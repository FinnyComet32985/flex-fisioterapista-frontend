import * as React from "react";
import { useEffect, useState } from "react";
import { EyeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { apiGet } from "@/lib/api";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"


interface Paziente {
  id: number;
  nome: string;
  cognome: string;
}

export default function ListaPazienti() {
  const [pazienti, setPazienti] = useState<Paziente[]>([]);
 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPazienti = async () => {
      try {
        
        const response = await apiGet("/patient"); // Assumendo che l'endpoint sia /patient

        if (!response.ok) {
          throw new Error("Impossibile caricare la lista dei pazienti");
        }

        const data: Paziente[] = await response.json();
        setPazienti(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Si è verificato un errore sconosciuto");
        console.error("Errore nel caricamento dei pazienti:", err);
      } finally {
      }
    };

    fetchPazienti();
  }, []); // L'array vuoto assicura che l'effetto venga eseguito solo una volta

 

  if (error) {
    return <div className="text-red-500">Errore: {error}</div>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup>
        {pazienti.map((paziente, index) => (
          <React.Fragment key={paziente.id}>
            <Item>
              <ItemMedia>
                <Avatar className="w-15 h-15">
                  {/* <AvatarImage src={paziente.avatar} /> */}
                  <AvatarFallback>{paziente.nome.charAt(0)}{paziente.cognome.charAt(0)}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="gap-1">
                <ItemTitle>{paziente.nome} {paziente.cognome}</ItemTitle>
                {/* <ItemDescription>{paziente.email}</ItemDescription> */}
              </ItemContent>
              <ItemActions>
                <Button variant="outline" size="lg">
                  <EyeIcon className=" size-5" />
                  <Link to={`/profilo-paziente/${paziente.id}`}>Visualizza profilo</Link>
                </Button>
              </ItemActions>
            </Item>
            {index !== pazienti.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
      </ItemGroup>
    </div>
  )
}
