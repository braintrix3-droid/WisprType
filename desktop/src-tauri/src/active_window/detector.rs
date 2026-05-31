// =========================================================================
// NATIVE ACTIVE WINDOW DETECTOR ENGINE
// =========================================================================

#[cfg(target_os = "windows")]
use windows_sys::Win32::UI::WindowsAndMessaging::{GetForegroundWindow, GetWindowTextW};
#[cfg(target_os = "windows")]
use windows_sys::Win32::System::Threading::{
    GetWindowThreadProcessId, OpenProcess, QueryFullProcessImageNameW, PROCESS_QUERY_LIMITED_INFORMATION
};

#[cfg(target_os = "macos")]
use cocoa::base::id;
#[cfg(target_os = "macos")]
use objc::{msg_send, sel, sel_impl};

pub fn get_active_window_name() -> String {
    // 1. Native Windows Win32 API Implementation
    #[cfg(target_os = "windows")]
    {
        unsafe {
            let hwnd = GetForegroundWindow();
            if hwnd == 0 {
                return "Notepad".to_string();
            }

            let mut pid: u32 = 0;
            GetWindowThreadProcessId(hwnd, &mut pid);

            let process_handle = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, 0, pid);
            if process_handle != 0 {
                let mut buffer = [0u16; 260];
                let mut size = buffer.len() as u32;
                if QueryFullProcessImageNameW(process_handle, 0, buffer.as_mut_ptr(), &mut size) != 0 {
                    let path = String::from_utf16_lossy(&buffer[..size as usize]);
                    if let Some(filename) = path.split('\\').last() {
                        let name = filename.replace(".exe", "");
                        // Clean titles to standard simple tags
                        if name.to_lowercase().contains("chrome") {
                            return "Chrome".to_string();
                        } else if name.to_lowercase().contains("cursor") {
                            return "Cursor".to_string();
                        } else if name.to_lowercase().contains("vscode") || name.to_lowercase().contains("code") {
                            return "VSCode".to_string();
                        } else if name.to_lowercase().contains("slack") {
                            return "Slack".to_string();
                        } else if name.to_lowercase().contains("discord") {
                            return "Discord".to_string();
                        }
                        return name;
                    }
                }
            }
            
            // Fallback: Read raw Window Title text
            let mut title_buf = [0u16; 256];
            let len = GetWindowTextW(hwnd, title_buf.as_mut_ptr(), title_buf.len() as i32);
            if len > 0 {
                let title = String::from_utf16_lossy(&title_buf[..len as usize]);
                return title;
            }
        }
    }

    // 2. Native macOS Apple Cocoa Implementation
    #[cfg(target_os = "macos")]
    {
        unsafe {
            let workspace: id = msg_send![objc::class!(NSWorkspace), sharedWorkspace];
            let front_app: id = msg_send![workspace, frontmostApplication];
            if !front_app.is_null() {
                let localized_name: id = msg_send![front_app, localizedName];
                let c_str: *const std::os::raw::c_char = msg_send![localized_name, UTF8String];
                if !c_str.is_null() {
                    let app_name = std::ffi::CStr::from_ptr(c_str).to_string_lossy().into_owned();
                    return app_name;
                }
            }
        }
    }

    // Default Fallback
    "Notepad".to_string()
}
