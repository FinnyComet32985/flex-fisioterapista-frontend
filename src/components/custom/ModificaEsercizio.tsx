import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiEdit2 } from "react-icons/fi";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { apiPatch } from "@/lib/api";
import { useEffect } from "react";

interface ExerciseShort {
  id: number;
  nome: string;
  descrizione: string;
  descrizione_svolgimento: string;
  consigli_svolgimento: string;
  video?: string;
  immagine?: string;
}

export function ModificaEsercizio({
  exercise,
  onUpdated,
}: {
  exercise: ExerciseShort;
  onUpdated: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    nome: exercise.nome ?? "",
    descrizione: exercise.descrizione ?? "",
    descrizione_svolgimento: exercise.descrizione_svolgimento ?? "",
    consigli_svolgimento: exercise.consigli_svolgimento ?? "",
    immagine: exercise.immagine ?? "",
    video: exercise.video ?? "",
  });
  const [status, setStatus] = React.useState<[string, string]>(["", ""]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // sync when exercise prop changes
    setForm({
      nome: exercise.nome ?? "",
      descrizione: exercise.descrizione ?? "",
      descrizione_svolgimento: exercise.descrizione_svolgimento ?? "",
      consigli_svolgimento: exercise.consigli_svolgimento ?? "",
      immagine: exercise.immagine ?? "",
      video: exercise.video ?? "",
    });
  }, [exercise]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(["", ""]);
    if (!form.nome.trim()) {
      setStatus(["error", "Il nome è obbligatorio"]);
      return;
    }
    if (form.nome.trim().length > 50) {
      setStatus(["error", "Il nome non può superare i 50 caratteri."]);
      return;
    }

    setLoading(true);
    try {
      const body = {
        nome: form.nome.trim(),
        descrizione: form.descrizione.trim(),
        descrizione_svolgimento: form.descrizione_svolgimento.trim(),
        consigli_svolgimento: form.consigli_svolgimento.trim(),
        immagine: form.immagine?.trim() || undefined,
        video: form.video?.trim() || undefined,
      };

      const res = await apiPatch(`/exercise/${exercise.id}`, body);
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setStatus(["error", err?.message ?? `Errore (${res.status})`]);
        return;
      }

      setStatus(["success", "Esercizio aggiornato"]);
      setTimeout(() => {
        setOpen(false);
        onUpdated();
        setStatus(["", ""]);
      }, 900);
    } catch (err) {
      console.error(err);
      setStatus(["error", "Errore di rete"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="cursor-pointer w-12 h-12 p-3 bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] rounded-full hover:bg-[color:var(--color-primary)]/90">
          <FiEdit2 className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifica Esercizio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-3 mt-2">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={form.nome} onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))} />
          </div>

          <div>
            <Label htmlFor="descrizione">Descrizione</Label>
            <Input id="descrizione" value={form.descrizione} onChange={(e) => setForm((s) => ({ ...s, descrizione: e.target.value }))} />
          </div>

          <div>
            <Label htmlFor="descrizione_svolgimento">Esecuzione</Label>
            <textarea
              id="descrizione_svolgimento"
              value={form.descrizione_svolgimento}
              onChange={(e) => setForm((s) => ({ ...s, descrizione_svolgimento: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="consigli_svolgimento">Consigli</Label>
            <textarea
              id="consigli_svolgimento"
              value={form.consigli_svolgimento}
              onChange={(e) => setForm((s) => ({ ...s, consigli_svolgimento: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="immagine">Immagine (URL, opzionale)</Label>
            <Input id="immagine" value={form.immagine} onChange={(e) => setForm((s) => ({ ...s, immagine: e.target.value }))} />
          </div>

          <div>
            <Label htmlFor="video">Video (URL, opzionale)</Label>
            <Input id="video" value={form.video} onChange={(e) => setForm((s) => ({ ...s, video: e.target.value }))} />
          </div>

          {status[0] === "success" && (
            <div className="flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span>{status[1]}</span>
            </div>)}
          {status[0] === "error" && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>{status[1]}</span>
            </div>)}

          <DialogFooter>
            <Button type="submit" className="cursor-pointer w-full" disabled={loading}>
              {loading ? "Salvataggio..." : "Salva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}