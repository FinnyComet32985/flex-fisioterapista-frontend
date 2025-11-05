import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function CalendarAppointment({ key_id, paziente, orario, confermato, selected, setSelected, nome, cognome }: { 
    key_id:number, 
    id_appuntamento?: number, 
    id_paziente?:number, 
    paziente?: string; 
    orario: string, 
    confermato?:string, 
    selected: boolean, 
    setSelected: (index: number) => void,
    nome?: string,
    cognome?: string
}) {
    let borderColor
    if (paziente && confermato === "Confermato") {
        borderColor = "border-red-500 hover:bg-red-500"
    } else if (paziente && confermato === "Non Confermato") {
        borderColor = "border-yellow-500 hover:bg-yellow-500"
    } else {
        borderColor = "border-green-500 hover:bg-green-500"
    }
    const colorSelected = selected ? "bg-accent" : "bg-card" 

    return (
        <Item variant="outline" className={`bg-primary-bg w-full h-full ${borderColor} ${colorSelected}`} onClick={() => setSelected(key_id)}>
                {paziente && nome && cognome && (
                    <ItemMedia>
                        <Avatar className="w-10 h-10">
                            <AvatarFallback>{nome.charAt(0)}{cognome.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </ItemMedia>
                )}
                {paziente && <ItemContent>
                    <ItemTitle className="line-clamp-1">
                        {paziente}
                    </ItemTitle>
                </ItemContent>}
                <ItemContent className="flex-none text-center">
                    <ItemDescription className="text-accent-foreground">{orario}</ItemDescription>
                </ItemContent>
        </Item>
    );
}
export default CalendarAppointment;
