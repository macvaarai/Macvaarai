// src/Components/ChatSessionView.jsx
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatView from "./ChatView";
import InputBar from "./InputBar";
import { useChatContext } from "../context/ChatContext";
import { cards, cardChatbot } from "../data/cards";
import { useHistory } from "../hooks/useHistory";

const ChatSessionView = ({
  allChats,
  setAllChats,
  isAiResponding,
  activeChatId,
  setActiveChatId,
  handleStreamComplete,
}) => {
  const { subtypes, setSubtypes } = useChatContext();
  const { chatId, cardPath } = useParams();
  const { addToHistory } = useHistory();

  const chatEndRef = useRef(null);

  const allCards = [...cards, cardChatbot];
  const currentCard = cardPath
    ? allCards.find((c) => c.path === cardPath)
    : null;

  let chat = null;

  // Visiting by cardPath → create new chat entry if it doesn't exist
  useEffect(() => {
    if (currentCard && !chatId) {
      setAllChats((prev) => {
        const exists = prev.some((c) => c.path === currentCard.path);
        if (exists) return prev;

        const newChat = {
          id: Date.now(),
          title: currentCard.title,
          path: currentCard.path,
          messages: [],
        };
        setActiveChatId(newChat.id);
        return [...prev, newChat];
      });
    }
  }, [cardPath]);

  // restore from history id
  chat = chatId
    ? allChats.find((c) => c.id === Number(chatId))
    : allChats.find((c) => c.id === activeChatId);

  // subtype dropdown changes
  const handleSubtypeChange = (value) => {
    setSubtypes((prev) => ({ ...prev, [cardPath]: value }));
  };

  // helper: add message into this chat
  const addMessage = (msg) => {
    if (!chat) return;
    setAllChats((prev) =>
      prev.map((c) =>
        c.id === chat.id ? { ...c, messages: [...c.messages, msg] } : c
      )
    );

    // Save to persistent history
    if (chat) {
      const updatedChat = {
        ...chat,
        messages: [...(chat.messages || []), msg],
      };
      addToHistory(updatedChat);
    }
  };

  // helper: update AI placeholder
  const updateMessage = (id, updated) => {
    if (!chat) return;
    setAllChats((prev) =>
      prev.map((c) =>
        c.id === chat.id
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === id ? { ...m, ...updated } : m
              ),
            }
          : c
      )
    );
  };

  // ✅ Auto scroll to top (like old one)
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chat?.messages]);

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full px-4 lg:px-8 overflow-y-auto relative bg-black">
      {/* ✅ Small top header with model name + right logo */}
      {currentCard && (
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">{currentCard.icon}</span>
            {currentCard.title}
          </h1>

          {/* ✅ Always show logo at top right */}
          <img
            src="/1.png"
            alt="Macvaar Logo"
            className="h-24 w-auto object-contain"
          />
        </div>
      )}

      {/* Description + dropdowns under header */}
      {currentCard && (
        <div className="text-center mb-4">
          <p className="text-gray-400 text-sm">{currentCard.description}</p>

          {cardPath === "heart-ai-1-lead" && (
            <div className="mt-2">
              <select
                value={subtypes["heart-ai-1-lead"] || "general"}
                onChange={(e) => handleSubtypeChange(e.target.value)}
                className="bg-gray-800 text-white p-1 rounded border border-gray-600 text-sm"
              >
                <option value="general">General</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          )}

          {cardPath === "throat-ai" && (
            <div className="mt-2">
              <select
                value={subtypes["throat-ai"] || "cancer"}
                onChange={(e) => handleSubtypeChange(e.target.value)}
                className="bg-gray-800 text-white p-1 rounded border border-gray-600 text-sm"
              >
                <option value="cancer">Cancer</option>
                <option value="pharyngitis">Pharyngitis</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Chat messages */}
      <ChatView
        messages={chat?.messages || []}
        isAiResponding={isAiResponding}
        onStreamComplete={handleStreamComplete}
      />

      <div ref={chatEndRef}></div>

      {/* Input bar */}
      <div className="sticky bottom-0 left-0 w-full bg-[#131314]">
        <InputBar
          isAiResponding={isAiResponding}
          addMessage={addMessage}
          updateMessage={updateMessage}
          cardPath={chat?.path || cardPath}
        />
      </div>
    </div>
  );
};

export default ChatSessionView;
