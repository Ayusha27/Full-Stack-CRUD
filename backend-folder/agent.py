import os
from dotenv import load_dotenv
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq

# Load variables from .env
load_dotenv()

# Access the key securely
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    temperature=0,
    model_name="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

def get_chat_response(user_input: str):
    try:
        # Ensure user_input is treated as a string and assigned to 'content'
        messages = [
            SystemMessage(content="You are AdmitPro AI, a helpful university assistant."),
            HumanMessage(content=str(user_input))
        ]

        # Invoke the model
        response = llm.invoke(messages)
        return response.content
    except Exception as e:
        print(f"Agent Error: {e}")
        return "I encountered an error processing your request."