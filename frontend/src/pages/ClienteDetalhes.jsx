import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Mail, Phone, Building, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ServicoTable from "@/components/clientes/ServicoTable";
import ServicoModal from "@/components/clientes/ServicoModal";
import { obterCliente, listarServicos, deletarServico } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function ClienteDetalhes() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);
  const [servicoParaExcluir, setServicoParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const { toast } = useToast();

  const carregarDados = useCallback(() => {
    setLoading(true);
    Promise.all([obterCliente(id), listarServicos(id)])
      .then(([resCliente, resServicos]) => {
        setCliente(resCliente.data);
        setServicos(resServicos.data);
      })
      .catch(() => {
        setCliente(null);
        setServicos([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  function abrirNovoServico() {
    setServicoEditando(null);
    setModalAberto(true);
  }

  function abrirEdicaoServico(servico) {
    setServicoEditando(servico);
    setModalAberto(true);
  }

  async function confirmarExclusao() {
    if (!servicoParaExcluir) return;
    setExcluindo(true);
    try {
      await deletarServico(servicoParaExcluir.id);
      toast({
        title: "Serviço removido",
        description: "O serviço foi excluído com sucesso.",
      });
      carregarDados();
    } catch {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível remover o serviço.",
        variant: "destructive",
      });
    } finally {
      setExcluindo(false);
      setServicoParaExcluir(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>;
  }

  if (!cliente) {
    return (
      <p className="text-sm text-muted-foreground">Cliente não encontrado.</p>
    );
  }

  return (
    <div>
      <Link
        to="/clientes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Clientes
      </Link>

      <Card className="mb-6 overflow-hidden border-0 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
              {cliente.nome?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {cliente.nome}
              </h1>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {cliente.email}
                </span>
                {cliente.telefone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {cliente.telefone}
                  </span>
                )}
                {cliente.empresa && (
                  <span className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5" /> {cliente.empresa}
                  </span>
                )}
                {cliente.endereco && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {cliente.endereco}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Serviços</h2>
        <Button
          onClick={abrirNovoServico}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <Card className="overflow-hidden border-0 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-0">
          <ServicoTable
            servicos={servicos}
            onEditar={abrirEdicaoServico}
            onDeletar={setServicoParaExcluir}
          />
        </CardContent>
      </Card>

      <ServicoModal
        clienteId={id}
        servico={servicoEditando}
        open={modalAberto}
        onOpenChange={setModalAberto}
        onSalvar={carregarDados}
      />

      <Dialog
        open={!!servicoParaExcluir}
        onOpenChange={(open) => !open && setServicoParaExcluir(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir serviço</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o serviço{" "}
              <strong>{servicoParaExcluir?.tipo_servico}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setServicoParaExcluir(null)}
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
