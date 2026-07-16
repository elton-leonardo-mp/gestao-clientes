import { useEffect, useState } from "react";
import { Users, TrendingUp, Building2, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    {
      label: "Total de Clientes",
      value: totalClientes,
      icon: Users,
      gradient: "from-indigo-500 to-violet-600",
      glow: "shadow-indigo-500/30",
    },
    {
      label: "Empresas Distintas",
      value: empresasUnicas,
      icon: Building2,
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/30",
    },
    {
      label: "Crescimento Mensal",
      value: "+0%",
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/30",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral da sua carteira de clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, gradient, glow }) => (
          <Card
            key={label}
            className="overflow-hidden border-0 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur transition-transform hover:-translate-y-1"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg ${glow}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  ativo
                </span>
              </div>
              <p className="mt-5 text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight">
                {loading ? "—" : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
