// =========================================================================
// NATIVE AUDIO CAPTURE & WAV ENCODER ENGINE
// =========================================================================

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::{Arc, Mutex};

pub struct AudioRecorder {
    stream: Option<cpal::Stream>,
    buffer: Arc<Mutex<Vec<i16>>>,
}

impl AudioRecorder {
    pub fn new() -> Self {
        Self {
            stream: None,
            buffer: Arc::new(Mutex::new(Vec::new())),
        }
    }

    /// Spawns a high-priority cpal capture stream at 16000Hz mono PCM
    pub fn start(&mut self) -> Result<(), String> {
        let host = cpal::default_host();
        let device = host.default_input_device()
            .ok_or_else(|| "No input microphone device found on system".to_string())?;
            
        // Standard mono PCM configuration (optimal for Deepgram Nova-2 and Whisper)
        let config = cpal::StreamConfig {
            channels: 1,
            sample_rate: cpal::SampleRate(16000),
            buffer_size: cpal::BufferSize::Default,
        };

        let buffer = self.buffer.clone();
        buffer.lock().unwrap().clear();

        let stream = device.build_input_stream(
            &config,
            move |data: &[i16], _: &cpal::InputCallbackInfo| {
                let mut buf = buffer.lock().unwrap();
                buf.extend_from_slice(data);
            },
            |err| {
                eprintln!("Audio input callback error: {}", err);
            },
            None
        ).map_err(|e| e.to_string())?;

        // Start playback capture
        stream.play().map_err(|e| e.to_string())?;
        self.stream = Some(stream);
        
        Ok(())
    }

    /// Stops the active audio stream, encodes captured samples into WAV format, and returns the bytes
    pub fn stop(&mut self) -> Vec<u8> {
        // Drop the CPAL stream to immediately release hardware resource lock
        self.stream = None; 
        let pcm_data = self.buffer.lock().unwrap().clone();
        
        // Encode raw PCM i16 samples directly into standard WAV container format
        encode_wav(&pcm_data, 16000)
    }
}

/// Helper function to encode raw PCM frames to a standard RIFF/WAVE container
fn encode_wav(samples: &[i16], sample_rate: u32) -> Vec<u8> {
    let header_size = 44; 
    let data_size = samples.len() * 2;
    let file_size = 36 + data_size;
    let mut wav = Vec::with_capacity(header_size + data_size);

    // 1. RIFF Container Header
    wav.extend_from_slice(b"RIFF");
    wav.extend_from_slice(&(file_size as u32).to_le_bytes());
    wav.extend_from_slice(b"WAVE");

    // 2. Format Chunk Specifications
    wav.extend_from_slice(b"fmt ");
    wav.extend_from_slice(&(16u32).to_le_bytes()); // Chunk size (16 for PCM)
    wav.extend_from_slice(&(1u16).to_le_bytes());  // Audio format (1 for Uncompressed PCM)
    wav.extend_from_slice(&(1u16).to_le_bytes());  // Num channels (1 for Mono)
    wav.extend_from_slice(&sample_rate.to_le_bytes());
    wav.extend_from_slice(&(sample_rate * 2).to_le_bytes()); // Byte rate (SampleRate * BlockAlign)
    wav.extend_from_slice(&(2u16).to_le_bytes());  // Block align (Channels * BitsPerSample / 8)
    wav.extend_from_slice(&(16u16).to_le_bytes()); // Bits per sample (16)

    // 3. Audio Data Chunk
    wav.extend_from_slice(b"data");
    wav.extend_from_slice(&(data_size as u32).to_le_bytes());

    // 4. Sample Bytes Payload
    for &sample in samples {
        wav.extend_from_slice(&sample.to_le_bytes());
    }

    wav
}
