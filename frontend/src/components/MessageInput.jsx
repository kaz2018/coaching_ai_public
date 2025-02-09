import React, { useState } from "react";
import { sendMessage, talktovertex } from "../services/api";

function MessageInput({ user, onSendMessage }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-light mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!message.trim() || sending}
        >
          {sending ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
