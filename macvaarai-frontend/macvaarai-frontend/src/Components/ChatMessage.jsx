// src/Components/ChatMessage.jsx
import React from "react";

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";

  let parsed = null;
  if (message.sender === "ai" && message.text) {
    try {
      parsed = JSON.parse(message.text); // Try parse JSON
    } catch {
      parsed = null; // fallback to plain text
    }
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-[75%] break-words whitespace-pre-line ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-700 text-white rounded-bl-none"
        }`}
      >
        {/* Case 1: BE sent plain text */}
        {!parsed && message.text && <p>{message.text}</p>}

        {/* Case 2: BE sent JSON - Professional Report Format */}
        {parsed && (
          <div className="space-y-5 text-sm bg-gray-800 p-4 rounded-lg">
            {/* --- Greeting / Simple Answer --- */}
            {parsed.response?.answer && (
              <div className="text-gray-200">
                <p>{parsed.response.answer}</p>
              </div>
            )}

            {/* --- MODEL RESULT SECTION (Styled Card) --- */}
            {parsed.model_result && (
              <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-bold text-lg mb-3 text-blue-300">📊 Model Result</h3>
                <div className="space-y-2">
                  {parsed.model_result.label && (
                    <p className="text-gray-100">
                      <span className="font-semibold">Label:</span> {parsed.model_result.label}
                    </p>
                  )}
                  {parsed.model_result.confidence !== undefined && (
                    <p className="text-gray-100">
                      <span className="font-semibold">Confidence:</span> {
                        typeof parsed.model_result.confidence === "number"
                          ? (parsed.model_result.confidence * 100).toFixed(2) + "%"
                          : parsed.model_result.confidence
                      }
                    </p>
                  )}
                  {parsed.model_result.summary && (
                    <p className="text-gray-100">
                      <span className="font-semibold">Summary:</span> {parsed.model_result.summary}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* === CLINICAL ANALYSIS SECTIONS === */}

            {parsed.llm_response?.thought_process && (
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-base mb-2 text-purple-300">🧠 Thought Process</h3>
                <p className="text-gray-200 leading-relaxed">{parsed.llm_response.thought_process}</p>
              </div>
            )}

            {parsed.llm_response?.key_findings && (
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-base mb-2 text-green-300">✓ Key Findings</h3>
                {Array.isArray(parsed.llm_response.key_findings) ? (
                  <ol className="list-decimal list-inside ml-2 space-y-1 text-gray-200">
                    {parsed.llm_response.key_findings.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-200">{parsed.llm_response.key_findings}</p>
                )}
              </div>
            )}

            {parsed.llm_response?.model_reasoning && (
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-bold text-base mb-2 text-yellow-300">🔬 Model Reasoning</h3>
                <p className="text-gray-200 leading-relaxed">{parsed.llm_response.model_reasoning}</p>
              </div>
            )}

            {parsed.llm_response?.recommended_steps && (
              <div className="border-l-4 border-cyan-500 pl-4">
                <h3 className="font-bold text-base mb-2 text-cyan-300">📋 Recommended Steps</h3>
                {Array.isArray(parsed.llm_response.recommended_steps) ? (
                  <ol className="list-decimal list-inside ml-2 space-y-1 text-gray-200">
                    {parsed.llm_response.recommended_steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-200">{parsed.llm_response.recommended_steps}</p>
                )}
              </div>
            )}

            {parsed.llm_response?.medical_risks && (
              <div className="border-l-4 border-red-500 pl-4 bg-red-900 bg-opacity-20 p-3 rounded">
                <h3 className="font-bold text-base mb-2 text-red-300">⚠️ Medical Risks</h3>
                {Array.isArray(parsed.llm_response.medical_risks) ? (
                  <ul className="list-disc list-inside ml-2 space-y-1 text-gray-200">
                    {parsed.llm_response.medical_risks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-200">{parsed.llm_response.medical_risks}</p>
                )}
              </div>
            )}

            {parsed.llm_response?.references && (
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-base mb-2 text-indigo-300">📚 References</h3>
                {Array.isArray(parsed.llm_response.references) ? (
                  <ul className="list-disc list-inside ml-2 space-y-1 text-blue-300">
                    {parsed.llm_response.references.map((ref, i) => (
                      <li key={i} className="break-words">{ref}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-blue-300">{parsed.llm_response.references}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* File Preview */}
        {message.filePreview &&
          (message.fileType?.startsWith("image/") ? (
            <img
              src={message.filePreview}
              alt="uploaded"
              className="mt-2 rounded max-h-48"
            />
          ) : (
            <span className="mt-2 block text-sm text-gray-300">
              📎 File uploaded
            </span>
          ))}
      </div>
    </div>
  );
};

export default ChatMessage;
