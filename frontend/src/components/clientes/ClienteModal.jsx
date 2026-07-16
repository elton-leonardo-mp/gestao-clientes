import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { criarCliente, atualizarCliente } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const initialState = { nome: "", email: "", telefone: "", empresa: "" };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONE_REGEX = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

export default function ClienteModal({
  cliente,
  open,
  onOpenChange,
  onSalvar,
  trigger,
}) {
  const [form, setForm] = useState(initialState);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const editando = !!cliente;

  useEffect(() => {
    if (open) {
      setForm(
        cliente
          ? {
              nome: cliente.nome,
              email: cliente.email,
              telefone: cliente.telefone || "",
              empresa: cliente.empresa || "",
            }
          : initialState,
      );
      setErros({});
    }
  }, [open, cliente]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErros({ ...erros, [e.target.name]: undefined });
  }

  function validar() {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "Informe o nome do cliente.";
    if (!form.email.trim()) {
      novosErros.email = "Informe o e-mail.";
    } else if (!EMAIL_REGEX.test(form.email)) {
      novosErros.email = "Informe um e-mail válido.";
    }
    if (form.telefone && !TELEFONE_REGEX.test(form.telefone)) {
      novosErros.telefone = "Use o formato (81) 99999-9999.";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;

    setLoading(true);
    try {
      if (editando) {
        await atualizarCliente(cliente.id, form);
        toast({
          title: "Cliente atualizado",
          description: `${form.nome} foi atualizado com sucesso.`,
        });
      } else {
        await criarCliente(form);
        toast({
          title: "Cliente cadastrado",
          description: `${form.nome} foi adicionado com sucesso.`,
        });
      }
      onOpenChange(false);
      onSalvar();
    } catch (err) {
      toast({
        title: editando ? "Erro ao atualizar" : "Erro ao cadastrar",
        description: "Não foi possível salvar o cliente. Verifique o backend.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className="border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle>
            {editando ? "Editar Cliente" : "Cadastrar Cliente"}
          </DialogTitle>
          <DialogDescription>
            {editando
              ? "Atualize os dados do cliente abaixo."
              : "Preencha os dados abaixo para adicionar um novo cliente."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
            />
            {erros.nome && (
              <p className="text-xs text-destructive">{erros.nome}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {erros.email && (
              <p className="text-xs text-destructive">{erros.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              name="telefone"
              placeholder="(81) 99999-9999"
              value={form.telefone}
              onChange={handleChange}
            />
            {erros.telefone && (
              <p className="text-xs text-destructive">{erros.telefone}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Input
              id="empresa"
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90"
            >
              {loading
                ? "Salvando..."
                : editando
                  ? "Salvar Alterações"
                  : "Salvar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
