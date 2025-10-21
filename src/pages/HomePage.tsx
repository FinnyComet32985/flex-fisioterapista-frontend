import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";
import PazientiPage from "./Pazienti";

const getPages = (page: string): string[] => {
    return page.split("/");
};

function HomePage() {
    const [page, setPage] = useState("flexifisio");

    const handleSetSubpage = (page: string, currentPage: string) => {
        const pagesArray = getPages(page);
        let newPage = "";

        const indexPage = pagesArray.indexOf(currentPage);

        for (let i = 0; i <= indexPage; i++) {
            if (i < indexPage - 1) {
                newPage += pagesArray[i] + "/";
            } else {
                newPage += pagesArray[i];
            }
        }
        setPage(newPage);
    };

    return (
        <SidebarProvider>
            <AppSidebar onPageChange={setPage} />
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
                                {getPages(page) &&
                                    getPages(page).map((currentPage, index) => (
                                        <>
                                            {index > 0 && (
                                                <BreadcrumbSeparator className="hidden md:block" />
                                            )}
                                            <BreadcrumbItem key={currentPage}>
                                                {index <
                                                getPages(page).length - 1 ? (
                                                    <BreadcrumbLink
                                                        onClick={() =>
                                                            handleSetSubpage(
                                                                page,
                                                                currentPage
                                                            )
                                                        }
                                                    >
                                                        {currentPage.toUpperCase()}
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <BreadcrumbPage>
                                                        {currentPage.toUpperCase()}
                                                    </BreadcrumbPage>
                                                )}
                                            </BreadcrumbItem>
                                        </>
                                    ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="p-4">
                    {page === "flexifisio" && <h3>Homepage</h3>}
                    {page === "pazienti" && <PazientiPage handler={setPage} />}
                    {page === "esercizi" && <h3>Catalogo Esercizi</h3>}
                    {page === "chat" && <h3>Chat</h3>}
                    {page === "appuntamenti" && <h3>Appuntamenti</h3>}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default HomePage;
