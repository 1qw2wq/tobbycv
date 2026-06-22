'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  MapPin, 
  GraduationCap, 
  Sparkles, 
  Utensils, 
  BookOpen, 
  AlertTriangle, 
  Download, 
  Printer, 
  Volume2, 
  Eye, 
  Droplet, 
  Flame,
  RotateCcw,
  VolumeX,
  Plus,
  Play,
  Square,
  Search,
  ExternalLink,
  ChefHat,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Pause,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

// Static assets imported from the workspace assets path
import extraImg1 from '@/src/assets/images/56b90727554baeb88e448fb8e1c72cd3.jpg';
import extraImg2 from '@/src/assets/images/1243fbf25d7b4d03c8de2eb1bf059a80.jpg';
import extraImg3 from '@/src/assets/images/d43c1e6642ca15ed02921d59b3048aa2.jpg';
import extraImg4 from '@/src/assets/images/f50d19f02b471c08c1876ae66acce043.jpg';

const profileImg = extraImg1;
const actionImg = extraImg2;

enum ActiveCam {
  FOCUS = 'FOCUS',
  HAZARD = 'HAZARD',
  ACOUSTIC = 'ACOUSTIC',
  SCRATCH = 'SCRATCH'
}

enum VideoFeedID {
  SIMULID = 'SIMULID',
  VIDEO1 = 'VIDEO1',
  VIDEO2 = 'VIDEO2'
}

const dossierImages = [
  { src: extraImg1, title: "Tactical Profile α", desc: "Frontal facial profile of subject Tobby Lv. Primary identifier.", id: "img-0" },
  { src: extraImg2, title: "Sensory Kitchen β", desc: "Active flavor analysis laboratory space. Sweet-savory testing deck.", id: "img-1" },
  { src: extraImg3, title: "Surveillance Feed γ", desc: "Captured ambient thermal/chromic surveillance imagery of Tobby.", id: "img-2" },
  { src: extraImg4, title: "Field Operation δ", desc: "Action sequence capturing in natural tactical exploration.", id: "img-3" },
];

const tacticalMediaList = [
  { type: "image", src: extraImg1, title: "Tactical Profile α", desc: "Frontal facial profile of subject Tobby Lv. Primary identifier and target assessment photo.", spec: "TOBBY_LV_01", id: "m-0" },
  { type: "image", src: extraImg2, title: "Sensory Kitchen β", desc: "Active food aesthetics and flavor testing deck. Japanese sweet-savory testing panel.", spec: "TOBBY_LV_02", id: "m-1" },
  { type: "image", src: extraImg3, title: "Surveillance Feed γ", desc: "Ambience and environment chromatic/thermal-ready surveillance of Tobby.", spec: "TOBBY_TRACK_03", id: "m-2" },
  { type: "image", src: extraImg4, title: "Field Operation δ", desc: "High agility physical action sequence captured in natural tactical setting.", spec: "TOBBY_TRACK_04", id: "m-3" },
  { type: "video", src: "/videos/cbca78f178d8cbe4127963ed2c52dc83.mp4", title: "Surveillance Footage I", desc: "Surveillance feed of the target's active field exploration in designated zone.", spec: "RECON_FEED_01", id: "m-4" },
  { type: "video", src: "/videos/7e7a758c1482a69f0926e395d8fb9044.mp4", title: "Surveillance Footage II", desc: "Primary high resolution recording capturing subject's tactical gait and environmental spatial adjustments.", spec: "RECON_FEED_02", id: "m-5" },
];

export default function TobbyLvCV() {
  const [activeCam, setActiveCam] = React.useState<ActiveCam>(ActiveCam.FOCUS);
  const [isFeedMuted, setIsFeedMuted] = React.useState(false);
  const [isFeedRecording, setIsFeedRecording] = React.useState(true);
  const [fps, setFps] = React.useState(60);
  const [timeStr, setTimeStr] = React.useState('18:03:15');

  // Interactive Custom Asset Gallery and Video feed states
  const [activeDossierIndex, setActiveDossierIndex] = React.useState(0);
  const [cctvVideoTrack, setCctvVideoTrack] = React.useState<VideoFeedID>(VideoFeedID.SIMULID);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  // Tactical Lightbox Custom internal states
  const [lbScale, setLbScale] = React.useState(1.0);
  const [lbOffset, setLbOffset] = React.useState({ x: 0, y: 0 });
  const [lbFilter, setLbFilter] = React.useState<'normal' | 'thermal' | 'night' | 'amber' | 'grayscale'>('normal');
  const [lbHudGrid, setLbHudGrid] = React.useState(true);
  
  // Video player internal states
  const lbVideoRef = React.useRef<HTMLVideoElement>(null);
  const [lbVideoPlaying, setLbVideoPlaying] = React.useState(true);
  const [lbVideoMuted, setLbVideoMuted] = React.useState(true);
  const [lbVideoSpeed, setLbVideoSpeed] = React.useState(1.0);
  const [lbVideoTime, setLbVideoTime] = React.useState(0);
  const [lbVideoDuration, setLbVideoDuration] = React.useState(0);

  // Keyboard navigation & resets
  React.useEffect(() => {
    if (!lightboxOpen) return;
    
    // Reset zoom, pan, and video settings when index or modal changes
    setLbScale(1.0);
    setLbOffset({ x: 0, y: 0 });
    setLbVideoPlaying(true);
    setLbVideoSpeed(1.0);
    setLbVideoTime(0);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % tacticalMediaList.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + tacticalMediaList.length) % tacticalMediaList.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex]);

  // Video progress checker and syncer
  React.useEffect(() => {
    const video = lbVideoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setLbVideoTime(video.currentTime);
    const handleDurationChange = () => setLbVideoDuration(video.duration);
    const handleEnded = () => setLbVideoPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
    };
  }, [lightboxOpen, lightboxIndex]);

  // Synchronize dynamic attributes of <video> element
  React.useEffect(() => {
    const video = lbVideoRef.current;
    if (!video) return;
    
    if (lbVideoPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [lbVideoPlaying, lightboxIndex, lightboxOpen]);

  React.useEffect(() => {
    const video = lbVideoRef.current;
    if (!video) return;
    video.muted = lbVideoMuted;
  }, [lbVideoMuted, lightboxIndex, lightboxOpen]);

  React.useEffect(() => {
    const video = lbVideoRef.current;
    if (!video) return;
    video.playbackRate = lbVideoSpeed;
  }, [lbVideoSpeed, lightboxIndex, lightboxOpen]);

  // Interactive Target Focus coordinate state
  const focusContainerRef = React.useRef<HTMLDivElement>(null);
  const [focusCoord, setFocusCoord] = React.useState({ x: 0.5, y: 0.5 });
  const [isHoveringFocus, setIsHoveringFocus] = React.useState(false);

  // Sound ripple states
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);
  const [rippleId, setRippleId] = React.useState(0);

  // Scratch dummy marks state
  const [scratches, setScratches] = React.useState<{ id: number; x: number; y: number; angle: number }[]>([]);
  const [scratchCount, setScratchCount] = React.useState(0);

  // Water spill hazard cone state
  const hazardContainerRef = React.useRef<HTMLDivElement>(null);
  const [spills, setSpills] = React.useState<{ id: number; x: number; y: number; angle: number }[]>([]);

  // Culinary Bowl candy simulation state
  const [starchyBowl, setStarchyBowl] = React.useState<{ id: number; type: string; color: string; x: number; y: number }[]>([]);
  const [bowlProgress, setBowlProgress] = React.useState(3); // start with high glycemic rating.

  // Guide user about PDF export
  const [showExportGuide, setShowExportGuide] = React.useState(false);

  // Track ticking seconds and realistic camera noise fluctuations
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
      setFps(Math.floor(58.5 + Math.random() * 2.5));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // PDF print trigger helper
  const handlePrint = () => {
    setShowExportGuide(true);
    setTimeout(() => {
      window.print();
    }, 1500);
  };

  // Plain Text CV downloader for complete client action accessibility
  const downloadTextPortfolio = () => {
    const textCV = `=========================================
TOBBY LV - TACTICAL & CULINARY CV
=========================================
Location: Japanese-based profile (Chinese cultural background)
Specialization: Tactical Presence, Non-Linguistic Chinese Studies, Experimental Flavor Development

-----------------------------------------
PROFESSIONAL SUMMARY
-----------------------------------------
A highly distinctive professional characterized by an intense, commanding presence and an innovative, experimental approach to sensory and spatial experiences. Tobby possesses a strong aptitude for Chinese regional and cultural academic subjects, though he operates primarily in non-linguistic areas. He is currently working on refining his highly specific culinary theories regarding sweet-and-savory flavor combinations and maintains a specialized set of tactical physical abilities.

-----------------------------------------
CORE COMPETENCIES & TACTICAL SKILLS
-----------------------------------------
- Spatial Hazard Management (Water Spill): Capable of deploying directional liquid hazards (0.6-meter, 80° cone) to create temporary 10-second zone hazards to manage physical space.
- Targeted Focus (Stare): High-intensity visual engagement capable of maintaining direct focus on a single target for sustained periods to achieve specific outcomes.
- Acoustic Presence (Scary Sound): Quick-activation radial acoustic projection (3.0-meter radius) for immediate environmental impact.
- Close-Quarter Coordination (Hit & Scratch): Competent in direct physical contact and applying continuous physical engagement over short durations.

-----------------------------------------
CULINARY & GASTRONOMIC PROFILE
-----------------------------------------
Tobby has a highly developed, non-traditional preference for "bliss point" flavor profiles, specifically combining extreme sweet and savory elements in his daily meals.

Specific Daily Dietary Habits:
- Starch & Confectionery Fusion: Regularly adds confectionery candies directly into savory noodle and white rice dishes. 
- Fruit & Protein Pairings: Frequently mixes a wide variety of fruits (both fresh and sticky, dried fruits) with salty meats—specifically beef and pork—as well as various vegetables.
- High-Frequency Sweetening: Incorporates highly sweetened elements or refined sugars into nearly every meal, maintaining an exceptionally high threshold for sweetness.

Target Culinary Adjustments & Training:
Currently working on professionalizing his palate by replacing refined candies with healthier, traditional sweet-savory cooking techniques:
- Phasing Out Candies: Transitioning to natural fruit-based sauces and whole fruits containing fiber, vitamins, and antioxidants.
- Traditional Culinary Application Mastery:
  * Thai Fried Rice (Pineapple, raisins, soy sauce)
  * Korean Bulgogi & Galbi (Beef marinated in soy sauce, sesame oil, and Asian pear)
  * Teriyaki & Sweet-and-Sour (Soy sauce balanced with honey, mirin, or pineapple juice)

-----------------------------------------
EDUCATION & ACADEMIC STRENGTHS
-----------------------------------------
- Focus Area: Demonstrated aptitude in Chinese-related academic subjects (focusing on historical, cultural, or regional topics rather than language acquisition).

-----------------------------------------
PROFESSIONAL & LINGUISTIC LIMITATIONS
-----------------------------------------
- Language Skills: Limited English, Limited Chinese.
- Information Technology (IT): No prior experience or technical training in IT systems, software, or hardware.
- Legal Studies: No background knowledge or training in law or jurisprudence.

=========================================
Generated via Tobby Lv's Premium Portal
=========================================`;

    const blob = new Blob([textCV], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Tobby_Lv_Tactical_Culinary_CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cursor tracker calculation for Focused Stare
  const handleFocusMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!focusContainerRef.current) return;
    const rect = focusContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setFocusCoord({ x, y });
  };

  // Web Audio Synthesizer for "Scary Sound meow"
  const triggerScaryMeow = (e?: React.MouseEvent) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipples(prev => [...prev, { id: rippleId, x, y }]);
      setRippleId(prev => prev + 1);
    } else {
      setRipples(prev => [...prev, { id: rippleId, x: 200, y: 150 }]);
      setRippleId(prev => prev + 1);
    }

    if (isFeedMuted) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(322, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(690, ctx.currentTime + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.42);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.warn('Audio Context not allowed failed:', err);
    }
  };

  // Trigger claw scratch marks on a training dummy target
  const triggerScratch = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const angle = (Math.random() * 40) - 20;

    setScratches(prev => [...prev, { id: scratchCount, x, y, angle }]);
    setScratchCount(prev => prev + 1);

    if (!isFeedMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.11);
      } catch (err) {}
    }
  };

  const clearScratch = () => {
    setScratches([]);
  };

  const deploySpill = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hazardContainerRef.current) return;
    const rect = hazardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height - 20;
    const dx = x - centerX;
    const dy = y - centerY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const newSpill = {
      id: Date.now(),
      x,
      y,
      angle
    };

    setSpills(prev => [newSpill, ...prev].slice(0, 3));

    if (!isFeedMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (err) {}
    }
  };

  const addCandyToNoodle = (type: string, color: string) => {
    const rx = 80 + Math.random() * 140;
    const ry = 80 + Math.random() * 80;
    const newCandy = {
      id: Date.now(),
      type,
      color,
      x: rx,
      y: ry
    };
    setStarchyBowl(prev => [...prev, newCandy]);
    setBowlProgress(prev => Math.min(prev + 1, 10));
  };

  const clearStarchyBowl = () => {
    setStarchyBowl([]);
    setBowlProgress(1);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F5F5F5] selection:bg-[#FF4500]/40 flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. PRINT DIALOG SETUP INSTRUCTION */}
      <AnimatePresence>
        {showExportGuide && (
          <motion.div 
            id="print-guide"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg bg-zinc-900 text-white rounded-none border-l-4 border-[#FF4500] shadow-2xl p-5 text-sm print:hidden"
          >
            <div className="flex items-start gap-4">
              <Printer className="w-6 h-6 text-[#FF4500] shrink-0 animate-pulse" />
              <div>
                <h4 className="font-bold text-[#FF4500] uppercase tracking-wider font-display text-base">Print Job Triggered</h4>
                <p className="text-zinc-300 mt-1 text-xs">
                  We have formatted a beautiful, highly polished single-page A4 PDF dossier for Tobby Lv. 
                  In your browser print popup, select:
                </p>
                <div className="bg-black/60 p-3 my-3 font-mono text-[11px] leading-relaxed text-zinc-400 border border-zinc-800">
                  &gt; Destination: <span className="text-white">Save as PDF</span><br />
                  &gt; Background Graphics: <span className="text-[#FF4500]">ENABLED</span><br />
                  &gt; Margins: <span className="text-white">NONE or DEFAULT</span>
                </div>
                <button 
                  onClick={() => setShowExportGuide(false)}
                  className="px-4 py-2 bg-white text-black font-extrabold text-xs uppercase hover:bg-transparent hover:text-white border border-white transition-all"
                >
                  Confirm & Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. BRUTALIST PORTAL ACTION HEADER BAR */}
      <header className="sticky top-0 z-30 w-full bg-[#0A0A0A]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[#FF4500] rounded-none animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-zinc-400">
              SECURE SIGNAL: TOBBY_LV_TACTICAL_INTERFACE
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={downloadTextPortfolio}
              id="download-txt-cv"
              className="px-5 py-2.5 text-xs font-mono font-bold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-black border border-zinc-700 transition"
              title="Download structured text resume file directly"
            >
              [DOWNLOAD_RAW_TEXT]
            </button>

            <button
              onClick={handlePrint}
              id="download-pdf-portfolio"
              className="bg-white text-black px-5 py-2.5 font-bold uppercase text-xs tracking-wider border border-white hover:bg-transparent hover:text-white transition-colors"
              title="Prints standard single-sheet vector portfolio document"
            >
              DOWNLOAD PORTFOLIO (PDF)
            </button>
          </div>
        </div>
      </header>

      {/* 3. CORE EXECUTABLE GRID VIEWPORT */}
      <div className="max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-between print:p-0 print:m-0">
        
        {/* INTERACTIVE DOSSIER HEADER STYLING FROM THE "BOLD TYPOGRAPHY" THEME */}
        <header className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-8 print:block print:mb-6">
          <div className="flex flex-col">
            <h1 className="text-[75px] sm:text-[110px] leading-[0.85] font-black uppercase tracking-tighter text-white">
              TOBBY<br />LV
            </h1>
            <p className="mt-4 text-xs font-mono tracking-widest uppercase text-[#FF4500] max-w-2xl leading-relaxed">
              Location: Japan-Based [Chinese Heritage] // SPECIALIZATION: Tactical Presence, Non-Linguistic Studies, and Experimental Flavor Development
            </p>
          </div>
          <div className="flex flex-col lg:items-end gap-3 font-mono print:hidden shrink-0">
            <div className="text-right text-xs text-[#FF4500] font-bold">
              SYS STATUS: ACTIVE RECONNAISSANCE
            </div>
            <div className="text-left lg:text-right text-[10px] text-zinc-500 uppercase leading-snug">
              Reference ID: TL-992-G<br />
              Sub-Syllabus Rank: APEX ADVISOR
            </div>
          </div>
        </header>

        {/* CONTENT SECTIONS GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch print:block print:space-y-6">
          
          {/* LEFT SECTION (4/12 COLUMNS): BIO SUMMARY + LIMITS PROTOCOL */}
          <section className="col-span-1 lg:col-span-4 flex flex-col justify-between gap-8 print:w-full print:block">
            
            {/* PROFILE HEADSHOT OR CARD */}
            <div className="bg-[#1A1A1A] border-l-4 border-[#FF4500] p-6 flex flex-col justify-between h-full space-y-6 print:border-l-2 print:border-zinc-950 print:bg-white print:p-0 print:text-black">
              <div>
                <div 
                  onClick={() => {
                    setLightboxIndex(activeDossierIndex);
                    setLightboxOpen(true);
                  }}
                  className="relative w-full aspect-square bg-zinc-900 border border-zinc-800 overflow-hidden mb-3 group/dossier cursor-pointer print:max-w-[150px] print:mb-3"
                  title="Click to zoom and fully view this tactical photo"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDossierIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={dossierImages[activeDossierIndex].src} 
                        alt={dossierImages[activeDossierIndex].title}
                        fill
                        priority
                        referrerPolicy="no-referrer"
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-300 group-hover/dossier:scale-105"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent pointer-events-none" />
                  
                  {/* Expand badge overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover/dossier:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                    <Search className="w-8 h-8 text-[#FF4500] stroke-[1.5] mb-2 scale-90 group-hover/dossier:scale-100 transition-all duration-300" />
                    <span className="text-[10px] font-mono tracking-wider text-[#FF4500] uppercase font-bold px-2 py-0.5 bg-zinc-950 border border-[#FF4500]">
                      FULL SCREEN RECON
                    </span>
                  </div>

                  {/* Frame Number Overlay */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 border border-zinc-800 text-[8px] font-mono tracking-wider z-10 text-[#FF4500]">
                    DOSSIER_FRAME: 0x0{activeDossierIndex + 1}
                  </div>
                </div>

                {/* Dossier Image Selection Thumbnails Slider */}
                <div className="grid grid-cols-4 gap-1.5 mb-4">
                  {dossierImages.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveDossierIndex(idx)}
                      className={`relative aspect-square transition overflow-hidden border ${
                        activeDossierIndex === idx 
                          ? 'border-[#FF4500] ring-1 ring-[#FF4500]' 
                          : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                      title={img.title}
                    >
                      <Image 
                        src={img.src} 
                        alt={img.title} 
                        fill 
                        sizes="40px"
                        className="object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>

                {/* Photo meta descriptor */}
                <div className="bg-black/40 border border-zinc-850 p-3 text-[10px] font-mono leading-relaxed mb-6">
                  <div className="flex justify-between text-[9px] text-zinc-500 mb-1 border-b border-[#FF4500]/25 pb-0.5">
                    <span>FILE_SPEC: TOBBY_LV_0{activeDossierIndex + 1}</span>
                    <span>EXIF: AUTO</span>
                  </div>
                  <span className="text-[#FF4500] font-bold uppercase">{dossierImages[activeDossierIndex].title}</span>
                  <p className="text-zinc-400 mt-1 text-[11px] leading-snug">{dossierImages[activeDossierIndex].desc}</p>
                </div>

                <h2 className="text-xl font-bold uppercase mb-4 text-[#FF4500] border-b border-[#FF4500]/30 pb-2 print:text-black print:border-black print:text-lg">
                  Professional Summary
                </h2>
                <p className="text-sm leading-relaxed text-zinc-300 print:text-zinc-800 text-justify">
                  A highly distinctive professional characterized by an intense, commanding presence and an innovative, experimental approach to sensory and spatial experiences. Tobby possesses a strong aptitude for Chinese regional and cultural academic subjects, though he operates primarily in non-linguistic areas. He is currently working on refining his highly specific culinary theories regarding sweet-and-savory flavor combinations and maintains a specialized set of tactical physical abilities.
                </p>
              </div>

              {/* Education section in profile column */}
              <div className="pt-6 border-t border-zinc-800 print:border-zinc-300">
                <h2 className="text-lg font-bold uppercase mb-3 text-[#FF4500] print:text-black">Academic Strengths & Education</h2>
                <p className="text-xs font-mono text-zinc-400 leading-relaxed print:text-zinc-800">
                  &gt; FOCUS AREA: CHINESE REGIONAL HISTORY<br/>
                  &gt; CULTURAL RECOGNITION (NON-VERBAL)<br/>
                  &gt; EXPERIMENTAL FLAVOR THEORY & CHEMISTRY
                </p>
                <p className="text-xs text-zinc-500 mt-2 print:text-zinc-600">
                  Demonstrated advanced aptitude in historical, cultural, or regional topics rather than vocal language acquisition.
                </p>
              </div>
            </div>

            {/* REAL-TIME PROTOCOL LIMITS BANNER */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 print:border-zinc-300 print:bg-white print:text-black print:p-0">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#FF4500] uppercase mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-5" />
                <span>LIMITATIONS & DEFICITS</span>
              </h3>
              <ul className="text-xs text-zinc-400 space-y-3 font-mono print:text-zinc-800 list-disc list-inside">
                <li>
                  <strong className="text-white print:text-black">Linguistic Capacity:</strong> Limited English proficiency. Limited Chinese verbal dialogue (non-verbal specialist).
                </li>
                <li>
                  <strong className="text-white print:text-black">Information Technology:</strong> 0% training or experience with IT hardware, networking, or systems.
                </li>
                <li>
                  <strong className="text-white print:text-black">Jurisprudence / Law:</strong> No prior background study or training in jurisprudence.
                </li>
              </ul>
            </div>

          </section>

          {/* MIDDLE SECTION (5/12 COLUMNS): LIVE CCTV CAM & ACTION EXPERIMENT SANDBOX */}
          <section className="col-span-1 lg:col-span-5 flex flex-col gap-6 print:hidden">
            
            {/* CCTV CAMS PANEL */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between flex-1">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">LIVE TACTICAL FEEDS</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  FPS: {fps} | REC
                </div>
              </div>

              {/* Feed selection tab buttons */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => { setActiveCam(ActiveCam.FOCUS); setIsHoveringFocus(false); }}
                  className={`px-3 py-2 text-[11px] font-mono border text-left flex flex-col justify-between transition ${
                    activeCam === ActiveCam.FOCUS 
                      ? 'bg-zinc-950 border-[#FF4500] text-[#FF4500]' 
                      : 'bg-[#151515] border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] opacity-40">FEED_A</span>
                  <span className="font-bold flex items-center gap-1 mt-1">
                    <Eye className="w-3.5 h-3.5" /> TARGETED STARE
                  </span>
                </button>

                <button
                  onClick={() => setActiveCam(ActiveCam.HAZARD)}
                  className={`px-3 py-2 text-[11px] font-mono border text-left flex flex-col justify-between transition ${
                    activeCam === ActiveCam.HAZARD 
                      ? 'bg-zinc-950 border-[#FF4500] text-[#FF4500]' 
                      : 'bg-[#151515] border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] opacity-40">FEED_B</span>
                  <span className="font-bold flex items-center gap-1 mt-1">
                    <Droplet className="w-3.5 h-3.5" /> LIQUID SPILL
                  </span>
                </button>

                <button
                  onClick={() => setActiveCam(ActiveCam.ACOUSTIC)}
                  className={`px-3 py-2 text-[11px] font-mono border text-left flex flex-col justify-between transition ${
                    activeCam === ActiveCam.ACOUSTIC 
                      ? 'bg-zinc-950 border-[#FF4500] text-[#FF4500]' 
                      : 'bg-[#151515] border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] opacity-40">FEED_C</span>
                  <span className="font-bold flex items-center gap-1 mt-1">
                    <Volume2 className="w-3.5 h-3.5" /> SCARY SOUND
                  </span>
                </button>

                <button
                  onClick={() => setActiveCam(ActiveCam.SCRATCH)}
                  className={`px-3 py-2 text-[11px] font-mono border text-left flex flex-col justify-between transition ${
                    activeCam === ActiveCam.SCRATCH 
                      ? 'bg-zinc-950 border-[#FF4500] text-[#FF4500]' 
                      : 'bg-[#151515] border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] opacity-40">FEED_D</span>
                  <span className="font-bold flex items-center gap-1 mt-1">
                    <Plus className="w-3.5 h-3.5" /> HIT & SCRATCH
                  </span>
                </button>
              </div>

              {/* VIDEO STREAM SELECTOR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4 bg-zinc-950 p-2.5 border border-zinc-800 text-[10px] font-mono">
                <span className="text-zinc-500 uppercase tracking-widest font-bold pl-1 flex items-center gap-1 select-none">
                  <Play className="w-3 h-3 text-[#FF4500]" /> BACKGROUND FOOTAGE:
                </span>
                <div className="grid grid-cols-3 gap-1 shrink-0">
                  <button
                    onClick={() => setCctvVideoTrack(VideoFeedID.SIMULID)}
                    className={`px-2 py-1 text-[9px] uppercase font-bold transition border cursor-pointer ${
                      cctvVideoTrack === VideoFeedID.SIMULID 
                        ? 'bg-[#FF4500] text-black border-[#FF4500]' 
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    RAW_HUD
                  </button>
                  <button
                    onClick={() => setCctvVideoTrack(VideoFeedID.VIDEO1)}
                    className={`px-2 py-1 text-[9px] uppercase font-bold transition border cursor-pointer ${
                      cctvVideoTrack === VideoFeedID.VIDEO1 
                        ? 'bg-[#FF4500] text-black border-[#FF4500]' 
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
                    }`}
                    title="Play tactical surveillance video feed 1"
                  >
                    V_FEED_01
                  </button>
                  <button
                    onClick={() => setCctvVideoTrack(VideoFeedID.VIDEO2)}
                    className={`px-2 py-1 text-[9px] uppercase font-bold transition border cursor-pointer ${
                      cctvVideoTrack === VideoFeedID.VIDEO2 
                        ? 'bg-[#FF4500] text-black border-[#FF4500]' 
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
                    }`}
                    title="Play tactical surveillance video feed 2"
                  >
                    V_FEED_02
                  </button>
                </div>
              </div>

              {/* FEED DIGITAL VIEWPORT */}
              <div className="relative aspect-video w-full bg-black border border-zinc-800 overflow-hidden">
                {/* CRT Interference scanlines */}
                <div className="absolute inset-x-0 h-0.5 bg-neutral-800/20 top-1/3 animate-pulse pointer-events-none z-15" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[size:100%_4px] pointer-events-none z-15" />

                {/* DYNAMIC BACKGROUND SURVEILLANCE VIDEO TRACK */}
                {cctvVideoTrack !== VideoFeedID.SIMULID && (
                  <video
                    src={cctvVideoTrack === VideoFeedID.VIDEO1 ? "/videos/cbca78f178d8cbe4127963ed2c52dc83.mp4" : "/videos/7e7a758c1482a69f0926e395d8fb9044.mp4"}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
                  />
                )}

                {/* CAM A: STARING EYE PUPIL TRACKING */}
                {activeCam === ActiveCam.FOCUS && (
                  <div 
                    ref={focusContainerRef}
                    onMouseMove={handleFocusMouseMove}
                    onMouseEnter={() => setIsHoveringFocus(true)}
                    onMouseLeave={() => setIsHoveringFocus(false)}
                    className={`absolute inset-0 flex flex-col items-center justify-center cursor-crosshair select-none p-4 z-10 ${
                      cctvVideoTrack !== VideoFeedID.SIMULID ? 'bg-black/20' : ''
                    }`}
                  >
                    <div className="absolute top-2 left-2 text-[9px] font-mono uppercase text-zinc-400 font-bold bg-black/40 px-1">
                      Engaging Target engagement coordinate module
                    </div>

                    {isHoveringFocus && (
                      <div 
                        className="absolute w-10 h-10 border border-[#FF4500] border-dashed rounded-full pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${focusCoord.x * 100}%`, top: `${focusCoord.y * 100}%` }}
                      >
                        <div className="w-1.5 h-1.5 bg-[#FF4500] rounded-none" />
                      </div>
                    )}

                    {/* Highly stylized brutalist cat eye array */}
                    <div className="flex gap-8 items-center justify-center py-4 px-6 bg-zinc-950/90 border border-zinc-800 relative shadow-2xl">
                      {/* Left Eye */}
                      <div className="w-16 h-12 bg-yellow-400 rounded-none relative overflow-hidden flex items-center justify-center border-2 border-yellow-300">
                        <motion.div 
                          className="w-3.5 h-10 bg-black rounded-none"
                          animate={{
                            x: (focusCoord.x - 0.5) * 28,
                            y: (focusCoord.y - 0.5) * 8,
                          }}
                          transition={{ type: 'spring', stiffness: 140, damping: 12 }}
                        />
                      </div>
                      {/* Right Eye */}
                      <div className="w-16 h-12 bg-yellow-400 rounded-none relative overflow-hidden flex items-center justify-center border-2 border-yellow-300">
                        <motion.div 
                          className="w-3.5 h-10 bg-black rounded-none"
                          animate={{
                            x: (focusCoord.x - 0.5) * 28,
                            y: (focusCoord.y - 0.5) * 8,
                          }}
                          transition={{ type: 'spring', stiffness: 140, damping: 12 }}
                        />
                      </div>
                    </div>

                    <p className="mt-4 text-[10px] font-mono text-zinc-300 text-center uppercase tracking-wider bg-black/60 px-2 py-0.5 mt-2">
                      {isHoveringFocus 
                        ? `LOC COORDS // X:${(focusCoord.x * 100).toFixed(0)} Y:${((1-focusCoord.y) * 100).toFixed(0)}` 
                        : 'Move pointer here to simulate stare engagement'
                      }
                    </p>
                  </div>
                )}

                {/* CAM B: WATER HAZARD 80-DEGREE CONE DEPLOYER */}
                {activeCam === ActiveCam.HAZARD && (
                  <div 
                    ref={hazardContainerRef}
                    onClick={deploySpill}
                    className={`absolute inset-0 flex flex-col items-center justify-end p-4 cursor-pointer select-none z-10 transition ${
                      cctvVideoTrack !== VideoFeedID.SIMULID ? 'bg-black/30' : 'bg-stone-950'
                    }`}
                  >
                    <div className="absolute top-2 left-2 text-[9px] font-mono text-zinc-400 font-bold bg-black/40 px-1">
                      DEPLOY RADIAL cone liquid hazard (0.6M range)
                    </div>

                    {spills.map((spill) => (
                      <motion.div
                        key={spill.id}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: [1, 0.8, 0], scale: 1.4 }}
                        transition={{ duration: 10 }}
                        className="absolute w-28 h-28 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                        style={{ left: spill.x, top: spill.y }}
                      >
                        <div 
                          className="w-full h-full bg-[#FF4500]/20 border-l border-r border-[#FF4500]/80"
                          style={{ 
                            transform: `rotate(${spill.angle - 90}deg)`,
                            clipPath: 'polygon(50% 0%, 5% 100%, 95% 100%)'
                          }}
                        />
                      </motion.div>
                    ))}

                    <div className="z-10 mb-4 text-center">
                      <div className="inline-block p-1 bg-black border border-zinc-800 text-[10px] text-zinc-400 font-mono mb-2 uppercase">
                        Origin Point: Tobby
                      </div>
                      <p className="text-[10px] font-mono text-zinc-300 uppercase bg-black/50 px-2 py-0.5">Click area to deploy 10-sec slip hazard zone</p>
                    </div>
                  </div>
                )}

                {/* CAM C: RADIAL ACOUSTIC SOUNDS */}
                {activeCam === ActiveCam.ACOUSTIC && (
                  <div 
                    onClick={triggerScaryMeow}
                    className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer select-none z-10 transition ${
                      cctvVideoTrack !== VideoFeedID.SIMULID ? 'bg-black/30' : 'bg-zinc-950'
                    }`}
                  >
                    {ripples.map((rip) => (
                      <motion.div
                        key={rip.id}
                        initial={{ scale: 0.2, opacity: 1 }}
                        animate={{ scale: 4.5, opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute w-24 h-24 border border-[#FF4500] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                        style={{ left: rip.x, top: rip.y }}
                      >
                        <div className="w-16 h-16 border border-zinc-800" />
                      </motion.div>
                    ))}

                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-none border border-[#FF4500] bg-black/40 hover:bg-[#FF4500]/20 flex items-center justify-center mx-auto transition">
                        <Volume2 className="w-8 h-8 text-[#FF4500]" />
                      </div>
                      <div>
                        <p className="font-mono text-xs text-white bg-black/50 px-2 py-0.5 inline-block">CLICK TO EMIT RADIAL MEOW WAVE</p>
                        <p className="font-mono text-[9px] text-[#FF4500] uppercase mt-1 bg-black/50 px-2 inline-block">Projection Range: 3.0-meter radial blast</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CAM D: CLOSE-QUARTERS AGILITY TRAINING */}
                {activeCam === ActiveCam.SCRATCH && (
                  <div 
                    onClick={triggerScratch}
                    className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer select-none z-10 transition ${
                      cctvVideoTrack !== VideoFeedID.SIMULID ? 'bg-black/30' : 'bg-[#111]'
                    }`}
                  >
                    <div className="relative w-24 h-40 bg-zinc-900 border border-zinc-800 flex flex-col justify-between p-3 overflow-hidden shadow-2xl">
                      <div className="absolute inset-x-0 h-4 bg-orange-950 border-b border-[#FF4500] top-2" />
                      <span className="text-[9px] font-mono text-zinc-600">TARGET DUMMY</span>

                      {scratches.map((scratch) => (
                        <div 
                          key={scratch.id}
                          className="absolute pointer-events-none flex flex-col gap-0.5 shrink-0 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: scratch.x, top: scratch.y, transform: `translate(-50%, -50%) rotate(${scratch.angle}deg)` }}
                        >
                          <div className="w-8 h-[2px] bg-[#FF4500]" />
                          <div className="w-9 h-[2px] bg-red-600" />
                          <div className="w-7 h-[2px] bg-[#FF4500]" />
                        </div>
                      ))}

                      <div className="text-zinc-500 font-mono text-[8px] text-center">CLICK TO APPY SCRATCH INFLICTS</div>
                    </div>

                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#FF4500] bg-black/60 px-1">STRIKES: {scratches.length}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearScratch(); }}
                        className="px-2 py-0.5 bg-zinc-800 text-zinc-300 font-mono text-[9px] uppercase border border-zinc-700 hover:text-white cursor-pointer"
                      >
                        [RESET]
                      </button>
                    </div>
                  </div>
                )}

                {/* CONTROL FEEDS FOOTER METAHUD */}
                <div className="absolute bottom-1 right-2 left-2 flex justify-between items-center bg-black/80 p-2 border border-zinc-800 text-[9px] font-mono z-30">
                  <span className="text-zinc-500">SIGNAL FEED ACTIVE // TACTICAL LAB</span>
                  <div className="flex items-center gap-3">
                    {cctvVideoTrack !== VideoFeedID.SIMULID && (
                      <button
                        onClick={() => {
                          setLightboxIndex(cctvVideoTrack === VideoFeedID.VIDEO1 ? 4 : 5);
                          setLightboxOpen(true);
                        }}
                        className="text-[#FF4500] hover:text-white font-bold bg-zinc-950 px-1.5 py-0.5 border border-[#FF4500]/55 hover:border-[#FF4500] transition flex items-center gap-1 cursor-pointer"
                        title="Expand active video feed to full-screen view"
                      >
                        <Maximize2 className="w-3 h-3" /> [EXPAND FEED]
                      </button>
                    )}
                    <button 
                      onClick={() => setIsFeedMuted(!isFeedMuted)} 
                      className="text-zinc-500 hover:text-white"
                    >
                      {isFeedMuted ? '[SYNTH_OFF]' : '[SYNTH_ACTIVE]'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECONDARY ACTION LAB PHOTO BANNER */}
            <div 
              onClick={() => {
                setLightboxIndex(1); // Sensory Kitchen β has extraImg2 at index 1
                setLightboxOpen(true);
              }}
              className="bg-[#111111] border border-zinc-800 p-5 relative group overflow-hidden cursor-pointer hover:border-[#FF4500]/50 transition-colors"
              title="Click to view full image in high-res"
            >
              <div className="relative w-full h-36 bg-zinc-950 overflow-hidden">
                <Image
                  src={actionImg}
                  alt="Tobby Lv real research kitchen desktop"
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover grayscale group-hover:grayscale-0 transition duration-700 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center pointer-events-none z-10">
                  <Search className="w-6 h-6 text-[#FF4500] mb-1" />
                  <span className="text-[10px] font-mono tracking-wider text-[#FF4500] uppercase font-bold px-1.5 py-0.5 bg-zinc-950 border border-[#FF4500]">
                    [EXPAND PHOTO SPEC]
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#FF4500] uppercase font-bold tracking-wider">SECURE SENSORY STATION // RESEARCH</span>
                  <p className="text-xs text-zinc-400 mt-1">Japanese-based sweet-savory combinations testing panel</p>
                </div>
                <ChefHat className="w-5 h-5 text-zinc-600" />
              </div>
            </div>

          </section>

          {/* RIGHT SECTION (3/12 COLUMNS): RADICAL FLAVOR PROFILE & CULINARY SANDBOX */}
          <section className="col-span-1 lg:col-span-3 flex flex-col justify-between gap-6 print:w-full print:block">
            
            {/* SAVORY + SWEET FLAVOR DOSSIER */}
            <div className="bg-white text-black p-6 flex flex-col justify-between h-full print:border-l-2 print:border-zinc-950 print:p-0">
              <div>
                <h3 className="text-sm font-black uppercase mb-4 tracking-tight border-b-2 border-black pb-1 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF4500]" />
                  <span>Gastronomic Profile</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-zinc-500 mb-1">Dietary Habits Overview</h4>
                    <p className="text-xs leading-relaxed text-zinc-800">
                      Tobby operates a non-traditional palate theory applying sudden spikes of glucose directly inside salty amino platforms.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-900 font-mono">
                    <p className="border-l-2 border-black pl-2 py-0.5 font-bold text-[11px]">
                      &gt; Starch & Candy Fusion:<br/>
                      <span className="font-normal text-zinc-600 block pl-2">Combines sugary confectionery candies with noodles & white rice.</span>
                    </p>
                    <p className="border-l-2 border-black pl-2 py-0.5 font-bold text-[11px]">
                      &gt; Fruit & Protein Marriage:<br/>
                      <span className="font-normal text-zinc-600 block pl-2">Mixes sticky dried fruits or citrus slices with pork & beef.</span>
                    </p>
                    <p className="border-l-2 border-black pl-2 py-0.5 font-bold text-[11px]">
                      &gt; Threshold Sweetening:<br/>
                      <span className="font-normal text-zinc-600 block pl-2">Unusually high sugar tolerance; processes high refined sucrose.</span>
                    </p>
                  </div>
                </div>

                <div className="h-px bg-zinc-200 my-4" />

                <div className="bg-[#FF4500] text-black p-5">
                  <h3 className="text-sm font-black uppercase mb-2">Palate Modernization</h3>
                  <p className="text-[10px] leading-snug font-bold">
                    REPLACING REFINED CANDY CARDS WITH NATURAL SAUCES & ANCIENT FLAVORS:
                  </p>
                  <ul className="text-[10px] font-mono mt-3 space-y-1 text-black pl-1.5 list-disc list-inside">
                    <li>THAI PINEAPPLE RICE</li>
                    <li>PEAR SESAME BULGOGI</li>
                    <li>HONEY GINGER TERIYAKI</li>
                  </ul>
                </div>
              </div>

              {/* PRINT ONLY STATS BLOCK (Renders elegantly instead of the canvas interactive sandbox) */}
              <div className="hidden print:block space-y-3 pt-6 border-t border-zinc-300 mt-4">
                <h3 className="text-xs font-black uppercase border-b-2 border-black pb-1">Tactical Competence Ratings</h3>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between">
                    <span>Target Eye Stare Lock Duration:</span>
                    <span className="font-bold">98% (Apex)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acoustic Wave Decibel Projection:</span>
                    <span className="font-bold">85% (Defensive)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Spill Spatial Hazard Control:</span>
                    <span className="font-bold">92% (Dynamic)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Close-Quarter Combat Coordination Speed:</span>
                    <span className="font-bold">95% (High Agile)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* THE SWEET SAVORY MEAL BLENDER - INTERACTIVE COMPONENT */}
            <div className="bg-[#111111] border border-zinc-850 p-6 flex flex-col justify-between print:hidden">
              <div>
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-2">
                  FLAVOR SYNTHESIZER
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Simulate Tobby&apos;s daily habit: Drop confectionery candies into the hot noodle substrate.
                </p>
              </div>

              {/* Small physical stylized bowl representation */}
              <div className="my-5 bg-black border border-zinc-800 h-28 relative overflow-hidden flex items-center justify-center shadow-inner">
                <div className="absolute bottom-0 w-32 h-14 bg-zinc-900 border-b-4 border-l-2 border-r-2 border-zinc-750 rounded-b-full flex items-center justify-center">
                  <span className="text-[8px] font-mono text-zinc-600 uppercase">SAVORY SOUP BASE</span>
                </div>

                {starchyBowl.map((candy) => (
                  <motion.div
                    key={candy.id}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: candy.y - 10, opacity: 1 }}
                    className="absolute w-3.5 h-2 rounded-full shadow-xs"
                    style={{ left: `${candy.x - 30}px`, backgroundColor: candy.color }}
                  />
                ))}

                {starchyBowl.length === 0 && (
                  <span className="text-zinc-600 font-mono text-[10px] text-center px-4 uppercase animate-pulse">0% Additives. Drop starch elements below.</span>
                )}
              </div>

              {/* Candy Dropping buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <button 
                    onClick={() => addCandyToNoodle('Candy A', '#FF4500')}
                    className="py-1 text-[10px] font-mono bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
                  >
                    + JELLYBEANS
                  </button>
                  <button 
                    onClick={() => addCandyToNoodle('Candy B', '#eab308')}
                    className="py-1 text-[10px] font-mono bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
                  >
                    + CANDY CORN
                  </button>
                  <button 
                    onClick={() => addCandyToNoodle('Candy C', '#a855f7')}
                    className="py-1 text-[10px] font-mono bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
                  >
                    + GUMDROPS
                  </button>
                  <button 
                    onClick={clearStarchyBowl}
                    className="py-1 text-[10px] font-mono bg-zinc-950 text-zinc-500 hover:text-white border border-[#FF4500]"
                  >
                    [CLEAR MEAL]
                  </button>
                </div>

                <div className="pt-3 border-t border-zinc-850 mt-2">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>GLYCEMIC INDEX LEVEL:</span>
                  </div>
                  <div className="h-1 bg-zinc-800 w-full mt-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-[#FF4500] transition-all duration-300" 
                      style={{ width: `${Math.min(starchyBowl.length * 15, 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

          </section>

        </main>

        {/* COMPACT PRINT-ONLY BEAUTIFIED LAYOUT AND PARAMETERS */}
        <div className="hidden print:block absolute inset-0 bg-white font-sans text-stone-950 p-6 max-w-[210mm] min-h-[297mm] mx-auto text-xs leading-relaxed">
          <div className="border border-stone-950 p-6 space-y-4">
            
            <div className="flex justify-between items-start border-b-2 border-stone-950 pb-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight uppercase">TOBBY LV</h1>
                <p className="text-xs font-mono text-stone-700 mt-1 uppercase tracking-wider">Tactical Presence & Experimental Flavor Specialist</p>
                <p className="text-stone-600 mt-1">Location: Tokyo-based Profile (Chinese Cultural Background)</p>
              </div>
              <div className="text-right font-mono text-[9px] text-stone-600 space-y-0.5 uppercase">
                <p>Reference ID: TL-992-G</p>
                <p>CLASSIFICATION: APEX ADVISOR</p>
                <p>GRID REF: Tokyo-Japanese</p>
              </div>
            </div>

            <div className="space-y-1 shadow-none">
              <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950">1. Professional Overview</h2>
              <p className="text-[11px] leading-relaxed text-justify">
                A highly distinctive professional characterized by an intense, commanding presence and an innovative, experimental approach to sensory and spatial experiences. Tobby possesses a strong aptitude for Chinese regional and cultural academic studies, operating primarily in non-linguistic areas. He is currently working on refining his highly specific culinary theories regarding sweet-and-savory flavor combinations and maintains a specialized set of tactical physical abilities.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950">2. Physical & Tactical Parameters</h2>
                <ul className="list-disc list-inside space-y-1.5 pl-1 leading-normal text-[10.5px]">
                  <li><strong>Spatial Hazard Control:</strong> Rapidly deploys water hazard cones (0.6m, 80° cone area, temporary 10-second duration) to manage physical territorial lanes.</li>
                  <li><strong>Targeted Eyesight Focus:</strong> High-intensity pupil visual alignment; locks and tracks single coordinate positions with absolute focus.</li>
                  <li><strong>Acoustic Radial Sound Strike:</strong> Quick-activation radial shock sound (3.0m radius capacity) for instant defensive environmental control.</li>
                  <li><strong>Close-Quarter Scratch:</strong> Advanced agile physical contact, applying continuous targeted scratch and impact patterns.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950">3. Experimental Culinary Lab</h2>
                <p className="text-[10.5px] leading-relaxed">
                  Highly developed, non-traditional preference for sweet-savory combinations. Daily starches include mixes of confectionery sugars inside white rice and standard noodle dishes.
                </p>
                <div className="pt-1.5 border-t border-stone-300">
                  <span className="font-bold underline text-[10px]">Active Chef Professionalization:</span>
                  <ul className="list-disc list-inside space-y-1 mt-1 pl-1 text-[10px] text-stone-700">
                    <li>Transitioning artificial sugars to organic whole fruits and sauce glazes.</li>
                    <li>Applying soy base to Thai Pineapple fried rice.</li>
                    <li>Preparing pear-marinated sesame Korean Bulgogi beef.</li>
                    <li>Glazing home-made sweet-sour ginger honey salmon.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1.5">
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950">4. Academic Focus & Studies</h2>
                <p className="text-[11px]">
                  <strong>Focus Area:</strong> Demonstrated high score aptitude in Chinese cultural, regional historical, and archaeological studies (focusing on non-verbal artifacts and cultural gastronomy rather than language translation).
                </p>
              </div>

              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950">5. Constraints & Operational Boundaries</h2>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[10px] text-stone-700 font-mono">
                  <li>Linguistic: Limited English & Chinese verbal speech structures.</li>
                  <li>Technical: 0% corporate Information Technology (IT) proficiency.</li>
                  <li>Legal: 0% jurisprudence or law studies.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-stone-400 pt-3 text-center text-[9px] text-stone-500 font-mono">
              Certified authentic. Generated via Tobby Lv&apos;s Secure Digital Portal. All active records locked and verified.
            </div>

          </div>
        </div>

        {/* BRUTALIST THEMED SYSTEM FOOTER */}
        <footer className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase text-zinc-500 gap-4 print:hidden">
          <div>System Version 4.0.2 // Tobby Lv Tactical Interface</div>
          <div className="tracking-[0.25em]">Experimental Sensory Development &copy; 2026 // ADVISORY PROTOCOL</div>
        </footer>

      </div>
    </div>
  );
}
