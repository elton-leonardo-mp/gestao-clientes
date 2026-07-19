import { useNavigate } from "react-router-dom";
import { Trash2, Pencil, Mail, Phone, Building } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function ClienteTable({
  clientes,
  loading,
  onEditar,
  onDeletar,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="mb-2 h-3 w-40" />
                <Skeleton className="h-3 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24 rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-8 w-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!clientes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
          <Building className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Nenhum cliente cadastrado
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Clique em "Novo Cliente" para começar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow
            key={cliente.id}
            className="cursor-pointer"
            onClick={() => navigate(`/clientes/${cliente.id}`)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${corAvatar(cliente.nome)}`}
                >
                  {cliente.nome?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="font-medium">{cliente.nome}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {cliente.email}
                </div>
                {cliente.telefone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {cliente.telefone}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {cliente.empresa ? (
                <Badge variant="secondary">
                  <Building className="mr-1 h-3 w-3" />
                  {cliente.empresa}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell
              className="text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditar(cliente)}
                  className="hover:bg-indigo-50"
                >
                  <Pencil className="h-4 w-4 text-indigo-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeletar(cliente)}
                  className="hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
