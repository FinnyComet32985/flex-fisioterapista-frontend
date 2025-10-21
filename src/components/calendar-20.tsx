

import * as React from "react"
import { it } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function Calendar20() {
  const orariPrenotati = [
    
    // Appuntamenti futuri
    { date: new Date(2025, 9, 25), time: "11:00" },
    { date: new Date(2025, 9, 26), time: "10:00" },
  ]

  const [data, setData] = React.useState<Date | undefined>(
    new Date(2025, 9, 21) // vista del calendario parte da ottobre 2025 
  )
  // gestione del mese visualizzato nel calendario
  const [mese, setMese] = React.useState<Date>(data || new Date());
  const [orarioSelezionato, setOrarioSelezionato] = React.useState<string | null>("10:00")
  const fasceOrarie = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"]
  
  // disabilitare date passate 
  const giorniDisabilitati = [
    { before: new Date() },
    
  ]

  // Calcola se l'ora è prenotata 
  let oraGiaPrenotata = false;
  if (data && orarioSelezionato) {
    for (const appuntamento of orariPrenotati) {

      if (appuntamento.date.toDateString() === data.toDateString() && appuntamento.time === orarioSelezionato) {
        oraGiaPrenotata = true; 
        break; 
      }
    }
  }

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            locale={it}
            mode="single"
            selected={data}
            onSelect={(nuovaData) => {
              setData(nuovaData)
              if (nuovaData) {
                setMese(nuovaData) // calendario al mese della nuova data
              }
            }}
            month={mese}
            onMonthChange={setMese} // navigazione tra i mesi
            disabled={giorniDisabilitati}
            showOutsideDays={false}
            modifiers={{
              booked: giorniDisabilitati,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) => date.toLocaleString("it-IT", { weekday: "short" }).charAt(0).toUpperCase() + date.toLocaleString("it-IT", { weekday: "short" }).slice(1)
            }}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {fasceOrarie.map((orario) => (
              <Button
                key={orario}
                variant={orarioSelezionato === orario ? "default" : "outline"}
                onClick={() => setOrarioSelezionato(orario)}
                className="w-full shadow-none"
              >
                {orario}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {oraGiaPrenotata ? (
            <span className="text-destructive">
              Questa data e ora non è disponibile.
            </span>
          ) : data && orarioSelezionato ? (
            <span>
              Il tuo appuntamento è per il{" "}
              <span className="font-medium">{data.toLocaleDateString("it-IT", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}</span>{" "}
              alle <span className="font-medium">{orarioSelezionato}</span>.
            </span>
          ) : (
            <>Seleziona una data e un orario per il tuo appuntamento.</>
          )}
        </div>
        <Button
          disabled={!data || !orarioSelezionato || oraGiaPrenotata}
          className="w-full md:ml-auto md:w-auto"
        >
          Continua
        </Button>
      </CardFooter>
    </Card>
  )
}
