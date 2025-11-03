import React, { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis,  } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiGet } from "@/lib/api"

interface SurveyData {
  id: number;
  data_sessione: string;
  sondaggio: {forza: string; dolore: string; mobilita: string; feedback: string;};
}

interface SchedaWithSessioni {
  id_scheda: number;
  nome_scheda: string;
  sessioni: SurveyData[];
}

const chartConfig = {
  dolore: {
    label: "Dolore",
    color: "var(--chart-1)",
  },
  forza: {
    label: "Forza",
    color: "var(--chart-2)",
  },
  mobilita: {
    label: "Mobilità",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function GraficoPazienti({ pazienteId }: { pazienteId?: string }) {
  const [allSurveyData, setAllSurveyData] = useState<SchedaWithSessioni[]>([]);
  const [selectedSchedaId, setSelectedSchedaId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pazienteId) return;

    const fetchSurveyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiGet(`/trainingSession/graph/${pazienteId}`);
        // Se la risposta non è OK, proviamo a leggere il messaggio di errore dal server
        if (!response.ok) {
          let errorMessage = `Errore ${response.status}: Impossibile caricare i dati dei sondaggi.`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) { /* Il corpo della risposta non è JSON, usiamo il messaggio di default */ }
          throw new Error(errorMessage);
        }
        const data = await response.json();
        console.log("Dati sondaggi ricevuti:", data);
        setAllSurveyData(data);

        // Se ci sono dati, seleziona la prima scheda di default
        if (data && data.length > 0) {
          setSelectedSchedaId(data[0].id_scheda);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [pazienteId]);

  // Dati del grafico filtrati per scheda e per intervallo di tempo
  const chartData = React.useMemo(() => {
    if (!selectedSchedaId || allSurveyData.length === 0) return [];

    const scheda = allSurveyData.find(s => s.id_scheda === selectedSchedaId);
    if (!scheda) return [];

    return scheda.sessioni.map(sondaggio => ({
      date: sondaggio.data_sessione,
      dolore: Number(sondaggio.sondaggio.dolore),
      forza: Number(sondaggio.sondaggio.forza),
      mobilita: Number(sondaggio.sondaggio.mobilita),
    }));
  }, [allSurveyData, selectedSchedaId]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Progressi paziente</CardTitle>
          
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(selectedSchedaId)} onValueChange={str => setSelectedSchedaId(Number(str))} disabled={allSurveyData.length === 0}>
            <SelectTrigger
              className="w-[180px] rounded-lg"
              aria-label="Seleziona una scheda"
            >
              <SelectValue placeholder="Seleziona scheda" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {allSurveyData.map((scheda) => (
                <SelectItem key={scheda.id_scheda} value={String(scheda.id_scheda)} className="rounded-lg">
                  {scheda.nome_scheda}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading && <div className="flex justify-center items-center h-[250px]">Caricamento dati...</div>}
        {error && <div className="flex justify-center items-center h-[250px] text-destructive">{error}</div>}
        {!isLoading && !error && allSurveyData.length === 0 && (
          <div className="flex justify-center items-center h-[250px] text-muted-foreground">
            Nessun dato disponibile per questo paziente.
          </div>
        )}
        {!isLoading && !error && allSurveyData.length > 0 && chartData.length > 0 && (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDolore" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-dolore)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-dolore)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillForza" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-forza)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-forza)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobilita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobilita)" stopOpacity={0.8} />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobilita)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("it-IT", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("it-IT", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="dolore"
              type="natural"
              fill="url(#fillDolore)"
              stroke="var(--color-dolore)"              
            />
            <Area
              dataKey="forza"
              type="natural"
              fill="url(#fillForza)"
              stroke="var(--color-forza)"              
            />
            <Area
              dataKey="mobilita"
              type="natural"
              fill="url(#fillMobilita)"
              stroke="var(--color-mobilita)"              
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        )}
        {!isLoading && !error && allSurveyData.length > 0 && chartData.length === 0 && (
            <div className="flex justify-center items-center h-[250px] text-muted-foreground">
                Nessun dato disponibile per questa scheda.
            </div>
        )}
      </CardContent>
    </Card>
  )
}
