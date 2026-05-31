// =========================================================================
// NATIVE TEXT INJECTION ENGINE
// =========================================================================

use enigo::{Enigo, KeyboardControllable};
use std::thread;
use std::time::Duration;

pub fn inject_text(text: &str) {
    if text.is_empty() {
        return;
    }

    // Initialize Enigo virtual keyboard controller
    let mut enigo = Enigo::new();

    // Small delay to allow active window cursor focus to settle
    thread::sleep(Duration::from_millis(50));

    // High performance virtual keystroke injection
    // Achieves target insertion latency of <1s for transcription paragraphs
    enigo.key_sequence(text);
}
