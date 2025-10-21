import { Button } from "@/components/ui/button";

const data = [
    {
    name: "luca",
    surname: "rossi"
    },
    {
    name: "mario",
    surname: "verdi"
    },

]
function PazientiPage({handler}: {handler: (name: string) => void}){


    return(
        <>


        <h3 className="text-red-500">PAZIENTI</h3>

        {
            data && data.map((paziente) => (
                <Button onClick={() => handler("pazienti/" + paziente.name+ " "+ paziente.surname)}>{paziente.name} {paziente.surname}</Button>))
        }
        </>
    );
}

export default PazientiPage;