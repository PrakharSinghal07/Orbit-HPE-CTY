from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, suggestions, conversation
import os
from dotenv import load_dotenv

load_dotenv()
frontendURL = os.getenv("FRONTEND_URL")

app = FastAPI()
origins = [
    frontendURL,
]

# Apply CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
app.include_router(chat.router) 
app.include_router(suggestions.router) 
app.include_router(conversation.router)

