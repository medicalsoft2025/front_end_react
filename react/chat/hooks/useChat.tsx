// hooks/useChat.ts
import { useState, useEffect, useRef } from "react";
declare const io: any;

interface Message {
    from: string;
    to: string;
    text: string;
    time: string;
    timestamp: number;
}

interface UseChatProps {
    token: string;
}

export function useChat({ token }: UseChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(
        "Medicalsoft AI"
    );
    const [inputMessage, setInputMessage] = useState("");
    const [typingMessage, setTypingMessage] = useState("");
    const [username, setUsername] = useState<string>("");

    const socketRef = useRef<any>(null);
    const typingTimeoutRef = useRef<number | null>(null);
    const isTypingRef = useRef(false);

    // Decodificar JWT
    useEffect(() => {
        if (!token) return;

        function parseJwt(token: string) {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(
                        (c) =>
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    )
                    .join("")
            );
            return JSON.parse(jsonPayload);
        }

        try {
            const decoded = parseJwt(token);
            setUsername(decoded.username);
        } catch (err) {
            console.error("Error decodificando token:", err);
        }
    }, [token]);

    // Conexión a Socket.IO
    useEffect(() => {
        if (!username) return;

        const socket = io("https://dev.monaros.co/chat-internal", {
            query: { token },
            transports: ["websocket"],
        });
        socketRef.current = socket;

        // Historial
        socket.on("chat:history", (msgs: any[]) => {
            const mapped = msgs.map((msg) => ({
                from: msg.userId,
                to: msg.toUserId || "all",
                text: msg.content || msg.text || "",
                timestamp: new Date(msg.createdAt || Date.now()).getTime(),
                time: new Date(msg.createdAt || Date.now()).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                ),
            }));
            setMessages(mapped.sort((a, b) => a.timestamp - b.timestamp));
        });

        // Mensajes entrantes
        const handleMessage = (data: any) => {
            console.log("data", data);

            const now = Date.now();
            const msg: Message = {
                from: data.from,
                to: data.to || "all",
                text: data.message,
                time: new Date(now).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                timestamp: now,
            };
            setMessages((prev) =>
                [...prev, msg].sort((a, b) => a.timestamp - b.timestamp)
            );
        };

        socket.on("message:receive", handleMessage);

        // Lista de usuarios
        socket.on("user:list", (onlineUsers: string[]) => {
            setUsers([
                "Medicalsoft AI",
                ...onlineUsers.filter((u) => u !== username),
            ]);
        });

        // Indicador de escribiendo
        socket.on("user:typing", ({ username: typingUser }: any) => {
            setTypingMessage(`${typingUser} está escribiendo...`);
            if (typingTimeoutRef.current)
                clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = window.setTimeout(
                () => setTypingMessage(""),
                2500
            );
        });

        socket.on("user:stopTyping", ({ from }: any) => {
            if (typingMessage.includes(from)) setTypingMessage("");
        });

        return () => {
            socket.off("message:receive", handleMessage);
            socket.disconnect();
        };
    }, [username, token]);

    // Filtrar mensajes según chat seleccionado
    const filteredMessages = messages
        .filter((msg) => {
            if (!selectedUser || selectedUser === "all")
                return (
                    msg.to === "all" ||
                    msg.from === username ||
                    msg.to === username
                );
            return (
                (msg.from === username && msg.to === selectedUser) ||
                (msg.from === selectedUser && msg.to === username)
            );
        })
        .sort((a, b) => a.timestamp - b.timestamp);

    // Enviar mensaje
    const sendMessage = () => {
        if (!inputMessage.trim()) return;

        const now = Date.now();
        const msg: Message = {
            from: username,
            to: selectedUser || "all",
            text: inputMessage.trim(),
            time: new Date(now).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            timestamp: now,
        };

        socketRef.current?.emit("message:send", {
            message: msg.text,
            toUser: selectedUser || null,
        });
        setInputMessage("");
        socketRef.current?.emit("user:stopTyping", {
            toUser: selectedUser || null,
        });
        isTypingRef.current = false;
    };

    // Detectar escribiendo
    const handleInputChange = (value: string) => {
        setInputMessage(value);

        if (!isTypingRef.current) {
            isTypingRef.current = true;
            socketRef.current?.emit("user:typing", {
                username,
                toUser: selectedUser || null,
            });
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = window.setTimeout(() => {
            isTypingRef.current = false;
            socketRef.current?.emit("user:stopTyping", {
                toUser: selectedUser || null,
            });
        }, 1500);
    };

    return {
        username,
        users,
        messages: filteredMessages,
        selectedUser,
        setSelectedUser,
        inputMessage,
        setInputMessage: handleInputChange,
        sendMessage,
        typingMessage,
    };
}
