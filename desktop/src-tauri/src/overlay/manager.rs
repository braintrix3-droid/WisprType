// =========================================================================
// NATIVE ALWAYS-ON-TOP OVERLAY MANAGER
// =========================================================================

use tauri::{AppHandle, Manager};

/// Toggles visibility of the transparent, always-on-top overlay waveform window
pub fn toggle_overlay(app: &AppHandle, visible: bool) {
    if let Some(overlay_window) = app.get_window("overlay") {
        if visible {
            // Make visible, focus, and lock in always-on-top foreground stack
            let _ = overlay_window.show();
            let _ = overlay_window.set_always_on_top(true);
        } else {
            // Hide immediately upon key release
            let _ = overlay_window.hide();
        }
    }
}
