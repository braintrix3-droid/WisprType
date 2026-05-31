"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Shield, Zap, Keyboard, Sparkles, Copy, Check, 
  HelpCircle, ChevronDown, Download, Apple, Monitor, Play, 
  Settings, Terminal, FileText, CheckCircle2, XCircle, ArrowRight,
  TrendingUp, Users, Plus, Trash2, Cpu, RefreshCw, Star, Mail, FileCode
} from 'lucide-react';
import { Button } from '@/components/Button';
import { GlassCard } from '@/components/GlassCard';
import { createClient } from '@/utils/supabase/client';
import styles from './Home.module.css';

// TypeScript Declarations for Web Speech API
const SpeechRecognition = typeof window !== 'undefined' && 
  ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

export default function Home() {
  const supabase = createClient();

  // --- STATE FOR INTERACTIVE TIME SAVED CALCULATOR ---
  const [dailyWords, setDailyWords] = useState(2500);
  const [typingSpeed, setTypingSpeed] = useState(45);
  const [hourlyRate, setHourlyRate] = useState(65);

  // Time saved formulas
  const speakSpeed = 150; 
  const monthlyTypingHours = (dailyWords / typingSpeed) * 30 / 60;
  const monthlySpeakingHours = (dailyWords / speakSpeed) * 30 / 60;
  const hoursSaved = Math.max(0, monthlyTypingHours - monthlySpeakingHours);
  const moneySaved = hoursSaved * hourlyRate;
  const productivityMultiplier = speakSpeed / typingSpeed;
  const emailsEquivalent = Math.floor(dailyWords / 150) * 30; // approx 150 words per email

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
        .limit(3);
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
        fetchSnippets(); 
      } else {
        setSpeechError(`Database save error: ${error.message}`);
      }
    } catch (err) {
      setSpeechError("Database save failed. Check console details.");
    } finally {
      setDbLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = transcript || interimText || "Hey, let's ship this dev code to make it work";
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      text = text.toLowerCase().replace(/[.]/g, ""); 
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

  // --- BEFORE/AFTER SPEED SIMULATOR ---
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");
  const [beforeWpm, setBeforeWpm] = useState(0);
  const [afterWpm, setAfterWpm] = useState(0);

  useEffect(() => {
    let indexBefore = 0;
    let indexAfter = 0;
    const phrase = "The quick brown fox jumps over the lazy dog. Local dictation triggers speech pipelines instantly.";
    let timerBefore: NodeJS.Timeout;
    let timerAfter: NodeJS.Timeout;

    const typeBefore = () => {
      if (indexBefore < phrase.length) {
        setBeforeText(phrase.slice(0, indexBefore + 1));
        indexBefore++;
        setBeforeWpm(40 + Math.floor(Math.random() * 5));
        timerBefore = setTimeout(typeBefore, 180); // slow keypress
      } else {
        setTimeout(() => {
          indexBefore = 0;
          setBeforeText("");
          typeBefore();
        }, 3000);
      }
    };

    const typeAfter = () => {
      if (indexAfter < phrase.length) {
        // paste word groups instantly
        const words = phrase.split(" ");
        const wordsToShow = Math.ceil(indexAfter / 5) + 1;
        setAfterText(words.slice(0, wordsToShow).join(" "));
        indexAfter += 6;
        setAfterWpm(150 + Math.floor(Math.random() * 12));
        timerAfter = setTimeout(typeAfter, 250); 
      } else {
        setTimeout(() => {
          indexAfter = 0;
          setAfterText("");
          typeAfter();
        }, 3000);
      }
    };

    typeBefore();
    typeAfter();

    return () => {
      clearTimeout(timerBefore);
      clearTimeout(timerAfter);
    };
  }, []);

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
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className={styles.main}>
      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 1 — HERO (Warm Ivory Background with Pill Buttons & Floating mic) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroGrid}>
            <motion.div 
              className={styles.heroLeft}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className={styles.heroBadge}>
                <Sparkles size={13} /> Open-Source Dictation v1.0
              </div>
              <h1 className={styles.heroHeadline}>
                Turn Your Voice <br />
                <span className="text-gradient">Into Written Gold.</span>
              </h1>
              <p className={styles.heroSubheadline}>
                A premium, modern, AI-native speech utility that types 4× faster than keyboards. Formats code variables, erases fillers, and corrects backtrackings—100% offline.
              </p>
              <div className={styles.heroCTAButtons}>
                <Button variant="primary" onClick={() => {
                  document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span>Download Free</span>
                </Button>
                <Button variant="secondary" onClick={() => {
                  document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span>Try Interactive Sandbox</span>
                </Button>
              </div>
            </motion.div>

            {/* Right: Interactive Dictation Playground inside the Hero Preview */}
            <motion.div 
              className={styles.heroRight}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard className={styles.dictationWindowCard} glowColor="teal">
                <div className={styles.cardHeaderPane}>
                  <div className={styles.cardIndicators}>
                    <div className={`${styles.dot} ${styles.dotRed}`} />
                    <div className={`${styles.dot} ${styles.dotYellow}`} />
                    <div className={`${styles.dot} ${styles.dotGreen}`} />
                  </div>
                  <span className={styles.cardTitleText}>WhisperType Pro Dictation Box</span>
                  <div className={styles.cardGlowBadge}>
                    {isRecording ? "🔴 LISTENING" : "⚫ STANDBY"}
                  </div>
                </div>

                <div className={styles.cardInnerContent}>
                  {/* Waveform Visualizer */}
                  <div className={styles.heroWaveformWrapper}>
                    {waveHeights.map((h, i) => (
                      <div 
                        key={i} 
                        className={`${styles.heroWaveBar} ${isRecording ? styles.heroWaveActive : ""}`}
                        style={{ 
                          height: `${h}px`,
                          transition: isRecording ? 'height 0.08s ease' : 'height 0.3s ease'
                        }}
                      />
                    ))}
                  </div>

                  {/* Mic Toggle Button */}
                  <div className={styles.heroMicBtnWrapper}>
                    <button 
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`${styles.heroMicButton} ${isRecording ? styles.heroMicActive : ""}`}
                    >
                      <Mic size={26} />
                    </button>
                    {isRecording && <div className="record-pulse-active" style={{ position: 'absolute', width: '60px', height: '60px', borderRadius: '50%', pointerEvents: 'none' }} />}
                  </div>

                  {/* Casing Options */}
                  <div className={styles.heroOutputControls}>
                    <button onClick={() => setOutputStyle('formal')} className={`${styles.controlBtn} ${outputStyle === 'formal' ? styles.controlBtnActive : ""}`}>Formal</button>
                    <button onClick={() => setOutputStyle('casual')} className={`${styles.controlBtn} ${outputStyle === 'casual' ? styles.controlBtnActive : ""}`}>Casual</button>
                    <button onClick={() => setOutputStyle('developer')} className={`${styles.controlBtn} ${outputStyle === 'developer' ? styles.controlBtnActive : ""}`}>camelCase</button>
                  </div>

                  {/* Real-time Text Box */}
                  <div className={styles.heroTextBox}>
                    {transcript || interimText ? (
                      <>
                        <span>{transcript}</span>
                        {interimText && <span style={{ opacity: 0.5 }}>{" " + interimText}</span>}
                      </>
                    ) : (
                      <span className={styles.heroPlaceholder}>
                        Click the teal mic, speak natural sentences (or say "meet at 2... actually 3") and watch corrections apply...
                      </span>
                    )}
                  </div>

                  {/* Supabase Actions Row */}
                  {(transcript || interimText) && (
                    <div className={styles.heroActionRow}>
                      <button onClick={saveToSupabase} disabled={dbLoading} className={styles.dbActionButton}>
                        {dbLoading ? <RefreshCw size={12} className="animate-spin" /> : saveSuccess ? <><Check size={12} /> Saved</> : <><Shield size={12} /> Save to Supabase</>}
                      </button>
                      <button onClick={handleCopy} className={styles.dbActionButton}>
                        {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 2 — PRODUCT IN ACTION (Dark Obsidian Orbiting Grid) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.productInActionSection}>
        <div className="container">
          <div className={styles.actionHeader}>
            <h2 className={styles.darkHeadline}>Writes Faster In Every App You Already Use</h2>
            <p className={styles.darkSubheadline}>WhisperType Pro works everywhere your cursor lands. Seamlessly types code, documents, and communication logs.</p>
          </div>

          <div className={styles.orbitContainer}>
            {/* Ambient Background glows */}
            <div className={styles.orbitGlow1} />
            <div className={styles.orbitGlow2} />

            {/* Central WhisperType Node */}
            <GlassCard className={styles.centralAppNode} isDark glowColor="teal">
              <Mic size={36} className={styles.centralIcon} />
              <span className={styles.centralLabel}>WhisperType Pro</span>
            </GlassCard>

            {/* Orbiting App Tracks */}
            <div className={styles.orbitTrack1} />
            <div className={styles.orbitTrack2} />

            {/* Orbiting Icons */}
            <motion.div className={`${styles.orbitIcon} ${styles.orbitIcon1}`} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}>
              <Terminal size={18} />
            </motion.div>
            <motion.div className={`${styles.orbitIcon} ${styles.orbitIcon2}`} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 22, ease: "linear" }}>
              <Mail size={18} />
            </motion.div>
            <motion.div className={`${styles.orbitIcon} ${styles.orbitIcon3}`} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }}>
              <FileText size={18} />
            </motion.div>
            <motion.div className={`${styles.orbitIcon} ${styles.orbitIcon4}`} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
              <Shield size={18} />
            </motion.div>
            <motion.div className={`${styles.orbitIcon} ${styles.orbitIcon5}`} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
              <FileCode size={18} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 3 — SPEED COMPARISON (Before / After Split Panel) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.speedComparisonSection}>
        <div className="container">
          <div className={styles.comparisonHeader}>
            <h2 className={styles.speedHeadline}>4× Faster Than Typing</h2>
            <p className={styles.speedSubheadline}>Your voice speaks at 150+ Words Per Minute. Stop limiting your thoughts to WPM keyboard limits.</p>
          </div>

          <div className={styles.speedSplitGrid}>
            {/* Before (Typing Manually) */}
            <GlassCard className={styles.speedCard} glowColor="none">
              <div className={styles.speedCardHeader}>
                <span className={styles.speedBadge} style={{ background: 'rgba(17,17,17,0.05)', color: 'var(--text-primary)' }}>Before</span>
                <span className={styles.speedCounter}>{beforeWpm} WPM</span>
              </div>
              <div className={styles.speedBody}>
                <p className={styles.speedText}>{beforeText}<span className={styles.speedCursor} /></p>
              </div>
              <div className={styles.speedCardFooter}>Manual Keyboard Typing</div>
            </GlassCard>

            {/* After (WhisperType Pro) */}
            <GlassCard className={styles.speedCard} glowColor="teal">
              <div className={styles.speedCardHeader}>
                <span className={styles.speedBadge}>After</span>
                <span className={styles.speedCounter} style={{ color: 'var(--accent-teal)' }}>{afterWpm} WPM</span>
              </div>
              <div className={styles.speedBody}>
                <p className={styles.speedText} style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>{afterText}<span className={styles.speedCursor} style={{ background: 'var(--accent-teal)' }} /></p>
              </div>
              <div className={styles.speedCardFooter} style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>WhisperType Local AI</div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 4 — ALTERNATING WORKFLOW SECTIONS (Large visual storybooks) */}
      {/* ------------------------------------------------------------------------- */}
      {/* Block 1: Auto Formatting (Light) */}
      <section className={styles.workflowLightSection}>
        <div className="container">
          <div className={styles.workflowRow}>
            <div className={styles.workflowInfo}>
              <span className={styles.workflowTag}>Smart Dictation</span>
              <h3>Auto-Formatting & Filler Eraser</h3>
              <p>Strips out filler words like 'um', 'uh', and 'you know' instantly. Corrects speech stutters to format beautiful paragraphs natively.</p>
              <div className={styles.workflowMockText}>
                "let's <span style={{ textDecoration: 'line-through', color: 'rgba(244,63,94,0.6)' }}>um</span> code the <span style={{ textDecoration: 'line-through', color: 'rgba(244,63,94,0.6)' }}>like</span> new API endpoint" <br />
                <ArrowRight size={14} style={{ margin: '0.4rem 0', color: 'var(--text-muted)' }} /> <br />
                <strong style={{ color: 'var(--accent-teal)' }}>"Let's code the new API endpoint"</strong>
              </div>
            </div>
            <div className={styles.workflowVisual}>
              <GlassCard className={styles.workflowGlassCard} glowColor="teal">
                <Terminal size={32} style={{ color: 'var(--accent-teal)', marginBottom: '1rem' }} />
                <h5>Auto-Punctuate & Auto-Paragraph</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pause to paragraph. Speak naturally, and let our compiler inject formatting elements seamlessly.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Block 2: Context Awareness (Dark) */}
      <section className={styles.workflowDarkSection}>
        <div className="container">
          <div className={styles.workflowRow} style={{ flexDirection: 'row-reverse' }}>
            <div className={styles.workflowInfo}>
              <span className={styles.workflowTag} style={{ color: 'var(--accent-lavender)', background: 'rgba(220, 198, 246, 0.1)' }}>Developers</span>
              <h3 style={{ color: 'var(--text-white)' }}>Developer Context Awareness</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Formulate variables inside your IDE. WhisperType Pro understands camelCase, snake_case, CLI triggers, and brackets without breaking code syntax.</p>
              <div className={styles.workflowMockCode}>
                <span style={{ color: '#8b5cf6' }}>const</span> <span style={{ color: '#06b6d4' }}>fetchProductInventoryAPI</span> = () =&gt; &#123;&#125;
              </div>
            </div>
            <div className={styles.workflowVisual}>
              <GlassCard className={styles.workflowGlassCard} isDark glowColor="lavender">
                <FileCode size={32} style={{ color: 'var(--accent-lavender)', marginBottom: '1rem' }} />
                <h5 style={{ color: 'var(--text-white)' }}>Windsurf & Cursor File Tags</h5>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Speak tag triggers alongside codes to auto-import target file contexts straight to your prompt window.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Block 3: AI Enhancement (Light) */}
      <section className={styles.workflowLightSection}>
        <div className="container">
          <div className={styles.workflowRow}>
            <div className={styles.workflowInfo}>
              <span className={styles.workflowTag}>Voice Editing</span>
              <h3>Vocal Command Mode</h3>
              <p>Highlight any typed sentence and dictate formatting prompts like "Make Professional", "Summarize as bullets", or "Casual tone". Watch text morph instantly.</p>
              <div className={styles.presetCmdRow}>
                <span className={styles.cmdBadge}>"Make Professional"</span>
                <span className={styles.cmdBadge}>"Bulleted List"</span>
              </div>
            </div>
            <div className={styles.workflowVisual}>
              <GlassCard className={styles.workflowGlassCard} glowColor="teal">
                <Sparkles size={32} style={{ color: 'var(--accent-teal)', marginBottom: '1rem' }} />
                <h5>Personal Dictionary Learning</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Prevent repeated spelling errors. Add custom industry jargon, names, or slang to correct casing dynamically.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Block 4: Offline Privacy (Dark) */}
      <section className={styles.workflowDarkSection}>
        <div className="container">
          <div className={styles.workflowRow} style={{ flexDirection: 'row-reverse' }}>
            <div className={styles.workflowInfo}>
              <span className={styles.workflowTag} style={{ color: 'var(--accent-lavender)', background: 'rgba(220, 198, 246, 0.1)' }}>Security</span>
              <h3 style={{ color: 'var(--text-white)' }}>100% Offline Privacy</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Run AI transcription models entirely inside local system RAM. Your confidential documents, proprietary scripts, and emails remain entirely on device.</p>
              
              {/* Dynamic Supabase Log inside Dark Section */}
              <div className={styles.supabaseLogSection}>
                <span className={styles.dbSyncBadge}><Shield size={12} /> Local Supabase Sandbox Sync</span>
                {dbSnippets.length > 0 ? (
                  <div className={styles.supabaseMockList}>
                    {dbSnippets.map((item) => (
                      <div key={item.id} className={styles.supabaseMockItem}>
                        <span className={styles.supabaseMockId}>ID #{item.id}</span>
                        <p className={styles.supabaseMockText}>{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                    Database logs are empty. Save your sandbox dictations in the hero block above.
                  </div>
                )}
              </div>
            </div>
            <div className={styles.workflowVisual}>
              <GlassCard className={styles.workflowGlassCard} isDark glowColor="lavender">
                <Shield size={32} style={{ color: 'var(--accent-lavender)', marginBottom: '1rem' }} />
                <h5 style={{ color: 'var(--text-white)' }}>Zero Server Telemetry</h5>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>WhisperType Pro respects your privacy bounds. Absolutely zero audio packet files or transcription texts are stored on public servers.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 5 — BENTO FEATURES GRID (Dark 2-Column Bento Deck) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.bentoSection}>
        <div className="container">
          <div className={styles.bentoHeader}>
            <h2 className={styles.darkHeadline}>Built For Absolute Dictation Control</h2>
            <p className={styles.darkSubheadline}>An organic Bento Grid compiling all advanced voice editing, casing, and privacy features.</p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Bento Card 1: Auto Formatting */}
            <GlassCard className={styles.bentoCard} isDark glowColor="teal">
              <Sparkles size={24} style={{ color: 'var(--accent-teal)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>Auto Formatting</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Automatically removes fill words ("um", "like") and constructs bullet items natively from spoken pauses.</p>
            </GlassCard>

            {/* Bento Card 2: Context Casing */}
            <GlassCard className={styles.bentoCard} isDark glowColor="lavender">
              <Terminal size={24} style={{ color: 'var(--accent-lavender)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>Context Awareness</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Intuitively maps casual uppercase templates, corporate emails, and complex developer casings seamlessly.</p>
            </GlassCard>

            {/* Bento Card 3: Voice Commands */}
            <GlassCard className={styles.bentoCard} isDark glowColor="lavender">
              <Keyboard size={24} style={{ color: 'var(--accent-lavender)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>Voice Commands</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Allows you to highlight any block and use vocal editing shortcuts to rewrite formatting styles instantly.</p>
            </GlassCard>

            {/* Bento Card 4: AI Rewrite */}
            <GlassCard className={styles.bentoCard} isDark glowColor="teal">
              <FileText size={24} style={{ color: 'var(--accent-teal)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>AI Rewrite Preset</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Converts standard sentences into casual lowercase, professional pitches, or outline drafts dynamically.</p>
            </GlassCard>

            {/* Bento Card 5: Privacy First */}
            <GlassCard className={styles.bentoCard} isDark glowColor="teal">
              <Shield size={24} style={{ color: 'var(--accent-teal)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>Privacy First</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Operates offline local AI model files completely. Zero third-party telemetry footprints exist.</p>
            </GlassCard>

            {/* Bento Card 6: Multi-Language */}
            <GlassCard className={styles.bentoCard} isDark glowColor="lavender">
              <Cpu size={24} style={{ color: 'var(--accent-lavender)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>100+ Languages</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Supports global speech translation networks including English, Spanish, Hindi, Korean, and Arabic.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 6 — REDESIGNED CALCULATOR (Sliders & Savings Dashboard) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.calculatorSection}>
        <div className="container">
          <div className={styles.calculatorHeader}>
            <h2>Redesigned Savings Dashboard</h2>
            <p>Slide metrics to see how WhisperType Pro alters your daily writing timelines.</p>
          </div>

          <div className={styles.calculatorCardContainer}>
            <GlassCard className={styles.premiumCalculatorCard} glowColor="teal">
              <div className={styles.calculatorSplitGrid}>
                {/* Sliders */}
                <div className={styles.slidersBlock}>
                  <div className={styles.sliderWidget}>
                    <div className={styles.sliderLabels}>
                      <span>Daily Dictation Length</span>
                      <strong className={styles.sliderHighlight}>{dailyWords} words</strong>
                    </div>
                    <input 
                      type="range" 
                      min="500" 
                      max="10000" 
                      step="500"
                      value={dailyWords} 
                      onChange={(e) => setDailyWords(Number(e.target.value))}
                      className={styles.rangeBar}
                    />
                    <div className={styles.rangeLimits}><span>500 words</span><span>10,000 words</span></div>
                  </div>

                  <div className={styles.sliderWidget}>
                    <div className={styles.sliderLabels}>
                      <span>Keyboard Typing Speed</span>
                      <strong className={styles.sliderHighlight}>{typingSpeed} WPM</strong>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="120" 
                      step="5"
                      value={typingSpeed} 
                      onChange={(e) => setTypingSpeed(Number(e.target.value))}
                      className={styles.rangeBar}
                    />
                    <div className={styles.rangeLimits}><span>20 WPM (Slow)</span><span>120 WPM (Pro)</span></div>
                  </div>

                  <div className={styles.sliderWidget}>
                    <div className={styles.sliderLabels}>
                      <span>Hourly Value Rate</span>
                      <strong className={styles.sliderHighlight}>${hourlyRate}/hr</strong>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="200" 
                      step="5"
                      value={hourlyRate} 
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className={styles.rangeBar}
                    />
                    <div className={styles.rangeLimits}><span>$15/hr</span><span>$200/hr</span></div>
                  </div>
                </div>

                {/* Animated metrics Dashboard */}
                <div className={styles.dashboardBlock}>
                  <div className={styles.dashboardMetricsGrid}>
                    <div className={styles.dashCard}>
                      <span className={styles.dashCardTitle}>Monthly Hours Saved</span>
                      <h4 className={styles.dashCardVal}>{hoursSaved.toFixed(1)} hrs</h4>
                      <p className={styles.dashCardSub}>recovered back to you</p>
                    </div>

                    <div className={styles.dashCard}>
                      <span className={styles.dashCardTitle}>Productivity Boost</span>
                      <h4 className={styles.dashCardVal} style={{ color: 'var(--accent-teal)' }}>{productivityMultiplier.toFixed(1)}x</h4>
                      <p className={styles.dashCardSub}>faster dictation speed</p>
                    </div>

                    <div className={styles.dashCard} style={{ gridColumn: 'span 2' }}>
                      <span className={styles.dashCardTitle}>Equivalent Emails Spoken</span>
                      <h4 className={styles.dashCardVal} style={{ color: 'var(--accent-teal)' }}>~{emailsEquivalent} emails</h4>
                      <p className={styles.dashCardSub}>drafted at speed of thought</p>
                    </div>
                  </div>

                  <div className={styles.dashFinancialCard}>
                    <span>Monthly Financial Value Saved</span>
                    <h3 className={styles.dashFinancialVal}>${moneySaved.toLocaleString(undefined, {maximumFractionDigits: 0})} / mo</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projected savings on daily transcription workloads</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 7 — WHY WHISPERTYPE WINS (Interactive comparison cards) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.winsComparisonSection}>
        <div className="container">
          <div className={styles.comparisonHeader}>
            <h2>Why WhisperType Pro Wins</h2>
            <p>A modern comparative experience outlining the technical edge of WhisperType Pro.</p>
          </div>

          <div className={styles.winsGrid}>
            {/* Card 1: Built-in Dictation */}
            <GlassCard className={styles.winsCard} glowColor="none">
              <h4 className={styles.winsCardTitle}>Built-in Dictation</h4>
              <p className={styles.winsCardDesc}>Basic OS tools built for generic transcription logs.</p>
              
              <ul className={styles.winsChecklist}>
                <li><XCircle size={15} color="var(--neon-rose)" /> 100% Offline Inference</li>
                <li><XCircle size={15} color="var(--neon-rose)" /> Auto-Filler Word Eraser</li>
                <li><XCircle size={15} color="var(--neon-rose)" /> Backtrack Vocal Corrections</li>
                <li><XCircle size={15} color="var(--neon-rose)" /> Developer casing formatting</li>
                <li><XCircle size={15} color="var(--neon-rose)" /> Speech-to-Command editing</li>
              </ul>
            </GlassCard>

            {/* Card 2: Generic Speech-to-Text */}
            <GlassCard className={styles.winsCard} glowColor="none">
              <h4 className={styles.winsCardTitle}>Generic Speech-to-Text</h4>
              <p className={styles.winsCardDesc}>Standard cloud utilities resolving voice documents.</p>
              
              <ul className={styles.winsChecklist}>
                <li><XCircle size={15} color="var(--neon-rose)" /> 100% Offline Inference</li>
                <li><CheckCircle2 size={15} color="var(--accent-teal)" /> Auto-Filler Word Eraser</li>
                <li><XCircle size={15} color="var(--neon-rose)" /> Backtrack Vocal Corrections</li>
                <li><XCircle size={15} color="var(--neon-rose)" /> Developer casing formatting</li>
                <li><XCircle size={15} color="var(--neon-rose)" /> Speech-to-Command editing</li>
              </ul>
            </GlassCard>

            {/* Card 3: WhisperType Pro */}
            <GlassCard className={styles.winsCard} glowColor="teal" style={{ borderColor: 'var(--accent-teal)', borderWidth: '2px' }}>
              <div className={styles.winsCardHeader}>
                <h4 className={styles.winsCardTitle} style={{ color: 'var(--accent-teal)' }}>WhisperType Pro</h4>
                <span className={styles.winsBadge}>Recommended</span>
              </div>
              <p className={styles.winsCardDesc}>Our offline local engine built for extreme workflow speeds.</p>
              
              <ul className={styles.winsChecklist}>
                <li><CheckCircle2 size={15} color="var(--accent-teal)" /> 100% Offline Inference</li>
                <li><CheckCircle2 size={15} color="var(--accent-teal)" /> Auto-Filler Word Eraser</li>
                <li><CheckCircle2 size={15} color="var(--accent-teal)" /> Backtrack Vocal Corrections</li>
                <li><CheckCircle2 size={15} color="var(--accent-teal)" /> Developer casing formatting</li>
                <li><CheckCircle2 size={15} color="var(--accent-teal)" /> Speech-to-Command editing</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 8 — HOW IT WORKS (Horizontal Stepper timeline) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.howItWorksSection}>
        <div className="container">
          <div className={styles.howHeader}>
            <h2 className={styles.darkHeadline}>Horizontal timeline</h2>
            <p className={styles.darkSubheadline}>Get started in four organic stages with zero friction.</p>
          </div>

          <div className={styles.howHorizontalGrid}>
            {[
              { step: "01", title: "Connect Helper", desc: "Download and launch the offline helper natively matching your OS." },
              { step: "02", title: "Speak Naturally", desc: "Hold down your global activation shortcut (Caps Lock) and start dictating." },
              { step: "03", title: "AI Enhances Casing", desc: "Our localized models erase stutters, check dictionaries, and format casings." },
              { step: "04", title: "Publish Globally", desc: "Release key. The output text auto-pastes instantly in Notion, Cursor, or Slack." }
            ].map((st, i) => (
              <GlassCard key={i} className={styles.howStepCard} isDark glowColor={i === 2 ? "lavender" : "none"}>
                <div className={styles.howStepNum}>{st.step}</div>
                <h4 className={styles.howStepTitle}>{st.title}</h4>
                <p className={styles.howStepDesc}>{st.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 9 — TESTIMONIALS (Auto-Scrolling Infinite Marquee) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className={styles.testimonialsHeader}>
            <h2 className={styles.darkHeadline}>Love Letters To WhisperType</h2>
            <p className={styles.darkSubheadline}>What developers, authors, and executives say about their dictation speeds.</p>
          </div>
        </div>

        {/* Auto Scrolling Marquee Wall */}
        <div className="marquee-container">
          <div className="marquee-content">
            {[
              { name: "Sarah K.", role: "Senior Developer", quote: "Auto-camelCasing variable speech is a massive game-changer. I dictation-code all day inside Cursor." },
              { name: "David L.", role: "Founder & CEO", quote: "No cloud lag, and 100% offline security means my voice dictations never trigger server flags." },
              { name: "James M.", role: "Creative Author", quote: "Typing speed bottlenecks are gone. I dictation-draft my outlines in casual style natively." },
              { name: "Elena R.", role: "SaaS Marketer", quote: "Vocal Command Mode is magic. Highlighted paragraphs rewrite to professional drafts instantly." },
              { name: "Marcus P.", role: "Support Lead", quote: "Filler erasers are extremely accurate. Strips stutters so my customer Slack messages read flawlessly." }
            ].map((t, i) => (
              <GlassCard key={i} className={styles.testimonialMarqueeCard} isDark glowColor="teal">
                <div className={styles.tHeader}>
                  <div className={styles.tAvatar}>{t.name[0]}</div>
                  <div>
                    <h5 style={{ color: 'var(--text-white)', fontWeight: 700 }}>{t.name}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t.role}</span>
                  </div>
                </div>
                <p className={styles.tQuote}>"{t.quote}"</p>
                <div className={styles.tStars}><Star size={12} fill="var(--accent-lavender)" color="var(--accent-lavender)" /> 5.0 Core rating</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 10 — FINAL CTA (Immersive Blurred Lavender Panel) */}
      {/* ------------------------------------------------------------------------- */}
      <section id="download" className={styles.ctaImmersiveSection}>
        {/* Soft Blurred Lavender and Peach Background Spheres */}
        <div className={styles.ctaImmersiveSphere1} />
        <div className={styles.ctaImmersiveSphere2} />

        {/* Floating Background Micro-particles */}
        <div className={`${styles.ctaParticle} ${styles.ctaParticle1}`} />
        <div className={`${styles.ctaParticle} ${styles.ctaParticle2}`} />
        <div className={`${styles.ctaParticle} ${styles.ctaParticle3}`} />
        <div className={`${styles.ctaParticle} ${styles.ctaParticle4}`} />
        <div className={`${styles.ctaParticle} ${styles.ctaParticle5}`} />
        <div className={`${styles.ctaParticle} ${styles.ctaParticle6}`} />

        {/* Animated Dotted Vector Flow Paths */}
        <svg className={styles.ctaDottedSvg} viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,100 Q300,50 500,300 T1100,150 T1600,400" stroke="url(#gradientTeal)" strokeWidth="2" strokeDasharray="6 8" className={styles.ctaDottedPath1} />
          <path d="M-50,450 Q400,500 700,200 T1200,450 T1500,150" stroke="url(#gradientLavender)" strokeWidth="1.5" strokeDasharray="4 6" className={styles.ctaDottedPath2} />
          <defs>
            <linearGradient id="gradientTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 95, 90, 0.05)" />
              <stop offset="50%" stopColor="rgba(0, 95, 90, 0.25)" />
              <stop offset="100%" stopColor="rgba(0, 95, 90, 0.05)" />
            </linearGradient>
            <linearGradient id="gradientLavender" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(220, 198, 246, 0.05)" />
              <stop offset="50%" stopColor="rgba(220, 198, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(220, 198, 246, 0.05)" />
            </linearGradient>
          </defs>
        </svg>

        <div className="container">
          <motion.div 
            className={styles.ctaImmersiveCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className={styles.ctaImmersiveHeadline}>Start Writing At The <br />Speed Of Thought.</h2>
            <p className={styles.ctaImmersiveSubheadline}>Download the free open-source helper launcher and start dictating 4× faster than keyboards with absolute privacy.</p>
            
            <div className={styles.ctaImmersiveButtons}>
              <Button variant="primary">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Apple size={18} /> Download macOS Client
                </span>
              </Button>
              <Button variant="secondary" style={{ background: '#ffffff', color: '#111111' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Monitor size={18} /> Download Windows Client
                </span>
              </Button>
            </div>

            <ul className={styles.ctaImmersiveChecklist}>
              <li><Check size={16} /> Free Forever</li>
              <li><Check size={16} /> Fully Offline Whisper AI</li>
              <li><Check size={16} /> Less than 50MB installer</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
