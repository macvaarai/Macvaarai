
def format_combined_image_query_response(classification_label, confidence, llm_response):
    return {
        "status": "success",
        "analysis": {
            "thought_process": llm_response.get("thought_process", ""),
            "medical_explanation": llm_response.get("medical_explanation", ""),
            "key_findings": llm_response.get("key_findings", ""),
            "diagnostic_basis": llm_response.get("diagnostic_basis", ""),
            "medical_risks": llm_response.get("medical_risks", ""),
            "recommended_steps": llm_response.get("recommended_steps", ""),
            "references": llm_response.get("references", "")
        },
        "classification": {
            "label": classification_label,
            "confidence": confidence
        }
    }

def format_file_only_response(label, confidence, short_description):
    return {
        "status": "success",
        "classification": {
            "label": label,
            "confidence": confidence,
            "summary": short_description
        },
        "note": "This result is from automated classification. Please verify with a medical professional."
    }

def format_query_only_response(query_text, llm_summary, model_type):
    if model_type == "general":
        return {
            "status": "success",
            "response": {
                "query": query_text,
                "answer": llm_summary,
                "disclaimer": "This is not a medical diagnosis. Please consult a professional if needed."
            }
        }
    elif model_type == "greeting":
        return {
            "status": "success",
            "response": {
                "query": query_text,
                "answer": "Hi! I’m your medical assistant. Please ask a health-related question.",
                "type": "greeting"
            }
        }
    else:
        return {
            "status": "error",
            "message": "Unsupported model_type."}