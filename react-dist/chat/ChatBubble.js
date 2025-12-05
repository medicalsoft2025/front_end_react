// ChatBubble.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useChat } from "./hooks/useChat.js";
export function ChatBubble({
  token
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("contacts");
  const messagesEndRef = useRef(null);

  // Usar el hook del chat
  const {
    username,
    users,
    messages,
    selectedUser,
    setSelectedUser,
    inputMessage,
    setInputMessage,
    sendMessage,
    typingMessage
  } = useChat({
    token
  });
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  const statusColor = () => "green"; // Todos online en este contexto

  const openChat = user => {
    setSelectedUser(user);
    setView("chat");
  };
  const backToContacts = () => setView("contacts");

  // Si no hay username (no autenticado), no mostrar el chat
  if (!username) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "chat-bubble-button",
    onClick: () => setIsOpen(!isOpen)
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("div", {
    className: `chat-bubble-window ${isOpen ? "chat-bubble-open" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-bubble-header"
  }, /*#__PURE__*/React.createElement("div", null, view === "chat" && /*#__PURE__*/React.createElement("button", {
    onClick: backToContacts,
    className: "chat-bubble-back-button"
  }, "\u2190"), /*#__PURE__*/React.createElement("span", null, view === "contacts" ? "Chats" : selectedUser)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsOpen(false),
    className: "chat-bubble-close-button"
  }, "\u2716")), view === "contacts" ? /*#__PURE__*/React.createElement("div", {
    className: "chat-bubble-contacts"
  }, users.map((user, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "chat-bubble-contact-item",
    onClick: () => openChat(user)
  }, /*#__PURE__*/React.createElement("span", null, user), /*#__PURE__*/React.createElement("span", {
    className: "chat-bubble-status-dot",
    style: {
      backgroundColor: statusColor()
    }
  })))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "chat-bubble-messages"
  }, messages.map((msg, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: `chat-bubble-message-row ${msg.from === username ? "chat-bubble-user" : "chat-bubble-contact"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-bubble-message-bubble"
  }, msg.text), /*#__PURE__*/React.createElement("div", {
    className: "chat-bubble-message-time"
  }, msg.time))), typingMessage && /*#__PURE__*/React.createElement("div", {
    className: "chat-bubble-typing"
  }, typingMessage), /*#__PURE__*/React.createElement("div", {
    ref: messagesEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "chat-bubble-input-area"
  }, /*#__PURE__*/React.createElement(InputText, {
    value: inputMessage,
    onChange: e => setInputMessage(e.target.value),
    onKeyPress: handleKeyPress,
    placeholder: "Escribe un mensaje...",
    className: "chat-bubble-input"
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: sendMessage
  }, "Enviar")))), /*#__PURE__*/React.createElement("style", null, `
              /* Botón flotante */
              .chat-bubble-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background-color: #2563EB;
                color: white;
                font-size: 24px;
                border: none;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
              }

              .chat-bubble-button:hover {
                background-color: #1d4ed8;
                transform: scale(1.05);
              }

              /* Ventana de chat */
              .chat-bubble-window {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 360px;
                height: 600px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: 1000;
                transform: scale(0);
                opacity: 0;
                transition: all 0.3s ease;
              }

              .chat-bubble-open {
                transform: scale(1);
                opacity: 1;
              }

              /* Header */
              .chat-bubble-header {
                padding: 12px;
                background-color: #2563EB;
                color: white;
                border-bottom: 1px solid #ccc;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
              }

              .chat-bubble-back-button, .chat-bubble-close-button {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.2s;
              }

              .chat-bubble-back-button:hover, .chat-bubble-close-button:hover {
                background-color: rgba(255,255,255,0.2);
              }

              /* Lista de contactos */
              .chat-bubble-contacts {
                flex: 1;
                overflow-y: auto;
              }

              .chat-bubble-contact-item {
                padding: 12px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                transition: background-color 0.2s;
              }

              .chat-bubble-contact-item:hover {
                background-color: #f3f3f3;
              }

              .chat-bubble-status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
              }

              /* Mensajes */
              .chat-bubble-messages {
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                background-color: #f8f9fa;
              }

              .chat-bubble-message-row {
                display: flex;
                margin-bottom: 8px;
              }

              .chat-bubble-message-row.chat-bubble-user { 
                justify-content: flex-end; 
              }

              .chat-bubble-message-row.chat-bubble-contact { 
                justify-content: flex-start; 
              }

              .chat-bubble-message-bubble {
                padding: 8px 12px;
                border-radius: 16px;
                max-width: 75%;
                word-wrap: break-word;
              }

              .chat-bubble-message-row.chat-bubble-user .chat-bubble-message-bubble {
                background-color: #2563EB;
                color: white;
              }

              .chat-bubble-message-row.chat-bubble-contact .chat-bubble-message-bubble {
                background-color: #E5E7EB;
                color: black;
              }

              .chat-bubble-message-time {
                font-size: 10px;
                color: #6B7280;
                align-self: flex-end;
                margin-left: 6px;
                margin-right: 6px;
              }

              .chat-bubble-typing {
                font-style: italic;
                color: #6B7280;
                margin-top: 4px;
                padding: 8px 12px;
                font-size: 12px;
              }

              /* Input */
              .chat-bubble-input-area {
                display: flex;
                padding: 12px;
                border-top: 1px solid #ccc;
                gap: 8px;
                background-color: white;
              }

              .chat-bubble-input {
                flex: 1;
              }

              /* Estilos específicos para el InputText de PrimeReact dentro de nuestro componente */
              .chat-bubble-input-area .p-inputtext {
                width: 100%;
              }
            `));
}