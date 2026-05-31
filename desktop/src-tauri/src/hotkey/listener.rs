// =========================================================================
// SYSTEM-WIDE GLOBAL SHORTCUT SCHEDULER
// =========================================================================

use tauri::{AppHandle, GlobalShortcutManager};

/// Registers the customizable system-wide shortcut trigger
pub fn register_global_shortcuts(app: &AppHandle, shortcut: &str) -> Result<(), String> {
    let mut shortcut_manager = app.global_shortcut_manager();
    
    // Unregister any legacy triggers
    let _ = shortcut_manager.unregister_all();
    
    let app_clone = app.clone();
    shortcut_manager.register(shortcut, move || {
        // Emit events directly to the frontend window for smooth audio state toggles
        let _ = app_clone.emit_all("hotkey-triggered", true);
    }).map_err(|e| format!("Shortcut registration failed: {}", e))?;
    
    Ok(())
}
