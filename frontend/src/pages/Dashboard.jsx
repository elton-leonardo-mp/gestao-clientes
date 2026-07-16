import { useEffect, useState } from "react";
import { Users, TrendingUp, Building2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { listarClientes } from "@/lib/api";

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarClientes()
      .then((res) => setClientes(res.data))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  }, []);

  const totalClientes = clientes.length;
  const empresasUnicas = new Set(clientes.map((c) => c.empresa).filter(Boolean))
    .size;

  const cards = [
    { label: "Total de Clientes", value: totalClientes, icon: Users },
    { label: "Empresas Distintas", value: empresasUnicas, icon: Building2 },
    { label: "Crescimento Mensal", value: "+0%", icon: TrendingUp },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral da sua carteira de clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "—" : value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
