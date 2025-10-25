import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiEdit2 } from "react-icons/fi";
import { apiPatch } from "@/lib/api";

export function ModificaInformazioniPaziente({
  id_paziente,
  peso,
  altezza,
  diagnosi,
  onInfoUpdate,
}: {
  id_paziente: number | undefined;
  peso: number;
  altezza: number;
  diagnosi: string;
  onInfoUpdate: () => void;
}) {
  const [nuovoPeso, setNuovoPeso] = React.useState<number | undefined>(peso);
  const [nuovaAltezza, setNuovaAltezza] = React.useState<number | undefined>(altezza);
  const [nuovaDiagnosi, setNuovaDiagnosi] = React.useState<string>(diagnosi);
  const [status, setStatus] = React.useState<[string, string]>(["", ""]);
  const [open, setOpen] = React.useState(false);

  const diagnoses = [
    "Ipotrofia",
    "Ipertonia",
    "Ipomobilità",
    "Instabilità",
    "Limitazione articolare",
    "Rigidità",
    "Alterazione del passo",
    "Dolore lombare",
    "Squilibrio posturale",
    "Retrazione muscolare",
    "Ipotonia",
    "Rallentamento motorio",
  ];

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id_paziente) return;

    const body: { peso?: number; altezza?: number; diagnosi?: string } = {};
    if (nuovoPeso !== peso) body.peso = nuovoPeso;
    if (nuovaAltezza !== altezza) body.altezza = nuovaAltezza;
    if (nuovaDiagnosi !== diagnosi) body.diagnosi = nuovaDiagnosi;

    if (Object.keys(body).length === 0) {
      setStatus(["error", "Nessuna modifica da salvare."]);
      setTimeout(() => setStatus(["", ""]), 3000);
      return;
    }

    try {
      const response = await apiPatch(`/patient/${id_paziente}`, body);
      if (response.ok) {
        setStatus(["success", "Informazioni paziente modificate con successo!"]);
        setTimeout(() => {
          onInfoUpdate();
          setOpen(false);
          setStatus(["", ""]);
        }, 1500);
      } else {
        const errorData = await response.json();
        setStatus(["error", errorData.message || "Errore durante la modifica."]);
        setTimeout(() => setStatus(["", ""]), 4000);
      }
    } catch (error) {
      console.error("Errore API:", error);
      setStatus(["error", "Errore di connessione."]);
      setTimeout(() => setStatus(["", ""]), 4000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="w-14 h-14 p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-lg"
        >
          <FiEdit2 className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica Informazioni Paziente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSaveChanges} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input
              id="peso"
              type="number"
              value={nuovoPeso || ""}
              onChange={(e) => setNuovoPeso(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="altezza">Altezza (cm)</Label>
            <Input
              id="altezza"
              type="number"
              value={nuovaAltezza || ""}
              onChange={(e) => setNuovaAltezza(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="diagnosi">Diagnosi</Label>
            <Input
              id="diagnosi"
              list="diagnosesList"
              value={nuovaDiagnosi ?? ""}
              onChange={(e) => setNuovaDiagnosi(e.target.value)}
            />
            <datalist id="diagnosesList">
              {diagnoses.map((d, i) => (
                <option key={i} value={d} />
              ))}
            </datalist>
          </div>

          {status[0] === "success" && (
            <div className="mt-2 p-2 text-sm text-green-800 bg-green-100 rounded">
              {status[1]}
            </div>
          )}
          {status[0] === "error" && (
            <div className="mt-2 p-2 text-sm text-red-800 bg-red-100 rounded">
              {status[1]}
            </div>
          )}

          <DialogFooter>
            <Button type="submit" className="w-full">
              Salva Modifiche
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
