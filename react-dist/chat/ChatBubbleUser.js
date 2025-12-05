import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
export const ChatBubbleUser = props => {
  const {
    messages,
    typingMessage,
    username,
    inputMessage,
    setInputMessage,
    handleKeyPress,
    sendMessage
  } = props;
  const messagesEndRef = useRef(null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
  }, "Enviar")));
};