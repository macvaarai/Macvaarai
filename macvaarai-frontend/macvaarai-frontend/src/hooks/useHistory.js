import { useState, useEffect } from "react";

const HISTORY_STORAGE_KEY = "ai_health_platform_history";

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      } catch (err) {
        console.error("Error saving history:", err);
      }
    }
  }, [history, loading]);

  const addToHistory = (conversation) => {
    const historyItem = {
      id: conversation.id || `chat_${Date.now()}`,
      title: conversation.title || `Conversation ${new Date().toLocaleDateString()}`,
      type: conversation.type || "general",
      timestamp: conversation.timestamp || new Date().toISOString(),
      messages: conversation.messages || [],
      summary: conversation.summary || "",
      model: conversation.model || null,
      subtype: conversation.subtype || null,
    };

    setHistory((prev) => [historyItem, ...prev]);
    return historyItem;
  };

  const deleteFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to delete all history? This cannot be undone.")) {
      setHistory([]);
    }
  };

  const getHistoryItem = (id) => {
    return history.find((item) => item.id === id);
  };

  const updateHistoryItem = (id, updates) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  return {
    history,
    loading,
    addToHistory,
    deleteFromHistory,
    clearAllHistory,
    getHistoryItem,
    updateHistoryItem,
  };
};
