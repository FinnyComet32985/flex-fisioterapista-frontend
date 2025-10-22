// Importazione delle dipendenze React necessarie
import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
// Importazione delle icone da react-icons/fi per l'interfaccia utente
import {
  FiSearch,      // Icona per la ricerca
  FiSend,        // Icona per inviare messaggi
  FiPaperclip,   // Icona per allegati
  FiArrowLeft,   // Icona freccia indietro
} from "react-icons/fi";
// Importazione utility per la formattazione delle date
import { format } from "date-fns";

// ==== Definizione dei tipi TypeScript ====

// Tipo per gli allegati nei messaggi
type Attachment = {
  type: "image" | "file";     // Tipo di allegato: immagine o file generico
  url: string;                // URL dell'allegato
  name: string;               // Nome del file
  fileType?: string;          // Tipo MIME del file (opzionale)
};

// Tipo per i messaggi
type Message = {
  id: number;                 // ID univoco del messaggio
  senderId: number | "me";    // ID del mittente ("me" per l'utente corrente)
  text: string;               // Contenuto testuale del messaggio
  timestamp: Date;            // Data e ora del messaggio
  status: "sent" | "delivered" | "read";  // Stato del messaggio
  attachments: Attachment[];  // Array di allegati
};

// Tipo per i contatti
type Contact = {
  id: number;                 // ID univoco del contatto
  name: string;               // Nome del contatto
  image: string;              // URL dell'immagine profilo
  lastMessage: string;        // Ultimo messaggio nella chat
  timestamp: Date;            // Data e ora dell'ultimo messaggio
  unread: number;            // Numero di messaggi non letti
};

// Mappa che associa l'ID del contatto con l'array dei suoi messaggi
type MessagesMap = Record<number, Message[]>;

// ==== Componente principale ====

// ==== Componente principale del Messenger ====
const ChatMessenger: React.FC = () => {
  // Stati per la gestione dell'interfaccia
  const [isMobileView, setIsMobileView] = useState<boolean>(false);          // Gestisce la vista mobile/desktop
  const [messageSearch, setMessageSearch] = useState<string>("");            // Testo di ricerca messaggi

  const contacts = [
    {
      id: 1,
      name: "Sarah Wilson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      lastMessage: "Hey, how are you doing?",
      timestamp: new Date(2024, 0, 15, 14, 30),
      unread: 2,
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      lastMessage: "The project looks great!",
      timestamp: new Date(2024, 0, 15, 13, 45),
      unread: 0,
    },
    {
      id: 3,
      name: "Emily Davis",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      lastMessage: "Let's meet tomorrow",
      timestamp: new Date(2024, 0, 15, 12, 15),
      unread: 1,
    },
  ];

  const [messages, setMessages] = useState<MessagesMap>({
    1: [
      {
        id: 1,
        senderId: 1,
        text: "Hey, how are you doing?",
        timestamp: new Date(2024, 0, 15, 14, 30),
        status: "read",
        attachments: [],
      },
      {
        id: 2,
        senderId: "me",
        text: "I'm good! Just working on some new features.",
        timestamp: new Date(2024, 0, 15, 14, 31),
        status: "delivered",
        attachments: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87",
            name: "project_screenshot.jpg",
            fileType: "image/jpeg",
          },
        ],
      },
    ],
    2: [
      {
        id: 1,
        senderId: 2,
        text: "Hi there! Can we discuss the project timeline?",
        timestamp: new Date(2024, 0, 15, 13, 45),
        status: "read",
        attachments: [],
      },
    ],
    3: [
      {
        id: 1,
        senderId: 3,
        text: "Let's meet tomorrow",
        timestamp: new Date(2024, 0, 15, 12, 15),
        status: "read",
        attachments: [],
      },
    ],
  });

  // Stati per la gestione della chat
  const [activeContact, setActiveContact] = useState<Contact | null>(contacts[0]); // Contatto selezionato
  const [searchQuery, setSearchQuery] = useState<string>("");                      // Ricerca contatti
  const [newMessage, setNewMessage] = useState<string>("");                        // Testo nuovo messaggio
  const messageEndRef = useRef<HTMLDivElement | null>(null);                      // Riferimento per lo scroll automatico
  const fileInputRef = useRef<HTMLInputElement | null>(null);                     // Riferimento per input file

  // Effetto per lo scroll automatico quando arrivano nuovi messaggi
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filtra i contatti in base alla ricerca
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtra i messaggi del contatto attivo in base alla ricerca
  const filteredMessages = activeContact
    ? messages[activeContact.id]?.filter((message) =>
        message.text.toLowerCase().includes(messageSearch.toLowerCase())
      )
    : [];

  // Gestisce l'invio di un nuovo messaggio
  const handleSendMessage = () => {
    if (!activeContact) return;  // Verifica che ci sia un contatto attivo
    if (newMessage.trim()) {     // Verifica che il messaggio non sia vuoto
      // Crea un nuovo oggetto messaggio
      const newMsg: Message = {
        id: messages[activeContact.id]?.length + 1 || 1,  // Genera un nuovo ID
        senderId: "me",                                   // Imposta il mittente come utente corrente
        text: newMessage,                                 // Testo del messaggio
        timestamp: new Date(),                            // Data e ora correnti
        status: "sent",                                   // Stato iniziale
        attachments: [],                                  // Nessun allegato
      };

      // Aggiorna lo stato dei messaggi aggiungendo il nuovo messaggio
      setMessages((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
      }));

      setNewMessage("");  // Pulisce il campo di input
    }
  };

  // Gestisce il caricamento di file come allegati
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!activeContact) return;  // Verifica che ci sia un contatto attivo
    const file = event.target.files?.[0];  // Prende il primo file selezionato
    if (file) {
      // Crea un nuovo messaggio con l'allegato
      const newMsg: Message = {
        id: messages[activeContact.id]?.length + 1 || 1,
        senderId: "me",
        text: "",  // Messaggio vuoto perché contiene solo l'allegato
        timestamp: new Date(),
        status: "sent",
        attachments: [
          {
            // Determina se è un'immagine o un altro tipo di file
            type: file.type.startsWith("image/") ? "image" : "file",
            url: URL.createObjectURL(file),  // Crea un URL locale per il file
            name: file.name,
            fileType: file.type,
          },
        ],
      };

      // Aggiunge il messaggio con l'allegato alla chat
      setMessages((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
      }));
    }
  };



  // Gestisce il ridimensionamento della finestra e imposta la vista mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);  // Imposta vista mobile se larghezza < 768px
    };
    handleResize();  // Esegue al mount
    window.addEventListener("resize", handleResize);  // Aggiunge listener
    return () => window.removeEventListener("resize", handleResize);  // Cleanup al unmount
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Contacts List */}
      <div
        className={`${
          isMobileView ? (activeContact ? "hidden" : "w-full") : "w-1/3"
        } bg-white border-r border-gray-200`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-5rem)]">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                activeContact?.id === contact.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setActiveContact(contact)}
            >
              <img
                src={contact.image}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <span className="text-sm text-gray-500">
                    {format(contact.timestamp, "HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {contact.lastMessage}
                </p>
              </div>
              {contact.unread > 0 && (
                <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                  {contact.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${
          isMobileView ? (activeContact ? "w-full" : "hidden") : "flex-1"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            {isMobileView && (
              <button
                onClick={() => setActiveContact(null)}
                className="mr-2 p-2 hover:bg-gray-100 rounded-full"
              >
                <FiArrowLeft className="text-xl" />
              </button>
            )}

          </div>
        </div>

        {/* Messages + Sidebar */}
        <div className="flex flex-1 relative">
          <div className="flex-1 flex flex-col">
            <div className="p-2 bg-white border-b">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in messages"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {filteredMessages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === "me" ? "justify-end" : "justify-start"
                  } mb-4 relative`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiPaperclip className="text-xl" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
            />
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 ml-4 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              maxLength={500}
            />
            <button
              onClick={handleSendMessage}
              className="ml-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
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
