import os
from functools import wraps
from flask import Flask, jsonify, request, g
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

app = Flask(__name__)
app.config["SECRET_KEY"] = "troque-essa-chave-em-producao"

CORS(app)

database_url = os.environ.get("DATABASE_URL", "sqlite:///clientes.db")
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {"id": self.id, "email": self.email}


class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    telefone = db.Column(db.String(30))
    empresa = db.Column(db.String(120))
    endereco = db.Column(db.String(255))
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone,
            "empresa": self.empresa,
            "endereco": self.endereco,
        }


class Servico(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo_servico = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="pendente")  # pendente | andamento | concluido
    cliente_id = db.Column(db.Integer, db.ForeignKey("cliente.id"), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "tipo_servico": self.tipo_servico,
            "status": self.status,
            "cliente_id": self.cliente_id,
        }


with app.app_context():
    db.create_all()


# ---------- AUTENTICAÇÃO / MIDDLEWARE ----------

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({"erro": "Token de autenticação ausente."}), 401

        token = auth_header.split(" ", 1)[1]

        try:
            dados = serializer.loads(token, max_age=60 * 60 * 24 * 7)
        except SignatureExpired:
            return jsonify({"erro": "Sessão expirada. Faça login novamente."}), 401
        except BadSignature:
            return jsonify({"erro": "Token inválido."}), 401

        g.usuario_id = dados.get("user_id")
        return f(*args, **kwargs)

    return decorated


@app.route("/")
def inicio():
    return "Página Inicial"



@app.route("/registrar", methods=["POST"])
def registrar():
    dados = request.get_json()
    email = (dados or {}).get("email", "").strip().lower()
    senha = (dados or {}).get("senha", "")

    if not email or not senha:
        return jsonify({"erro": "E-mail e senha são obrigatórios."}), 400

    if len(senha) < 6:
        return jsonify({"erro": "A senha deve ter no mínimo 6 caracteres."}), 400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"erro": "Já existe uma conta com esse e-mail."}), 409

    usuario = Usuario(email=email, senha_hash=generate_password_hash(senha))
    db.session.add(usuario)
    db.session.commit()

    token = serializer.dumps({"user_id": usuario.id})
    return jsonify({"token": token, "usuario": usuario.to_dict()}), 201


@app.route("/login", methods=["POST"])
def login():
    dados = request.get_json()
    email = (dados or {}).get("email", "").strip().lower()
    senha = (dados or {}).get("senha", "")

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not check_password_hash(usuario.senha_hash, senha):
        return jsonify({"erro": "E-mail ou senha inválidos."}), 401

    token = serializer.dumps({"user_id": usuario.id})
    return jsonify({"token": token, "usuario": usuario.to_dict()}), 200


# ---------- CLIENTES ----------

@app.route("/clientes", methods=["GET"])
@login_required
def listar_clientes():
    clientes = Cliente.query.filter_by(usuario_id=g.usuario_id).all()
    return jsonify([c.to_dict() for c in clientes])


@app.route("/clientes/<int:id>", methods=["GET"])
@login_required
def obter_cliente(id):
    cliente = Cliente.query.filter_by(id=id, usuario_id=g.usuario_id).first()

    if not cliente:
        return jsonify({"erro": "Cliente não encontrado."}), 404

    return jsonify(cliente.to_dict())


@app.route("/clientes", methods=["POST"])
@login_required
def criar_cliente():
    dados = request.get_json()

    if not dados or not dados.get("nome") or not dados.get("email"):
        return jsonify({"erro": "Nome e email são obrigatórios."}), 400

    novo_cliente = Cliente(
        nome=dados.get("nome"),
        email=dados.get("email"),
        telefone=dados.get("telefone"),
        empresa=dados.get("empresa"),
        endereco=dados.get("endereco"),
        usuario_id=g.usuario_id,
    )
    db.session.add(novo_cliente)
    db.session.commit()

    return jsonify(novo_cliente.to_dict()), 201


@app.route("/clientes/<int:id>", methods=["PUT"])
@login_required
def atualizar_cliente(id):
    cliente = Cliente.query.filter_by(id=id, usuario_id=g.usuario_id).first()

    if not cliente:
        return jsonify({"erro": "Cliente não encontrado."}), 404

    dados = request.get_json()

    if not dados or not dados.get("nome") or not dados.get("email"):
        return jsonify({"erro": "Nome e email são obrigatórios."}), 400

    cliente.nome = dados.get("nome")
    cliente.email = dados.get("email")
    cliente.telefone = dados.get("telefone")
    cliente.empresa = dados.get("empresa")
    cliente.endereco = dados.get("endereco")

    db.session.commit()

    return jsonify(cliente.to_dict()), 200


@app.route("/clientes/<int:id>", methods=["DELETE"])
@login_required
def deletar_cliente(id):
    cliente = Cliente.query.filter_by(id=id, usuario_id=g.usuario_id).first()

    if not cliente:
        return jsonify({"erro": "Cliente não encontrado."}), 404

    db.session.delete(cliente)
    db.session.commit()

    return jsonify({"mensagem": "Cliente deletado com sucesso."}), 200


# ---------- SERVIÇOS ----------

@app.route("/clientes/<int:cliente_id>/servicos", methods=["GET"])
@login_required
def listar_servicos(cliente_id):
    cliente = Cliente.query.filter_by(id=cliente_id, usuario_id=g.usuario_id).first()
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado."}), 404

    servicos = Servico.query.filter_by(cliente_id=cliente_id, usuario_id=g.usuario_id).all()
    return jsonify([s.to_dict() for s in servicos])


@app.route("/clientes/<int:cliente_id>/servicos", methods=["POST"])
@login_required
def criar_servico(cliente_id):
    cliente = Cliente.query.filter_by(id=cliente_id, usuario_id=g.usuario_id).first()
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado."}), 404

    dados = request.get_json()

    if not dados or not dados.get("tipo_servico"):
        return jsonify({"erro": "Tipo de serviço é obrigatório."}), 400

    status = dados.get("status", "pendente")
    if status not in ("pendente", "andamento", "concluido"):
        return jsonify({"erro": "Status inválido."}), 400

    novo_servico = Servico(
        tipo_servico=dados.get("tipo_servico"),
        status=status,
        cliente_id=cliente_id,
        usuario_id=g.usuario_id,
    )
    db.session.add(novo_servico)
    db.session.commit()

    return jsonify(novo_servico.to_dict()), 201


@app.route("/servicos/<int:id>", methods=["PUT"])
@login_required
def atualizar_servico(id):
    servico = Servico.query.filter_by(id=id, usuario_id=g.usuario_id).first()

    if not servico:
        return jsonify({"erro": "Serviço não encontrado."}), 404

    dados = request.get_json()

    if not dados or not dados.get("tipo_servico"):
        return jsonify({"erro": "Tipo de serviço é obrigatório."}), 400

    status = dados.get("status", servico.status)
    if status not in ("pendente", "andamento", "concluido"):
        return jsonify({"erro": "Status inválido."}), 400

    servico.tipo_servico = dados.get("tipo_servico")
    servico.status = status

    db.session.commit()

    return jsonify(servico.to_dict()), 200


@app.route("/servicos/<int:id>", methods=["DELETE"])
@login_required
def deletar_servico(id):
    servico = Servico.query.filter_by(id=id, usuario_id=g.usuario_id).first()

    if not servico:
        return jsonify({"erro": "Serviço não encontrado."}), 404

    db.session.delete(servico)
    db.session.commit()

    return jsonify({"mensagem": "Serviço deletado com sucesso."}), 200


@app.route("/servicos/resumo", methods=["GET"])
@login_required
def resumo_servicos():
    servicos = (
        db.session.query(Servico, Cliente.nome)
        .join(Cliente, Servico.cliente_id == Cliente.id)
        .filter(Servico.usuario_id == g.usuario_id)
        .all()
    )

    resumo = {"pendente": [], "andamento": [], "concluido": []}

    for servico, nome_cliente in servicos:
        resumo[servico.status].append(
            {
                "cliente_id": servico.cliente_id,
                "cliente_nome": nome_cliente,
                "tipo_servico": servico.tipo_servico,
                "servico_id": servico.id,
            }
        )

    return jsonify(resumo)


if __name__ == "__main__":
    app.run(debug=True)