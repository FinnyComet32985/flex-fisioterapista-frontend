
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { it } from "date-fns/locale";


interface EsercizioSvolto {
  id: number;
  nome: string;
  serie_effettive: number;
  ripetizioni_effettive: number;
  serie_previste: number;
  ripetizioni_previste: number;
}

interface SessioneSvolta {
  id: number;
  data: string;
  note_paziente: string | null;
  esercizi: EsercizioSvolto[];
}

// Dati di esempio per una sessione di allenamento
const sessioniDiEsempio: SessioneSvolta[] = [
  {
    id: 1,
    data: new Date().toISOString().split("T")[0], // Data di oggi
    note_paziente: "Oggi mi faceva male il culo",
    esercizi: [
      {
        id: 101,
        nome: "Panca Piana",
        serie_effettive: 3,
        ripetizioni_effettive: 8,
        serie_previste: 3,
        ripetizioni_previste: 8,
      },
      {
        id: 103,
        nome: "Trazioni alla sbarra",
        serie_effettive: 3,
        ripetizioni_effettive: 5,
        serie_previste: 3,
        ripetizioni_previste: 5,
      },
    ],
  },
];

export function CalendarioSessioni() {
  const [dataSelezionata, setDataSelezionata] = useState<Date | undefined>(
    new Date()
  );
  const [sessioniSvolte] = useState<SessioneSvolta[]>(sessioniDiEsempio);
  const [sessioneDelGiorno, setSessioneDelGiorno] = useState<
    SessioneSvolta | undefined
  >(undefined);

  useEffect(() => {
    if (dataSelezionata) {
      const dataISO = dataSelezionata.toISOString().split("T")[0];
      const sessione = sessioniSvolte.find((s) => s.data === dataISO);
      setSessioneDelGiorno(sessione);
    }
  }, [dataSelezionata, sessioniSvolte]);

  const giorniConSessione = sessioniSvolte.map((s) => new Date(s.data));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 flex justify-center">
        <Calendar
          mode="single"
          locale={it}
          selected={dataSelezionata}
          onSelect={setDataSelezionata}
          className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
          modifiers={{ booked: giorniConSessione }}
          modifiersClassNames={{
            booked: "bg-primary text-primary-foreground rounded-full",
          }}
        />
      </div>
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>
              Dettagli Sessione del{" "}
              {dataSelezionata?.toLocaleDateString("it-IT") || ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[55vh]">
              {sessioneDelGiorno ? (
                <div className="space-y-4 pr-4">
                  {sessioneDelGiorno.esercizi.map((esercizio) => (
                    <div key={esercizio.id} className="border p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">
                        {esercizio.nome}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Serie svolte</p>
                          <p className="font-medium">{esercizio.serie_effettive}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Ripetizioni svolte</p>
                          <p className="font-medium">{esercizio.ripetizioni_effettive}</p>

                        </div>
                        <div>
                            <p className="text-muted-foreground">Serie effettive</p>
                            <p className="font-medium">{esercizio.serie_previste}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"> Ripetizioni effettive</p>
                            <p className="font-medium">{esercizio.ripetizioni_previste}</p>
                        </div>

                      </div>
                    </div>
                  ))}
                  {sessioneDelGiorno.note_paziente && (
                    <div className="mt-6">
                      <Separator />
                      <div className="mt-4">
                        <h4 className="font-semibold text-lg mb-2">
                          Note del Paziente
                        </h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {sessioneDelGiorno.note_paziente}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Nessuna sessione trovata per questo giorno.
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
