// src/Components/ExploreMoreAI.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { cards, cardChatbot } from "../data/cards";
import AICard from "./AICard";

const ExploreMoreAI = ({ onSignOut }) => {
  const { cardPath } = useParams();

  const handleSignOut = () => {
    // Clear stored tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");

    // Reset auth state if passed down
    if (onSignOut) onSignOut();

    // Reload → ProtectedRoute will show login/signup again
    window.location.reload();
  };

  return (
    <div className="p-8 space-y-10 overflow-y-auto flex-1 bg-black">
      {/* Health Models */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Health Models</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <AICard key={card.path} card={card} activePath={cardPath} />
          ))}
        </div>
      </div>

      {/* Chatbot */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Chatbot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AICard card={cardChatbot} activePath={cardPath} />
        </div>
      </div>

      {/* 🔹 Sign out button at bottom */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default ExploreMoreAI;
