import httpx
import asyncio
from app.core.config import settings

async def transcribe_audio(
    audio_content: bytes, 
    provider: str = "deepgram", 
    language: str = "en"
) -> str:
    """
    Abstractions layer for Speech-To-Text processing.
    Direct REST integrations ensure ultra-low latency (<500ms).
    """
    if not audio_content:
        return ""
        
    # Provider 1: Deepgram Nova-2 (Optimized for fast throughput and speed)
    if provider == "deepgram":
        try:
            headers = {
                "Authorization": f"Token {settings.DEEPGRAM_API_KEY}",
                "Content-Type": "audio/wav"
            }
            params = {
                "model": "nova-2",
                "smart_format": "true",
                "language": language
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.deepgram.com/v1/listen",
                    headers=headers,
                    params=params,
                    content=audio_content,
                    timeout=8.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["results"]["channels"][0]["alternatives"][0]["transcript"]
        except Exception:
            # Fallback to OpenAI Whisper on failure
            provider = "openai"
            
    # Provider 2: OpenAI Whisper API
    if provider == "openai":
        try:
            headers = {
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
            }
            files = {
                "file": ("audio.wav", audio_content, "audio/wav")
            }
            data = {
                "model": "whisper-1",
                "language": language
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/audio/transcriptions",
                    headers=headers,
                    files=files,
                    data=data,
                    timeout=12.0
                )
                if response.status_code == 200:
                    return response.json()["text"]
        except Exception as e:
            return f"[OpenAI Transcription Error: {str(e)}]"
            
    # Provider 3: AssemblyAI
    if provider == "assemblyai":
        try:
            headers = {
                "Authorization": settings.ASSEMBLYAI_API_KEY,
                "Content-Type": "application/json"
            }
            async with httpx.AsyncClient() as client:
                # 1. Upload audio to secure AssemblyAI buffer
                upload_resp = await client.post(
                    "https://api.assemblyai.com/v2/upload",
                    headers={"Authorization": settings.ASSEMBLYAI_API_KEY},
                    content=audio_content,
                    timeout=12.0
                )
                if upload_resp.status_code == 200:
                    audio_url = upload_resp.json()["upload_url"]
                    # 2. Trigger transcription request
                    transcribe_resp = await client.post(
                        "https://api.assemblyai.com/v2/transcript",
                        headers=headers,
                        json={"audio_url": audio_url, "language_code": language},
                        timeout=10.0
                    )
                    if transcribe_resp.status_code == 200:
                        transcript_id = transcribe_resp.json()["id"]
                        # 3. Simple async polling loop
                        for _ in range(12):
                            await asyncio.sleep(0.5)
                            status_resp = await client.get(
                                f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
                                headers={"Authorization": settings.ASSEMBLYAI_API_KEY}
                            )
                            if status_resp.status_code == 200:
                                result = status_resp.json()
                                if result["status"] == "completed":
                                    return result["text"]
                                elif result["status"] == "failed":
                                    break
        except Exception as e:
            return f"[AssemblyAI Transcription Error: {str(e)}]"
            
    return ""
