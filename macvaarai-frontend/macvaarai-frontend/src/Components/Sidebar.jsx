// src/Components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import { cards, cardChatbot } from "../data/cards";
import { Menu, X } from "lucide-react"; // Hamburger + Close
import HistoryPanel from "./HistoryPanel";
import { useHistory } from "../hooks/useHistory";

const Sidebar = ({ allChats, activeChatId, setActiveChatId, setAllChats, children }) => {
  const { cardPath } = useParams();
  const location = useLocation();
  const { subtypes, setSubtypes } = useChatContext();
  const { history, addToHistory, deleteFromHistory, clearAllHistory } = useHistory();

  const [openSection, setOpenSection] = useState(null); // collapsed by default
  const [isOpen, setIsOpen] = useState(false); // sidebar closed by default

  const allCards = [...cards, cardChatbot];
  const iconMap = allCards.reduce((acc, c) => {
    acc[c.title] = c.icon;
    return acc;
  }, {});

  const handleDelete = (id) => {
    setAllChats((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSelectHistory = (item) => {
    setActiveChatId(item.id);
    // Navigate to chat
    window.location.hash = `#/chat/${item.id}`;
  };

  const handleDeleteHistory = (id) => {
    deleteFromHistory(id);
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  };

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
          className={`block px-3 py-2 ${
            cardPath === card.path
              ? "font-semibold text-blue-400"
              : "hover:text-gray-300"
          }`}
        >
          {card.icon} {card.title}
        </Link>

        {/* subtype dropdowns */}
        {card.path === "heart-ai-1-lead" && cardPath === "heart-ai-1-lead" && (
          <select
            value={subtypes["heart-ai-1-lead"]}
            onChange={(e) =>
              handleSubtypeChange("heart-ai-1-lead", e.target.value)
            }
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

  // ✅ Auto-close on home, auto-open on chat/model
  useEffect(() => {
    if (location.pathname === "/") {
      setIsOpen(false);
    } else if (
      location.pathname.startsWith("/chat") ||
      location.pathname.startsWith("/card")
    ) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="flex">
      {/* ✅ Sidebar */}
      <div
        className={`bg-[#1e1f24] text-white flex flex-col border-r border-gray-700 transition-all duration-300 ${
          isOpen ? "w-72" : "w-0"
        }`}
      >
        {isOpen && (
          <>
            {/* Header with Close button */}
            <div className="p-4 font-bold text-lg border-b border-gray-700 flex justify-between items-center">
              AI Models
              <button onClick={() => setIsOpen(false)} className="text-gray-300">
                <X size={22} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {/* 🔙 Home */}
              <div>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 font-semibold hover:text-gray-300 ${
                    location.pathname === "/" ? "text-blue-400" : ""
                  }`}
                >
                  🔙 Home
                </Link>
              </div>

              {/* Health Models */}
              <div>
                <button
                  onClick={() => toggleSection("health")}
                  className="w-full text-left px-4 py-2 font-semibold hover:text-gray-300"
                >
                  Health Models {openSection === "health" ? "▼" : "▶️"}
                </button>
                {openSection === "health" && (
                  <div className="ml-2">{renderCards(cards)}</div>
                )}
              </div>

              {/* Chatbot */}
              <div>
                <div className="px-4 py-2 font-semibold">Chatbot</div>
                <Link
                  to={`/card/${cardChatbot.path}`}
                  className={`block px-3 py-2 ${
                    cardPath === cardChatbot.path
                      ? "font-semibold text-blue-400"
                      : "hover:text-gray-300"
                  }`}
                >
                  {cardChatbot.icon} {cardChatbot.title}
                </Link>
              </div>

              {/* Reports */}
              <div className="mt-6">
                <div className="px-4 py-2 text-sm font-bold text-gray-300 border-b border-gray-700">
                  Reports
                </div>
                <Link
                  to="/appointments"
                  className={`block px-3 py-2 ${
                    cardPath === "appointments"
                      ? "font-semibold text-blue-400"
                      : "hover:text-gray-300"
                  }`}
                >
                  📋 Appointments
                </Link>
              </div>

              {/* ✅ Profile */}
              <div className="mt-6">
                <div className="px-4 py-2 text-sm font-bold text-gray-300 border-b border-gray-700">
                  Account
                </div>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 ${
                    location.pathname === "/profile"
                      ? "font-semibold text-blue-400"
                      : "hover:text-gray-300"
                  }`}
                >
                  👤 Profile
                </Link>
              </div>

              {/* Persistent History Panel */}
              <HistoryPanel
                history={history}
                onSelectHistory={handleSelectHistory}
                onDeleteHistory={handleDeleteHistory}
                onClearAll={clearAllHistory}
              />
            </div>
          </>
        )}
      </div>

      {/* ✅ Main content shifts when sidebar opens */}
      <div className={`flex-1 transition-all duration-300 ${isOpen ? "ml-0" : "ml-0"}`}>
        {/* Hamburger visible when sidebar is closed */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="m-4 text-white hover:text-gray-400"
          >
            <Menu size={22} />
          </button>
        )}

        {/* Children = your page content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;
