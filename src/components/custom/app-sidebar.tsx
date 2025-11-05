import React, { useState, useEffect } from "react"
import { Users, CalendarFold, MessageCircle, Dumbbell} from "lucide-react"

import { NavMain } from "@/components/custom/nav-main"
import { ModeToggle } from "./theme-toggler";
import {Link} from "react-router-dom";
import { NavUser } from "@/components/custom/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { apiGet } from "@/lib/api"
import logo from "@/assets/logo.png"

interface UserProfile {
  nome: string;
  cognome: string;
  email: string;
}

const navMainData = {
  navMain: [
    {
      title: "Pazienti",
      url: "/pazienti",
      icon: Users,
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // chiamata API
        const response = await apiGet("/profile");

        if (!response.ok) {
          // La logica di refresh/logout è gestita in api.ts
          throw new Error("Impossibile caricare il profilo utente.");
        }

        const data: UserProfile = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Errore nel caricamento del profilo:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-xl" >
                  <img src={logo} style={{borderRadius: '20em'}}></img>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">FlexiFisio</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle></ModeToggle>
        {userProfile ? (
          <NavUser user={{
            name: `${userProfile.nome} ${userProfile.cognome}`,
            email: userProfile.email,
            avatar: "/avatars/shadcn.jpg" 
          }} />
        ) : (
          // Mostra stato di caricamento o un fallback
          <NavUser user={{ name: "Caricamento...", email: "...", avatar: "" }} />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
