import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Teste de Componentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Se você está vendo isso com um card branco, sombra suave e botão
            azul, o Shadcn + Tailwind estão funcionando.
          </p>
          <div className="flex gap-2">
            <Button>Botão Padrão</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Deletar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
