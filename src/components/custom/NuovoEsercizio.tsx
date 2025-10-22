import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"


function NuovoEsercizio() {
    return (
        <div className="w-full max-w-md">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Nuovo esercizio</FieldLegend>
            <FieldDescription>
              Aggiungi un nuovo esercizio al catalogo
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="Nome">
                  Nome esercizio
                </FieldLabel>
                <Input
                  id="Nome"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="descrizione">
                  Descrizione dell'esercizio
                </FieldLabel>
                <Input
                  id="descrizione"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="descrizione_svolgimento">
                  Descrizione dello svolgimento
                </FieldLabel>
                <Input
                  id="descrizione_svolgimento"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="consigli_svolgimento">
                  Consigli per lo svolgimento
                </FieldLabel>
                <Input
                  id="consigli_svolgimento"
                  required
                />
              </Field>
              <FieldSeparator />
                <Field>
                    <FieldLabel htmlFor="video">
                        Link al video (opzionale)
                    </FieldLabel>
                    <Input
                        id="video"
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="immagine">
                        Link all'immagine (opzionale)
                    </FieldLabel>
                    <Input
                        id="immagine"
                    />
                </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation="horizontal">
            <Button type="submit" className="cursor-pointer">Aggiungi</Button>
            <Button variant="outline" type="button" className="cursor-pointer">Annulla</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
    );
}

export default NuovoEsercizio;