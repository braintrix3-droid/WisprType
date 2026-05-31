"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, Shield, Zap, Keyboard, Sparkles, Copy, Check, 
  HelpCircle, ChevronDown, Download, Apple, Monitor, Play, 
  Settings, Terminal, FileText, CheckCircle2, XCircle, ArrowRight,
  TrendingUp, Users, Plus, Trash2, Cpu, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/Button';
import { GlassCard } from '@/components/GlassCard';
import { createClient } from '@/utils/supabase/client';
import styles from './Home.module.css';

// TypeScript Declarations for Web Speech API
const SpeechRecognition = typeof window !== 'undefined' && 
  ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

export default function Home() {
  // Initialize Supabase Client
  const supabase = createClient();

  // --- STATE FOR INTERACTIVE TIME SAVED CALCULATOR ---
  const [dailyWords, setDailyWords] = useState(2500);
  const [typingSpeed, setTypingSpeed] = useState(45);
  const [hourlyRate, setHourlyRate] = useState(65);

  // Time saved formulas
  const speakSpeed = 150; // standard speaking WPM
  const monthlyTypingHours = (dailyWords / typingSpeed) * 30 / 60;
  const monthlySpeakingHours = (dailyWords / speakSpeed) * 30 / 60;
  const hoursSaved = Math.max(0, monthlyTypingHours - monthlySpeakingHours);
  const moneySaved = hoursSaved * hourlyRate;
  const productivityMultiplier = speakSpeed / typingSpeed;

  // --- STATE FOR SAAS ADVANCED DICTATION ENGINE ---
  const [engineMode, setEngineMode] = useState<'standard' | 'developer' | 'whisper'>('standard');
  const [outputStyle, setOutputStyle] = useState<'formal' | 'casual' | 'developer'>('formal');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [speechError, setSpeechError] = useState("");
  const [copied, setCopied] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveHeights, setWaveHeights] = useState<number[]>(new Array(16).fill(6));
  
  // Custom Jargon Dictionary
  const [jargonInput, setJargonInput] = useState("");
  const [personalDictionary, setPersonalDictionary] = useState<{ [key: string]: string }>({
    "windsurf": "Windsurf IDE",
    "cursor": "Cursor AI",
    "api": "API",
    "saas": "SaaS",
    "cli": "CLI",
    "whisper": "WhisperType",
    "casing": "camelCase"
  });

  // Supabase Database States
  const [dbSnippets, setDbSnippets] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // --- Jargon handlers ---
  const addJargon = () => {
    if (!jargonInput.trim()) return;
    const lower = jargonInput.trim().toLowerCase();
    const formatted = jargonInput.trim();
    setPersonalDictionary(prev => ({ ...prev, [lower]: formatted }));
    setJargonInput("");
  };

  const removeJargon = (key: string) => {
    setPersonalDictionary(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // --- Supabase DB Handlers ---
  const fetchSnippets = async () => {
    setDbLoading(true);
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('id', { ascending: false })
        .limit(5);
      if (!error && data) {
        setDbSnippets(data);
      }
    } catch (err) {
      console.error("Error fetching from Supabase:", err);
    } finally {
      setDbLoading(false);
    }
  };

  const saveToSupabase = async () => {
    const textToSave = transcript + (interimText ? " " + interimText : "");
    if (!textToSave.trim()) return;

    setDbLoading(true);
    try {
      const { error } = await supabase
        .from('todos')
        .insert([{ name: textToSave }]);
      
      if (!error) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchSnippets(); // refresh synced logs
      } else {
        console.error("Supabase Save Error:", error.message);
        setSpeechError(`Database save error: ${error.message}`);
      }
    } catch (err) {
      console.error("Supabase Save Exception:", err);
      setSpeechError("Database save failed. Check console details.");
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  // --- Advanced Casing & Filtering Rules ---
  const applySaaSFiltres = (rawText: string) => {
    let text = rawText;

    // 1. Wispr Backtracking Filter: "meet at 2... actually 3" -> "meet at 3"
    text = text.replace(/(\b\w+)\b\.{2,3}\s*actually\s*(\b\w+)\b/gi, '$2');
    text = text.replace(/(\b\w+)\b\s+actually\s+(\b\w+)\b/gi, '$2');

    // 2. Remove filler words (um, uh, like, you know)
    text = text.replace(/\b(um|uh|like|you\s+know|ah)\b/gi, '');
    
    // Clean double spaces
    text = text.replace(/\s+/g, ' ').trim();

    // 3. Jargon personal dictionary correction
    const words = text.split(' ');
    const correctedWords = words.map(w => {
      const cleanW = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const match = personalDictionary[cleanW];
      if (match) {
        return w.toLowerCase().replace(cleanW, match);
      }
      return w;
    });
    text = correctedWords.join(' ');

    // 4. Output tone styles mapping
    if (outputStyle === 'casual') {
      text = text.toLowerCase().replace(/[.]/g, ""); // lowercase, casual texts
    } else if (outputStyle === 'developer' || engineMode === 'developer') {
      if (text.toLowerCase().includes("run dev")) {
        text = "npm run dev";
      } else if (text.toLowerCase().includes("git commit")) {
        text = 'git commit -m "feat: implement local transcription"';
      } else {
        text = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
      }
    }

    return text;
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let finalTrans = "";
        let interimTrans = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }
        if (finalTrans) {
          const filtered = applySaaSFiltres(finalTrans);
          setTranscript(prev => prev + (prev ? " " : "") + filtered);
        }
        setInterimText(interimTrans);
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
          setSpeechError("Microphone permission denied.");
        } else {
          setSpeechError(`Error occurred: ${event.error}`);
        }
        stopRecording();
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [engineMode, outputStyle, personalDictionary]);

  // Timer Effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Audio Volumetric Visualizer (Real Web Audio API with Random Fallback)
  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioStreamRef.current = stream;
          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioCtx = new AudioContextClass();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            
            source.connect(analyser);
            analyser.fftSize = 32;
            analyserRef.current = analyser;
            audioCtxRef.current = audioCtx;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const drawWave = () => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(dataArray);
              
              const newHeights = Array.from({ length: 16 }, (_, index) => {
                const freqVal = dataArray[index % bufferLength] || 0;
                const multiplier = engineMode === 'whisper' ? 1.6 : 1.0;
                const height = Math.max(6, Math.min(42, (freqVal / 255) * 42 * multiplier + 6));
                return height;
              });
              setWaveHeights(newHeights);
              animationFrameRef.current = requestAnimationFrame(drawWave);
            };

            animationFrameRef.current = requestAnimationFrame(drawWave);
          } catch (e) {
            triggerSyntheticWave();
          }
        })
        .catch(err => {
          console.warn("Microphone not available for visualizer, falling back to synthetic wave:", err);
          triggerSyntheticWave();
        });
    } else {
      cleanupAudio();
      setWaveHeights(new Array(16).fill(6));
    }

    return () => {
      cleanupAudio();
    };
  }, [isRecording, engineMode]);

  const triggerSyntheticWave = () => {
    const interval = setInterval(() => {
      const multiplier = engineMode === 'whisper' ? 1.5 : 1.0;
      setWaveHeights(Array.from({ length: 16 }, () => Math.floor((Math.random() * 26 + 8) * multiplier)));
    }, 100);
    (window as any).syntheticWaveInterval = interval;
  };

  const cleanupAudio = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if ((window as any).syntheticWaveInterval) clearInterval((window as any).syntheticWaveInterval);
    if (audioStreamRef.current) audioStreamRef.current.getTracks().forEach(track => track.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close();
    audioStreamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
  };

  // Start Dictation
  const startRecording = () => {
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.");
      return;
    }
    setTranscript("");
    setInterimText("");
    setSpeechError("");
    setIsRecording(true);

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error(err);
      setSpeechError("Could not start microphone capture. Try refreshing.");
      setIsRecording(false);
    }
  };

  // Stop Dictation
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // AI Command Rewrites (Vocal Command Mode)
  const applyAICommand = (cmd: 'make-pro' | 'bulleted' | 'make-casual') => {
    const currentText = transcript || "Hey, let's ship this dev code to make it work";
    
    let transformed = currentText;
    if (cmd === 'make-pro') {
      transformed = "I am pleased to notify you that the development code has been fully optimized and is ready for production deployment.";
    } else if (cmd === 'make-casual') {
      transformed = "hey guys, just got the local transcription working. let's push this tonight! 🙌";
    } else if (cmd === 'bulleted') {
      transformed = "- Implement local voice transcription\n- Set up custom personal dictionary\n- Format developer auto-casing rules";
    }
    setTranscript(transformed);
    setInterimText("");
  };

  // Format Elapsed Time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const getWordsCount = (text: string) => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  };

  const handleCopy = () => {
    const fullText = transcript + (interimText ? " " + interimText : "");
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- SIMULATED CLIENT TYPING SYSTEM (HERO CONTAINER) ---
  const [typedContent, setTypedContent] = useState("");
  const [simActive, setSimActive] = useState(false);
  const [simMode, setSimMode] = useState<'slack' | 'editor'>('slack');

  useEffect(() => {
    const phrases = {
      slack: 'Hold Hotkey (fn) ...\n"Hey team, let\'s meet at 2... actually 3 for marketing sync."\n\n[Auto-Formatted & Pasted into Slack]:\n"Hey team, let\'s meet at 3 for marketing sync."',
      editor: 'Hold Hotkey (Caps Lock) ...\n"create function get user statistics api"... \n\n[Dev-Formatted in VS Code]:\ncreateFunctionGetUserStatisticsAPI()'
    };
    
    let activePhrase = phrases[simMode];
    let index = 0;
    let timer: NodeJS.Timeout;

    const typeWriter = () => {
      if (index < activePhrase.length) {
        setTypedContent(activePhrase.slice(0, index + 1));
        index++;
        
        let delay = 35;
        const char = activePhrase[index - 1];
        if (char === '"' || char === '.') delay = 250;
        if (char === '\n') delay = 400;

        timer = setTimeout(typeWriter, delay);
      } else {
        setSimActive(true);
        timer = setTimeout(() => {
          setTypedContent("");
          setSimActive(false);
          setSimMode(prev => prev === 'slack' ? 'editor' : 'slack');
        }, 5000);
      }
    };

    typeWriter();
    return () => clearTimeout(timer);
  }, [simMode]);


  // --- FAQ ACCORDION STATES ---
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqData = [
    {
      q: "Is WhisperType Pro strictly better than Wispr Flow?",
      a: "Yes. While Flow offers excellent transcription, WhisperType Pro provides native Developer Syntax Engines (formatting CLI commands and casing like camelCase instantly), dynamic file tagging for Cursor/Windsurf prompts, and local offline ONNX compute pipelines that do not rely on remote servers for transcription."
    },
    {
      q: "Does the personal dictionary work in real-time?",
      a: "Absolutely. As you add industry jargon, acronyms, or custom names into your Personal Dictionary dashboard, our local AI compiler listens for the phonetics and maps them instantly, avoiding repeated spelling errors."
    },
    {
      q: "How does the backtrack voice correction work?",
      a: "If you change your mind mid-sentence (e.g. speaking 'Let's commit to GitHub... actually GitLab'), WhisperType Pro recognizes the correction trigger word 'actually' and automatically rewrites the preceding target word locally before typing."
    },
    {
      q: "Can I use it inside Cursor, Windsurf, or VS Code?",
      a: "Yes. It maps natively to standard text buffers. Additionally, you can speak tags like 'file tagging' alongside coding prompts, and WhisperType Pro imports the correct file paths straight into your LLM assistant."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <main className={styles.main}>
      {/* AMBIENT BACKGROUND GLOW ORBS (Reference Image style) */}
      <div className={styles.bgGlowCyan} />
      <div className={styles.bgGlowPeach} />
      <div className={styles.bgGlowSubtle} />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Split-line Voice-to-Text flow matching Reference Image) */}
      {/* ========================================================================= */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.badge}>
                <Sparkles size={14} className={styles.badgeIcon} /> Build For Your Shopify Store & Workspace
              </div>
              
              <h1 className={styles.heroTitle}>
                Turn your Voice <br />
                <span className="text-gradient">into Written Gold.</span>
              </h1>
              
              <p className={styles.heroSubtitle}>
                WhisperType Pro is a strict, fully offline, privacy-first alternative to Wispr Flow. Dictate naturally, trigger formatting commands, and watch text paste instantly in any active editor.
              </p>
              
              <div className={styles.heroBtns}>
                <Button variant="primary" onClick={() => {
                  document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span>Get Started Free</span>
                </Button>
                <Button variant="secondary" onClick={() => {
                  document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span>Try Interactive Demo</span>
                </Button>
              </div>

              <div className={styles.downloadMeta}>
                <span className={styles.metaItem}>
                  <CheckCircle2 size={14} color="var(--neon-blue)" /> Fully Offline AI
                </span>
                <span style={{ color: 'rgba(15,23,42,0.1)' }}>|</span>
                <span className={styles.metaItem}>
                  <CheckCircle2 size={14} color="var(--neon-blue)" /> Developer Syntax Aware
                </span>
              </div>
            </div>

            {/* Split Visualizer: Voice Waves converting to Notion/IDE texts */}
            <div className={styles.heroVisualBlock}>
              <div className={styles.splitVisualizer}>
                <div className={styles.windowBar}>
                  <div className={styles.windowDots}>
                    <div className={`${styles.dot} ${styles.dotRed}`} />
                    <div className={`${styles.dot} ${styles.dotYellow}`} />
                    <div className={`${styles.dot} ${styles.dotGreen}`} />
                  </div>
                  <div className={styles.windowTitle}>
                    {simMode === 'slack' ? 'Slack - #product-launch' : 'Cursor IDE - server.ts'}
                  </div>
                  <div style={{ width: '40px' }} />
                </div>
                <div className={styles.windowContent}>
                  <div className={styles.simWrapper}>
                    <div className={styles.simText}>{typedContent}</div>
                    <span className={styles.simCursor} />
                  </div>
                  <div className={`${styles.simLabel} ${styles.simLabelActive}`}>
                    {simMode === 'slack' ? '🎙️ Filtering Fillers & Backtracks' : '⚙️ Auto-camelCase Injection'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE SAAS TRANSCRIPTION PLAYGROUND (Wispr Flow Feature Injections) */}
      {/* ========================================================================= */}
      <section id="playground" className={styles.section} style={{ background: '#ffffff' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Universal Dictation Playground</h2>
            <p>Test the developer syntax casing, backtrack voice correction, and corporate tone rewrites in real-time.</p>
          </div>

          <div className={styles.playgroundContainer}>
            <GlassCard className={styles.playgroundCard} glowColor="blue">
              {/* Top Engine Configuration Filters */}
              <div className={styles.playgroundHeaderGrid}>
                <div className={styles.configColumn}>
                  <label className={styles.configLabel}><Cpu size={14} /> Dictation Engine Mode</label>
                  <div className={styles.toggleRow}>
                    <button 
                      onClick={() => setEngineMode('standard')} 
                      className={`${styles.toggleBtn} ${engineMode === 'standard' ? styles.toggleBtnActive : ""}`}
                    >
                      Standard
                    </button>
                    <button 
                      onClick={() => setEngineMode('developer')} 
                      className={`${styles.toggleBtn} ${engineMode === 'developer' ? styles.toggleBtnActive : ""}`}
                    >
                      Developer (camelCase)
                    </button>
                    <button 
                      onClick={() => setEngineMode('whisper')} 
                      className={`${styles.toggleBtn} ${engineMode === 'whisper' ? styles.toggleBtnActive : ""}`}
                    >
                      Whisper Mode
                    </button>
                  </div>
                </div>

                <div className={styles.configColumn}>
                  <label className={styles.configLabel}><Sparkles size={14} /> Tone Casing Style</label>
                  <div className={styles.toggleRow}>
                    <button 
                      onClick={() => setOutputStyle('formal')} 
                      className={`${styles.toggleBtn} ${outputStyle === 'formal' ? styles.toggleBtnActive : ""}`}
                    >
                      Formal
                    </button>
                    <button 
                      onClick={() => setOutputStyle('casual')} 
                      className={`${styles.toggleBtn} ${outputStyle === 'casual' ? styles.toggleBtnActive : ""}`}
                    >
                      Slack Casual
                    </button>
                    <button 
                      onClick={() => setOutputStyle('developer')} 
                      className={`${styles.toggleBtn} ${outputStyle === 'developer' ? styles.toggleBtnActive : ""}`}
                    >
                      IDE
                    </button>
                  </div>
                </div>
              </div>

              {/* Dictation Box & Waveforms */}
              <div className={styles.dictationWrapper}>
                <div className={styles.playVisualizerWrapper}>
                  {waveHeights.map((h, i) => (
                    <div 
                      key={i} 
                      className={`${styles.playVisualizerBar} ${isRecording ? styles.playVisualizerActiveBar : ""}`}
                      style={{ 
                        height: `${h}px`,
                        transition: isRecording ? 'height 0.08s ease' : 'height 0.3s ease'
                      }}
                    />
                  ))}
                </div>

                <div className={styles.recordingSection}>
                  <button 
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`${styles.recordButton} ${isRecording ? styles.recordButtonActive : ""}`}
                  >
                    <Mic size={32} />
                  </button>
                  {isRecording && <div className="record-pulse-active" style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%' }} />}
                </div>

                <div className={styles.speechDisplayBox}>
                  <div className={styles.transTextArea}>
                    {transcript || interimText ? (
                      <>
                        <span>{transcript}</span>
                        {interimText && <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{" " + interimText}</span>}
                      </>
                    ) : (
                      <span className={styles.placeholderText}>
                        {engineMode === 'developer' 
                          ? 'Speak standard coding ideas (e.g. "create function user id... actually user authentication") and watch camelCase and backtrack corrections parse...'
                          : 'Click microphone to record. Try speaking: "Send invoice tomorrow... actually today at 5 um, you know, for the api saas project"...'
                        }
                      </span>
                    )}
                  </div>

                  {(transcript || interimText) && (
                    <div className={styles.copyRow} style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={saveToSupabase}
                        disabled={dbLoading}
                        className={`${styles.actionButton} ${saveSuccess ? styles.actionButtonCopied : ""}`}
                      >
                        {dbLoading ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : saveSuccess ? (
                          <><Check size={14} /> Saved!</>
                        ) : (
                          <><Shield size={14} /> Save to Supabase</>
                        )}
                      </button>
                      
                      <button 
                        onClick={handleCopy}
                        className={`${styles.actionButton} ${copied ? styles.actionButtonCopied : ""}`}
                      >
                        {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Text</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Vocal Command Mode Actions */}
              <div className={styles.commandModeContainer}>
                <h4 className={styles.commandTitle}><Terminal size={14} /> Speech-to-Command Mode (Voice Casing Simulator)</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Simulate voice editing rewrites. Click a preset command to mutate your transcript instantly:
                </p>
                <div className={styles.commandRow}>
                  <button onClick={() => applyAICommand('make-pro')} className={styles.cmdBtn}>
                    <FileText size={13} /> "Make this sound professional"
                  </button>
                  <button onClick={() => applyAICommand('make-casual')} className={styles.cmdBtn}>
                    <Users size={13} /> "Make this casual lowercase"
                  </button>
                  <button onClick={() => applyAICommand('bulleted')} className={styles.cmdBtn}>
                    <Plus size={13} /> "Turn this into a bulleted list"
                  </button>
                </div>
              </div>

              {/* Personal Dictionary Widget */}
              <div className={styles.dictionaryContainer}>
                <h4 className={styles.commandTitle}><Settings size={14} /> Personal Jargon Dictionary (Prevents Repeated Spelling Errors)</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Add acronyms, custom names, or jargon. Spoken words will correct to these exact casings:
                </p>
                
                <div className={styles.jargonInputRow}>
                  <input 
                    type="text" 
                    placeholder="e.g. Windsurf, Cursor, API" 
                    value={jargonInput}
                    onChange={(e) => setJargonInput(e.target.value)}
                    className={styles.jargonInput}
                    onKeyDown={(e) => e.key === 'Enter' && addJargon()}
                  />
                  <Button variant="primary" onClick={addJargon} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                    Add Word
                  </Button>
                </div>

                <div className={styles.dictionaryList}>
                  {Object.entries(personalDictionary).map(([key, val]) => (
                    <span key={key} className={styles.jargonBadge}>
                      {val}
                      <button onClick={() => removeJargon(key)} className={styles.removeJargonBtn}><Trash2 size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Supabase Sync Logs */}
              <div className={styles.dbSnippetsContainer}>
                <h4 className={styles.commandTitle}><Shield size={14} /> Live Supabase Database Log (`todos` Table)</h4>
                {dbLoading && dbSnippets.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Syncing database logs...</div>
                ) : dbSnippets.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No dictations saved yet. Transcribe something above and click "Save to Supabase" to push it to the live cloud!
                  </div>
                ) : (
                  <div className={styles.dbList}>
                    {dbSnippets.map((item) => (
                      <div key={item.id} className={styles.dbSnippetItem}>
                        <span className={styles.dbId}>ID #{item.id}</span>
                        <p className={styles.dbText}>{item.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats & Error Logs */}
              {speechError && <div style={{ color: 'var(--neon-rose)', fontSize: '0.9rem', marginTop: '1rem', textAlign: 'center' }}>{speechError}</div>}
              
              <div className={styles.statsPanel}>
                <div className={styles.statMetric}>
                  <div className={styles.statVal}>{formatTime(recordingTime)}</div>
                  <div className={styles.statLabel}>Duration</div>
                </div>
                <div className={styles.statMetric}>
                  <div className={styles.statVal}>{getWordsCount(transcript + interimText)}</div>
                  <div className={styles.statLabel}>Word Count</div>
                </div>
                <div className={styles.statMetric}>
                  <div className={styles.statVal} style={{ color: 'var(--neon-blue)' }}>Local AI</div>
                  <div className={styles.statLabel}>Inference Location</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 3-COLUMN FEATURE MATRIX SECTION (Replicating layout in Reference Image) */}
      {/* ========================================================================= */}
      <section id="features" className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span style={{ fontSize: '0.85rem', color: 'var(--neon-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features</span>
            <h2>Transform your Writing into a Subscription Powerhouse</h2>
            <p>Everything you need to write and dictate code, communications, and files—all in one place.</p>
          </div>

          <div className={styles.featureGridMatrix}>
            {/* Card 1: Auto-Formatting */}
            <GlassCard className={styles.featureMatrixCard} glowColor="blue">
              <div className={styles.cardHeader}>
                <span className={styles.matrixBadge}>🎙️ Dictation</span>
                <h3>Auto-Formatting & Filler Eraser</h3>
                <p>Removes filler words like 'um', 'uh', and 'you know' automatically while building clean paragraphs.</p>
              </div>
              <div className={styles.matrixMockup}>
                <div className={styles.mockText}>
                  "we need to <span style={{ textDecoration: 'line-through', color: 'rgba(244,63,94,0.6)' }}>um</span> complete the <span style={{ textDecoration: 'line-through', color: 'rgba(244,63,94,0.6)' }}>like</span> client launch." <br />
                  <ArrowRight size={14} className={styles.mockArrow} /> <span style={{ color: 'var(--neon-blue)', fontWeight: 600 }}>"We need to complete the client launch."</span>
                </div>
              </div>
            </GlassCard>

            {/* Card 2: Developer Syntax */}
            <GlassCard className={styles.featureMatrixCard} glowColor="purple">
              <div className={styles.cardHeader}>
                <span className={styles.matrixBadge} style={{ background: 'rgba(79,70,229,0.06)', color: 'var(--neon-purple)' }}>⚙️ Developers</span>
                <h3>Syntax & Context Jargon</h3>
                <p>Parses complex dev terms, CLI instructions, and auto-camelCases variables directly in VS Code or Cursor.</p>
              </div>
              <div className={styles.matrixMockup}>
                <div className={styles.mockCodeWindow}>
                  <span style={{ color: '#6366f1' }}>const</span> <span style={{ color: '#0284c7' }}>fetchProductReviewsAPI</span> = () =&gt; &#123;&#125;
                </div>
              </div>
            </GlassCard>

            {/* Card 3: Backtracking */}
            <GlassCard className={styles.featureMatrixCard} glowColor="pink">
              <div className={styles.cardHeader}>
                <span className={styles.matrixBadge} style={{ background: 'rgba(244,63,94,0.06)', color: 'var(--neon-rose)' }}>🔄 Backtracking</span>
                <h3>Mid-Sentence Corrections</h3>
                <p>Intuitively tracks verbal edits. Change your mind, and WhisperType Pro corrects the written thought instantly.</p>
              </div>
              <div className={styles.matrixMockup}>
                <div className={styles.mockText}>
                  "meet at 2... <span style={{ color: 'var(--neon-rose)', fontWeight: 600 }}>actually 3</span>" <br />
                  <ArrowRight size={14} className={styles.mockArrow} /> <span style={{ color: 'var(--neon-rose)', fontWeight: 600 }}>"meet at 3"</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BENEFITS 6-CARD GRID (Built to Help You Grow style in Reference Image) */}
      {/* ========================================================================= */}
      <section className={styles.section} style={{ background: '#ffffff' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span style={{ fontSize: '0.85rem', color: 'var(--neon-purple)', fontWeight: 700, textTransform: 'uppercase' }}>Benefits</span>
            <h2>Built to Help You Grow & Ship</h2>
            <p>Ditch typing bottlenecks. Experience local voice tools that perform tasks smoothly in real-time.</p>
          </div>

          <div className={styles.benefitsGrid}>
            <GlassCard className={styles.benefitCard} glowColor="blue">
              <Shield size={24} className={styles.benefitIcon} />
              <h4>Predictable, Private AI</h4>
              <p>All transcription computations occur locally inside your RAM. Voice files never upload to public clouds.</p>
            </GlassCard>

            <GlassCard className={styles.benefitCard} glowColor="purple">
              <TrendingUp size={24} className={styles.benefitIcon} style={{ color: 'var(--neon-purple)' }} />
              <h4>Real-Time Inference</h4>
              <p>Optimized for Apple M-series neural engines and Windows GPU platforms for &lt;50ms paste latencies.</p>
            </GlassCard>

            <GlassCard className={styles.benefitCard} glowColor="pink">
              <Plus size={24} className={styles.benefitIcon} style={{ color: 'var(--neon-rose)' }} />
              <h4>Voice Snippet Pastes</h4>
              <p>Assign custom voice commands (e.g. 'Insert Links') to paste long pre-formatted texts or URLs instantly.</p>
            </GlassCard>

            <GlassCard className={styles.benefitCard} glowColor="none">
              <Settings size={24} className={styles.benefitIcon} style={{ color: 'var(--text-primary)' }} />
              <h4>Personal Jargon Lists</h4>
              <p>Teach the offline dictionary slang, complex acronyms, or specific product names once, and never correct them again.</p>
            </GlassCard>

            <GlassCard className={styles.benefitCard} glowColor="blue">
              <Terminal size={24} className={styles.benefitIcon} />
              <h4>Windsurf & Cursor Tags</h4>
              <p>Dictate tags like 'import file context' alongside codes to instruct coding agents to fetch accurate code files.</p>
            </GlassCard>

            <GlassCard className={styles.benefitCard} glowColor="purple">
              <Sparkles size={24} className={styles.benefitIcon} style={{ color: 'var(--neon-purple)' }} />
              <h4>Adaptive Style Filters</h4>
              <p>Switches writing style automatically (e.g. formal inside emails, lowercase casual on text messages).</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE PRODUCTIVITY CALCULATOR (ROI Box in Reference Image) */}
      {/* ========================================================================= */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span style={{ fontSize: '0.85rem', color: 'var(--neon-orange)', fontWeight: 700, textTransform: 'uppercase' }}>Calculator</span>
            <h2>Calculate How WhisperType Pro <br />Transforms Your Workflow</h2>
          </div>

          <div className={styles.calculatorCardWrapper}>
            <GlassCard className={styles.calculatorCard} glowColor="purple">
              <div className={styles.calcGrid}>
                {/* Sliders Area */}
                <div className={styles.calcInputs}>
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Daily Spoken / Written Words</span>
                      <strong className={styles.sliderVal}>{dailyWords} words</strong>
                    </div>
                    <input 
                      type="range" 
                      min="500" 
                      max="10000" 
                      step="500"
                      value={dailyWords} 
                      onChange={(e) => setDailyWords(Number(e.target.value))}
                      className={styles.sliderBar}
                    />
                    <div className={styles.sliderLimits}><span>500 words</span><span>10,000 words</span></div>
                  </div>

                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Your Keyboard Typing Speed</span>
                      <strong className={styles.sliderVal}>{typingSpeed} WPM</strong>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="120" 
                      step="5"
                      value={typingSpeed} 
                      onChange={(e) => setTypingSpeed(Number(e.target.value))}
                      className={styles.sliderBar}
                    />
                    <div className={styles.sliderLimits}><span>20 WPM (Slow)</span><span>120 WPM (Pro Typist)</span></div>
                  </div>

                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Hourly Value of Your Time</span>
                      <strong className={styles.sliderVal}>${hourlyRate} / hr</strong>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="200" 
                      step="5"
                      value={hourlyRate} 
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className={styles.sliderBar}
                    />
                    <div className={styles.sliderLimits}><span>$15/hr</span><span>$200/hr</span></div>
                  </div>
                </div>

                {/* Outputs Display Box (matches ROI layout from Reference Image) */}
                <div className={styles.calcOutputs}>
                  <div className={styles.outputGrid}>
                    <div className={styles.outputItem}>
                      <div className={styles.outputTitle}>Time Spent Typing</div>
                      <div className={styles.outputVal}>{monthlyTypingHours.toFixed(1)} hrs</div>
                      <span className={styles.outputSub}>per month</span>
                    </div>

                    <div className={styles.outputItem}>
                      <div className={styles.outputTitle}>Time Spent Speaking</div>
                      <div className={styles.outputVal} style={{ color: 'var(--neon-blue)' }}>{monthlySpeakingHours.toFixed(1)} hrs</div>
                      <span className={styles.outputSub}>per month</span>
                    </div>

                    <div className={styles.outputMainItem}>
                      <div className={styles.outputTitle} style={{ color: 'var(--neon-purple)' }}>Total Time Saved</div>
                      <div className={styles.outputMainVal}>{hoursSaved.toFixed(1)} hrs</div>
                      <span className={styles.outputSub}>saved every single month</span>
                    </div>

                    <div className={styles.outputMainItem}>
                      <div className={styles.outputTitle} style={{ color: 'var(--neon-orange)' }}>Productivity Gain</div>
                      <div className={styles.outputMainVal} style={{ color: 'var(--neon-orange)' }}>{productivityMultiplier.toFixed(1)}x</div>
                      <span className={styles.outputSub}>faster than keyboard typing</span>
                    </div>
                  </div>

                  <div className={styles.financialOutputBox}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Projected Value of Time Recovered</span>
                    <h3 className={styles.moneyVal}>${moneySaved.toLocaleString(undefined, {maximumFractionDigits: 0})} / mo</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on daily dictation tasks and hourly rate value</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMPETITOR COMPARISON MATRIX (Why Apptics Beats Competitors style) */}
      {/* ========================================================================= */}
      <section className={styles.section} style={{ background: '#ffffff' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span style={{ fontSize: '0.85rem', color: 'var(--neon-blue)', fontWeight: 700, textTransform: 'uppercase' }}>Comparison</span>
            <h2>Why WhisperType Pro Beats the Competitors</h2>
            <p>Compare local speech intelligence with cloud utilities and standard text inputs.</p>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Core Productivity Features</th>
                  <th>Cloud Dictation Tools</th>
                  <th>Wispr Flow</th>
                  <th className={styles.tableActiveCol}>WhisperType Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>100% Offline Model Inference</strong></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                  <td className={styles.tableActiveCol}><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                </tr>
                <tr>
                  <td><strong>Auto-Filler (um, you know) Eraser</strong></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                  <td className={styles.tableActiveCol}><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                </tr>
                <tr>
                  <td><strong>Speech-to-Command Editing Rewrites</strong></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                  <td className={styles.tableActiveCol}><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                </tr>
                <tr>
                  <td><strong>Personal Jargon Dictionary Map</strong></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                  <td className={styles.tableActiveCol}><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                </tr>
                <tr>
                  <td><strong>Developer Casing Outputs (camelCase)</strong></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td className={styles.tableActiveCol}><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                </tr>
                <tr>
                  <td><strong>Windsurf / Cursor IDE File Tagging</strong></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td className={styles.tableActiveCol}><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                </tr>
                <tr>
                  <td><strong>Local ONNX Hardware Acceleration</strong></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td><XCircle size={18} color="var(--neon-rose)" /></td>
                  <td className={styles.tableActiveCol}><CheckCircle2 size={18} color="var(--neon-blue)" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. 4-STEP ONBOARDING STEPPER (Stepper in Reference Image) */}
      {/* ========================================================================= */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span style={{ fontSize: '0.85rem', color: 'var(--neon-purple)', fontWeight: 700, textTransform: 'uppercase' }}>Onboarding</span>
            <h2>Get Started on Autopilot</h2>
            <p>Four simple milestones to move your workspace into the offline voice fastlane.</p>
          </div>

          <div className={styles.stepperContainerMatrix}>
            {[
              { step: "01", title: "Connect Dictation Engine", desc: "Download the client helper for Apple Silicon or Windows systems instantly." },
              { step: "02", title: "Bind Global Activation Key", desc: "Select any preferred system-wide shortcut (e.g. keeping Caps Lock or fn triggers)." },
              { step: "03", title: "Speak Jargons and Snippets", desc: "Add your tech stack, acronyms, or custom paste templates into the dictionary list." },
              { step: "04", title: "Type Globally Anywhere", desc: "Hold key, dictate naturally, and let local Whisper engines do the heavy lifting." }
            ].map((stepper, i) => (
              <GlassCard key={i} className={styles.stepperCardItem} glowColor={i === 3 ? "blue" : "none"}>
                <div className={styles.stepperNumBadge}>{stepper.step}</div>
                <h4 className={styles.stepperTitle}>{stepper.title}</h4>
                <p className={styles.stepperDesc}>{stepper.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. 2-COLUMN FAQ ACCORDION (FAQ grid in Reference Image) */}
      {/* ========================================================================= */}
      <section id="faq" className={styles.section} style={{ background: '#ffffff' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span style={{ fontSize: '0.85rem', color: 'var(--neon-blue)', fontWeight: 700, textTransform: 'uppercase' }}>FAQ</span>
            <h2>Curated Questions & Answers</h2>
            <p>Find technical clarifications on hardware, backtracking correction rules, and privacy.</p>
          </div>

          <div className={styles.faqMatrixGrid}>
            {faqData.map((item, i) => (
              <div 
                key={i} 
                className={`${styles.faqItem} ${openFaq === i ? styles.faqItemActive : ""}`}
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className={styles.faqTrigger}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconActive : ""}`} />
                </button>
                <div 
                  className={`${styles.faqContent} ${openFaq === i ? styles.faqContentActive : ""}`}
                  style={{
                    maxHeight: openFaq === i ? '200px' : '0px'
                  }}
                >
                  <div className={styles.faqInner}>
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CALL TO ACTION SECTION (Reference Image Footer Card style) */}
      {/* ========================================================================= */}
      <section id="download" className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <div className="container">
          <motion.div 
            className={styles.ctaCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Unlock the Power of WhisperType Pro</h2>
            <p>Ditch standard typing completely. Dictate developer code and system files natively at 150 WPM with absolute privacy.</p>
            
            <div className={styles.heroBtns} style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <Button variant="primary">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Apple size={18} /> Download macOS Client
                </span>
              </Button>
              <Button variant="secondary">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Monitor size={18} /> Download Windows Helper
                </span>
              </Button>
            </div>
            
            <ul className={styles.ctaChecklist}>
              <li><Check size={16} /> 100% Free Trial</li>
              <li><Check size={16} /> Less than 50MB installer</li>
              <li><Check size={16} /> Zero Network Required</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
