import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, Clock, Filter } from "lucide-react";

const HistoryPanel = ({ history, onSelectHistory, onDeleteHistory, onClearAll }) => {
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "today", "week", "month"

  const getDaysSince = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filterHistory = () => {
    const now = new Date();
    return history.filter((item) => {
      const date = new Date(item.timestamp);
      const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));

      switch (filter) {
        case "today":
          return days === 0;
        case "week":
          return days <= 7;
        case "month":
          return days <= 30;
        default:
          return true;
      }
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (days === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredHistory = filterHistory();

  return (
    <div className="bg-gray-900 border-t border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition w-full"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            <Clock size={18} />
            <span className="font-semibold">History ({history.length})</span>
          </button>
        </div>

        {expanded && (
          <>
            {/* Filter */}
            <div className="flex gap-2 mb-2">
              {["all", "today", "week", "month"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Clear All Button */}
            {history.length > 0 && (
              <button
                onClick={onClearAll}
                className="w-full px-3 py-1 rounded text-xs bg-red-900 hover:bg-red-800 text-red-200 font-medium transition"
              >
                Clear All History
              </button>
            )}
          </>
        )}
      </div>

      {/* History List */}
      {expanded && (
        <div className="max-h-96 overflow-y-auto">
          {filteredHistory.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 hover:bg-gray-800 transition group"
                >
                  <button
                    onClick={() => onSelectHistory(item)}
                    className="w-full text-left mb-2 hover:text-blue-400 transition"
                  >
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type && <span className="capitalize">{item.type}</span>}
                      {item.type && item.model && <span> • </span>}
                      {item.model && <span>{item.model}</span>}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatDate(item.timestamp)}
                    </p>
                  </button>

                  <button
                    onClick={() => onDeleteHistory(item.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No history yet</p>
              <p className="text-xs mt-1">Your conversations will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
