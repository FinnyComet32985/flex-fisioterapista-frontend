import * as React from "react"
import {
  BookOpen,
  Bot,
  Users,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  CalendarFold,
  MessageCircle,
  Dumbbell
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { ModeToggle } from "../components/custom/theme-toggler";

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import logo from "@/assets/logo.jpg"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Pazienti",
      url: "/pazienti",
      icon: Users,
      isActive: true,
    },
    {
      title: "Appuntamenti",
      url: "/appuntamenti",
      icon: CalendarFold,
    },
    {
      title: "Messaggi",
      url: "/chat",
      icon: MessageCircle,
    },
    {
      title: "Catalogo Esercizi",
      url: "/catalogo-esercizi",
      icon: Dumbbell,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-xl" >
                  <img src={logo} style={{borderRadius: '20em'}}></img>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">FlexiFisio</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle></ModeToggle>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
