import re
from together import Together
from config import TOGETHER_API_KEY

client = Together(api_key=TOGETHER_API_KEY)

SYSTEM_PROMPT_CHATBOT = """
You are MacvaarAI Chatbot.
- Be clear, concise, and conversational. No Hallucination.
- Answer casual questions (greetings, small talk, personal queries) naturally and directly, even if no files are uploaded.
- If the user provides an image, report, audio, video, or document, summarize the contents and extract useful observations in simple words or points.
- If the user asks a specific question about the content of a file or document, answer *only what is asked* without unnecessary extra details.
- Never add disclaimers like "As an AI".
- Never suggest or encourage harmful, suicidal, or unsafe actions. Provide safe and professional guidance if such topics appear.
- Respond in English if no text language is provided; otherwise respond in the user's text language.
- Do not use markdown, bold, or italics. Always answer in plain text only.
"""

def ask_chatbot(
    question: str,
    user_lang:  str = "en",
    system_prompt: str = SYSTEM_PROMPT_CHATBOT,
    model: str = "mistralai/Mistral-7B-Instruct-v0.1",
    max_tokens: int = 1024,
    temperature: float = 0.5
):
    system_prompt = system_prompt + f"\n\nAlways reply in this language: {user_lang}\n"
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question}
        ],
        max_tokens=max_tokens,
        temperature=temperature,
    )



    content = response.choices[0].message.content.strip()

    content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
    content = re.sub(r"\\(.?)\\*", r"\1", content)
    content = re.sub(r"(.*?)", r"\1", content)
    content = re.sub(r"\n{2,}", "\n", content)
    content = re.sub(r"\s{2,}", " ", content)
    content = re.sub(r"(\d+\.)", r"\n\1", content)
    return content.strip()