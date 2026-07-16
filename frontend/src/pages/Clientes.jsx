import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClienteTable from "@/components/clientes/ClienteTable";
import ClienteModal from "@/components/clientes/ClienteModal";
import { listarClientes, deletarCliente } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const { toast } = useToast();

  const carregarClientes = useCallback(() => {
    setLoading(true);
    listarClientes()
      .then((res) => setClientes(res.data))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  function abrirNovo() {
    setClienteEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(cliente) {
    setClienteEditando(cliente);
    setModalAberto(true);
  }

  async function confirmarExclusao() {
    if (!clienteParaExcluir) return;
    setExcluindo(true);
    try {
      await deletarCliente(clienteParaExcluir.id);
      toast({
        title: "Cliente removido",
        description: `${clienteParaExcluir.nome} foi excluído com sucesso.`,
      });
      carregarClientes();
    } catch {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
    } finally {
      setExcluindo(false);
      setClienteParaExcluir(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Carregando..."
              : `${clientes.length} cliente(s) cadastrado(s)`}
          </p>
        </div>
        <Button
          onClick={abrirNovo}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card className="overflow-hidden border-0 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-0">
          <ClienteTable
            clientes={clientes}
            loading={loading}
            onEditar={abrirEdicao}
            onDeletar={setClienteParaExcluir}
          />
        </CardContent>
      </Card>

      <ClienteModal
        cliente={clienteEditando}
        open={modalAberto}
        onOpenChange={setModalAberto}
        onSalvar={carregarClientes}
        trigger={null}
      />

      <Dialog
        open={!!clienteParaExcluir}
        onOpenChange={(open) => !open && setClienteParaExcluir(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir cliente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <strong>{clienteParaExcluir?.nome}</strong>? Essa ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClienteParaExcluir(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarExclusao}
              disabled={excluindo}
            >
              {excluindo ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
