import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";

interface Esercizio {
  id: number;
  nome: string;
  descrizione: string;
  descrizione_svolgimento: string;
  consigli_svolgimento: string;
  video?: string;
  immagine?: string;
  fisioterapista_id: number;
}

function CatalogoEsercizi() {
    const [esercizi, setEsercizi] = useState<Esercizio[]>([]);
    const [videoSelezionato, setVideoSelezionato] = useState<string | null>(null);

  useEffect(() => {
    fetch("/esercizi.json")
      .then((response) => {
        if (!response.ok) throw new Error("Errore nel caricamento del JSON");
        return response.json();
      })
      .then((data) => setEsercizi(data))
      .catch((error) => console.error(error));
    }, []);

  return (
    <>
    <div className="container grid grid-cols-3 mx-auto mt-4 p-2 gap-4">
      {esercizi.map((esercizio) => (
        <Card key={esercizio.id}>
          <CardHeader>
            <CardTitle className="text-center">{esercizio.nome.toUpperCase()}</CardTitle>
            <CardDescription>{esercizio.descrizione}</CardDescription>
            {/* <CardAction>{esercizio.consigli_svolgimento}</CardAction> */}
        </CardHeader>
        <CardContent>
          <img src={esercizio.immagine} alt={esercizio.nome} className="w-full h-48 object-cover mb-3 rounded-lg" />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground">{esercizio.descrizione_svolgimento}</p>
        </CardFooter>
         {esercizio.video && (
              <Button
                onClick={() => setVideoSelezionato(esercizio.video!)}
                style={{
                  /* marginTop: "10px",
                  padding: "10px 15px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px", */
                  cursor: "pointer"
                }}
              >
                🎥 Guarda video
              </Button>
            )}
      </Card>
     ))}
     
      </div>
       {/* MODALE VIDEO */}
      {videoSelezionato && (
        <div
          onClick={() => setVideoSelezionato(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              maxWidth: "800px",
              width: "90%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              position: "relative"
            }}
          >
            <button
              onClick={() => setVideoSelezionato(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              ✖
            </button>

            {/* Se il video è di YouTube */}
            {videoSelezionato.includes("youtube.com") ? (
              <iframe
                width="100%"
                height="450"
                src={videoSelezionato.replace("watch?v=", "embed/")}
                title="Video esercizio"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px" }}
              ></iframe>
            ) : (
              <video
                src={videoSelezionato}
                controls
                style={{ width: "100%", borderRadius: "8px" }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CatalogoEsercizi;
