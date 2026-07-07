// src/Components/InputBar.jsx
import React, { useState, useRef } from "react";
import { Send, Paperclip, X, Download } from "lucide-react";
import { useChatContext } from "../context/ChatContext";
import { postHealthAssistantData, postChatbotData } from "../services/healthApi";
import { useParams } from "react-router-dom";

const InputBar = ({ isAiResponding, addMessage, updateMessage }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [lastResponse, setLastResponse] = useState(null); // Store latest response for PDF download
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const { subtypes } = useChatContext();
  const { cardPath } = useParams();

  // Map cardPath → backend model_type
  const mapCardPathToModelType = (cardPath) => {
    switch (cardPath) {
      case "heart-ai-1-lead": return "onelead";
      case "heart-ai-12-lead": return "twelvelead";
      case "skin-ai": return "skin";
      case "eye-ai": return "eye";
      case "lungs-ai": return "lung";
      case "ear-ai": return "ear";
      case "malaria-ai": return "malaria";
      case "pneumonia-ai": return "pneumonia";
      case "diabetes-ai": return "diabetes";
      case "throat-ai": return "throat";
      case "oral-ai": return "oral";
      case "covid-19-ai": return "covid";
      case "dengue-ai": return "dengue";
      case "nose-ai": return "nose";
      case "pharyngitis-ai": return "pharyngitis";
      case "colorectal-ai": return "colorectal";
      default: return "none";
    }
  };

  // Format backend response (unchanged)
  const formatHealthResponse = (res) => {
    if (!res) return "⚠ No response from server";
    if (res.response?.answer) {
      return res.response.answer;
    }
    let text = "";
    if (res.model_result) {
      text += `Model Result\n`;
      if (res.model_result.label) text += `Label: ${res.model_result.label}\n\n`;
      if (res.model_result.confidence !== undefined) {
        const confVal = res.model_result.confidence;
        const confText =
          typeof confVal === "number"
            ? `${(confVal * 100).toFixed(2)}%`
            : String(confVal);
        text += `Confidence: ${confText}\n\n`;
      }
      if (res.model_result.summary) text += `${res.model_result.summary}\n\n`;
    }
    if (res.llm_response?.key_findings) {
      text += `Key Findings\n${res.llm_response.key_findings}\n\n`;
    }
    if (res.llm_response?.medical_explanation) {
      text += `Medical Explanation\n${res.llm_response.medical_explanation}\n\n`;
    }
    if (res.llm_response?.medical_risks) {
      text += `Medical Risks\n${res.llm_response.medical_risks}\n\n`;
    }
    if (res.llm_response?.model_reasoning) {
      text += `Model Reasoning\n${res.llm_response.model_reasoning}\n\n`;
    }
    if (res.llm_response?.recommended_steps) {
      text += `Recommended Steps\n${res.llm_response.recommended_steps}\n\n`;
    }
    if (res.llm_response?.references) {
      text += `References\n${
        Array.isArray(res.llm_response.references)
          ? res.llm_response.references.join("\n")
          : res.llm_response.references
      }\n`;
    }
    return text.trim();
  };

  const handleSend = async () => {
    if (!text.trim() && !file) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text.trim() || "",
      filePreview: file ? URL.createObjectURL(file) : null,
      fileType: file ? file.type : null,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);

    const aiMsg = {
      id: Date.now() + 1,
      sender: "ai",
      text: "Thinking..",
      timestamp: new Date().toISOString(),
    };
    addMessage(aiMsg);

    setText("");
    setFile(null);

    try {
      const formData = new FormData();
      if (userMsg.text) formData.append("text", userMsg.text);
      if (file) formData.append("file", file);

      if (cardPath) {
        const modelType = mapCardPathToModelType(cardPath);
        formData.append("model_type", modelType);

        if (cardPath === "heart-ai-1-lead" || cardPath === "throat-ai") {
          if (subtypes[cardPath]) {
            formData.append("model_subtype", subtypes[cardPath]);
          }
        } else {
          formData.append("model_subtype", "none");
        }
      }

      let result;
      if (cardPath === "chatbot-ai") {
        result = await postChatbotData(formData);
        updateMessage(aiMsg.id, { text: result });
      } else {
        result = await postHealthAssistantData(formData);
        setLastResponse(result); // Store for PDF download
        if (result.response?.answer) {
          updateMessage(aiMsg.id, { text: result.response.answer });
        } else {
          updateMessage(aiMsg.id, { text: JSON.stringify(result) });
        }
      }
    } catch (err) {
      let errorMsg = "⚠ Unknown error";
      if (err.response?.data) {
        errorMsg = JSON.stringify(err.response.data, null, 2);
      } else if (err.message) {
        errorMsg = `⚠ ${err.message}`;
      }
      updateMessage(aiMsg.id, { text: errorMsg });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ Toggle mic logic
  const handleMicToggle = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => prev + " " + transcript);
      };

      recognition.onerror = (err) => {
        console.error("Speech recognition error:", err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    }
  };

  // Download PDF Report
  const handleDownloadPDF = async () => {
    if (!lastResponse) {
      alert("No analysis result to download. Please run an analysis first.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/download-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_result: lastResponse.model_result,
          llm_response: lastResponse.llm_response,
          query: lastResponse.query,
          file_type: lastResponse.file_type,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Health_Report_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Failed to download PDF: " + err.message);
    }
  };

  return (
    <div className="flex flex-col border-t border-gray-700">
      {file && (
        <div className="flex items-center gap-2 p-2 bg-gray-800">
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="h-16 rounded"
            />
          ) : (
            <span className="text-gray-300">📎 {file.name}</span>
          )}
          <button onClick={() => setFile(null)} className="text-red-400">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 p-3">
        {/* 📎 Upload Button */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".png,.jpeg,.jpg,.bmp,.gif,.tiff,.tif,.webp,.heic,.avif,.dcm,.dicom,.cr2,.cr3,.nef,.arw,.raf,.psd,.svg,.eps,.ico,.icns,.fits,.exr,.hdr,.xcf,.apng,.mng,.bmv,.pmv,
          .pdf,.txt,.doc,.docx,.rtf,.odt,.dot,.dotx,.md,.json,.xml,.csv,.log,
          .mp4,.mov,.avi,.mkv"
          style={{ display: "none" }}
          onChange={(e) => {
            setFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="p-2 hover:bg-gray-700 rounded-full"
        >
          <Paperclip size={18} />
        </button>

        {/* 🎙️ Mic Button right beside upload */}
        <button
          type="button"
          onClick={handleMicToggle}
          className={`p-2 rounded-full ${
            isRecording ? "bg-red-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {isRecording ? "🛑" : "🎙️"}
        </button>

        {/* ✍️ Text Area with Paste Image Support */}
        <textarea
          className="flex-1 bg-transparent resize-none outline-none p-2"
          rows={1}
          placeholder="Ask about your health concerns..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={(e) => {
            const items = e.clipboardData.items;
            for (const item of items) {
              if (item.type.indexOf("image") !== -1) {
                const pastedFile = item.getAsFile();
                if (pastedFile) {
                  setFile(pastedFile);
                }
              }
            }
          }}
        />

        {/* 📤 Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={
            isAiResponding ||
            ((cardPath === "heart-ai-1-lead" || cardPath === "throat-ai") &&
              !subtypes[cardPath])
          }
          className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 disabled:opacity-50"
        >
          <Send size={18} />
        </button>

        {/* 📥 Download PDF Button */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={!lastResponse || isAiResponding}
          title="Download PDF Report"
          className="p-2 bg-green-600 rounded-full hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

export default InputBar;
