import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { criarServico, atualizarServico } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const initialState = { tipo_servico: "", status: "pendente" };

export default function ServicoModal({
  clienteId,
  servico,
  open,
  onOpenChange,
  onSalvar,
}) {
  const [form, setForm] = useState(initialState);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const editando = !!servico;

  useEffect(() => {
    if (open) {
      setForm(
        servico
          ? { tipo_servico: servico.tipo_servico, status: servico.status }
          : initialState,
      );
      setErro("");
    }
  }, [open, servico]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.tipo_servico.trim()) {
      setErro("Informe o tipo de serviço.");
      return;
    }

    setLoading(true);
    try {
      if (editando) {
        await atualizarServico(servico.id, form);
        toast({
          title: "Serviço atualizado",
          description: "As alterações foram salvas.",
        });
      } else {
        await criarServico(clienteId, form);
        toast({
          title: "Serviço adicionado",
          description: "O novo serviço foi cadastrado.",
        });
      }
      onOpenChange(false);
      onSalvar();
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o serviço.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle>
            {editando ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogDescription>
            {editando
              ? "Atualize os dados do serviço."
              : "Adicione um novo serviço para este cliente."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_servico">Tipo de Serviço</Label>
            <Input
              id="tipo_servico"
              name="tipo_servico"
              value={form.tipo_servico}
              onChange={handleChange}
            />
            {erro && <p className="text-xs text-destructive">{erro}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="pendente">Pendente</option>
              <option value="andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </Select>
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
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
