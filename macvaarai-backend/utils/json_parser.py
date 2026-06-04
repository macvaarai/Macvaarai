def build_response_json(text=None, file_type=None, model_result=None, llm_response=None, semantic_matches=None):
    return {
        "input_type": "text+file" if text and file_type else "text" if text else "file",
        "query": text,
        "file_type": file_type,
        "model_result": model_result,
        "llm_response": llm_response,
        "semantic_matches": semantic_matches or []
    }