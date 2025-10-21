import { ItemGroupExample } from "@/components/utils/group";

function PazientiPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between-center gap-218">
        <h1 className="text-2xl font-semibold">Lista pazienti</h1>
        <button className="rounded bg-primary px-4 py-2 text-foreground hover:bg-primary/90">
          Aggiungi nuovo paziente
        </button>
      </div>
      <ItemGroupExample />
    </div>
  );
}

export default PazientiPage;