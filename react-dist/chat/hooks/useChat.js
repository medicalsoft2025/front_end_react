// hooks/useChat.ts
import { useState, useEffect, useRef } from "react";
import { getJWTPayload } from "../../../services/utilidades.js";
export function useChat({
  token
}) {
  const AIUser = "Medicalsoft AI";
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(AIUser);
  const [inputMessage, setInputMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [username, setUsername] = useState("");
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Decodificar JWT
  useEffect(() => {
    if (!token) return;
    function parseJwt(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
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
      query: {
        token
      },
      transports: ["websocket"]
    });
    socketRef.current = socket;

    // Historial
    socket.on("chat:history", msgs => {
      const mapped = msgs.map(msg => ({
        from: msg.userId,
        to: msg.toUserId || "all",
        text: msg.content || msg.text || "",
        timestamp: new Date(msg.createdAt || Date.now()).getTime(),
        time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }));
      setMessages(mapped.sort((a, b) => a.timestamp - b.timestamp));
    });
    socket.on("message:receive", handleMessage);

    // Lista de usuarios
    socket.on("user:list", onlineUsers => {
      setUsers([AIUser, ...onlineUsers.filter(u => u !== username)]);
    });

    // Indicador de escribiendo
    socket.on("user:typing", ({
      username: typingUser
    }) => {
      setTypingMessage(`${typingUser} está escribiendo...`);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = window.setTimeout(() => setTypingMessage(""), 2500);
    });
    socket.on("user:stopTyping", ({
      from
    }) => {
      if (typingMessage.includes(from)) setTypingMessage("");
    });
    return () => {
      socket.off("message:receive", handleMessage);
      socket.disconnect();
    };
  }, [username, token]);

  // Filtrar mensajes según chat seleccionado
  const filteredMessages = messages.filter(msg => {
    if (!selectedUser || selectedUser === "all") return msg.to === "all" || msg.from === username || msg.to === username;
    return msg.from === username && msg.to === selectedUser || msg.from === selectedUser && msg.to === username;
  }).sort((a, b) => a.timestamp - b.timestamp);

  // Mensajes entrantes
  const handleMessage = data => {
    console.log("data", data);
    const now = Date.now();
    const msg = {
      from: data.from,
      to: data.to || "all",
      text: data.message,
      time: new Date(now).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: now
    };
    setMessages(prev => [...prev, msg].sort((a, b) => a.timestamp - b.timestamp));
  };

  // Enviar mensaje
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const now = Date.now();
    const msg = {
      from: username,
      to: selectedUser || "all",
      text: inputMessage.trim(),
      time: new Date(now).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: now
    };
    if (selectedUser === AIUser) {
      handleSendToAI(msg);
    } else {
      handleSendToUser(msg);
    }
  };
  const handleSendToUser = msg => {
    socketRef.current?.emit("message:send", {
      message: msg.text,
      toUser: selectedUser || null
    });
    setInputMessage("");
    socketRef.current?.emit("user:stopTyping", {
      toUser: selectedUser || null
    });
    isTypingRef.current = false;
  };
  const handleSendToAI = async msg => {
    handleMessage({
      from: msg.from,
      to: msg.to,
      message: msg.text
    });
    setInputMessage("");
    const aiResponse = await getAIResponse(msg);
    handleMessage({
      from: AIUser,
      to: username,
      message: aiResponse
    });
  };
  const getAIWebhookByURL = () => {
    const jwtPayload = getJWTPayload();
    const location = window.location.href.split("/").reverse()[0];
    const sessionId = `${jwtPayload.tenant_id}-user-${jwtPayload.sub}-${location}`;
    const token = sessionStorage.getItem("auth_token");
    const defaultBody = {
      sessionId
    };
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
      "X-Tenant-ID": jwtPayload.tenant_id,
      "X-OpenAI-API-Key": "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"
    };
    if (location.startsWith("verPaciente")) {
      return {
        url: "https://unlucky-zebra-40.hooks.n8n.cloud/webhook-test/clinical-summary",
        body: {
          ...defaultBody,
          patientId: new URLSearchParams(window.location.search).get("id")
        },
        headers: defaultHeaders
      };
    }
    return {
      url: "https://hooks.medicalsoft.ai/webhook/test",
      body: defaultBody,
      headers: defaultHeaders
    };
  };
  const getAIResponse = async msg => {
    const {
      url,
      body,
      headers
    } = getAIWebhookByURL();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json" // Inform the server that we are sending JSON data
      },
      body: JSON.stringify({
        ...body,
        message: msg.text
      })
    });
    const data = await response.text();
    return data;
  };

  // Detectar escribiendo
  const handleInputChange = value => {
    setInputMessage(value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current?.emit("user:typing", {
        username,
        toUser: selectedUser || null
      });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      isTypingRef.current = false;
      socketRef.current?.emit("user:stopTyping", {
        toUser: selectedUser || null
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
    typingMessage
  };
}