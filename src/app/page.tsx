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

const appDictationExamples = {
  gmail: {
    raw: "Hey guys can we meet at 2... actually 3 to review the SaaS layout. Send the invite.",
    clean: "Hi Team,\n\nCould we please reschedule our meeting to 3:00 PM today to review the new SaaS design layouts? I will send out the calendar invitation shortly.\n\nBest regards,\n[My Name]",
    intent: "Schedule Reschedule Outreach",
    rules: "Professional Email Formatting",
    icon: "mail"
  },
  slack: {
    raw: "Let's um launch the dev server now actually wait till Marcus finishes the icons",
    clean: "hey team, let's wait to launch the dev server until marcus finishes the icon set 👍",
    intent: "Group Communication",
    rules: "Conversational lowercase formatting + emojis",
    icon: "terminal"
  },
  notion: {
    raw: "make a list of tasks for the launch we need to compile the code test the waveform and push to github",
    clean: "### Launch Tasks\n- [ ] Compile production code & verify builds\n- [ ] Test real-time Web Audio waveform analysis\n- [ ] Push local repository commits to GitHub",
    intent: "Task / Todo List",
    rules: "Structured Markdown Formatting",
    icon: "filetext"
  },
  cursor: {
    raw: "create a public async function called get user inventory details mapping database items",
    clean: "public async getUserInventoryDetails(userId: string): Promise<InventoryItem[]> {\n  return await this.db.items.find({ userId });\n}",
    intent: "Code Generation Prompt",
    rules: "Developer Syntax camelCasing",
    icon: "filecode"
  },
  crm: {
    raw: "met with sarah from Acme corp she loved the offline mode and wants a demo next tuesday",
    clean: "Acme Corp | Lead Sarah\n• Product Feedback: Highly interested in local offline privacy features.\n• Action Item: Schedule detailed technical demo next Tuesday.",
    intent: "CRM Call Log Note",
    rules: "Structured Bulleted Log Notes",
    icon: "trendingup"
  }
};

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
  const [activeTab, setActiveTab] = useState<'gmail' | 'slack' | 'notion' | 'cursor' | 'crm'>('gmail');
  const [typingIntervalId, setTypingIntervalId] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState<number>(1);
  const [layer2Cleaned, setLayer2Cleaned] = useState<boolean>(false);
  // --- STATES FOR 10 USP BENTO SIMULATORS ---
  const [commandsText, setCommandsText] = useState("hey team just wanted to let you know that we got the local transcription compiler working, let's push the dev code tonight");
  const [whisperMessages, setWhisperMessages] = useState<any[]>([
    { sender: 'whisper', text: "Hey! Speak or choose a command. I'm your on-device Voice AI Assistant. How can I help you finish work today?" }
  ]);
  const [whisperLoading, setWhisperLoading] = useState(false);
  const [notionTasks, setNotionTasks] = useState<string[]>(["Verify DB refresh rule", "Style horizontal flow"]);
  const [flyingTaskActive, setFlyingTaskActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [onnxLogs, setOnnxLogs] = useState<string[]>(["ONNX Core Engine: STANDBY"]);
  const [meetingActive, setMeetingActive] = useState(false);
  const [meetingSummaryReady, setMeetingSummaryReady] = useState(false);
  const [jargonList, setJargonList] = useState<string[]>(["windsurf", "cursor", "saas"]);

  const runVoiceCommand = (cmd: 'pro' | 'concise' | 'bullets' | 'hindi') => {
    if (cmd === 'pro') {
      setCommandsText("I am pleased to inform the team that our local voice compiler has been successfully implemented. Let us stage and deploy the development builds to production this evening.");
    } else if (cmd === 'concise') {
      setCommandsText("Local transcription is live. Pushing dev code tonight! 🚀");
    } else if (cmd === 'bullets') {
      setCommandsText("• Implemented local voice compiler\n• Staged dev builds for launch\n• Pushing to production tonight");
    } else if (cmd === 'hindi') {
      setCommandsText("हे टीम, बस आपको बताना चाहता था कि हमने लोकल ट्रांसक्रिप्शन कंपाइलर को चालू कर दिया है, आइए आज रात देव कोड पुश करें।");
    }
  };

  const runWhisperChat = (promptKey: 'email' | 'agenda' | 'linkedin') => {
    if (whisperLoading) return;
    
    let userQ = "";
    let reply = "";
    if (promptKey === 'email') {
      userQ = "Hey Whisper, draft a follow-up email";
      reply = "Subject: Scheduling WhisperType Demo\n\nHi Marcus,\n\nFollowing up on our sync. Let's schedule a deep-dive demo of our local AI Voice OS next Tuesday at 10 AM. Let me know if that works!\n\nBest,\nSarah";
    } else if (promptKey === 'agenda') {
      userQ = "Hey Whisper, generate meeting agenda";
      reply = "### Sync Agenda\n1. Review local ONNX latencies\n2. Align on Notion task database endpoints\n3. Stage repository builds";
    } else if (promptKey === 'linkedin') {
      userQ = "Hey Whisper, write a LinkedIn post";
      reply = "🚀 Speech isn't just voice-to-text anymore—it's Voice to Work.\n\nToday, we bootstrapped WhisperType V2, the first on-device AI Voice OS. Stop typing, start flowing! 🎙️ #AI #Productivity #VoiceOS";
    }
    
    setWhisperMessages(prev => [...prev, { sender: 'user', text: userQ }]);
    setWhisperLoading(true);
    
    setTimeout(() => {
      setWhisperLoading(false);
      setWhisperMessages(prev => [...prev, { sender: 'whisper', text: reply }]);
    }, 1500);
  };

  const triggerNotionAutomation = () => {
    if (flyingTaskActive) return;
    setFlyingTaskActive(true);
    
    setTimeout(() => {
      setNotionTasks(prev => [...prev, "Deploy server build"]);
      setFlyingTaskActive(false);
    }, 1200);
  };

  const toggleOfflineMode = (val: boolean) => {
    setOfflineMode(val);
    if (val) {
      setOnnxLogs([
        "Initializing local ONNX pipeline...",
        "Loading quantized Whisper weights...",
        "Success: ONNX model compiled locally on CPU (54ms latency).",
        "TELEMETRY: Offline Privacy Mode Active. Zero cloud packets exist."
      ]);
    } else {
      setOnnxLogs(["ONNX Core Engine: STANDBY"]);
    }
  };

  const triggerMeetingMode = () => {
    if (meetingActive) return;
    setMeetingActive(true);
    setMeetingSummaryReady(false);
    
    setTimeout(() => {
      setMeetingActive(false);
      setMeetingSummaryReady(true);
    }, 4000);
  };
  useEffect(() => {
    if (typingIntervalId) clearInterval(typingIntervalId);
    setTranscript("");
    setInterimText("");
    setIsRecording(false);
    
    const targetText = appDictationExamples[activeTab].clean;
    let currentIdx = 0;
    const words = targetText.split(" ");
    
    const interval = setInterval(() => {
      setTranscript(prev => {
        if (currentIdx < words.length) {
          const nextText = prev ? prev + " " + words[currentIdx] : words[currentIdx];
          currentIdx++;
          return nextText;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 100);
    
    setTypingIntervalId(interval);
    return () => clearInterval(interval);
  }, [activeTab]);

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

    // 4. Output tone styles mapping matching V2 AI Voice OS App-Awareness
    if (activeTab === 'slack') {
      text = text.toLowerCase().replace(/[.]/g, "") + " 👍"; 
    } else if (activeTab === 'cursor') {
      if (text.toLowerCase().includes("run dev")) {
        text = "npm run dev";
      } else if (text.toLowerCase().includes("git commit")) {
        text = 'git commit -m "feat: implement local transcription"';
      } else {
        text = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
      }
    } else if (activeTab === 'gmail') {
      text = `Hi Team,\n\n${text}\n\nBest regards,\n[My Name]`;
    } else if (activeTab === 'notion') {
      text = `### Tasks\n` + text.split(". ").map(s => s.trim() ? `- [ ] ${s}` : "").filter(Boolean).join("\n");
    } else if (activeTab === 'crm') {
      text = `Acme Corp | Lead\n• Log: ${text}`;
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
      q: "Is WhisperType V2 strictly better than Wispr Flow?",
      a: "Yes. While Flow offers basic dictation, WhisperType V2 is a complete on-device AI Voice Operating System combining speech capture, intent detection, voice template modifiers, and native workflow integrations (like triggering Notion database tasks or writing Cursor developer syntax instantly) entirely offline."
    },
    {
      q: "Does the voice workflow automation require remote servers?",
      a: "No. All intent resolving, casing adaptations, and local ONNX model compilations execute natively on-device. Telemetry states remain completely offline, preserving extreme security and confidential document privacy."
    },
    {
      q: "How does the backtrack voice correction work?",
      a: "If you change your mind mid-sentence (e.g. speaking 'Let's commit to GitHub... actually GitLab'), WhisperType V2 recognizes the correction trigger word 'actually' and automatically rewrites the preceding target word locally before outputting."
    },
    {
      q: "Can I use it inside Cursor, Windsurf, or VS Code?",
      a: "Yes. It maps natively to standard text buffers. Additionally, you can speak tags like 'file tagging' alongside coding prompts, and WhisperType V2 imports the correct file paths straight into your LLM assistant."
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
      {/* ---------------------------------------------------------------      {/* SECTION 1 — HERO (Warm Ivory Background with Pill Buttons & Floating Spotlight HUD) */}
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
                <Sparkles size={13} /> AI Voice Operating System v2.0
              </div>
              <h1 className={styles.heroHeadline}>
                Voice To Work. <br />
                <span className="text-gradient">Speak Naturally. Ship Faster.</span>
              </h1>
              <p className={styles.heroSubheadline}>
                WhisperType V2 is a voice-first operating system that converts spoken thoughts directly into finished emails, Slack messages, Notion tasks, database logs, and code. Your words. Instantly finished.
              </p>
              <div className={styles.heroCTAButtons}>
                <Button variant="primary" onClick={() => {
                  document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span>Get Voice OS Free</span>
                </Button>
                <Button variant="secondary" onClick={() => {
                  document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span>Try 10 OS Features</span>
                </Button>
              </div>
            </motion.div>
 
            {/* Right: Interactive Spotlight HUD Sandbox */}
            <motion.div 
              className={styles.heroRight}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard className={styles.dictationWindowCard} glowColor="teal">
                {/* Spotlight/Raycast Header Command Bar */}
                <div className={styles.spotlightHeaderBar}>
                  <Terminal size={16} className={styles.spotlightTerminalIcon} />
                  <span className={styles.spotlightPlaceholder}>WhisperType Voice OS Spotlight</span>
                  <div className={styles.spotlightShortcutBadge}>Ctrl + Win</div>
                </div>

                {/* Horizontal App Context Tabs */}
                <div className={styles.contextTabsGrid}>
                  {[
                    { id: 'gmail', label: 'Gmail', icon: Mail },
                    { id: 'slack', label: 'Slack', icon: Terminal },
                    { id: 'notion', label: 'Notion', icon: FileText },
                    { id: 'cursor', label: 'Cursor IDE', icon: FileCode },
                    { id: 'crm', label: 'HubSpot CRM', icon: TrendingUp }
                  ].map((t) => {
                    const IconComponent = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`${styles.contextTabBtn} ${activeTab === t.id ? styles.contextTabBtnActive : ""}`}
                      >
                        <IconComponent size={13} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Intelligence Layer Activity Panel */}
                <div className={styles.hudActivityMonitor}>
                  <div className={styles.monitorStat}>
                    <span className={styles.monitorLabel}>Active Ruleset:</span>
                    <strong className={styles.monitorVal}>{appDictationExamples[activeTab].rules}</strong>
                  </div>
                  <div className={styles.monitorStat}>
                    <span className={styles.monitorLabel}>Intent Resolved:</span>
                    <strong className={styles.monitorVal} style={{ color: 'var(--accent-teal)' }}>{appDictationExamples[activeTab].intent}</strong>
                  </div>
                </div>

                <div className={styles.cardInnerContent}>
                  {/* Waveform Visualizer */}
                  <div className={styles.heroWaveformWrapper} style={{ marginTop: '0rem', marginBottom: '1.25rem' }}>
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
                  <div className={styles.heroMicBtnWrapper} style={{ marginBottom: '1.5rem' }}>
                    <button 
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`${styles.heroMicButton} ${isRecording ? styles.heroMicActive : ""}`}
                    >
                      <Mic size={26} />
                    </button>
                    {isRecording && <div className="record-pulse-active" style={{ position: 'absolute', width: '60px', height: '60px', borderRadius: '50%', pointerEvents: 'none' }} />}
                  </div>

                  {/* Real-time Text Box (Raw vs Format side-by-side) */}
                  <div className={styles.hudPlaygroundGrid}>
                    <div className={styles.hudSpeechBox}>
                      <span className={styles.hudBoxTag}>User Spoke Naturally:</span>
                      <p className={styles.hudRawSpeechText}>"{appDictationExamples[activeTab].raw}"</p>
                    </div>
                    
                    <div className={styles.hudResultBox}>
                      <span className={styles.hudBoxTag} style={{ color: 'var(--accent-teal)' }}>Voice OS Finished Work:</span>
                      <div className={styles.hudCleanOutputBox}>
                        {transcript || interimText ? (
                          <>
                            <span style={{ whiteSpace: 'pre-line' }}>{transcript}</span>
                            {interimText && <span style={{ opacity: 0.5 }}>{" " + interimText}</span>}
                          </>
                        ) : (
                          <span className={styles.heroPlaceholder}>
                            Press Ctrl+Win to dictate or click tabs to simulate...
                          </span>
                        )}
                        <span className={styles.speedCursor} style={{ background: 'var(--accent-teal)', height: '1.1rem', width: '2px', display: 'inline-block', marginLeft: '2px', verticalAlign: 'middle' }} />
                      </div>
                    </div>
                  </div>

                  {/* Supabase Actions Row */}
                  {(transcript || interimText) && (
                    <div className={styles.heroActionRow} style={{ marginTop: '1.5rem' }}>
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
            <p className={styles.darkSubheadline}>WhisperType V2 works everywhere your cursor lands. Seamlessly types code, documents, and communication logs.</p>
          </div>

          <div className={styles.orbitContainer}>
            {/* Ambient Background glows */}
            <div className={styles.orbitGlow1} />
            <div className={styles.orbitGlow2} />

            {/* Central WhisperType Node */}
            <GlassCard className={styles.centralAppNode} isDark glowColor="teal">
              <Mic size={36} className={styles.centralIcon} />
              <span className={styles.centralLabel}>WhisperType V2</span>
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

            {/* After (WhisperType V2 AI Voice OS) */}
            <GlassCard className={styles.speedCard} glowColor="teal">
              <div className={styles.speedCardHeader}>
                <span className={styles.speedBadge}>After</span>
                <span className={styles.speedCounter} style={{ color: 'var(--accent-teal)' }}>{afterWpm} WPM</span>
              </div>
              <div className={styles.speedBody}>
                <p className={styles.speedText} style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>{afterText}<span className={styles.speedCursor} style={{ background: 'var(--accent-teal)' }} /></p>
              </div>
              <div className={styles.speedCardFooter} style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>WhisperType V2 Voice OS</div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 4 — 5 LAYERS OF VOICE INTELLIGENCE (Interactive Pipeline) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.intelligenceLayersSection}>
        <div className="container">
          <div className={styles.layersHeader}>
            <span className={styles.layersBadge}>SaaS Core Architecture</span>
            <h2>5 Layers of Voice Intelligence</h2>
            <p>WhisperType V2 maps your spoken voice through five localized optimization layers in under 200ms, transforming raw speech into finished work.</p>
          </div>

          <div className={styles.layersPipelineContainer}>
            {/* Left: Interactive Stepper Timeline */}
            <div className={styles.layersSidebar}>
              {[
                { step: 1, name: "Layer 1: Speech Recognition", desc: "Accent & Noise resistant voice capture" },
                { step: 2, name: "Layer 2: AI Cleanup Engine", desc: "Filler removal, grammar & punctuation" },
                { step: 3, name: "Layer 3: Intent Understanding", desc: "Auto-detecting goals: emails, code, templates" },
                { step: 4, name: "Layer 4: App Awareness", desc: "Adapting tone specifically for active app contexts" },
                { step: 5, name: "Layer 5: Personal Memory", desc: "Acronyms, team names & style memory" }
              ].map((layer) => (
                <button
                  key={layer.step}
                  onClick={() => {
                    setActiveLayer(layer.step);
                    if (layer.step !== 2) setLayer2Cleaned(false);
                  }}
                  className={`${styles.layerSelectorBtn} ${activeLayer === layer.step ? styles.layerSelectorBtnActive : ""}`}
                >
                  <div className={styles.layerStepBubble}>{layer.step}</div>
                  <div style={{ textAlign: 'left' }}>
                    <h5 className={styles.layerStepName}>{layer.name}</h5>
                    <p className={styles.layerStepDesc}>{layer.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Active Layer Glass Dashboard Simulator */}
            <div className={styles.layerSimulatorPane}>
              <GlassCard className={styles.layerSimCard} glowColor="teal" isDark>
                {activeLayer === 1 && (
                  <div className={styles.simContent}>
                    <div className={styles.simBadge}>Layer 1 Active: Speech Recognition</div>
                    <h4>Volumetric Speech Capture</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Fast-streaming on-device audio transcriptions built for noise-heavy or whispering work environments.</p>
                    
                    {/* Simulated Voice Waveform & Streaming text */}
                    <div className={styles.waveVisualizerBox}>
                      <div className={styles.visualizerWaveLoop} />
                      <p className={styles.streamingText}>
                        "connecting speech pipelines to local models..."
                      </p>
                    </div>
                  </div>
                )}

                {activeLayer === 2 && (
                  <div className={styles.simContent}>
                    <div className={styles.simBadge}>Layer 2 Active: AI Cleanup Engine</div>
                    <h4>Filler word strike-through editor</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Automatically erases stutters, repetitions, and filler phrases, formatting beautiful structured thoughts instantly.</p>
                    
                    {/* Filler word Strike-through sandbox */}
                    <div className={styles.fillerWordSandbox}>
                      <div className={styles.fillerTextContainer}>
                        <span>"Hey </span>
                        <span className={`${styles.strikeText} ${layer2Cleaned ? styles.strikeFaded : ""}`}>um</span>
                        <span> can you </span>
                        <span className={`${styles.strikeText} ${layer2Cleaned ? styles.strikeFaded : ""}`}>like</span>
                        <span> write the proposal... </span>
                        <span className={`${styles.strikeText} ${layer2Cleaned ? styles.strikeFaded : ""}`}>actually</span>
                        <span> reschedule it to </span>
                        <span className={styles.cleanHighlightedText}>Friday morning</span>
                        <span>"</span>
                      </div>

                      <button 
                        onClick={() => setLayer2Cleaned(true)} 
                        className={styles.simActionButton}
                        style={{ marginTop: '1.5rem' }}
                      >
                        {layer2Cleaned ? "✓ Stutters Erased!" : "Run AI Cleanup"}
                      </button>

                      {layer2Cleaned && (
                        <div className={styles.cleanedResultPane}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-teal)' }}>FINISHED WORK OUTPUT:</span>
                          <h4 style={{ color: 'var(--accent-teal)', margin: '0.25rem 0 0' }}>"Can you write the proposal and schedule it for Friday morning?"</h4>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeLayer === 3 && (
                  <div className={styles.simContent}>
                    <div className={styles.simBadge}>Layer 3 Active: Intent Understanding</div>
                    <h4>Categorized Goal Detection</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Identifies user goals and maps templates instantly. Adjusts paragraphs based on formatting templates.</p>
                    
                    <div className={styles.intentMatrixGrid}>
                      {[
                        { name: "Email Outreach", conf: "98% Confidence", active: true },
                        { name: "Slack Discussion", conf: "95% Confidence", active: false },
                        { name: "Code Block prompt", conf: "89% Confidence", active: false },
                        { name: "CRM Call Log", conf: "91% Confidence", active: false }
                      ].map((item, idx) => (
                        <div key={idx} className={`${styles.intentItem} ${item.active ? styles.intentItemActive : ""}`}>
                          <span style={{ fontWeight: 700 }}>{item.name}</span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.conf}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeLayer === 4 && (
                  <div className={styles.simContent}>
                    <div className={styles.simBadge}>Layer 4 Active: Application Awareness</div>
                    <h4>Active Window Tone Adaptation</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Detects context app buffers (Gmail vs VS Code) and updates casing or style guides natively.</p>
                    
                    <div className={styles.appAwarenessMock}>
                      <div className={styles.appCardContainer}>
                        <div className={styles.mockWindowFrame}>
                          <div className={styles.mockDots}><div /><div /><div /></div>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>activeApp: Cursor IDE</span>
                        </div>
                        <pre style={{ margin: 0, padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent-teal)' }}>
                          {"const handleSaveUserMetadata = () => {}"}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {activeLayer === 5 && (
                  <div className={styles.simContent}>
                    <div className={styles.simBadge}>Layer 5 Active: Personal Memory</div>
                    <h4>Localized Jargon Resolvers</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Learns names, team members, companies, slang, and dictionary rules natively on-device.</p>
                    
                    <div className={styles.memoryItemsGrid}>
                      <div className={styles.memoryCard}>
                        <span>Acronym</span>
                        <strong>"crm" Resolved ➔ "HubSpot CRM"</strong>
                      </div>
                      <div className={styles.memoryCard}>
                        <span>Team Contact</span>
                        <strong>"Sarah" Resolved ➔ "Sarah Jenkins (Lead)"</strong>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 5 — 10-USP BENTO GRID SHOWCASE (Interactive Operating System Simulators) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.bentoSection}>
        <div className="container">
          <div className={styles.bentoHeader}>
            <span className={styles.layersBadge}>10 Voice OS Features</span>
            <h2 className={styles.darkHeadline}>Outclassing Standard Dictation Tools</h2>
            <p className={styles.darkSubheadline}>WhisperType is not another dictation app. It's an entire AI Voice Operating System with dedicated automation blocks.</p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Bento Card 1: Voice Commands (Interactive) - Width: 2 Columns */}
            <GlassCard className={`${styles.bentoCard} ${styles.colSpan2}`} isDark glowColor="teal">
              <div className={styles.bentoCardInnerSplit}>
                <div style={{ flex: 1 }}>
                  <Keyboard size={24} style={{ color: 'var(--accent-teal)', marginBottom: '1.25rem' }} />
                  <h4 style={{ color: 'var(--text-white)' }}>Voice Commands</h4>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Speak styling commands to modify formatting guides instantly without manual key presses.</p>
                  
                  <div className={styles.bentoModifierGrid}>
                    <button onClick={() => runVoiceCommand('pro')} className={styles.bentoSimBtn}>"Rewrite professionally"</button>
                    <button onClick={() => runVoiceCommand('concise')} className={styles.bentoSimBtn}>"Make it concise"</button>
                    <button onClick={() => runVoiceCommand('bullets')} className={styles.bentoSimBtn}>"Convert to bullets"</button>
                    <button onClick={() => runVoiceCommand('hindi')} className={styles.bentoSimBtn}>"Translate to Hindi"</button>
                  </div>
                </div>

                <div className={styles.bentoOutputSandbox}>
                  <span className={styles.hudBoxTag}>LIVE OUTPUT SANDBOX:</span>
                  <div className={styles.bentoOutputArea}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-teal)', whiteSpace: 'pre-line' }}>{commandsText}</p>
                    <span className={styles.speedCursor} style={{ background: 'var(--accent-teal)' }} />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Bento Card 2: Voice AI Assistant ("Hey Whisper" Chat) - Width: 1 Column */}
            <GlassCard className={styles.bentoCard} isDark glowColor="lavender">
              <Sparkles size={24} style={{ color: 'var(--accent-lavender)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>Voice AI Assistant</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Acts like an embedded ChatGPT. Simply speak "Hey Whisper" to draft, reply, or generate agendas.</p>
              
              <div className={styles.heyWhisperChatPanel}>
                <div className={styles.chatMessageList}>
                  {whisperMessages.map((m, idx) => (
                    <div key={idx} className={`${styles.chatMsg} ${m.sender === 'user' ? styles.chatMsgUser : styles.chatMsgAI}`}>
                      <span className={styles.chatMsgSender}>{m.sender === 'user' ? "User Spoke" : "Whisper AI"}</span>
                      <p style={{ margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-line' }}>{m.text}</p>
                    </div>
                  ))}
                  {whisperLoading && <div className={styles.chatMsgAI} style={{ opacity: 0.6 }}><span>Whisper is drafting...</span></div>}
                </div>

                <div className={styles.heyWhisperPromptCapsules}>
                  <button onClick={() => runWhisperChat('email')} className={styles.chatPromptBtn}>"Draft follow-up email"</button>
                  <button onClick={() => runWhisperChat('agenda')} className={styles.chatPromptBtn}>"Write sync agenda"</button>
                  <button onClick={() => runWhisperChat('linkedin')} className={styles.chatPromptBtn}>"Write LinkedIn post"</button>
                </div>
              </div>
            </GlassCard>

            {/* Bento Card 3: Voice Workflow Automation (Notion Board) - Width: 2 Columns */}
            <GlassCard className={`${styles.bentoCard} ${styles.colSpan2}`} isDark glowColor="teal">
              <div className={styles.bentoCardInnerSplit}>
                <div style={{ flex: 1 }}>
                  <TrendingUp size={24} style={{ color: 'var(--accent-teal)', marginBottom: '1.25rem' }} />
                  <h4 style={{ color: 'var(--text-white)' }}>Voice Workflow Automation</h4>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Speak actual business actions to execute system commands directly. Turn vocal requests into actual project tickets instantly.</p>
                  
                  <div className={styles.automationTriggers}>
                    <button onClick={triggerNotionAutomation} className={styles.simActionButton} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mic size={14} /> Speak: "Create task in Notion"
                    </button>
                    {flyingTaskActive && <div className={styles.flyingTicketCard}>Deploy server build</div>}
                  </div>
                </div>

                <div className={styles.bentoNotionBoardMock}>
                  <div className={styles.notionHeader}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>📂 Mock Notion Kanban Board</span>
                  </div>
                  <div className={styles.notionColumns}>
                    <div className={styles.notionCol}>
                      <span className={styles.notionColTitle}>Todo ({notionTasks.length})</span>
                      <div className={styles.notionColList}>
                        {notionTasks.map((t, idx) => (
                          <div key={idx} className={styles.notionTaskCard}>{t}</div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.notionCol}>
                      <span className={styles.notionColTitle}>In Progress (1)</span>
                      <div className={styles.notionColList}>
                        <div className={styles.notionTaskCard}>Setup ONNX Inference</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Bento Card 4: Developer Mode (VS Code Editor) - Width: 1 Column */}
            <GlassCard className={styles.bentoCard} isDark glowColor="lavender">
              <FileCode size={24} style={{ color: 'var(--accent-lavender)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>Developer Mode</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.25rem' }}>Built specifically for Cursor, VS Code, and Windsurf, formatting variables, function names, and code syntax instantly from voice.</p>
              
              <div className={styles.devIdeMockContainer}>
                <div className={styles.mockWindowFrame}>
                  <div className={styles.mockDots}><div /><div /><div /></div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>Cursor IDE</span>
                </div>
                <div className={styles.devIdeCodeBlock}>
                  <span className={styles.devIdeLabel}>Spoke Naturally:</span>
                  <p style={{ fontStyle: 'italic', fontSize: '0.75rem', margin: '0.2rem 0 0.5rem', color: 'rgba(255,255,255,0.6)' }}>"create public async get inventory metadata"</p>
                  <span className={styles.devIdeLabel} style={{ color: 'var(--accent-lavender)' }}>Voice OS Finished Code:</span>
                  <pre style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--accent-lavender)', fontFamily: 'monospace' }}>
                    {"public async getInventoryMetadata(): Promise<Metadata> {}"}
                  </pre>
                </div>
              </div>
            </GlassCard>

            {/* Bento Card 5: Offline Privacy Mode (ONNX) - Width: 1 Column */}
            <GlassCard className={styles.bentoCard} isDark glowColor="teal">
              <Shield size={24} style={{ color: 'var(--accent-teal)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>Offline Privacy Mode</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.25rem' }}>Allow 100% offline local processing. Your voice never leaves your physical system bounds.</p>
              
              <div className={styles.onnxLogsSandbox}>
                <div className={styles.onnxTogglePane} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Local ONNX Engine:</span>
                  <button onClick={() => toggleOfflineMode(!offlineMode)} className={`${styles.onnxSwitch} ${offlineMode ? styles.onnxSwitchActive : ""}`}>
                    {offlineMode ? "ON" : "OFF"}
                  </button>
                </div>

                <div className={styles.onnxTerminalLogs}>
                  {onnxLogs.map((log, idx) => (
                    <div key={idx} className={styles.terminalLine}>{log}</div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Bento Card 6: Meeting Mode (Structural Parsers) - Width: 2 Columns */}
            <GlassCard className={`${styles.bentoCard} ${styles.colSpan2}`} isDark glowColor="lavender">
              <div className={styles.bentoCardInnerSplit}>
                <div style={{ flex: 1 }}>
                  <Cpu size={24} style={{ color: 'var(--accent-lavender)', marginBottom: '1.25rem' }} />
                  <h4 style={{ color: 'var(--text-white)' }}>Meeting Mode</h4>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Record multi-user sync conversations and auto-generate summaries, action checklists, and decision logs dynamically.</p>
                  
                  <button onClick={triggerMeetingMode} className={styles.simActionButton} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: meetingActive ? 'var(--accent-rose, #f43f5e)' : 'var(--accent-lavender)', boxShadow: '0 4px 15px rgba(220,198,246,0.2)' }}>
                    <Play size={12} /> {meetingActive ? "🔴 Recording Meeting..." : "Start Recording Meeting"}
                  </button>
                </div>

                <div className={styles.meetingSummaryBox}>
                  <span className={styles.hudBoxTag}>AUTOMATED MEETING STRUCTURER:</span>
                  {meetingActive ? (
                    <div className={styles.visualizerWaveLoop} style={{ border: '2px solid var(--accent-lavender)', boxShadow: '0 0 20px rgba(220,198,246,0.3)', margin: '1rem auto' }} />
                  ) : meetingSummaryReady ? (
                    <div className={styles.meetingOutputMarkdown}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--accent-lavender)' }}>📝 Product Alignment Summary</strong>
                      <p style={{ fontSize: '0.75rem', margin: '0.25rem 0', color: 'rgba(255,255,255,0.8)' }}>Discussed V2 release pipeline and Notion automation end points.</p>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--accent-lavender)' }}>✅ Action Items</strong>
                      <ul style={{ margin: '0.2rem 0', paddingLeft: '1rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                        <li>Verify ONNX latency bounds</li>
                        <li>Finalize CSS Spotlight modules</li>
                      </ul>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '1rem 0' }}>
                      Click record to capture structural summary presets...
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Bento Card 7: Voice Snippets, Team Knowledge & Relational Graph - Width: 1 Column */}
            <GlassCard className={styles.bentoCard} isDark glowColor="teal">
              <Users size={24} style={{ color: 'var(--accent-teal)', marginBottom: '1.25rem' }} />
              <h4 style={{ color: 'var(--text-white)' }}>Snippets & Team Memory</h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.25rem' }}>Expands macros instantly ("My calendar"), logs company vocabulary rules, and remembers previous relation threads.</p>
              
              <div className={styles.teamSnippetsSimulator}>
                <div className={styles.snippetsGlossary}>
                  <div className={styles.snippetItem}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Spoke Macro: "My calendar"</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 700 }}>➔ cal.com/whispertype/15min</span>
                  </div>
                  <div className={styles.snippetItem} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Spoke: "Reply to Sarah"</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 700 }}>➔ Resolving Acme Support lead context</span>
                  </div>
                </div>
              </div>
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
            <p>Slide metrics to see how WhisperType V2 alters your daily writing timelines.</p>
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
            <h2>Why WhisperType V2 Wins</h2>
            <p>A modern comparative experience outlining the technical edge of WhisperType V2 Voice OS.</p>
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

            {/* Card 3: WhisperType V2 */}
            <GlassCard className={styles.winsCard} glowColor="teal" style={{ borderColor: 'var(--accent-teal)', borderWidth: '2px' }}>
              <div className={styles.winsCardHeader}>
                <h4 className={styles.winsCardTitle} style={{ color: 'var(--accent-teal)' }}>WhisperType V2</h4>
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
