
import Calendar20 from "@/components/custom/calendar-20"

function AppuntamentiPage() {
    return(
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-semibold">Prenota appuntamenti</h1>
            <p className="mb-6 text-sm text-muted-foreground">Scegli la data dal calendario e poi seleziona l'orario disponibile.</p>
            <Calendar20 />
        </div>
    );
}

export default AppuntamentiPage;