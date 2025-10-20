import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  onPageChange,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[],
  onPageChange?: (name: string) => void
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <button onClick={() => onPageChange?.(item.title.toLowerCase())}>
                <item.icon />
                <span>{item.title}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
