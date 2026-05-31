import json
import re
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from openai import OpenAI
from app.core.config import settings
from app.models.models import User, CustomDictionary, Memory, Snippet, Integration
from app.services.automations import (
    trigger_notion_page,
    trigger_clickup_task,
    trigger_calendar_event,
    trigger_gmail_draft
)

# Initialize OpenAI Client using shared settings
client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def run_ai_pipeline(
    raw_text: str,
    user: User,
    active_app: str,
    db: Session
) -> Dict[str, Any]:
    """
    Executes the WhisperType V3 AI Voice OS Pipeline:
    1. Snippet Trigger Expansion (regex replacements)
    2. Dynamic Memory & Vocab Context fetching
    3. App-Aware Casing and tone adjustment
    4. GPT-4o Cleanup & Function-Calling intent automation routing
    """
    processed_text = raw_text.strip()
    if not processed_text:
        return {"processed_text": "", "action_executed": False, "action_summary": ""}

    # 1. Expand Voice Snippets triggers (e.g. "my signature" -> formatted sign)
    user_snippets = db.query(Snippet).filter(Snippet.user_id == user.id).all()
    for sn in user_snippets:
        pattern = re.compile(rf"\b{re.escape(sn.trigger_phrase)}\b", re.IGNORECASE)
        processed_text = pattern.sub(sn.expansion_text, processed_text)

    # 2. Collect Custom Dictionary & Personal Memory Contexts
    custom_vocab = db.query(CustomDictionary).filter(CustomDictionary.user_id == user.id).all()
    vocab_context = ", ".join([v.phrase for v in custom_vocab])
    
    personal_memories = db.query(Memory).filter(Memory.user_id == user.id).all()
    memories_context = "\n".join([f"{m.entity_key}: {m.entity_value}" for m in personal_memories])

    # 3. Formulate App-Aware Casing & Styling Rules
    app_lower = active_app.lower()
    app_style_guidelines = "Style: Keep original tone but ensure perfect grammar and punctuation."
    
    if "slack" in app_lower or "discord" in app_lower:
        app_style_guidelines = "Style: Casual, lowercase formatting, direct conversational flow, friendly, include 1-2 natural emojis."
    elif "gmail" in app_lower or "outlook" in app_lower or "mail" in app_lower:
        app_style_guidelines = "Style: Professional corporate email format. Include appropriate greetings, clean paragraphs, and formal sign-offs."
    elif "linkedin" in app_lower:
        app_style_guidelines = "Style: Engaging LinkedIn post layout with vertical spacing, hooks, formatted paragraphs, and minimal clean hashtags."
    elif "notion" in app_lower or "docs" in app_lower:
        app_style_guidelines = "Style: Highly structured markdown document. Utilize headers (###), checklists (- [ ]), and bullet points."
    elif "cursor" in app_lower or "vscode" in app_lower or "windsurf" in app_lower:
        app_style_guidelines = "Style: STRICT CODE GENERATION mode. Format cleanly in developer code syntax (camelCase, proper indentations). Return ONLY the direct lines of code, no Markdown tags, no quotes."

    # 4. Construct System Prompt mapping context rules
    system_prompt = f"""You are the core cleanup intelligence of WhisperType Voice OS.
Your goal is to parse raw spoken audio transcription, clean repetitions, stutters, verbal pauses (um, ah, like, you know), fix grammar errors, and output finished writing.

Rules:
- If the user corrects themselves (e.g. "I want to email Bob... actually let's do Alice"), output the final corrected thought ("I want to email Alice.").
- Custom Vocabs to recognize: {vocab_context}
- Personal Memory Context: {memories_context}
- Application Awareness Rules: {app_style_guidelines}
- Do NOT add conversational responses like "Here is your cleaned text". Simply output the polished, finished writing.
"""

    # Declare Function Calling tools for AI Actions
    tools = [
        {
            "type": "function",
            "function": {
                "name": "create_notion_page",
                "description": "Triggered when user explicitly requests to create or add a Notion page/note (e.g. 'Create a notion page called Tasks List')",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "The title of the page to create"},
                        "content": {"type": "string", "description": "Markdown body content of the page"}
                    },
                    "required": ["title", "content"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "create_clickup_task",
                "description": "Triggered when user requests task creation inside ClickUp (e.g. 'Create a clickup task for project review')",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "Task name"},
                        "priority": {"type": "string", "enum": ["urgent", "high", "normal", "low"], "default": "normal"},
                        "due_date": {"type": "string", "description": "Relative or parsed date (e.g. 'tomorrow', 'Friday')"}
                    },
                    "required": ["title"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "book_calendar_event",
                "description": "Triggered when user wants to book a Google Calendar event (e.g. 'Add a meeting next Tuesday to my calendar')",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "Event subject"},
                        "event_time": {"type": "string", "description": "Parsed event date and time string"},
                        "duration_minutes": {"type": "integer", "default": 30}
                    },
                    "required": ["title", "event_time"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "create_gmail_draft",
                "description": "Triggered when user wants to draft or send an email (e.g. 'Send a follow-up email draft to client')",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "recipient": {"type": "string", "description": "Target email address or name"},
                        "subject": {"type": "string", "description": "Email subject line"},
                        "body": {"type": "string", "description": "Polished corporate email message body"}
                    },
                    "required": ["recipient", "subject", "body"]
                }
            }
        }
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": processed_text}
            ],
            tools=tools,
            tool_choice="auto",
            temperature=0.2
        )
        
        message = response.choices[0].message
        
        # Check if the LLM routed to an automation tool call
        if message.tool_calls:
            tool_call = message.tool_calls[0]
            func_name = tool_call.function.name
            func_args = json.loads(tool_call.function.arguments)
            
            action_executed = False
            action_summary = ""
            
            if func_name == "create_notion_page":
                action_executed = await trigger_notion_page(func_args["title"], func_args["content"], user, db)
                action_summary = f'[Notion Page Created: "{func_args["title"]}"]'
                
            elif func_name == "create_clickup_task":
                action_executed = await trigger_clickup_task(func_args["title"], func_args.get("priority", "normal"), func_args.get("due_date"), user, db)
                action_summary = f'[ClickUp Task Created: "{func_args["title"]}"]'
                
            elif func_name == "book_calendar_event":
                action_executed = await trigger_calendar_event(func_args["title"], func_args["event_time"], func_args.get("duration_minutes", 30), user, db)
                action_summary = f'[Calendar Event Booked: "{func_args["title"]}"]'
                
            elif func_name == "create_gmail_draft":
                action_executed = await trigger_gmail_draft(func_args["recipient"], func_args["subject"], func_args["body"], user, db)
                action_summary = f'[Gmail Draft Created for {func_args["recipient"]}]'
                
            if action_executed:
                return {
                    "processed_text": action_summary,
                    "action_executed": True,
                    "action_summary": action_summary
                }
        
        # If no tool calls or execution failed, return cleaned text output
        cleaned_text = message.content if message.content else processed_text
        return {
            "processed_text": cleaned_text.strip(),
            "action_executed": False,
            "action_summary": ""
        }
        
    except Exception as e:
        # Graceful fallback on OpenAI connectivity or parser errors
        return {
            "processed_text": processed_text,
            "action_executed": False,
            "action_summary": f"[Pipeline Error: {str(e)}]"
        }
