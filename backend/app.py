from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuração do banco SQLite (cria um arquivo clientes.db na pasta backend)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///clientes.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ---------- MODEL ----------
class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    telefone = db.Column(db.String(30))
    empresa = db.Column(db.String(120))

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone,
            "empresa": self.empresa,
        }


# Cria as tabelas no banco (se ainda não existirem)
with app.app_context():
    db.create_all()


# ---------- ROTAS ----------

@app.route("/")
def inicio():
    return "Página Inicial"


if __name__ == "__main__":
    app.run(debug=True)