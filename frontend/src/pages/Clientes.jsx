import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClienteTable from "@/components/clientes/ClienteTable";
import ClienteModal from "@/components/clientes/ClienteModal";
import { listarClientes, deletarCliente } from "@/lib/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  async function handleDeletar(id) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    await deletarCliente(id);
    carregarClientes();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os seus clientes cadastrados.
          </p>
        </div>
        <ClienteModal onClienteCriado={carregarClientes} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            {loading ? "Carregando..." : `${clientes.length} cliente(s)`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ClienteTable clientes={clientes} onDeletar={handleDeletar} />
        </CardContent>
      </Card>
    </div>
  );
}
