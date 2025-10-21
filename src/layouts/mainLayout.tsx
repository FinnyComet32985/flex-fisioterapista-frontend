import { AppSidebar } from "@/components/custom/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    // BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    // BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";

function MainLayout() {

    const path = {
        "": "HOMEPAGE",
        "appuntamenti": "APPUNTAMENTI",
        "catalogo-esercizi": "CATALOGO",
        "chat": "CHAT",
        "settings": "IMPOSTAZIONI",
        "dashboard-paziente": "DASHBOARD",
        "pazienti": "PAZIENTI",
        "scheda-allenamento": "SCHEDA"
    } as const;
    const locator = useLocation();
    const pathArray: string[] = locator.pathname.substring(1).split("/");
    

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {pathArray && (
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {path[pathArray[0] as keyof typeof path]}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    )}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <Outlet></Outlet>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

export default MainLayout;
