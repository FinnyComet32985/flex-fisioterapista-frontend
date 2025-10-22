import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import {
  FiSearch,
  FiSend,
  FiVideo,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiPaperclip,
  FiUsers,
  FiMoreVertical,
  FiArrowLeft,
} from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { format } from "date-fns";

// ==== Tipi ====

type Attachment = {
  type: "image" | "file";
  url: string;
  name: string;
  fileType?: string;
};

type Message = {
  id: number;
  senderId: number | "me";
  text: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  attachments: Attachment[];
};

type Contact = {
  id: number;
  name: string;
  image: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
};

type MessagesMap = Record<number, Message[]>;

// ==== Componente principale ====

const ChatMessenger: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [messageSearch, setMessageSearch] = useState<string>("");
  const [showMessageOptions, setShowMessageOptions] = useState<number | null>(null);

  const [contacts, setContacts] = useState<Contact[]>([
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
  ]);

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

  const [activeContact, setActiveContact] = useState<Contact | null>(contacts[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [showAttachments, setShowAttachments] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = activeContact
    ? messages[activeContact.id]?.filter((message) =>
        message.text.toLowerCase().includes(messageSearch.toLowerCase())
      )
    : [];

  const handleSendMessage = () => {
    if (!activeContact) return;
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages[activeContact.id]?.length + 1 || 1,
        senderId: "me",
        text: newMessage,
        timestamp: new Date(),
        status: "sent",
        attachments: [],
      };

      setMessages((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
      }));

      setNewMessage("");
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!activeContact) return;
    const file = event.target.files?.[0];
    if (file) {
      const newMsg: Message = {
        id: messages[activeContact.id]?.length + 1 || 1,
        senderId: "me",
        text: "",
        timestamp: new Date(),
        status: "sent",
        attachments: [
          {
            type: file.type.startsWith("image/") ? "image" : "file",
            url: URL.createObjectURL(file),
            name: file.name,
            fileType: file.type,
          },
        ],
      };

      setMessages((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
      }));
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    if (!activeContact) return;
    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: prev[activeContact.id].filter((msg) => msg.id !== messageId),
    }));
  };

  const handleEditMessage = (messageId: number, newText?: string) => {
    if (!activeContact) return;
    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: prev[activeContact.id].map((msg) =>
        msg.id === messageId ? { ...msg, text: newText ?? msg.text } : msg
      ),
    }));
  };

  const handleDeleteChat = (contactId: number) => {
    setMessages((prev) => ({
      ...prev,
      [contactId]: [],
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
              onClick={() => {
                setActiveContact(contact);
                setShowUserDetails(false);
              }}
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUserDetails(!showUserDetails)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiMoreVertical className="text-xl text-gray-600" />
              </button>
            </div>
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
                    onMouseEnter={() => setShowMessageOptions(message.id)}
                    onMouseLeave={() => setShowMessageOptions(null)}
                  >
                    {message.text}
                    {showMessageOptions === message.id && (
                      <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-white shadow-lg rounded-lg p-2">
                        <button
                          onClick={() => handleEditMessage(message.id)}
                          className="block p-2 hover:bg-gray-100 w-full text-left"
                        >
                          <FiEdit2 className="inline mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="block p-2 hover:bg-gray-100 w-full text-left text-red-500"
                        >
                          <FiTrash2 className="inline mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </div>

          {/* User details sidebar */}
          {showUserDetails && activeContact && (
            <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Shared Files</h3>
              <div className="space-y-2">
                {messages[activeContact.id]
                  ?.filter((msg) => msg.attachments.length > 0)
                  .flatMap((msg) =>
                    msg.attachments.map((attachment, idx) => (
                      <div
                        key={`${msg.id}-${idx}`}
                        className="flex items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <FiPaperclip className="mr-2" />
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                    ))
                  )}
              </div>
              <button
                onClick={() => handleDeleteChat(activeContact.id)}
                className="mt-4 w-full p-2 text-red-500 hover:bg-red-50 rounded"
              >
                Delete Chat
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex space-x-2">
              <BsEmojiSmile className="text-gray-400 text-xl cursor-pointer hover:text-gray-600" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiImage className="text-xl" />
              </button>
              <button
                onClick={() => setShowAttachments(!showAttachments)}
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
