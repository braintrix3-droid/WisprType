// =========================================================================
// TAURI COMMANDS BRIDGE
// =========================================================================

use tauri::{AppHandle, State};
use std::sync::Mutex;
use crate::audio::recorder::AudioRecorder;
use crate::active_window::detector::get_active_window_name;
use crate::text_inject::injector::inject_text;
use crate::overlay::manager::toggle_overlay;

pub struct RecorderState(pub Mutex<AudioRecorder>);

#[tauri::command]
pub async fn start_voice_recording(
    app: AppHandle,
    state: State<'_, RecorderState>
) -> Result<String, String> {
    // 1. Instantly display transparent waveform overlay always-on-top
    toggle_overlay(&app, true);
    
    // 2. Start high-priority cpal microphone capture stream
    let mut recorder = state.0.lock().unwrap();
    recorder.start()?;
    
    // 3. Return active window title to JS for feedback representation
    let active_app = get_active_window_name();
    Ok(active_app)
}

#[tauri::command]
pub async fn stop_voice_recording(
    app: AppHandle,
    state: State<'_, RecorderState>,
    auth_token: String,
    backend_url: String
) -> Result<String, String> {
    // 1. Instantly hide transparent overlay window
    toggle_overlay(&app, false);
    
    // 2. Stop microphone and encode PCM to WAV container bytes
    let wav_bytes = {
        let mut recorder = state.0.lock().unwrap();
        recorder.stop()
    };
    
    if wav_bytes.is_empty() {
        return Err("No audio captured by mic".to_string());
    }
    
    // 3. Detect focused active application process context
    let active_app = get_active_window_name();
    
    // 4. Send multi-part wav binary body to FastAPI server endpoint
    let client = reqwest::Client::new();
    let form = reqwest::multipart::Form::new()
        .part("file", reqwest::multipart::Part::bytes(wav_bytes).file_name("audio.wav"))
        .text("active_app", active_app.clone())
        .text("provider", "deepgram")
        .text("language", "en");
        
    let response = client.post(format!("{}/api/v1/transcribe", backend_url))
        .header("Authorization", format!("Bearer {}", auth_token))
        .multipart(form)
        .send()
        .await
        .map_err(|e| format!("HTTP request failed: {}", e))?;
        
    if response.status().is_success() {
        let res_json: serde_json::Value = response.json().await
            .map_err(|e| format!("Failed to parse response JSON: {}", e))?;
            
        let processed_text = res_json.get("processed_text")
            .and_then(|v| v.as_str())
            .unwrap_or("");
            
        // 5. Natively inject text back into focused application cursor
        inject_text(processed_text);
        
        Ok(processed_text.to_string())
    } else {
        let err_text = response.text().await.unwrap_or_default();
        Err(format!("Backend compilation error: {}", err_text))
    }
}
