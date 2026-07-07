import { IdeaForm } from "@/components/validator/IdeaForm";

export default function NewIdeaPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New validation</h1>
        <p className="text-muted-foreground">
          The AI agent will research competitors, size the market, estimate investment, recommend
          locations, and generate a full business strategy and success score.
        </p>
      </div>
      <IdeaForm />
    </div>
  );
}
