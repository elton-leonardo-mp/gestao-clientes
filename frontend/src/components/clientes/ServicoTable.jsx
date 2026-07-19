import {
  Trash2,
  Pencil,
  Wrench,
  Clock,
  Loader,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG = {
  pendente: {
    label: "Pendente",
    icon: Clock,
    headerBg: "bg-amber-500",
    dot: "bg-amber-500",
  },
  andamento: {
    label: "Em Andamento",
    icon: Loader,
    headerBg: "bg-sky-500",
    dot: "bg-sky-500",
  },
  concluido: {
    label: "Concluído",
    icon: CheckCircle2,
    headerBg: "bg-emerald-500",
    dot: "bg-emerald-500",
  },
};

const ORDEM_STATUS = ["pendente", "andamento", "concluido"];

export default function ServicoTable({ servicos, onEditar, onDeletar }) {
  if (!servicos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
          <Wrench className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Nenhum serviço cadastrado
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Clique em "Novo Serviço" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {ORDEM_STATUS.map((statusKey) => {
        const config = STATUS_CONFIG[statusKey];
        const Icon = config.icon;
        const itens = servicos.filter((s) => s.status === statusKey);

        if (!itens.length) return null;

        return (
          <div key={statusKey}>
            <div
              className={`flex items-center gap-2.5 px-5 py-3 ${config.headerBg}`}
            >
              <Icon className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">
                {config.label}
              </span>
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs font-bold text-white">
                {itens.length}
              </span>
            </div>

            <div className="divide-y divide-border">
              {itens.map((servico) => (
                <div
                  key={servico.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${config.dot}`}
                  />
                  <span className="flex-1 text-sm font-medium text-foreground">
                    {servico.tipo_servico}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditar(servico)}
                      className="hover:bg-indigo-50"
                    >
                      <Pencil className="h-4 w-4 text-indigo-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeletar(servico)}
                      className="hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
