import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";



function CalendarAppointment({ key_id, id_appuntamento, img, id_paziente, paziente, orario, confermato, selected, setSelected }: { key_id:number, id_appuntamento?: number, img?: string; id_paziente?:number, paziente?: string; orario: string, confermato?:string, selected: boolean, setSelected: (index: number) => void}) {
    let borderColor
    if (paziente && confermato === "Confermato") {
        borderColor = "border-red-500 hover:bg-red-500"
    } else if (paziente && confermato === "Non confermato") {
        borderColor = "border-green-500 hover:bg-yellow-500"
    } else {
        borderColor = "border-green-500 hover:bg-green-500"
    }
    const colorSelected = selected ? "bg-accent" : "bg-card" 


    return (
        <Item variant="outline" className={`bg-primary-bg w-full h-full ${borderColor} ${colorSelected}`} onClick={() => setSelected(key_id)}>
                {img && <ItemMedia variant="image">
                    <img
                        src={img}
                        alt={paziente}
                        width={32}
                        height={32}
                        className="object-cover"
                    />
                </ItemMedia>}
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
