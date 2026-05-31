// Prevents console window spawning on Windows in production/release mode
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod audio;
mod hotkey;
mod active_window;
mod text_inject;
mod overlay;
mod commands;

use std::sync::Mutex;
use tauri::{GlobalShortcutManager, Manager};
use audio::recorder::AudioRecorder;
use commands::{start_voice_recording, stop_voice_recording, RecorderState};

fn main() {
    tauri::Builder::default()
        // Initialize global state for native CPAL audio recorder
        .manage(RecorderState(Mutex::new(AudioRecorder::new())))
        .setup(|app| {
            let app_handle = app.app_handle();
            let mut shortcut_manager = app.global_shortcut_manager();
            
            // Register a highly-reliable global shortcut (F8 / CapsLock)
            // System-wide capture hooks map cleanly without overlapping system keys
            let _ = shortcut_manager.register("F8", move || {
                // Emit trigger to main window so JS can coordinate UI and overlay waveform sways
                let _ = app_handle.emit_all("global-hotkey-press", ());
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            start_voice_recording,
            stop_voice_recording
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
