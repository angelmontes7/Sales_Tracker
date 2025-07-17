from fastapi import FastAPI
from dotenv import load_dotenv
import os

# run uvicorn main:app --reload to start server
load_dotenv()  # Loads environment variables from .env file

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Sales Tracker API is running ✅"}
