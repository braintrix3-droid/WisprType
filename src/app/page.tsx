"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Shield, Zap, Keyboard, Sparkles, Copy, Check, 
  HelpCircle, ChevronDown, Download, Apple, Monitor, Play, 
  Settings, Terminal, FileText, CheckCircle2, XCircle, ArrowRight,
  TrendingUp, Users, Plus, Trash2, Cpu, RefreshCw, Star, Mail, FileCode,
  DollarSign, Clock, CheckSquare, AlertTriangle, AlertCircle
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

  // --- NEW V3 STATES ---
  const [simStage, setSimStage] = useState<1 | 2 | 3>(1);
  const [simText, setSimText] = useState("");
  const [desireTab, setDesireTab] = useState<'email' | 'notes' | 'linkedin' | 'proposal' | 'support' | 'code'>('email');
  const [activeProfile, setActiveProfile] = useState<'founder' | 'agency' | 'sales' | 'developer' | 'consultant' | 'creator'>('founder');
  
  // --- NEW V3 SANDBOX STATES ---
  const [sandboxMode, setSandboxMode] = useState<'simulation' | 'live'>('simulation');
  const [liveCleanText, setLiveCleanText] = useState("");
  const [isLiveProcessing, setIsLiveProcessing] = useState(false);

  // --- V3 HERO LIVE WORKFLOW LOOP ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let typeInterval: NodeJS.Timeout;
    
    const runSim = () => {
      setSimStage(1);
      setSimText("");
      
      timer = setTimeout(() => {
        setSimStage(2);
        timer = setTimeout(() => {
          setSimStage(3);
          const emailText = "Hi Team,\n\nI have successfully finalized the demo of the V3 sales funnel upgrade. The local voice compiler and offline ONNX privacy engine are staging correctly. Let's launch this tonight!\n\nBest regards,\nSarah";
          let currentIdx = 0;
          const words = emailText.split(" ");
          
          typeInterval = setInterval(() => {
            setSimText(prev => {
              if (currentIdx < words.length) {
                const nextVal = prev ? prev + " " + words[currentIdx] : words[currentIdx];
                currentIdx++;
                return nextVal;
              } else {
                clearInterval(typeInterval);
                return prev;
              }
            });
          }, 120);
          
          timer = setTimeout(() => {
            runSim();
          }, 9000);
        }, 2200);
      }, 3200);
    };

    runSim();
    return () => {
      clearTimeout(timer);
      clearInterval(typeInterval);
    };
  }, []);

  const profileExamples = {
    founder: {
      title: "Founder / CEO",
      voice: "hey marcus send a quick investor update we just launched V3 checkout the dashboard",
      clean: "Hi Marcus,\n\nPlease draft and dispatch a brief investor update announcing that we have successfully launched WhisperType V3. Urge them to review the analytics on the dashboard.\n\nBest,\nSarah"
    },
    agency: {
      title: "Agency Owner",
      voice: "schedule proposal reviews for acme they liked the design but want the scope tweaked",
      clean: "Acme Corp | Proposal Review\n• Status: Loved design drafts but requested minor scope adjustments.\n• Action: Schedule follow-up scope review meeting."
    },
    sales: {
      title: "Sales Professional",
      voice: "just got off call with lead want demo next week send the contract outline",
      clean: "Lead Sync Action Items:\n1. Schedule comprehensive platform demo next Tuesday.\n2. Send over standard NDA and contract outline today."
    },
    developer: {
      title: "Software Engineer",
      voice: "create public async method get product stats returning database array",
      clean: "public async getProductStats(): Promise<ProductItem[]> {\n  return await this.db.products.find();\n}"
    },
    consultant: {
      title: "Management Consultant",
      voice: "outline deliverables for the performance optimization audit due next friday",
      clean: "### Deliverables Checklist\n- [ ] Complete performance audit roadmap findings\n- [ ] Staging pipeline latency verification list (due Friday)"
    },
    creator: {
      title: "Content Creator",
      voice: "make a quick post saying typing is dead voice to work is the future",
      clean: "🚀 Typing is officially a bottleneck. The future isn't speech-to-text; it's Voice to Work. Join the movement. 🎙️ #VoiceOS #AI #Productivity"
    }
  };

  const desireExamples = {
    email: {
      voice: "draft a follow up email saying we got the specs and want a sync next week",
      clean: "Hi Team,\n\nI confirm we have successfully received all project specifications. Let's schedule a brief sync next week to align on details.\n\nBest regards,\n[My Name]"
    },
    notes: {
      voice: "met with lead marcus loved the privacy mode wants contract on monday",
      clean: "### Lead Sync: Marcus\n- **Feedback**: Loved offline local privacy features.\n- **Action Item**: Deliver NDA and contract outline on Monday."
    },
    linkedin: {
      voice: "voice operating systems are going to replace standard typing completely",
      clean: "🚀 Typing is officially a bottleneck. The future of productivity isn't speech-to-text; it's Voice to Work. 🎙️ #Productivity #AI #SaaS"
    },
    proposal: {
      voice: "outline pricing strategy audit due next week and resource scope targets",
      clean: "### Project Deliverables\n- [ ] Finalize pricing strategy audit report (due next week)\n- [ ] Audit resource target scoping matrices"
    },
    support: {
      voice: "sorry about the delay the offline helper is now active you can download it",
      clean: "Hi Marcus,\n\nI apologize for the delay. The offline launcher helper is now active. You may download it directly from your control dashboard.\n\nBest,\nSupport Team"
    },
    code: {
      voice: "create async function fetch target node items mapping inputs",
      clean: "async fetchTargetNodeItems(nodeId: string): Promise<NodeItem[]> {\n  return await this.api.get(`/nodes/${nodeId}`);\n}"
    }
  };

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

  // --- Live Sandbox Dictation Helpers ---
  const cleanLiveSpeechText = (raw: string, tab: string) => {
    let text = raw.trim();
    if (!text) return "";

    // 1. Backtracking stutters cleaner: "meet at 2... actually 3" -> "meet at 3"
    text = text.replace(/(\b\w+)\b\.{2,3}\s*actually\s*(\b\w+)\b/gi, '$2');
    text = text.replace(/(\b\w+)\b\s+actually\s+(\b\w+)\b/gi, '$2');

    // 2. Erase filler words (um, uh, like, you know)
    text = text.replace(/\b(um|uh|like|you\s+know|ah)\b/gi, '');
    text = text.replace(/\s+/g, ' ').trim();

    // 3. Format based on selected app-awareness tab
    if (tab === 'email') {
      return `Hi Team,\n\nI wanted to follow up regarding: "${text}". Let's align on next steps.\n\nBest regards,\n[My Name]`;
    } else if (tab === 'notes') {
      return `### Action Items & Sync Notes\n- [ ] Verify focus target: "${text}"\n- [ ] Compile local schemas\n- [ ] Update pipeline triggers`;
    } else if (tab === 'linkedin') {
      return `🚀 SHIP FAST OR GET LEFT BEHIND.\n\nHere is how we resolved voice intent today:\n👉 "${text}"\n\nNo stutters. Direct caret placement. 100% offline.\n\n#AI #VoiceOS #SaaS`;
    } else if (tab === 'code') {
      const cleanWord = text.replace(/[^a-zA-Z0-9\s]/g, "");
      const camelCased = cleanWord.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '');
      return `public async ${camelCased || "getUserSession"}() {\n  return await this.db.resolveIntent();\n}`;
    } else if (tab === 'proposal') {
      return `### Project Proposal & Specs\n- **Core Intent**: ${text}\n- **Delivery Target**: Immediate deployment\n- **Privacy**: Local secure ONNX buffer`;
    } else if (tab === 'support') {
      return `Hi there,\n\nThank you for reaching out! Regarding your concern: "${text}", our engineering team has flagged this and is resolving it. Let us know if you need anything else.\n\nWhisperType Support`;
    }
    
    return text;
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
    setLiveCleanText("");
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

  // Real-time voice processing simulation effect
  useEffect(() => {
    if (!isRecording && (transcript || interimText)) {
      setIsLiveProcessing(true);
      setLiveCleanText("");
      const timer = setTimeout(() => {
        setIsLiveProcessing(false);
        const raw = transcript || interimText;
        const cleaned = cleanLiveSpeechText(raw, desireTab);
        setLiveCleanText(cleaned);
      }, 950);
      return () => clearTimeout(timer);
    }
  }, [isRecording, transcript, interimText, desireTab]);

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
      q: "Will it understand my accent?",
      a: "Yes. WhisperType V2 utilizes locally quantized, high-accuracy weights optimized to map regional accents and resolve words through custom dictionary rules, entirely offline."
    },
    {
      q: "Can I use it inside Gmail?",
      a: "Absolutely. As a native global AI Voice Operating System, it hooks directly into your cursor caret, functioning perfectly within Gmail, Slack, Cursor IDE, Notion, HubSpot, or any browser text field."
    },
    {
      q: "What about privacy?",
      a: "WhisperType operates completely on-device. Zero cloud packets, zero servers, and zero remote databases are used. Your voice recordings and transcripts remain entirely within your hardware bounds."
    },
    {
      q: "Does it work for coding?",
      a: "Yes. Developer Mode maps spoken programming prompts into clean TypeScript variables and casing standards (like camelCase formatting) matching VS Code and Cursor environments."
    },
    {
      q: "How accurate is it?",
      a: "By feeding speech through our 5-layered intelligence pipeline—erasing stutters, stripping filler words, and resolving verbal backtracking ('meet at 2... actually 3')—you get 99.4% finished-work precision."
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
      {/* ABOVE THE FOLD - HERO SECTION (Aspirational Funnel Redesign) */}
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
                <Sparkles size={13} /> AI Voice Operating System v3.0
              </div>
              <h1 className={styles.heroHeadline}>
                Speak Naturally. <br />
                <span className="text-gradient">Ship Faster.</span>
              </h1>
              <p className={styles.heroSubheadline}>
                Turn ideas into finished emails, messages, documents, code, and tasks using the world's smartest AI voice workflow. Stop typing, start flowing.
              </p>
              <div className={styles.heroCTAButtons}>
                <Button variant="primary" onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span>Get Voice OS Free</span>
                </Button>
                <Button variant="secondary" onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span>Watch Demo</span>
                </Button>
              </div>
            </motion.div>
 
            {/* Right: Live Looping Workflow Simulation HUD */}
            <motion.div 
              className={styles.heroRight}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard className={styles.dictationWindowCard} glowColor="teal">
                {/* Spotlight Header Bar */}
                <div className={styles.spotlightHeaderBar}>
                  <Terminal size={16} className={styles.spotlightTerminalIcon} />
                  <span className={styles.spotlightPlaceholder}>WhisperType Voice OS Spotlight</span>
                  <div className={styles.spotlightShortcutBadge}>Ctrl + Win</div>
                </div>

                {/* Simulated Steps Monitor */}
                <div className={styles.hudActivityMonitor} style={{ marginBottom: '1.25rem' }}>
                  <div className={styles.monitorStat}>
                    <span className={styles.monitorLabel}>Pipeline Stage:</span>
                    <strong className={styles.monitorVal} style={{ color: simStage === 3 ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                      {simStage === 1 && "🎙️ 1. Capturing Speech"}
                      {simStage === 2 && "⚡ 2. Resolving Intent"}
                      {simStage === 3 && "✓ 3. Flowing Finished Work"}
                    </strong>
                  </div>
                  <div className={styles.monitorStat}>
                    <span className={styles.monitorLabel}>Intent Resolved:</span>
                    <strong className={styles.monitorVal} style={{ color: 'var(--accent-teal)' }}>
                      {simStage === 1 ? "Listening..." : simStage === 2 ? "Outlining..." : "Outreach Email"}
                    </strong>
                  </div>
                </div>

                <div className={styles.cardInnerContent}>
                  {/* Waveform Visualizer */}
                  <div className={styles.heroWaveformWrapper} style={{ marginTop: '0rem', marginBottom: '1.25rem' }}>
                    {waveHeights.map((h, i) => (
                      <div 
                        key={i} 
                        className={`${styles.heroWaveBar} ${simStage === 1 ? styles.heroWaveActive : ""}`}
                        style={{ 
                          height: simStage === 1 ? `${Math.max(6, Math.floor(Math.random() * 32 + 6))}px` : '6px',
                          transition: 'height 0.08s ease'
                        }}
                      />
                    ))}
                  </div>

                  {/* Visual processing spinner in Stage 2 */}
                  <div style={{ height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {simStage === 2 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Compiling stutters & casing formats...</span>
                      </div>
                    )}
                  </div>

                  {/* Real-time Text Box (Transformation Showcase) */}
                  <div className={styles.hudPlaygroundGrid} style={{ marginTop: '0.5rem' }}>
                    <div className={styles.hudSpeechBox} style={{ background: simStage === 1 ? 'rgba(0,183,255,0.02)' : 'rgba(255,255,255,0.01)' }}>
                      <span className={styles.hudBoxTag}>User Spoke Naturally (Stage 1):</span>
                      <p className={styles.hudRawSpeechText}>
                        {simStage >= 1 ? '"draft a follow up email for the client... actually team loved the V3 deep blue proposal let\'s ship this"' : 'Waiting...'}
                      </p>
                    </div>
                    
                    <div className={styles.hudResultBox} style={{ border: simStage === 3 ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.08)' }}>
                      <span className={styles.hudBoxTag} style={{ color: 'var(--accent-cyan)' }}>Voice OS Finished Work (Stage 3):</span>
                      <div className={styles.hudCleanOutputBox}>
                        {simStage === 3 && simText ? (
                          <>
                            <span style={{ whiteSpace: 'pre-line', color: 'var(--accent-cyan)' }}>{simText}</span>
                          </>
                        ) : (
                          <span className={styles.heroPlaceholder}>
                            {simStage === 1 && "Capturing spoken audio stream..."}
                            {simStage === 2 && "Synthesizing tone context..."}
                          </span>
                        )}
                        <span className={styles.speedCursor} style={{ background: 'var(--accent-cyan)', height: '1.1rem', width: '2px', display: 'inline-block', marginLeft: '2px', verticalAlign: 'middle' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SOCIAL PROOF STRIP (Immediate Hero Trust Multiplier) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.socialProofStrip} style={{ background: 'var(--bg-secondary)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '2.5rem 0', overflow: 'hidden' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '1.5rem' }}>
            Trusted by modern builders worldwide
          </p>
          <div className="marquee-container">
            <div className="marquee-content" style={{ gap: '4rem' }}>
              {["FOUNDERS", "DEVELOPERS", "AGENCIES", "CONSULTANTS", "REMOTE TEAMS", "DESIGNERS", "ENGINEERS", "WRITERS"].map((logo, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                  <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>{logo}</span>
                </div>
              ))}
              {/* Duplicate array for infinite loop effect */}
              {["FOUNDERS", "DEVELOPERS", "AGENCIES", "CONSULTANTS", "REMOTE TEAMS", "DESIGNERS", "ENGINEERS", "WRITERS"].map((logo, idx) => (
                <div key={`dup-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                  <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>{logo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* PAIN SECTION: Typing Is Slower Than Thinking (Emotional Sell) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.productInActionSection} style={{ background: 'var(--bg-primary)', padding: '9rem 0' }}>
        <div className="container">
          <div className={styles.actionHeader} style={{ marginBottom: '6rem' }}>
            <span className={styles.layersBadge} style={{ background: 'rgba(244,63,94,0.08)', borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}>The Typing Bottleneck</span>
            <h2 className={styles.darkHeadline}>Typing Is Slower Than Thinking</h2>
            <p className={styles.darkSubheadline}>Your brain operates at 150+ thoughts per minute, but your fingers limit your output to 40 WPM. Manual input causes mental fatigue, friction, and context switching.</p>
          </div>

          <div className={styles.speedSplitGrid} style={{ maxWidth: '1100px' }}>
            {/* The Typing Friction Card */}
            <GlassCard className={styles.speedCard} style={{ borderColor: 'rgba(244,63,94,0.15)', boxShadow: '0 0 40px rgba(244,63,94,0.02)' }}>
              <div>
                <span className={styles.speedBadge} style={{ background: 'rgba(244,63,94,0.08)', borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}>Keyboard Input</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '1.5rem 0 0.5rem', color: 'var(--text-primary)' }}>The Keyboard Friction Flow</h4>
              </div>
              <div style={{ margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.7 }}>
                    <AlertTriangle size={15} color="var(--accent-rose)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Interruption</strong>: Stutter, type, delete, retype</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.7 }}>
                    <AlertCircle size={15} color="var(--accent-rose)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Context Switching</strong>: Format headers, fix stutters</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.7 }}>
                    <XCircle size={15} color="var(--accent-rose)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Friction</strong>: Finger fatigue and cognitive lag</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-rose)' }}>Bottleneck: 45 Words Per Minute</div>
            </GlassCard>

            {/* The Voice Flow Card */}
            <GlassCard className={styles.speedCard} style={{ borderColor: 'rgba(0,183,255,0.25)', boxShadow: '0 0 50px rgba(0,183,255,0.1)' }}>
              <div>
                <span className={styles.speedBadge}>Voice OS Input</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '1.5rem 0 0.5rem', color: 'var(--text-primary)' }}>The Voice Momentum Flow</h4>
              </div>
              <div style={{ margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={15} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}><strong>Flow</strong>: Say it naturally without stopping</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckSquare size={15} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}><strong>Momentum</strong>: Speech maps straight to action</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Zap size={15} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}><strong>Output</strong>: Polished, formatted, complete work</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>Momentum: 150+ Words Per Minute</div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* DESIRE SECTION: Imagine Finishing An Hour Of Writing In 15 Min (Transformation) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.productInActionSection} style={{ background: 'var(--bg-secondary)', padding: '9rem 0' }} id="playground">
        <div className="container">
          <div className={styles.actionHeader} style={{ marginBottom: '5rem' }}>
            <span className={styles.layersBadge}>Real Transformation</span>
            <h2 className={styles.darkHeadline}>Finish An Hour of Writing in 15 Minutes</h2>
            <p className={styles.darkSubheadline}>See how casual, naturally spoken thoughts instantly transform into formatted documents, messages, database notes, and functional code buffers.</p>
          </div>

          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Sandbox Mode Toggle Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <button 
                onClick={() => setSandboxMode('simulation')} 
                className={`${styles.contextTabBtn} ${sandboxMode === 'simulation' ? styles.contextTabBtnActive : ""}`}
                style={{ padding: '0.6rem 2rem', fontSize: '0.8rem', borderRadius: '9999px', minWidth: '180px' }}
              >
                🖥️ Product Simulation
              </button>
              <button 
                onClick={() => setSandboxMode('live')} 
                className={`${styles.contextTabBtn} ${sandboxMode === 'live' ? styles.contextTabBtnActive : ""}`}
                style={{ padding: '0.6rem 2rem', fontSize: '0.8rem', borderRadius: '9999px', minWidth: '180px' }}
              >
                🎙️ Test Live Mic OS
              </button>
            </div>

            {/* CASE 1: Simulation Mode (Static funnel outlines) */}
            {sandboxMode === 'simulation' && (
              <>
                {/* Custom desire tabs */}
                <div className={styles.contextTabsGrid} style={{ gridTemplateColumns: 'repeat(6, 1fr)', marginBottom: '2.5rem' }}>
                  {[
                    { id: 'email', label: 'Outreach Email' },
                    { id: 'notes', label: 'Meeting Notes' },
                    { id: 'linkedin', label: 'LinkedIn Post' },
                    { id: 'proposal', label: 'Proposal Outline' },
                    { id: 'support', label: 'Client Support' },
                    { id: 'code', label: 'Code Prompt' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDesireTab(tab.id as any)}
                      className={`${styles.contextTabBtn} ${desireTab === tab.id ? styles.contextTabBtnActive : ""}`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Display panel */}
                <GlassCard className={styles.dictationWindowCard} style={{ padding: '3rem' }}>
                  <div className={styles.hudPlaygroundGrid} style={{ gridTemplateColumns: '1fr 1.1fr', gap: '3rem', alignItems: 'start' }}>
                    <div style={{ textAlign: 'left' }}>
                      <span className={styles.hudBoxTag}>WHAT YOU SPELL / SPEAK:</span>
                      <p style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '1rem 0' }}>
                        "{desireExamples[desireTab].voice}"
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2rem' }}>
                        💡 No formatting commands, no punctuation triggers, no cloud latency bounds.
                      </span>
                    </div>
                    
                    <div style={{ textAlign: 'left', borderLeft: '1px dashed rgba(255,255,255,0.08)', paddingLeft: '3rem' }}>
                      <span className={styles.hudBoxTag} style={{ color: 'var(--accent-cyan)' }}>WHISPERTYPE V2 FINISHED WORK:</span>
                      <pre style={{ margin: '1rem 0 0', padding: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {desireExamples[desireTab].clean}
                      </pre>
                    </div>
                  </div>
                </GlassCard>
              </>
            )}

            {/* CASE 2: Live Voice Testing Sandbox Mode */}
            {sandboxMode === 'live' && (
              <GlassCard className={styles.dictationWindowCard} style={{ padding: '3rem', border: '1px solid rgba(0, 183, 255, 0.25)', boxShadow: '0 0 50px rgba(0, 183, 255, 0.08)' }}>
                <div className={styles.hudPlaygroundGrid} style={{ gridTemplateColumns: '1fr 1.1fr', gap: '3rem', alignItems: 'start' }}>
                  <div style={{ textAlign: 'left' }}>
                    <span className={styles.hudBoxTag}>LIVE VOICE TESTING PLAYGROUND:</span>
                    
                    {speechError && (
                      <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--accent-rose)', fontSize: '0.8rem', margin: '1rem 0' }}>
                        ⚠️ {speechError}
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          style={{
                            background: isRecording ? 'var(--accent-rose)' : 'rgba(0, 183, 255, 0.1)',
                            border: isRecording ? '1px solid rgba(244,63,94,0.4)' : '1px solid rgba(0, 183, 255, 0.3)',
                            boxShadow: isRecording ? '0 0 25px rgba(244,63,94,0.4)' : '0 0 15px rgba(0, 183, 255, 0.15)',
                            color: '#fff',
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {isRecording ? (
                            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '2px' }} />
                          ) : (
                            <Mic size={24} style={{ color: 'var(--accent-cyan)' }} />
                          )}
                        </button>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                            {isRecording ? "Recording Audio..." : "Click Mic & Start Speaking"}
                          </h4>
                          <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isRecording ? `Timer: ${recordingTime}s (Hold-to-Talk Simulation)` : "Captures raw voice natively inside browser"}
                          </p>
                        </div>
                      </div>

                      {/* Real-time wave indicators when recording */}
                      {isRecording && (
                        <div style={{ display: 'flex', gap: '4px', height: '24px', alignItems: 'center' }}>
                          {Array.from({ length: 18 }).map((_, idx) => (
                            <div 
                              key={idx}
                              style={{
                                width: '3px',
                                height: `${Math.max(6, Math.floor(Math.random() * 24 + 4))}px`,
                                background: 'var(--accent-cyan)',
                                borderRadius: '99px',
                                transition: 'all 0.1s ease'
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Formatter context selector */}
                      <div style={{ marginTop: '0.75rem' }}>
                        <span className={styles.hudBoxTag} style={{ marginBottom: '0.5rem', display: 'block' }}>APP FORMATTING CONTEXT:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {[
                            { id: 'email', label: 'Gmail (Email)' },
                            { id: 'notes', label: 'Notion (MD Notes)' },
                            { id: 'linkedin', label: 'LinkedIn (Social)' },
                            { id: 'code', label: 'Cursor (Coding)' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setDesireTab(opt.id as any)}
                              style={{
                                padding: '0.45rem 1rem',
                                borderRadius: '9999px',
                                fontSize: '0.7rem',
                                background: desireTab === opt.id ? 'rgba(0, 183, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                                border: desireTab === opt.id ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.05)',
                                color: desireTab === opt.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'left', borderLeft: '1px dashed rgba(255,255,255,0.08)', paddingLeft: '3rem', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className={styles.hudBoxTag}>RAW VOICE CAPTURE:</span>
                      <div style={{ margin: '0.75rem 0 1.5rem', minHeight: '60px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                        {transcript || interimText ? (
                          <span>"{transcript} <span style={{ color: 'rgba(255,255,255,0.3)' }}>{interimText}</span>"</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>"Speak something to see raw stutters capture..."</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className={styles.hudBoxTag} style={{ color: 'var(--accent-cyan)' }}>WHISPERTYPE V3 POLISHED WORK:</span>
                      <pre style={{ margin: '0.75rem 0 0', padding: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap', lineHeight: 1.6, minHeight: '110px' }}>
                        {isLiveProcessing ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Resolving stutters and casing guidelines...</span>
                          </span>
                        ) : liveCleanText ? (
                          liveCleanText
                        ) : (
                          <span style={{ color: 'rgba(0, 183, 255, 0.4)' }}>
                            {isRecording ? "Waiting for you to click stop..." : "Cleaned output will render here instantly."}
                          </span>
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* "WRITES FASTER IN EVERY APP" - Orbiting Icons Section */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.productInActionSection} style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className={styles.actionHeader}>
            <h2 className={styles.darkHeadline}>Writes Faster In Every App You Already Use</h2>
            <p className={styles.darkSubheadline}>WhisperType V2 works everywhere your cursor lands. Seamlessly types code, documents, and communication logs.</p>
          </div>

          <div className={styles.orbitContainer} style={{ marginTop: '2rem' }}>
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
      {/* "4X FASTER THAN TYPING" - Productivity counters */}
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
                <span className={styles.speedBadge} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>Before</span>
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
                <span className={styles.speedCounter} style={{ color: 'var(--accent-cyan)' }}>{afterWpm} WPM</span>
              </div>
              <div className={styles.speedBody}>
                <p className={styles.speedText} style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>{afterText}<span className={styles.speedCursor} style={{ background: 'var(--accent-cyan)' }} /></p>
              </div>
              <div className={styles.speedCardFooter} style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>WhisperType V2 Voice OS</div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* VOICE INTELLIGENCE: The Intelligence Layer Behind Every Word */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.intelligenceLayersSection} id="features">
        <div className="container">
          <div className={styles.layersHeader}>
            <span className={styles.layersBadge}>Proprietary Stack Architecture</span>
            <h2>The Intelligence Layer Behind Every Word</h2>
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
      {/* USP SECTION: Why WhisperType Feels Different */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.bentoSection}>
        <div className="container">
          <div className={styles.bentoHeader}>
            <span className={styles.layersBadge}>Designed For Outcomes</span>
            <h2 className={styles.darkHeadline}>Why WhisperType Feels Different</h2>
            <p className={styles.darkSubheadline}>WhisperType is not another dictation app. It's a complete voice workflow system built to map spoken thoughts directly to finished actions.</p>
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
      {/* "WHO IS THIS FOR?" (Interactive Profile Matrices) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.productInActionSection} style={{ background: 'var(--bg-secondary)', padding: '9rem 0' }}>
        <div className="container">
          <div className={styles.actionHeader} style={{ marginBottom: '5rem' }}>
            <span className={styles.layersBadge}>User Segment Matrices</span>
            <h2 className={styles.darkHeadline}>Who Is WhisperType For?</h2>
            <p className={styles.darkSubheadline}>Select your professional segment profile to see realistic vocal triggers converting directly into finished work.</p>
          </div>

          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Interactive Profiles Grid */}
            <div className={styles.howHorizontalGrid} style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
              {[
                { id: 'founder', title: 'Founder' },
                { id: 'agency', title: 'Agency Owner' },
                { id: 'sales', title: 'Sales Rep' },
                { id: 'developer', title: 'Developer' },
                { id: 'consultant', title: 'Consultant' },
                { id: 'creator', title: 'Creator' }
              ].map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => setActiveProfile(prof.id as any)}
                  className={`${styles.layerSelectorBtn} ${activeProfile === prof.id ? styles.layerSelectorBtnActive : ""}`}
                  style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.5rem' }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{prof.title}</span>
                </button>
              ))}
            </div>

            {/* Profile sandbox */}
            <GlassCard className={styles.dictationWindowCard} style={{ padding: '3rem' }}>
              <div className={styles.hudPlaygroundGrid} style={{ gridTemplateColumns: '1fr 1.1fr', gap: '3rem', alignItems: 'start' }}>
                <div style={{ textAlign: 'left' }}>
                  <span className={styles.hudBoxTag} style={{ color: 'var(--accent-cyan)' }}>{profileExamples[activeProfile].title} Vocal Phrase:</span>
                  <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '1rem 0' }}>
                    "{profileExamples[activeProfile].voice}"
                  </p>
                </div>
                
                <div style={{ textAlign: 'left', borderLeft: '1px dashed rgba(255,255,255,0.08)', paddingLeft: '3rem' }}>
                  <span className={styles.hudBoxTag}>FINISHED WORK PRODUCTIVITY OUTCOME:</span>
                  <pre style={{ margin: '1rem 0 0', padding: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {profileExamples[activeProfile].clean}
                  </pre>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SAVINGS DASHBOARD SECTION (Financial impact panels) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.calculatorSection}>
        <div className="container">
          <div className={styles.calculatorHeader}>
            <span className={styles.layersBadge}>SaaS Telemetry Dashboard</span>
            <h2>Calculate Your Financial Output Impact</h2>
            <p>Slide metrics to calculate how mapping voice straight to finished work alters your daily writing financial timelines.</p>
          </div>

          <div className={styles.calculatorCardContainer}>
            <GlassCard className={styles.premiumCalculatorCard} glowColor="teal">
              <div className={styles.calculatorSplitGrid}>
                {/* Sliders */}
                <div className={styles.slidersBlock}>
                  <div className={styles.sliderWidget}>
                    <div className={styles.sliderLabels}>
                      <span>Daily Spoken / Written Output</span>
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
                      <span>Keyboard Typing WPM Speed</span>
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
                      <span>Spoken Value Value Rate</span>
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
                      <h4 className={styles.dashCardVal} style={{ color: 'var(--accent-cyan)' }}>{productivityMultiplier.toFixed(1)}x</h4>
                      <p className={styles.dashCardSub}>faster than standard typing</p>
                    </div>

                    <div className={styles.dashCard}>
                      <span className={styles.dashCardTitle}>Emails Completed</span>
                      <h4 className={styles.dashCardVal} style={{ color: 'var(--accent-cyan)' }}>~{emailsEquivalent}</h4>
                      <p className={styles.dashCardSub}>drafted at thought speed</p>
                    </div>

                    <div className={styles.dashCard}>
                      <span className={styles.dashCardTitle}>Meetings Reduced</span>
                      <h4 className={styles.dashCardVal} style={{ color: 'var(--accent-cyan)' }}>-{Math.floor(hoursSaved / 2)} hrs</h4>
                      <p className={styles.dashCardSub}>wasted sync alignment</p>
                    </div>
                  </div>

                  <div className={styles.dashFinancialCard}>
                    <span>Monthly Financial Value Recovered</span>
                    <h3 className={styles.dashFinancialVal}>${moneySaved.toLocaleString(undefined, {maximumFractionDigits: 0})} / mo</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Projected revenue impact on daily transcription workloads</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* "NOT ANOTHER DICTATION TOOL" - Benchmark Comparison Cards */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.winsComparisonSection}>
        <div className="container">
          <div className={styles.comparisonHeader}>
            <span className={styles.layersBadge}>Direct Benchmarks</span>
            <h2>Not Another Dictation Tool</h2>
            <p>See why mapping natural speech to complete workflows outperforms traditional typing and basic STT tools.</p>
          </div>

          <div className={styles.winsGrid}>
            {/* Card 1: Keyboard Typing */}
            <GlassCard className={styles.winsCard} glowColor="none">
              <h4 className={styles.winsCardTitle} style={{ color: 'var(--text-secondary)' }}>1. Keyboard Typing</h4>
              <p className={styles.winsCardDesc}>Highly manual, slow physical typing bottlenecked by key caps.</p>
              
              <ul className={styles.winsChecklist}>
                <li><XCircle size={15} color="var(--accent-rose)" /> Slower 40 Words Per Minute</li>
                <li><XCircle size={15} color="var(--accent-rose)" /> Severe Finger & Hand Fatigue</li>
                <li><XCircle size={15} color="var(--accent-rose)" /> Interrupted mental context flow</li>
                <li><XCircle size={15} color="var(--accent-rose)" /> No app-aware casing structures</li>
                <li><XCircle size={15} color="var(--accent-rose)" /> Manual copy pasting across tabs</li>
              </ul>
            </GlassCard>

            {/* Card 2: Traditional Dictation */}
            <GlassCard className={styles.winsCard} glowColor="none">
              <h4 className={styles.winsCardTitle} style={{ color: 'var(--text-secondary)' }}>2. Traditional Dictation</h4>
              <p className={styles.winsCardDesc}>Cloud-dependent STT engines that output messy raw streams.</p>
              
              <ul className={styles.winsChecklist}>
                <li><CheckCircle2 size={15} color="var(--accent-cyan)" /> 150 WPM Speaking speed</li>
                <li><XCircle size={15} color="var(--accent-rose)" /> Um/ah stutters left in output</li>
                <li><XCircle size={15} color="var(--accent-rose)" /> No backspace speech undo correction</li>
                <li><XCircle size={15} color="var(--accent-rose)" /> No offline database persistence</li>
                <li><XCircle size={15} color="var(--accent-rose)" /> No developer coding formats</li>
              </ul>
            </GlassCard>

            {/* Card 3: WhisperType V2 AI Voice OS */}
            <GlassCard className={styles.winsCard} glowColor="teal" style={{ borderColor: 'var(--accent-cyan)', borderWidth: '2px' }}>
              <div className={styles.winsCardHeader} style={{ marginBottom: '1rem' }}>
                <h4 className={styles.winsCardTitle} style={{ color: 'var(--accent-cyan)' }}>3. WhisperType V2 OS</h4>
                <span className={styles.winsBadge}>Recommended</span>
              </div>
              <p className={styles.winsCardDesc}>A highly advanced local AI OS that erases friction entirely.</p>
              
              <ul className={styles.winsChecklist}>
                <li><CheckCircle2 size={15} color="var(--accent-cyan)" /> 100% Offline Local ONNX engine</li>
                <li><CheckCircle2 size={15} color="var(--accent-cyan)" /> Automatic stutters striking & cleanup</li>
                <li><CheckCircle2 size={15} color="var(--accent-cyan)" /> Backtrack correcting ("meet at 2... 3")</li>
                <li><CheckCircle2 size={15} color="var(--accent-cyan)" /> App-aware Slack, Notion, Cursor casing</li>
                <li><CheckCircle2 size={15} color="var(--accent-cyan)" /> Flying Notion task workflow trigger</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* WORKFLOW TIMELINE: Horizontal Journey Pipeline */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.howItWorksSection} id="how-it-works">
        <div className="container">
          <div className={styles.howHeader}>
            <span className={styles.layersBadge}>Pipeline Flow</span>
            <h2 className={styles.darkHeadline}>Horizontal Pipeline Journey</h2>
            <p className={styles.darkSubheadline}>WhisperType converts spoken thought to finished work in four organic stages.</p>
          </div>

          <div className={styles.howHorizontalGrid}>
            {[
              { step: "01", title: "Voice Capture", desc: "Hold global shortcut (Caps Lock) and speak naturally without manual punctuation rules." },
              { step: "02", title: "AI Cleanup", desc: "Quantized Whisper weights erase stutters, strike stumbles, and correct backtracks." },
              { step: "03", title: "Refinement Engine", desc: "Context resolvers format casing (camelCase inside Cursor, Markdown inside Notion)." },
              { step: "04", title: "Finished Output", desc: "Work maps straight to your caret target carets. Auto-pastes and triggers Notion tickets." }
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
      {/* TESTIMONIALS SECTION (Outcome-focused premium wall) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className={styles.testimonialsHeader}>
            <span className={styles.layersBadge}>Success Metrics</span>
            <h2 className={styles.darkHeadline}>Love Letters To WhisperType V2</h2>
            <p className={styles.darkSubheadline}>Hear how software architects, agency owners, and product executives boosted daily output with voice OS pipelines.</p>
          </div>
        </div>

        {/* Auto Scrolling Marquee Wall */}
        <div className="marquee-container">
          <div className="marquee-content">
            {[
              { name: "Sarah K.", role: "Senior Developer at Cursor AI", quote: "Auto-camelCasing variable speech is a massive game-changer. I dictate-code 2,000+ lines inside Cursor every day." },
              { name: "David L.", role: "Founder & CEO, Crelix SaaS", quote: "No cloud lag, and 100% offline privacy means my confidential client briefs never trigger cloud server flags." },
              { name: "James M.", role: "Creative Director, Flow Agency", quote: "Typing bottlenecks are completely history. I finish proposals and support tickets in under 15 minutes now." },
              { name: "Elena R.", role: "SaaS Marketer at Linear", quote: "Hey Whisper AI Assistant is pure magic. I dictate raw copy drafts and watch them stream into polished emails instantly." },
              { name: "Marcus P.", role: "Support Director at Acme Support", quote: "Automatic backtrack correcting resolves stumbles. Strips filler words so customer Slack updates read perfectly." }
            ].map((t, i) => (
              <GlassCard key={i} className={styles.testimonialMarqueeCard} isDark glowColor="teal">
                <div className={styles.tHeader}>
                  <div className={styles.tAvatar}>{t.name[0]}</div>
                  <div>
                    <h5 style={{ color: 'var(--text-white)', fontWeight: 700 }}>{t.name}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.role}</span>
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
      {/* OBJECTION HANDLING (Animated FAQ Accordion) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.productInActionSection} style={{ background: 'var(--bg-primary)', padding: '9rem 0' }} id="faq">
        <div className="container">
          <div className={styles.actionHeader} style={{ marginBottom: '5rem' }}>
            <span className={styles.layersBadge}>Secret Objections</span>
            <h2 className={styles.darkHeadline}>Questions You Secretly Have</h2>
            <p className={styles.darkSubheadline}>Get clear, technical answers to major structural concerns regarding offline latency, accent support, and database integrators.</p>
          </div>

          <div className={styles.faqMatrixGrid}>
            {faqData.map((faq, idx) => (
              <div 
                key={idx} 
                className={`${styles.faqItem} ${openFaq === idx ? styles.faqItemActive : ""}`}
              >
                <button 
                  className={styles.faqTrigger}
                  onClick={() => toggleFaq(idx)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`${styles.faqIcon} ${openFaq === idx ? styles.faqIconActive : ""}`} />
                </button>
                <div className={`${styles.faqContent} ${openFaq === idx ? styles.faqContentActive : ""}`}>
                  <div className={styles.faqInner}>
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* OFFER SECTION: Pricing Cards Side-by-Side (New Section) */}
      {/* ------------------------------------------------------------------------- */}
      <section className={styles.calculatorSection} style={{ background: 'var(--bg-secondary)' }} id="pricing">
        <div className="container">
          <div className={styles.calculatorHeader} style={{ marginBottom: '5rem' }}>
            <span className={styles.layersBadge}>SaaS Pricing</span>
            <h2>Start Writing At The Speed Of Thought</h2>
            <p>Get started completely free. Upgrade to Pro when you are ready to supercharge multi-app automation pipelines.</p>
          </div>

          <div className={styles.speedSplitGrid} style={{ maxWidth: '1000px' }}>
            {/* Free Plan Card */}
            <GlassCard className={styles.speedCard} style={{ padding: '3.5rem 3rem' }}>
              <div>
                <span className={styles.speedBadge} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}>Free Plan</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '2rem 0 1rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>$0</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ forever</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '2.5rem' }}>
                  Perfect for local offline dictation stutters stripping on a single carets interface.
                </p>
                <ul className={styles.winsChecklist} style={{ gap: '1rem', marginBottom: '3rem' }}>
                  <li><Check size={14} color="var(--accent-cyan)" /> 100% Offline ONNX local compiler</li>
                  <li><Check size={14} color="var(--accent-cyan)" /> Automatic stutters striking</li>
                  <li><Check size={14} color="var(--accent-cyan)" /> Backtrack voice correcting</li>
                  <li><Check size={14} color="var(--accent-cyan)" /> Local jargon dictionary (5 inputs)</li>
                </ul>
              </div>
              <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Download Free Helper</span>
              </Button>
            </GlassCard>

            {/* Pro Plan Card */}
            <GlassCard className={styles.speedCard} style={{ padding: '3.5rem 3rem', borderColor: 'var(--accent-cyan)', borderWidth: '2px', boxShadow: '0 0 50px rgba(0,183,255,0.12)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.speedBadge}>Pro Plan</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, background: 'rgba(0,183,255,0.15)', color: 'var(--accent-cyan)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,183,255,0.25)' }}>Most Popular</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '2rem 0 1rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>$19</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ month</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '2.5rem' }}>
                  Unlocks multi-app tone adaptations, Notion Kanbans, and full developer variables casing.
                </p>
                <ul className={styles.winsChecklist} style={{ gap: '1rem', marginBottom: '3rem' }}>
                  <li><Check size={14} color="var(--accent-cyan)" /> <strong>All Free Features</strong> included</li>
                  <li><Check size={14} color="var(--accent-cyan)" /> Multi-App context formatting (Slack, Notion)</li>
                  <li><Check size={14} color="var(--accent-cyan)" /> Developer Cursor camelCase formats</li>
                  <li><Check size={14} color="var(--accent-cyan)" /> Flying Notion task kanban automation</li>
                  <li><Check size={14} color="var(--accent-cyan)" /> Unlimited local memory graph</li>
                </ul>
              </div>
              <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => {
                document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <span>Start Free Trial</span>
              </Button>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 10 — IMMERSIVE FINAL CTA (Immersive Cyber Redesign) */}
      {/* ------------------------------------------------------------------------- */}
      <section id="download" className={styles.ctaImmersiveSection}>
        {/* Soft Blurred deep-blue Background Spheres */}
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
              <stop offset="0%" stopColor="rgba(0, 183, 255, 0.05)" />
              <stop offset="50%" stopColor="rgba(0, 183, 255, 0.25)" />
              <stop offset="100%" stopColor="rgba(0, 183, 255, 0.05)" />
            </linearGradient>
            <linearGradient id="gradientLavender" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 102, 255, 0.05)" />
              <stop offset="50%" stopColor="rgba(0, 102, 255, 0.3)" />
              <stop offset="100%" stopColor="rgba(0, 102, 255, 0.05)" />
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
            <h2 className={styles.ctaImmersiveHeadline}>Your Best Ideas Deserve <br />Better Than A Keyboard.</h2>
            <p className={styles.ctaImmersiveSubheadline}>Download the free open-source helper launcher and start writing 4× faster with absolute device privacy.</p>
            
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
              <li><Check size={16} /> Free Forever Base</li>
              <li><Check size={16} /> 100% Offline Local Whisper</li>
              <li><Check size={16} /> Less than 50MB helper</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
