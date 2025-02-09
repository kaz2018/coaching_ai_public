import React, { useRef, useEffect, memo } from "react";

function MessageList({ messages, currentUser }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className="flex-grow-1 overflow-auto p-3"
      style={{ maxHeight: "calc(100vh - 180px)" }}
    >
      {messages.map((message, index) => (
        <div
          key={`${message.timestamp}-${index}`}
          className={`d-flex ${
            message.speaker === "user"
              ? "justify-content-end"
              : "justify-content-start"
          } mb-3`}
        >
          <div
            className={`message p-3 rounded-3 ${
              message.speaker === "user"
                ? "bg-primary text-white"
                : "bg-secondary text-dark"
            }`}
            style={{ maxWidth: "70%" }}
          >
            <div className="small mb-1 text-opacity-75">
              {message.speaker === "user" ? "You" : "Coach"}
            </div>
            <div>{message.describe}</div>
            <div className="small mt-1 text-opacity-75">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
