// src/Components/SidebarAIModels.jsx
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import { cards, cardChatbot } from "../data/cards";

const SidebarAIModels = () => {
  const { cardPath } = useParams();
  const { subtypes, setSubtypes } = useChatContext();
  const [openSection, setOpenSection] = useState("health");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSubtypeChange = (model, value) => {
    setSubtypes((prev) => ({ ...prev, [model]: value }));
  };

  const renderCards = (items) =>
    items.map((card) => (
      <div key={card.path} className="pl-2">
        <Link
          to={`/card/${card.path}`}
          className={`block px-3 py-2 rounded ${
            cardPath === card.path
              ? "bg-gray-700 font-semibold"
              : "hover:bg-gray-800"
          }`}
        >
          {card.icon} {card.title}
        </Link>

        {card.path === "heart-ai-1-lead" && cardPath === "heart-ai-1-lead" && (
          <select
            value={subtypes["heart-ai-1-lead"]}
            onChange={(e) => handleSubtypeChange("heart-ai-1-lead", e.target.value)}
            className="ml-6 mt-1 bg-gray-800 border border-gray-600 rounded text-sm"
          >
            <option value="general">General</option>
            <option value="advanced">Advanced</option>
          </select>
        )}
        {card.path === "throat-ai" && cardPath === "throat-ai" && (
          <select
            value={subtypes["throat-ai"]}
            onChange={(e) => handleSubtypeChange("throat-ai", e.target.value)}
            className="ml-6 mt-1 bg-gray-800 border border-gray-600 rounded text-sm"
          >
            <option value="cancer">Cancer</option>
            <option value="pharyngitis">Pharyngitis</option>
          </select>
        )}
      </div>
    ));

  return (
    <div className="w-72 bg-[#1e1f24] text-white flex flex-col border-r border-gray-700 overflow-y-auto">
      <div className="p-4 font-bold text-lg border-b border-gray-700">
        AI Models
      </div>

      {/* Health Models dropdown */}
      <div>
        <button
          onClick={() => toggleSection("health")}
          className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-800"
        >
          Health Models {openSection === "health" ? "▼" : "▶️"}
        </button>
        {openSection === "health" && (
          <div className="ml-2">{renderCards(cards)}</div>
        )}
      </div>

      {/* Chatbot separate section */}
      <div>
        <button className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-800">
          Chatbot
        </button>
        <div className="ml-2">
          <Link
            to={`/card/${cardChatbot.path}`}
            className={`block px-3 py-2 rounded ${
              cardPath === cardChatbot.path
                ? "bg-gray-700 font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            {cardChatbot.icon} {cardChatbot.title}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarAIModels;
