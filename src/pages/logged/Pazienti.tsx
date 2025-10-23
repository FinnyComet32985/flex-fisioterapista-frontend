import  ListaPazienti  from "@/components/custom/ListaPazienti";
import { Link } from "react-router-dom";

function PazientiPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between-center gap-218">
        <h1 className="text-2xl font-semibold">Lista pazienti</h1>
        <button className="rounded bg-primary px-4 py-2 text-primary-foreground">
          <Link to={"/nuovo-paziente"}>Aggiungi Paziente</Link>
        </button>
      </div>
      <ListaPazienti />
    </div>
  );
}

export default PazientiPage;