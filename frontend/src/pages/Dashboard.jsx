import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Building2,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Clock,
  Loader,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listarClientes, resumoServicos } from "@/lib/api";

const STATUS_CONFIG = [
  {
    key: "pendente",
    label: "Pendentes",
    icon: Clock,
    headerBg: "bg-amber-500",
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
  },
  {
    key: "andamento",
    label: "Em Andamento",
    icon: Loader,
    headerBg: "bg-sky-500",
    chipBg: "bg-sky-50",
    chipText: "text-sky-700",
  },
  {
    key: "concluido",
    label: "Concluídos",
    icon: CheckCircle2,
    headerBg: "bg-emerald-500",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
  },
];

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
];

function corAvatar(nome) {
  const soma = (nome || "")
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[soma % AVATAR_COLORS.length];
}

function agruparPorCliente(itens) {
  const grupos = [];
  const indice = new Map();

  for (const item of itens) {
    if (!indice.has(item.cliente_id)) {
      indice.set(item.cliente_id, grupos.length);
      grupos.push({
        cliente_id: item.cliente_id,
        cliente_nome: item.cliente_nome,
        servicos: [],
      });
    }
    grupos[indice.get(item.cliente_id)].servicos.push(item);
  }

  return grupos;
}

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [resumo, setResumo] = useState({
    pendente: [],
    andamento: [],
    concluido: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listarClientes(), resumoServicos()])
      .then(([resClientes, resResumo]) => {
        setClientes(resClientes.data);
        setResumo(resResumo.data);
      })
      .catch(() => {
        setClientes([]);
        setResumo({ pendente: [], andamento: [], concluido: [] });
      })
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
        <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral da sua carteira de clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [1, 2, 3].map((i) => (
              <Card
                key={i}
                className="border-0 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="mt-6 h-4 w-28" />
                  <Skeleton className="mt-2 h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : cards.map(({ label, value, icon: Icon, gradient, glow }) => (
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
                    {value}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {!loading && (
        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold">Serviços por Status</h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {STATUS_CONFIG.map(
              ({ key, label, icon: Icon, headerBg, chipBg, chipText }) => {
                const grupos = agruparPorCliente(resumo[key] || []);

                return (
                  <Card
                    key={key}
                    className="overflow-hidden border-0 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur"
                  >
                    <div
                      className={`flex items-center gap-2.5 px-5 py-4 ${headerBg}`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                      <span className="text-sm font-semibold text-white">
                        {label}
                      </span>
                      <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-white/25 px-2 text-xs font-bold text-white">
                        {resumo[key]?.length || 0}
                      </span>
                    </div>

                    <CardContent className="max-h-96 space-y-3 overflow-y-auto p-4">
                      {grupos.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                          Nenhum serviço neste status.
                        </p>
                      ) : (
                        grupos.map((grupo) => (
                          <Link
                            key={grupo.cliente_id}
                            to={`/clientes/${grupo.cliente_id}`}
                            className="block rounded-xl border border-border bg-white p-3 transition-shadow hover:shadow-md"
                          >
                            <div className="mb-2 flex items-center gap-2.5">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${corAvatar(grupo.cliente_nome)}`}
                              >
                                {grupo.cliente_nome?.[0]?.toUpperCase() ?? "?"}
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                {grupo.cliente_nome}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {grupo.servicos.map((s) => (
                                <span
                                  key={s.servico_id}
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${chipBg} ${chipText}`}
                                >
                                  {s.tipo_servico}
                                </span>
                              ))}
                            </div>
                          </Link>
                        ))
                      )}
                    </CardContent>
                  </Card>
                );
              },
            )}
          </div>
        </div>
      )}

      {!loading && totalClientes === 0 && (
        <Card className="mt-6 overflow-hidden border-0 bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30">
          <CardContent className="flex flex-col items-start gap-4 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold">
                  Comece a organizar sua carteira
                </p>
                <p className="text-sm text-white/80">
                  Você ainda não tem clientes cadastrados. Que tal adicionar o
                  primeiro?
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="secondary"
              className="shrink-0 bg-white text-indigo-700 hover:bg-white/90"
            >
              <Link to="/clientes">
                Cadastrar cliente
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
