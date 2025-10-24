// Importazione delle dipendenze React necessarie
import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
// Importazione delle icone da react-icons/fi per l'interfaccia utente
import {
    FiSearch, // Icona per la ricerca
    FiSend, // Icona per inviare messaggi
    FiPaperclip, // Icona per allegati
    FiArrowLeft, // Icona freccia indietro
} from "react-icons/fi";
// Importazione utility per la formattazione delle date
import { format } from "date-fns";
import { apiGet, apiPost } from "@/lib/api";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
// ==== Definizione dei tipi TypeScript ====

// Tipo per gli allegati nei messaggi
type Attachment = {
    type: "image" | "file"; // Tipo di allegato: immagine o file generico
    url: string; // URL dell'allegato
    name: string; // Nome del file
    fileType?: string; // Tipo MIME del file (opzionale)
};

type Chat = {
    id: number;
    nome: string;
    cognome: string;
    immagine: string;
};

type Messaggio = {
    id: number;
    testo: string;
    data_invio: Date;
    mittente: string;
};

// ==== Componente principale del Messenger ====
const ChatMessenger: React.FC = () => {
    // Stati per la gestione dell'interfaccia
    const [isMobileView, setIsMobileView] = useState<boolean>(false); // Gestisce la vista mobile/desktop
    const [messageSearch, setMessageSearch] = useState<string>(""); // Testo di ricerca messaggi

    /* CHAT */
    const [chat, setChat] = useState<Chat[]>([]);

    const fetchChat = async () => {
        try {
            const response = await apiGet("/chat");
            if (!response.ok) {
                throw new Error("Impossibile caricare la lista dei pazienti");
            } else {
                const data: Chat[] = await response.json();
                setChat(data);
            }
        } catch (err) {
            console.error("Errore nel caricamento dei pazienti:", err);
        }
    };

    /* MESSAGGI */
    const [messaggi, setMessaggi] = useState<Messaggio[]>([]);

    const fetchMessaggi = async (chat_id: number) => {
        try {
            const response = await apiGet(`/chat/${chat_id}`);
            if (!response.ok) {
                throw new Error("Impossibile caricare la lista dei messaggi");
            } else {
                const data: Messaggio[] = await response.json();
                setMessaggi(data);
            }
        } catch (err) {
            console.error("Errore nel caricamento dei messaggi:", err);
        }
    };

    useEffect(() => {
        fetchChat();
    }, []);

    // Effetto per impostare la chat attiva quando i dati vengono caricati
    useEffect(() => {
        // Se non c'è una chat attiva e la lista delle chat è stata caricata,
        // imposta la prima chat della lista come attiva.
        if (!activeChat && chat.length > 0) {
            handleSetActiveChat(chat[0]);
        }
    }, [chat]); // Questo effetto si attiva ogni volta che 'chat' cambia

    // Stati per la gestione della chat
    const [activeChat, setActiveChat] = useState<Chat | null>(null); // Contatto selezionato
    const [searchQuery, setSearchQuery] = useState<string>(""); // Ricerca contatti
    const [newMessage, setNewMessage] = useState<string>(""); // Testo nuovo messaggio
    const messageEndRef = useRef<HTMLDivElement | null>(null); // Riferimento per lo scroll automatico
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Riferimento per input file

    const handleSetActiveChat = (chat: Chat) => {
        setActiveChat(chat);
        fetchMessaggi(chat.id);
    };


    // Effetto per lo scroll automatico quando arrivano nuovi messaggi
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messaggi]);

    // Filtra i contatti in base alla ricerca
    const filteredChat = chat.filter((c) =>
        (c.nome + " " + c.cognome)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    // Filtra i messaggi del contatto attivo in base alla ricerca
    const filteredMessages = activeChat
        ? messaggi.filter((message) =>
              message.testo.toLowerCase().includes(messageSearch.toLowerCase())
          )
        : [];

    // Gestisce l'invio di un nuovo messaggio
    const handleSendMessage = async () => {
        if (!activeChat) return; // Verifica che ci sia un contatto attivo
        if (newMessage.trim()) {
            // Verifica che il messaggio non sia vuoto
            // Crea un nuovo oggetto messaggio

            try {
                const response = await apiPost(`/message/${activeChat.id}`, {
                    testo: newMessage,
                });
                if (!response.ok) {
                    throw new Error("Impossibile inviare il messaggio");
                }
                if (response.ok) {
                    fetchMessaggi(activeChat.id);
                }
            } catch (err) {
                console.error("Errore nell'invio del messaggio:", err);
            }

            setNewMessage(""); // Pulisce il campo di input
        }
    };

    // Gestisce l'invio del messaggio con il tasto Invio
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Previene il comportamento di default (es. invio di un form)
            event.preventDefault();
            handleSendMessage();
        }
    };

    // Gestisce il caricamento di file come allegati
    // const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    //     if (!activeChat) return; // Verifica che ci sia un contatto attivo
    //     const file = event.target.files?.[0]; // Prende il primo file selezionato
    //     if (file) {
    //         // Crea un nuovo messaggio con l'allegato
    //         const newMsg: Message = {
    //             id: messages[activeChat.id]?.length + 1 || 1,
    //             senderId: "me",
    //             text: "", // Messaggio vuoto perché contiene solo l'allegato
    //             timestamp: new Date(),
    //             status: "sent",
    //             attachments: [
    //                 {
    //                     // Determina se è un'immagine o un altro tipo di file
    //                     type: file.type.startsWith("image/") ? "image" : "file",
    //                     url: URL.createObjectURL(file), // Crea un URL locale per il file
    //                     name: file.name,
    //                     fileType: file.type,
    //                 },
    //             ],
    //         };

    //         // Aggiunge il messaggio con l'allegato alla chat
    //         setMessages((prev) => ({
    //             ...prev,
    //             [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
    //         }));
    //     }
    // };

    // Gestisce il ridimensionamento della finestra e imposta la vista mobile/desktop
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768); // Imposta vista mobile se larghezza < 768px
        };
        handleResize(); // Esegue al mount
        window.addEventListener("resize", handleResize); // Aggiunge listener
        return () => window.removeEventListener("resize", handleResize); // Cleanup al unmount
    }, []);

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-background">
            {/* Contacts List - Mostra su desktop o su mobile se non c'è una chat attiva */}
            <div
                className={`${
                    isMobileView && activeChat ? "hidden" : "w-full md:w-1/3"
                } bg-card border-r border-border`}
            >
                <div className="p-2 border-b border-border">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cerca paziente"
                            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:border-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-12rem)]">
                    {filteredChat.map((c) => (
                        <div
                            key={c.id}
                            className={`flex items-center p-4 cursor-pointer hover:bg-accent ${
                                activeChat?.id === c.id ? "bg-accent" : ""
                            }`}
                            onClick={() => handleSetActiveChat(c)}
                        >
                            <Avatar className="w-15 h-15">
                                {/* <AvatarImage src={paziente.avatar} /> */}
                                <AvatarFallback>
                                    {c.nome.charAt(0)}
                                    {c.cognome.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-foreground">
                                        {c.nome + " " + c.cognome}
                                    </h3>
                                    {/* <span className="text-sm text-muted-foreground">
                                        {format(contact.timestamp, "HH:mm")}
                                    </span> */}
                                </div>
                                {/* <p className="text-sm text-muted-foreground truncate">
                                    {contact.lastMessage}
                                </p> */}
                            </div>
                            {/* {contact.unread > 0 && (
                                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                                    {contact.unread}
                                </span>
                            )} */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window - Mostra su desktop o su mobile se c'è una chat attiva */}
            <div
                className={`${
                    !activeChat && isMobileView ? "hidden" : "flex-1"
                } flex flex-col`}
            >
                {/* Header */}
                <div className="">
                    <div className="flex items-center justify-between">
                        {isMobileView && (
                            <button
                                onClick={() => setActiveChat(null)}
                                className="mr-2 p-2 hover:bg-accent rounded-full"
                            >
                                <FiArrowLeft className="text-xl" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Messages + Sidebar */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Search in messages */}
                    <div className="p-2">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cerca nei messaggi"
                                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:border-primary"
                                value={messageSearch}
                                onChange={(e) =>
                                    setMessageSearch(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 w-full h-full rounded-md border p-4 overflow-y-auto">
                        <div className="p-4">
                            {filteredMessages?.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.mittente === "Fisioterapista"
                                            ? "justify-end"
                                            : "justify-start"
                                    } mb-4 relative`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${
                                            message.mittente === "Paziente"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-card text-card-foreground"
                                        }`}
                                    >
                                        {message.testo}
                                    </div>
                                </div>
                            ))}
                            <div ref={messageEndRef} />
                        </div>
                    </ScrollArea>
                </div>

                {/* Footer */}
                <div className="p-4 bg-card border-t border-border">
                    <div className="flex items-center">
                        <div className="flex space-x-2">
                            {/* <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <FiPaperclip className="text-xl" />
                            </button> */}
                        </div>
                        {/* <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="image/*,.pdf,.doc,.docx"
                        /> */}
                        <input
                            type="text"
                            placeholder="Scrivi un messaggio ..."
                            className="flex-1 ml-4 p-2 border border-input rounded-lg focus:outline-none focus:border-primary bg-background text-foreground"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength={500}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            className="ml-4 bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 focus:outline-none"
                        >
                            <FiSend className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessenger;
