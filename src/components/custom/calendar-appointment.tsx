import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";



function CalendarAppointment({ id, img, paziente, orario, selected, setSelected }: { id:number, img?: string; paziente?: string; orario: string, selected: boolean, setSelected: (index: number) => void}) {
    const borderColor = paziente ? "border-red-500 hover:bg-red-500" : "border-green-500 hover:bg-green-500"
    const colorSelected = selected ? "bg-accent" : "bg-card" 


    return (
        <Item variant="outline" className={`bg-primary-bg w-full h-full ${borderColor} ${colorSelected}`} onClick={() => setSelected(id)}>
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
