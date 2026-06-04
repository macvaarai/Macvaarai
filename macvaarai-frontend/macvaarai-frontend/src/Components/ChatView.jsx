import React from "react";
import ChatMessage from "./ChatMessage";

const ChatView = ({ messages }) => {
  return (
    <div className="flex-1 px-4 space-y-3 overflow-y-auto">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default ChatView;
