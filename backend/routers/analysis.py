import os
import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import get_current_user
import models
import schemas

router = APIRouter(prefix="/api/analysis", tags=["Code Analysis"])

# Helper function to call Gemini REST API directly
def call_gemini_api(contents: list, system_instruction: str = None) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY is not configured on the server. Please add it to backend/.env"
        )
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    payload = {
        "contents": contents
    }
    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }
        
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        data = response.json()
        
        # Extract response text
        result_text = data["candidates"][0]["content"]["parts"][0]["text"]
        return result_text
    except Exception as e:
        error_msg = str(e)
        try:
            # Try to get detailed error message from API response if possible
            if 'response' in locals() and response.text:
                error_json = response.json()
                if "error" in error_json:
                    error_msg = error_json["error"].get("message", error_msg)
        except Exception:
            pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing Gemini API: {error_msg}"
        )

@router.post("/review")
async def review_code(
    request: schemas.ReviewRequest, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    code = request.code
    label = request.label or "Code Review"
    custom_prompt = request.prompt or "Review this code for quality, correctness and performance."

    # Formulate prompt for Gemini
    full_prompt = f"{custom_prompt}\n\n```\n{code}\n```"

    try:
        # Format payload content for single turn
        contents = [{
            "role": "user",
            "parts": [{"text": full_prompt}]
        }]
        
        result_text = call_gemini_api(
            contents=contents,
            system_instruction="You are a senior code reviewer. Be concise, structured, and direct. Never include conversational preambles."
        )
        
        # Save to analysis history in database
        history_entry = models.History(
            user_id=current_user.id,
            code=code,
            result=result_text,
            label=label
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        return {
            "result": result_text,
            "label": label,
            "history_id": history_entry.id
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing review: {str(e)}"
        )

@router.post("/chat")
async def chat_assistant(
    request: schemas.ChatRequest,
    current_user: models.User = Depends(get_current_user)
):
    messages = request.messages
    system_instruction = request.system_instruction or (
        "You are a helpful AI coding assistant. Answer questions about code clearly and concisely. "
        "Format code examples with triple backticks. Be precise and conversational."
    )

    if not messages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Messages history cannot be empty."
        )

    try:
        # Convert message history to Gemini REST API format
        # Gemini expects roles to be either 'user' or 'model'
        gemini_contents = []
        for msg in messages:
            role = "model" if msg.role == "assistant" else "user"
            gemini_contents.append({
                "role": role,
                "parts": [{"text": msg.content}]
            })

        result_text = call_gemini_api(
            contents=gemini_contents,
            system_instruction=system_instruction
        )
        
        return {
            "result": result_text
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error running chat: {str(e)}"
        )
