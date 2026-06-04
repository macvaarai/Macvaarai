// src/Components/AICard.jsx
import React from "react";
import { Link } from "react-router-dom";

const AICard = ({ card }) => {
  return (
    <Link
      to={`/card/${card.path}`}
      className={`relative rounded-xl p-6 w-72 h-48 flex flex-col justify-between 
                  bg-[#1a1b1f] border border-gray-800 
                  shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-xl ${card.shadowGlow}
                  transition transform hover:scale-105`}
    >
      {/* Top: Icon + Title */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{card.icon}</span>
        <span className="font-semibold text-xl text-white">{card.title}</span>
      </div>

      {/* Description */}
      <p className="text-base text-gray-300 leading-relaxed mt-3">
        {card.description}
      </p>
    </Link>
  );
};

export default AICard;
