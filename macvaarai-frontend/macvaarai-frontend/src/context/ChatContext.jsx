import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [subtypes, setSubtypes] = useState({
    "heart-ai-1-lead": "general",
    "throat-ai": "cancer",
  });

  return (
    <ChatContext.Provider
      value={{
        subtypes,
        setSubtypes,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
