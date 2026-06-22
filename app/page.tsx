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
  Youtube,
  Gamepad2,
  ChefHat,
  Maximize2,
  Minimize2,
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
  const lightboxRef = React.useRef<HTMLDivElement>(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = React.useState(false);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLbScale(1.0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLbOffset({ x: 0, y: 0 });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLbVideoPlaying(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLbVideoSpeed(1.0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Track browser-level native fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

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
  const [starchyBowl, setStarchyBowl] = React.useState<{ id: number; type: string; color: string; x: number; y: number; angle: number }[]>([]);
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

  // Web Audio Synthesizer for weird tactical and digital effects
  const playWeirdSound = (type: 'click' | 'sonar' | 'glitch' | 'sweep' | 'alarm' | 'candyA' | 'candyB' | 'candyC' | 'dismiss') => {
    if (isFeedMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'sonar') {
        const osc = ctx.createOscillator();
        const biquad = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);
        biquad.type = 'bandpass';
        biquad.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
        osc.connect(biquad);
        biquad.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.1);
      } else if (type === 'glitch') {
        const now = ctx.currentTime;
        [0, 0.03, 0.06].forEach((timeOffset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = Math.random() > 0.5 ? 'triangle' : 'sawtooth';
          const pitch = 800 + Math.random() * 1200;
          osc.frequency.setValueAtTime(pitch, now + timeOffset);
          osc.frequency.setValueAtTime(pitch / 2, now + timeOffset + 0.02);
          gain.gain.setValueAtTime(0.025, now + timeOffset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.025);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + timeOffset);
          osc.stop(now + timeOffset + 0.03);
        });
      } else if (type === 'sweep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === 'alarm') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(850, ctx.currentTime + 0.08);
        osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'candyA') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'candyB') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.24);
      } else if (type === 'candyC') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'dismiss') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {}
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
    // x represents direct horizontal offset in pixels from the bowl's vertical center (-38 to +38)
    const rx = -38 + Math.random() * 76;
    // Parabolic gravitational settling bottom function so candy rests inside the physical bowl bottom curve
    const ry = 94 - (rx * rx) / 58 + (-3 + Math.random() * 6);
    // Custom rotation angle for physical natural layout positioning
    const angle = -45 + Math.random() * 90;
    
    const newCandy = {
      id: Date.now(),
      type,
      color,
      x: rx,
      y: ry,
      angle
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
      
      {/* PERFECT OVERRIDE INJECTION TO FORCE CLEAN SINGLE-SHEET WHITE BACKGROUND DURING PRINT */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html {
            background: white !important;
            color: #0c0a09 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          #interactive-root, .print\\:hidden, header, footer, main, .no-print {
            display: none !important;
            height: 0 !important;
            overflow: hidden !important;
            opacity: 0 !important;
          }
          .print-container-root {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: auto !important;
            background: white !important;
            color: #0c0a09 !important;
            box-sizing: border-box !important;
            padding: 24px !important;
            margin: 0 !important;
            border: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 6mm 10mm;
          }
        }
      `}} />

      {/* 1. PRINT DIALOG SETUP INSTRUCTION */}
      <AnimatePresence>
        {showExportGuide && (
          <motion.div 
            id="print-guide"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg bg-zinc-900 text-white rounded-2xl border-l-4 border-[#FF4500] shadow-2xl p-5 text-sm print:hidden"
          >
            <div className="flex items-start gap-4">
              <Printer className="w-6 h-6 text-[#FF4500] shrink-0 animate-pulse" />
              <div>
                <h4 className="font-bold text-[#FF4500] uppercase tracking-wider font-display text-base">Print Job Triggered</h4>
                <p className="text-zinc-300 mt-1 text-xs">
                  We have formatted a beautiful, highly polished single-page A4 PDF dossier for Tobby Lv. 
                  In your browser print popup, select:
                </p>
                <div className="bg-black/60 p-3 my-3 font-mono text-[11px] leading-relaxed text-zinc-400 rounded-xl border border-zinc-800">
                  &gt; Destination: <span className="text-white">Save as PDF</span><br />
                  &gt; Background Graphics: <span className="text-[#FF4500]">ENABLED</span><br />
                  &gt; Margins: <span className="text-white">NONE or DEFAULT</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a 
                    href="/print"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { playWeirdSound('sonar'); }}
                    className="px-4 py-2 bg-[#FF4500] text-black font-extrabold text-xs uppercase hover:bg-orange-600 border border-[#FF4500] rounded-full transition-all cursor-pointer text-center"
                  >
                    Open Standalone Printer Tab
                  </a>
                  <button 
                    onClick={() => { setShowExportGuide(false); playWeirdSound('dismiss'); }}
                    className="px-4 py-2 bg-transparent text-white font-extrabold text-xs uppercase hover:bg-white hover:text-black border border-white/45 rounded-full transition-all cursor-pointer"
                  >
                    Close Instruction
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="interactive-root" className="print:hidden w-full flex flex-col justify-between flex-1">

        {/* 2. ACTIONS HEADER BAR */}
        <header className="sticky top-0 z-30 w-full bg-[#0A0A0A]/95 backdrop-blur-md px-6 py-6 print:hidden">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#FF4500] rounded-none animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-zinc-400">
                SECURE SIGNAL: TOBBY_LV_TACTICAL_INTERFACE
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <button
                onClick={() => { downloadTextPortfolio(); playWeirdSound('click'); }}
                id="download-txt-cv"
                className="text-xs font-mono font-bold text-zinc-400 hover:text-white transition cursor-pointer hover:underline"
                title="Download structured text resume file directly"
              >
                [DOWNLOAD_RAW_TEXT]
              </button>

              <button
                onClick={() => { handlePrint(); playWeirdSound('sonar'); }}
                id="download-pdf-portfolio"
                className="text-[#FF4500] hover:text-white font-mono font-bold uppercase text-xs tracking-wider transition cursor-pointer hover:underline"
                title="Prints standard single-sheet vector portfolio document using window.print()"
              >
                [PRINT_PORTFOLIO]
              </button>

              <a
                href="/print"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { playWeirdSound('sonar'); }}
                id="print-pdf-separate"
                className="text-white hover:text-[#FF4500] font-mono font-bold uppercase text-xs tracking-wider transition hover:underline flex items-center gap-1.5 bg-[#FF4500]/10 px-3 py-1 bg-zinc-950 border border-[#FF4500]/30 hover:border-[#FF4500] rounded-md"
                title="Opens separate clean tab designed for fault-proof printing and PDF saving"
              >
                <span>[PRINT_STATION]</span>
              </a>
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
            {/* TACTICAL EXTERNAL TRANSMISSIONS */}
            <div className="flex flex-wrap items-center gap-3 mt-4 print:hidden">
              <a 
                href="https://www.youtube.com/shorts/cB2BndeFG_Q" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => playWeirdSound('click')}
                className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/20 border border-red-900/40 hover:border-red-500 rounded text-[10px] font-mono font-bold text-red-400 hover:text-white transition-all shadow-md hover:shadow-red-500/10 cursor-pointer"
                title="Watch Tobby's tactical broadcast on YouTube"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>YOUTUBE BROADCAST</span>
              </a>
              <a 
                href="https://tobby.cc.cd" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => playWeirdSound('click')}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF4500]/10 border border-[#FF4500]/30 hover:border-[#FF4500] rounded text-[10px] font-mono font-bold text-[#FF4500] hover:text-white transition-all shadow-md hover:shadow-[#FF4500]/10 cursor-pointer"
                title="Access Tobby's official interactive simulation / game"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#FF4500]" />
                <span>TOBBY.CC.CD [GAME]</span>
              </a>
            </div>
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
          <section className="col-span-1 lg:col-span-4 flex flex-col justify-between gap-12 print:w-full print:block">
            
            {/* PROFILE HEADSHOT OR CARD */}
            <div className="flex flex-col justify-between h-full space-y-12 print:border-l-2 print:border-zinc-950 print:bg-white print:p-0 print:text-black print:rounded-none">
              <div>
                <div 
                  onClick={() => {
                    setLightboxIndex(activeDossierIndex);
                    setLightboxOpen(true);
                    playWeirdSound('sonar');
                  }}
                  className="relative w-full aspect-square overflow-hidden mb-4 group/dossier cursor-pointer print:max-w-[150px] print:mb-3"
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
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 border border-zinc-900 text-[8px] font-mono tracking-wider z-10 text-[#FF4500]">
                    DOSSIER_FRAME: 0x0{activeDossierIndex + 1}
                  </div>
                </div>

                {/* Dossier Image Selection Thumbnails Slider */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {dossierImages.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => { setActiveDossierIndex(idx); playWeirdSound('click'); }}
                      className={`relative aspect-square transition overflow-hidden cursor-pointer ${
                        activeDossierIndex === idx 
                          ? 'opacity-100 ring-2 ring-[#FF4500] ring-offset-2 ring-offset-black' 
                          : 'opacity-40 hover:opacity-100'
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
                <div className="text-[10px] font-mono leading-relaxed mb-8 pt-2 pl-1">
                  <div className="flex justify-between text-[9px] text-zinc-500 mb-2">
                    <span>FILE_SPEC: TOBBY_LV_0{activeDossierIndex + 1}</span>
                    <span>EXIF: AUTO</span>
                  </div>
                  <span className="text-[#FF4500] font-bold uppercase tracking-wider">{dossierImages[activeDossierIndex].title}</span>
                  <p className="text-zinc-400 mt-1.5 text-[11px] leading-snug">{dossierImages[activeDossierIndex].desc}</p>
                </div>

                <h2 className="text-xs font-semibold tracking-widest uppercase mb-4 text-[#FF4500] print:text-black print:text-lg">
                  {"// PROFESSIONAL SUMMARY"}
                </h2>
                <p className="text-sm leading-relaxed text-zinc-300 print:text-zinc-800 text-justify">
                  A highly distinctive professional characterized by an intense, commanding presence and an innovative, experimental approach to sensory and spatial experiences. Tobby possesses a strong aptitude for Chinese regional and cultural academic subjects, though he operates primarily in non-linguistic areas. He is currently working on refining his highly specific culinary theories regarding sweet-and-savory flavor combinations and maintains a specialized set of tactical physical abilities.
                </p>
              </div>

              {/* Education section in profile column */}
              <div className="pt-10">
                <h2 className="text-xs font-semibold tracking-widest uppercase mb-4 text-[#FF4500] print:text-black">
                  {"// ACADEMIC STRENGTHS & EDUCATION"}
                </h2>
                <p className="text-xs font-mono text-zinc-400 leading-relaxed print:text-zinc-800">
                  &gt; FOCUS AREA: CHINESE REGIONAL HISTORY<br/>
                  &gt; CULTURAL RECOGNITION (NON-VERBAL)<br/>
                  &gt; EXPERIMENTAL FLAVOR THEORY & CHEMISTRY
                </p>
                <p className="text-xs text-zinc-500 mt-3 print:text-zinc-600">
                  Demonstrated advanced aptitude in historical, cultural, or regional topics rather than vocal language acquisition.
                </p>
              </div>
            </div>

            {/* REAL-TIME PROTOCOL LIMITS BANNER */}
            <div className="mt-8 print:border-zinc-300 print:bg-white print:text-black print:p-0">
              <h3 className="text-xs font-semibold tracking-widest text-[#FF4500] uppercase mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{"// LIMITATION SPECIFICATIONS"}</span>
              </h3>
              <ul className="text-xs text-zinc-400 space-y-4 font-mono print:text-zinc-800 list-disc list-inside pl-1">
                <li>
                  <strong className="text-zinc-200 print:text-black">Linguistic Capacity:</strong> Limited English proficiency. Limited Chinese verbal dialogue (non-verbal specialist).
                </li>
                <li>
                  <strong className="text-zinc-200 print:text-black">Information Technology:</strong> 0% training or experience with IT hardware, networking, or systems.
                </li>
                <li>
                  <strong className="text-zinc-200 print:text-black">Jurisprudence / Law:</strong> No prior background study or training in jurisprudence.
                </li>
              </ul>
            </div>
          </section>

          {/* MIDDLE SECTION (5/12 COLUMNS): LIVE CCTV CAM & ACTION EXPERIMENT SANDBOX */}
          <section className="col-span-1 lg:col-span-5 flex flex-col gap-12 print:hidden">
            
            {/* CCTV CAMS PANEL */}
            <div className="flex flex-col justify-between flex-1 space-y-10">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-650 rounded-none animate-ping" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-widest">{"// LIVE SURVEILLANCE FEEDS"}</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  FPS: {fps} | REC
                </div>
              </div>

              {/* Feed selection tab buttons */}
              <div id="feed-selection-grid" className="grid grid-cols-2 gap-0 bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden mb-6 shadow-xl">
                <button
                  id="cam-btn-focus"
                  onClick={() => { setActiveCam(ActiveCam.FOCUS); setIsHoveringFocus(false); playWeirdSound('sweep'); }}
                  className={`py-4 px-4 text-xs sm:text-sm font-mono text-left flex items-center justify-between transition-all cursor-pointer border-r border-b border-zinc-850/60 ${
                    activeCam === ActiveCam.FOCUS 
                      ? 'bg-zinc-900 font-bold text-[#FF4500]' 
                      : 'bg-black/20 text-zinc-400 hover:text-white hover:bg-zinc-900/30'
                  }`}
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF4500]" /> 
                    <span className="font-semibold tracking-wider text-[10px] sm:text-xs">TARGETED STARE</span>
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    activeCam === ActiveCam.FOCUS 
                      ? 'bg-[#FF4500]/10 border-[#FF4500]/50 text-[#FF4500]' 
                      : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                  }`}>01</span>
                </button>

                <button
                  id="cam-btn-hazard"
                  onClick={() => { setActiveCam(ActiveCam.HAZARD); playWeirdSound('sweep'); }}
                  className={`py-4 px-4 text-xs sm:text-sm font-mono text-left flex items-center justify-between transition-all cursor-pointer border-b border-zinc-850/60 ${
                    activeCam === ActiveCam.HAZARD 
                      ? 'bg-zinc-900 font-bold text-[#FF4500]' 
                      : 'bg-black/20 text-zinc-400 hover:text-white hover:bg-zinc-900/30'
                  }`}
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF4500]" /> 
                    <span className="font-semibold tracking-wider text-[10px] sm:text-xs">LIQUID SPILL</span>
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    activeCam === ActiveCam.HAZARD 
                      ? 'bg-[#FF4500]/10 border-[#FF4500]/50 text-[#FF4500]' 
                      : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                  }`}>02</span>
                </button>

                <button
                  id="cam-btn-acoustic"
                  onClick={() => { setActiveCam(ActiveCam.ACOUSTIC); playWeirdSound('sweep'); }}
                  className={`py-4 px-4 text-xs sm:text-sm font-mono text-left flex items-center justify-between transition-all cursor-pointer border-r border-zinc-850/60 ${
                    activeCam === ActiveCam.ACOUSTIC 
                      ? 'bg-zinc-900 font-bold text-[#FF4500]' 
                      : 'bg-black/20 text-zinc-400 hover:text-white hover:bg-zinc-900/30'
                  }`}
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF4500]" /> 
                    <span className="font-semibold tracking-wider text-[10px] sm:text-xs">SCARY SOUND</span>
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    activeCam === ActiveCam.ACOUSTIC 
                      ? 'bg-[#FF4500]/10 border-[#FF4500]/50 text-[#FF4500]' 
                      : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                  }`}>03</span>
                </button>

                <button
                  id="cam-btn-scratch"
                  onClick={() => { setActiveCam(ActiveCam.SCRATCH); playWeirdSound('sweep'); }}
                  className={`py-4 px-4 text-xs sm:text-sm font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                    activeCam === ActiveCam.SCRATCH 
                      ? 'bg-zinc-900 font-bold text-[#FF4500]' 
                      : 'bg-black/20 text-zinc-400 hover:text-white hover:bg-zinc-900/30'
                  }`}
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF4500]" /> 
                    <span className="font-semibold tracking-wider text-[10px] sm:text-xs">HIT & SCRATCH</span>
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    activeCam === ActiveCam.SCRATCH 
                      ? 'bg-[#FF4500]/10 border-[#FF4500]/50 text-[#FF4500]' 
                      : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                  }`}>04</span>
                </button>
              </div>

              {/* VIDEO STREAM SELECTOR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 text-[10px] font-mono">
                <span className="text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1.5 select-none text-[11px]">
                  <Play className="w-3.5 h-3.5 text-[#FF4500]" /> BACKGROUND FOOTAGE:
                </span>
                <div className="flex items-center gap-0 shrink-0 bg-zinc-950 p-1 border border-zinc-850 rounded-lg overflow-hidden">
                  <button
                    onClick={() => { setCctvVideoTrack(VideoFeedID.SIMULID); playWeirdSound('click'); }}
                    className={`px-4 py-1.5 text-[10px] uppercase font-bold transition cursor-pointer rounded-l-md ${
                      cctvVideoTrack === VideoFeedID.SIMULID 
                        ? 'bg-[#FF4500] text-black font-extrabold font-mono shadow' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                    }`}
                  >
                    RAW_HUD
                  </button>
                  <button
                    onClick={() => { setCctvVideoTrack(VideoFeedID.VIDEO1); playWeirdSound('click'); }}
                    className={`px-4 py-1.5 text-[10px] uppercase font-bold transition cursor-pointer rounded-none border-x border-zinc-900/40 ${
                      cctvVideoTrack === VideoFeedID.VIDEO1 
                        ? 'bg-[#FF4500] text-black font-extrabold font-mono shadow' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                    }`}
                    title="Play tactical surveillance video feed 1"
                  >
                    V_FEED_01
                  </button>
                  <button
                    onClick={() => { setCctvVideoTrack(VideoFeedID.VIDEO2); playWeirdSound('click'); }}
                    className={`px-4 py-1.5 text-[10px] uppercase font-bold transition cursor-pointer rounded-r-md ${
                      cctvVideoTrack === VideoFeedID.VIDEO2 
                        ? 'bg-[#FF4500] text-black font-extrabold font-mono shadow' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                    }`}
                    title="Play tactical surveillance video feed 2"
                  >
                    V_FEED_02
                  </button>
                </div>
              </div>

              {/* FEED DIGITAL VIEWPORT */}
              <div className="relative aspect-video w-full bg-black overflow-hidden border border-zinc-850 rounded-2xl shadow-2xl">
                {/* CRT Interference scanlines */}
                <div className="absolute inset-x-0 h-0.5 bg-neutral-800/15 top-1/3 animate-pulse pointer-events-none z-15" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.30)_50%)] bg-[size:100%_4px] pointer-events-none z-15" />

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
                        className="absolute w-12 h-12 border border-[#FF4500] border-dashed rounded-none pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${focusCoord.x * 100}%`, top: `${focusCoord.y * 100}%` }}
                      >
                        <div className="w-2 h-2 bg-[#FF4500] rounded-none animate-ping" />
                      </div>
                    )}

                    {/* Highly stylized brutalist cat eye array */}
                    <div className="flex gap-16 items-center justify-center py-6 relative">
                      {/* Left Eye */}
                      <div className="w-28 h-20 bg-yellow-400 rounded-[50%_15%] relative overflow-hidden flex items-center justify-center border-4 border-yellow-300 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]">
                        <motion.div 
                          className="w-5 h-16 bg-black rounded-none"
                          animate={{
                            x: (focusCoord.x - 0.5) * 55,
                            y: (focusCoord.y - 0.5) * 16,
                          }}
                          transition={{ type: 'spring', stiffness: 140, damping: 12 }}
                        />
                      </div>
                      {/* Right Eye */}
                      <div className="w-28 h-20 bg-yellow-400 rounded-[50%_15%] relative overflow-hidden flex items-center justify-center border-4 border-yellow-300 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]">
                        <motion.div 
                          className="w-5 h-16 bg-black rounded-none"
                          animate={{
                            x: (focusCoord.x - 0.5) * 55,
                            y: (focusCoord.y - 0.5) * 16,
                          }}
                          transition={{ type: 'spring', stiffness: 140, damping: 12 }}
                        />
                      </div>
                    </div>

                    <p className="text-xs font-mono text-zinc-300 text-center uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
                      <span>
                        {isHoveringFocus 
                          ? `LOC COORDS // X:${(focusCoord.x * 100).toFixed(0)} Y:${((1-focusCoord.y) * 100).toFixed(0)}` 
                          : 'MOVE POINTER HERE TO SIMULATE STARE ENGAGEMENT'
                        }
                      </span>
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

                    {/* Aiming/Tactical HUD Grid lines */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-zinc-800/60" />
                      <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-zinc-800/60" />
                    </div>

                    {spills.map((spill) => (
                      <motion.div
                        key={spill.id}
                        initial={{ opacity: 0, scale: 0.2 }}
                        animate={{ opacity: [1, 0.9, 0], scale: 1.6 }}
                        transition={{ duration: 10 }}
                        className="absolute w-36 h-36 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
                        style={{ left: spill.x, top: spill.y }}
                      >
                        <div 
                          className="w-full h-full bg-[#FF4500]/25 border-2 border-dashed border-[#FF4500]/70"
                          style={{ 
                            transform: `rotate(${spill.angle - 90}deg)`,
                            clipPath: 'polygon(50% 0%, 15% 100%, 85% 100%)'
                          }}
                        />
                        <div className="absolute bg-[#FF4500] text-black text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow mt-10 z-10 uppercase tracking-tight">
                          ⚠️ SLIP ZONE
                        </div>
                      </motion.div>
                    ))}

                    <div className="z-10 mb-4 text-center">
                      <div className="text-[10px] text-[#FF4500] font-mono tracking-wider mb-2 uppercase font-extrabold">
                        Origin Point: Tobby
                      </div>
                      <p className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-semibold">Click area to deploy 10-sec slip hazard zone</p>
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
                      <React.Fragment key={rip.id}>
                        {/* Ring 1 */}
                        <motion.div
                          initial={{ scale: 0.1, opacity: 1 }}
                          animate={{ scale: 6.0, opacity: 0 }}
                          transition={{ duration: 1.4, ease: "easeOut" }}
                          className="absolute w-32 h-32 border border-[#FF4500] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                          style={{ left: rip.x, top: rip.y }}
                        />
                        {/* Ring 2 */}
                        <motion.div
                          initial={{ scale: 0.1, opacity: 1 }}
                          animate={{ scale: 4.0, opacity: 0 }}
                          transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }}
                          className="absolute w-32 h-32 border border-orange-500/60 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                          style={{ left: rip.x, top: rip.y }}
                        />
                        {/* Ring 3 */}
                        <motion.div
                          initial={{ scale: 0.1, opacity: 1 }}
                          animate={{ scale: 2.0, opacity: 0 }}
                          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                          className="absolute w-32 h-32 border border-red-550/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                          style={{ left: rip.x, top: rip.y }}
                        />
                      </React.Fragment>
                    ))}

                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 rounded-full border-2 border-[#FF4500] hover:border-orange-500 bg-[#FF4500]/10 hover:bg-[#FF4500]/25 flex items-center justify-center mx-auto transition-all duration-300 shadow-lg shadow-[#FF4500]/20 hover:scale-105 active:scale-95">
                        <Volume2 className="w-12 h-12 text-[#FF4500]" />
                      </div>
                      <div>
                        <p className="font-mono text-sm text-white font-extrabold tracking-wide uppercase">CLICK ANYWHERE TO EMIT RADIAL MEOW WAVE</p>
                        <p className="font-mono text-[10px] text-[#FF4500] uppercase tracking-widest mt-2 bg-black/50 px-3 py-1 rounded inline-block border border-zinc-800 font-bold">
                          Projection Range: 3.5-meter acoustic blast
                        </p>
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
                    <div className="relative w-36 h-56 border-2 border-zinc-700/80 bg-zinc-900/90 flex flex-col justify-between p-4 overflow-hidden rounded-md shadow-2xl">
                      {/* Bullseye rings for target decoration */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className="w-28 h-28 border border-dashed border-zinc-500 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '60s' }}>
                          <div className="w-16 h-16 border border-dashed border-zinc-500 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 border border-[#FF4500] rounded-full" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-x-0 h-5 bg-orange-950/20 border-b border-[#FF4500]/50 top-3" />
                      <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-wider z-10 text-center uppercase">TACTICAL DUMMY EX6</span>

                      {scratches.map((scratch) => (
                        <div 
                          key={scratch.id}
                          className="absolute pointer-events-none flex flex-col gap-0.5 shrink-0 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: scratch.x, top: scratch.y, transform: `translate(-50%, -50%) rotate(${scratch.angle}deg)` }}
                        >
                          <div className="w-12 h-[3.5px] bg-[#FF4500] shadow-[0_0_6px_#FF4500]" />
                          <div className="w-14 h-[3.5px] bg-red-650 shadow-[0_0_6px_#ef4444]" />
                          <div className="w-10 h-[3.5px] bg-amber-505 shadow-[0_0_6px_#f59e0b]" />
                        </div>
                      ))}

                      <div className="text-zinc-400 font-mono text-[9px] text-center tracking-wider z-10 leading-snug">
                        CLICK BODY TO UNLEASH CLAW IMPACTS
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-4 bg-zinc-950/90 px-3 py-1.5 border border-zinc-800 rounded">
                      <span className="text-xs font-mono text-[#FF4500] font-black tracking-widest">STRIKES: {scratches.length}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearScratch(); playWeirdSound('dismiss'); }}
                        className="text-white hover:text-red-500 font-mono text-xs uppercase cursor-pointer hover:underline font-bold transition-all"
                      >
                        [RESET TARGET]
                      </button>
                    </div>
                  </div>
                )}

                {/* CONTROL FEEDS FOOTER METAHUD */}
                <div className="absolute bottom-3 right-4 left-4 flex justify-between items-center bg-black/70 backdrop-blur-sm p-1 text-[9px] font-mono z-30 animate-fade-in">
                  <span className="text-zinc-500">SIGNAL FEED ACTIVE // TACTICAL LAB</span>
                  <div className="flex items-center gap-4">
                    {cctvVideoTrack !== VideoFeedID.SIMULID && (
                      <button
                        onClick={() => {
                          setLightboxIndex(cctvVideoTrack === VideoFeedID.VIDEO1 ? 4 : 5);
                          setLightboxOpen(true);
                          playWeirdSound('sonar');
                        }}
                        className="text-[#FF4500] hover:text-white font-bold transition flex items-center gap-1.5 cursor-pointer underline decoration-1"
                        title="Expand active video feed to full-screen view"
                      >
                        <Maximize2 className="w-3 h-3" /> [EXPAND FEED]
                      </button>
                    )}
                    <button 
                      onClick={() => setIsFeedMuted(!isFeedMuted)} 
                      className="text-zinc-505 hover:text-white transition cursor-pointer"
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
              className="relative group overflow-hidden cursor-pointer mt-4"
              title="Click to view full image in high-res"
            >
              <div className="relative w-full h-36 overflow-hidden">
                <Image
                  src={actionImg}
                  alt="Tobby Lv real research kitchen desktop"
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover grayscale group-hover:grayscale-0 transition duration-700 opacity-50 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center pointer-events-none z-10">
                  <Search className="w-6 h-6 text-[#FF4500] mb-1" />
                  <span className="text-[10px] font-mono tracking-wider text-[#FF4500] uppercase font-bold px-1.5 py-0.5 bg-zinc-950 border border-[#FF4500]">
                    [EXPAND PHOTO SPEC]
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#FF4500] uppercase font-bold tracking-wider">SECURE SENSORY STATION // RESEARCH</span>
                  <p className="text-xs text-zinc-400 mt-1">Japanese-based sweet-savory combinations testing panel</p>
                </div>
                <ChefHat className="w-5 h-5 text-zinc-600" />
              </div>
            </div>
          </section>

          {/* RIGHT SECTION (3/12 COLUMNS): RADICAL FLAVOR PROFILE & CULINARY SANDBOX */}
          <section className="col-span-1 lg:col-span-3 flex flex-col justify-between gap-12 print:w-full print:block">
            
            {/* SAVORY + SWEET FLAVOR DOSSIER */}
            <div className="flex flex-col justify-between h-full space-y-10 print:border-l-2 print:border-zinc-950 print:p-0">
              <div>
                <h3 className="text-sm font-black uppercase mb-6 tracking-widest text-[#FF4500] border-b border-zinc-800 pb-2 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF4500]" />
                  <span>{"// GASTRONOMIC PROFILE"}</span>
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase text-zinc-500 mb-1 tracking-wider">Dietary Habits Overview</h4>
                    <p className="text-xs leading-relaxed text-zinc-300">
                      Tobby operates a non-traditional palate theory applying sudden spikes of glucose directly inside salty amino platforms.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs text-zinc-300 font-mono">
                    <p className="border-l-2 border-[#FF4500]/50 pl-3 py-0.5">
                      <strong className="text-white block mb-1">Starch & Candy Fusion:</strong>
                      <span className="text-zinc-400 font-normal pl-2 block">Combines sugary confectionery candies with noodles & white rice.</span>
                    </p>
                    <p className="border-l-2 border-[#FF4500]/50 pl-3 py-0.5">
                      <strong className="text-white block mb-1">Fruit & Protein Marriage:</strong>
                      <span className="text-zinc-400 font-normal pl-2 block">Mixes sticky dried fruits or citrus slices with pork & beef.</span>
                    </p>
                    <p className="border-l-2 border-[#FF4500]/50 pl-3 py-0.5">
                      <strong className="text-white block mb-1">Threshold Sweetening:</strong>
                      <span className="text-zinc-400 font-normal pl-2 block">Unusually high sugar tolerance; processes high refined sucrose.</span>
                    </p>
                  </div>
                </div>

                <div className="my-8 h-px bg-zinc-800/40" />

                <div className="py-2">
                  <h3 className="text-xs font-black uppercase text-[#FF4500] tracking-wider mb-2">Palate Modernization</h3>
                  <p className="text-[10px] leading-snug font-bold text-zinc-400 uppercase">
                    Replacing refined candy cards with natural sauces & ancient flavors:
                  </p>
                  <ul className="text-[10px] font-mono mt-3 space-y-1 text-zinc-350 list-disc list-inside">
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
            <div className="flex flex-col justify-between print:hidden mt-6">
              <div>
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-2">
                  {"// FLAVOR SYNTHESIZER"}
                </h4>
                <p className="text-[11px] text-zinc-450 font-mono">
                  Simulate Tobby&apos;s daily habit: Drop confectionery candies into the hot noodle substrate.
                </p>
              </div>

              {/* Small physical stylized bowl representation */}
              <div className="my-6 h-28 relative overflow-hidden flex items-center justify-center border-b border-zinc-800">
                <div className="absolute bottom-0 w-32 h-14 border-b-4 border-l-2 border-r-2 border-zinc-700 rounded-b-full flex items-center justify-center">
                  <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest">SAVORY SOUP BASE</span>
                </div>

                {starchyBowl.map((candy) => {
                  if (candy.type === 'Candy A') { // Jellybeans (oval pill)
                    return (
                      <motion.div
                        key={candy.id}
                        initial={{ x: "-50%", y: -35, opacity: 0, rotate: 0 }}
                        animate={{ x: "-50%", y: candy.y, opacity: 1, rotate: candy.angle }}
                        className="absolute w-4 h-2.5 rounded-full border border-black/30 shadow-md"
                        style={{ 
                          left: `calc(50% + ${candy.x}px)`, 
                          top: 0,
                          backgroundColor: candy.color,
                        }}
                        title="Jellybean"
                      />
                    );
                  } else if (candy.type === 'Candy B') { // Candy Corn (triangle)
                    return (
                      <motion.div
                        key={candy.id}
                        initial={{ x: "-50%", y: -35, opacity: 0, rotate: 0 }}
                        animate={{ x: "-50%", y: candy.y, opacity: 1, rotate: candy.angle }}
                        className="absolute w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[14px]"
                        style={{ 
                          left: `calc(50% + ${candy.x}px)`, 
                          top: 0,
                          borderBottomColor: candy.color,
                        }}
                        title="Candy Corn"
                      />
                    );
                  } else { // Gumdrops (gumdrop dome)
                    return (
                      <motion.div
                        key={candy.id}
                        initial={{ x: "-50%", y: -35, opacity: 0, rotate: 0 }}
                        animate={{ x: "-50%", y: candy.y, opacity: 1, rotate: candy.angle }}
                        className="absolute w-4.5 h-3.5 rounded-t-full border border-black/20 shadow-md"
                        style={{ 
                          left: `calc(50% + ${candy.x}px)`, 
                          top: 0,
                          backgroundColor: candy.color,
                        }}
                        title="Gumdrop"
                      />
                    );
                  }
                })}

                {starchyBowl.length === 0 && (
                  <span className="text-zinc-650 font-mono text-[9px] text-center px-4 uppercase tracking-wider animate-pulse">0% Additives. Drop starch elements below.</span>
                )}
              </div>

              {/* Candy Dropping buttons */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                  <button 
                    onClick={() => { addCandyToNoodle('Candy A', '#FF4500'); playWeirdSound('candyA'); }}
                    className="py-1 px-3 text-[10px] font-mono text-zinc-400 hover:text-white transition-all cursor-pointer underline decoration-1 text-left"
                  >
                    + JELLYBEANS
                  </button>
                  <button 
                    onClick={() => { addCandyToNoodle('Candy B', '#eab308'); playWeirdSound('candyB'); }}
                    className="py-1 px-3 text-[10px] font-mono text-zinc-400 hover:text-white transition-all cursor-pointer underline decoration-1 text-left"
                  >
                    + CANDY CORN
                  </button>
                  <button 
                    onClick={() => { addCandyToNoodle('Candy C', '#a855f7'); playWeirdSound('candyC'); }}
                    className="py-1 px-3 text-[10px] font-mono text-zinc-400 hover:text-white transition-all cursor-pointer underline decoration-1 text-left"
                  >
                    + GUMDROPS
                  </button>
                  <button 
                    onClick={() => { clearStarchyBowl(); playWeirdSound('dismiss'); }}
                    className="py-1 px-3 text-[10px] font-mono text-[#FF4500] hover:text-white transition-all cursor-pointer underline decoration-1 text-left"
                  >
                    [CLEAR MEAL]
                  </button>
                </div>

                <div className="pt-4 mt-2">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-zinc-500">GLYCEMIC INDEX LEVEL:</span>
                    <span className={starchyBowl.length === 0 ? "text-zinc-500 font-bold" : starchyBowl.length <= 3 ? "text-yellow-500 font-bold" : starchyBowl.length <= 6 ? "text-orange-500 font-bold animate-pulse" : "text-[#FF4500] font-black tracking-wider animate-bounce"}>
                      {Math.min(starchyBowl.length * 15, 100)}% 
                      ({starchyBowl.length === 0 ? "0% CLEAN" : starchyBowl.length <= 3 ? "STARCH WARNING" : starchyBowl.length <= 6 ? "HIGH GLYCEMIC" : "CRITICAL OVERLOAD!"})
                    </span>
                  </div>
                  <div className="h-1 bg-zinc-950 w-full mt-2 overflow-hidden rounded-full">
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

      </div> {/* Close #interactive-root container wrapper */}

      {/* COMPACT PRINT-ONLY BEAUTIFIED LAYOUT AND PARAMETERS */}
      <div className="hidden print:block print-container-root bg-white font-sans text-stone-950 p-6 max-w-[210mm] mx-auto text-xs leading-relaxed border-0">
        <div className="border border-stone-950 p-6 space-y-4">
            
            <div className="flex justify-between items-start border-b-2 border-stone-950 pb-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight uppercase">TOBBY LV</h1>
                <p className="text-xs font-mono text-stone-700 mt-1 uppercase tracking-wider">Tactical Presence & Experimental Flavor Specialist</p>
                <p className="text-stone-600 mt-1">Location: Tokyo-based Profile (Chinese Cultural Background)</p>
                <div className="text-[10px] space-y-1 mt-1.5 text-stone-700 flex flex-col font-mono">
                  <a href="https://www.youtube.com/shorts/cB2BndeFG_Q" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    <Youtube className="w-3 h-3 text-red-600 inline" /> 
                    <span>YouTube: youtube.com/shorts/cB2BndeFG_Q</span>
                  </a>
                  <a href="https://tobby.cc.cd" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3 text-[#FF4500] inline" /> 
                    <span>Game: tobby.cc.cd</span>
                  </a>
                </div>
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

        {/* INTERACTIVE FULLSCREEN DOSSIER & VIDEO METRIC LIGHTBOX */}
        <div className="print:hidden">
          <AnimatePresence>
            {lightboxOpen && (
            <motion.div
              ref={lightboxRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-[#070707] flex flex-col justify-between overflow-hidden text-white font-mono select-none"
            >
              {/* Backgrid scanner overlay pattern */}
              {lbHudGrid && (
                <div 
                  className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40 z-0" 
                />
              )}
              {/* Scanlines layer */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

              {/* LIGHTBOX HEADER */}
              <header className="z-20 flex justify-between items-center bg-zinc-950 p-4 border-b border-zinc-900 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-[#FF4500] animate-pulse" />
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold leading-none">TACTICAL MEDIA ANALYZER v4</span>
                    <span className="text-xs uppercase font-bold text-zinc-200 mt-1 block">
                      {tacticalMediaList[lightboxIndex].title}{" // "}{tacticalMediaList[lightboxIndex].spec}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setLbHudGrid(!lbHudGrid); playWeirdSound('click'); }}
                    className={`px-3 py-1 text-[10px] border tracking-wider transition rounded-full cursor-pointer ${
                      lbHudGrid 
                        ? 'border-[#FF4500] bg-[#FF4500]/10 text-[#FF4500]' 
                        : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    GRID_OVERLAY: {lbHudGrid ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={async () => {
                      playWeirdSound('click');
                      try {
                        if (!document.fullscreenElement) {
                          await lightboxRef.current?.requestFullscreen();
                          setIsNativeFullscreen(true);
                        } else {
                          await document.exitFullscreen();
                          setIsNativeFullscreen(false);
                        }
                      } catch (err) {
                        console.warn("Fullscreen toggle rejected by browser or frame sandboxing.", err);
                      }
                    }}
                    className={`px-3 py-1 text-[10px] border tracking-wider transition rounded-full cursor-pointer flex items-center gap-1.5 ${
                      isNativeFullscreen 
                        ? 'border-[#FF4500] bg-[#FF4500]/25 text-white' 
                        : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                    title="Toggle true full-screen browser mode"
                  >
                    {isNativeFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                    {isNativeFullscreen ? 'WINDOW' : 'FULLSCREEN'}
                  </button>
                  <button
                    onClick={() => { setLightboxOpen(false); playWeirdSound('dismiss'); }}
                    className="p-1 px-3 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  >
                    <X className="w-4 h-4" /> [DISMISS]
                  </button>
                </div>
              </header>

              {/* MAIN CONTENT VIEWPORT */}
              <main className="relative flex-1 flex flex-col lg:flex-row items-stretch justify-center overflow-hidden z-10">
                {/* PREVIOUS COMPONENT NAVIGATION BUTTON */}
                <button
                  onClick={() => { setLightboxIndex((prev) => (prev - 1 + tacticalMediaList.length) % tacticalMediaList.length); playWeirdSound('glitch'); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-zinc-950/85 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#FF4500] rounded-full transition group cursor-pointer"
                  title="Previous Media (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                {/* NEXT COMPONENT NAVIGATION BUTTON */}
                <button
                  onClick={() => { setLightboxIndex((prev) => (prev + 1) % tacticalMediaList.length); playWeirdSound('glitch'); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-zinc-950/85 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#FF4500] rounded-full transition group cursor-pointer"
                  title="Next Media (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* CENTRAL STAGE */}
                <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden bg-black/40">
                  {/* Scope target guides */}
                  {lbHudGrid && (
                    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                      <div className="absolute w-28 h-28 border border-dashed border-zinc-850 rounded-full opacity-60" />
                      <div className="absolute w-60 h-60 border border-[#FF4500]/10 rounded-full opacity-40 animate-spin-slow" />
                      <div className="absolute w-12 h-[1px] bg-[#FF4500]/40 -ml-6" />
                      <div className="absolute w-12 h-[1px] bg-[#FF4500]/40 ml-12" />
                      <div className="absolute h-12 w-[1px] bg-[#FF4500]/40 -mt-6" />
                      <div className="absolute h-12 w-[1px] bg-[#FF4500]/40 mt-12" />
                    </div>
                  )}

                  {/* MEDIA HOLDER CONTAINER */}
                  <div className="relative w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center overflow-hidden">
                    {tacticalMediaList[lightboxIndex].type === 'image' ? (
                      <div 
                        onMouseDown={(e) => {
                          if (lbScale > 1) {
                            e.preventDefault();
                            const startX = e.clientX;
                            const startY = e.clientY;
                            const curX = lbOffset.x;
                            const curY = lbOffset.y;
                            
                            const handleMouseMove = (mmE: MouseEvent) => {
                              const dx = mmE.clientX - startX;
                              const dy = mmE.clientY - startY;
                              setLbOffset({ x: curX + dx, y: curY + dy });
                            };
                            
                            const handleMouseUp = () => {
                              window.removeEventListener('mousemove', handleMouseMove);
                              window.removeEventListener('mouseup', handleMouseUp);
                            };
                            
                            window.addEventListener('mousemove', handleMouseMove);
                            window.addEventListener('mouseup', handleMouseUp);
                          }
                        }}
                        className="relative w-full h-full select-none cursor-grab active:cursor-grabbing"
                        style={{
                          transform: `scale(${lbScale}) translate(${lbOffset.x / lbScale}px, ${lbOffset.y / lbScale}px)`,
                          transition: lbScale === 1 ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                        }}
                      >
                        <Image
                          src={tacticalMediaList[lightboxIndex].src}
                          alt={tacticalMediaList[lightboxIndex].title}
                          fill
                          priority
                          sizes="90vw"
                          referrerPolicy="no-referrer"
                          className="object-contain transition-all duration-300 pointer-events-none"
                          style={{
                            filter: 
                              lbFilter === 'grayscale' ? 'grayscale(100%) contrast(120%)' :
                              lbFilter === 'thermal' ? 'contrast(130%) saturate(200%) hue-rotate(90deg) invert(100%)' :
                              lbFilter === 'night' ? 'brightness(120%) contrast(150%) sepia(100%) hue-rotate(100deg) saturate(350%)' :
                              lbFilter === 'amber' ? 'sepia(100%) saturate(300%) hue-rotate(15deg) brightness(95%) contrast(110%)' : 'none'
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        className="relative w-full h-full flex items-center justify-center overflow-hidden"
                      >
                        <video
                          ref={lbVideoRef}
                          src={typeof tacticalMediaList[lightboxIndex].src === 'string' ? (tacticalMediaList[lightboxIndex].src as string) : undefined}
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full max-h-[85vh] object-contain"
                          style={{
                            filter: 
                              lbFilter === 'grayscale' ? 'grayscale(100%) contrast(120%)' :
                              lbFilter === 'thermal' ? 'contrast(130%) saturate(200%) hue-rotate(90deg) invert(100%)' :
                              lbFilter === 'night' ? 'brightness(120%) contrast(150%) sepia(100%) hue-rotate(100deg) saturate(350%)' :
                              lbFilter === 'amber' ? 'sepia(100%) saturate(300%) hue-rotate(15deg) brightness(95%) contrast(110%)' : 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM METADATA & CONTROL DECK */}
                <div className="w-full lg:w-80 shrink-0 bg-[#0b0b0b] border-t lg:border-t-0 lg:border-l border-zinc-900 p-4 font-mono text-zinc-400 flex flex-col justify-between gap-4 select-none z-20 overflow-y-auto">
                  <div className="space-y-4">
                    {/* ASSET SPEC */}
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">ASSET_SPECIFICATION</div>
                      <div className="text-sm font-bold text-white border-b border-zinc-900 pb-2 flex justify-between items-center">
                        <span>{tacticalMediaList[lightboxIndex].spec}</span>
                        <span className="text-[10px] font-mono tracking-widest text-[#FF4500] px-1.5 py-0.5 bg-[#FF4500]/10 border border-[#FF4500]/20">
                          {tacticalMediaList[lightboxIndex].type.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* ASSET METADATA DESCRIPTION */}
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">OBSERVATION_LOG</div>
                      <p className="text-xs text-zinc-300 leading-relaxed bg-[#111] p-2 border border-zinc-900 rounded-none">
                        {tacticalMediaList[lightboxIndex].desc}
                      </p>
                    </div>

                    {/* DYNAMIC ZOOM / IMAGE CONTROLS */}
                    {tacticalMediaList[lightboxIndex].type === 'image' && (
                      <div className="space-y-2 pt-1 border-t border-zinc-900">
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">HUD_ZOOM_PAN_MODULE</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => setLbScale((s) => Math.min(s + 0.5, 4))}
                            className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition text-[10px] font-bold text-center flex items-center justify-center gap-1 cursor-pointer hover:text-[#FF4500]"
                          >
                            <ZoomIn className="w-3 h-3" /> ZOOM_IN
                          </button>
                          <button
                            onClick={() => setLbScale((s) => Math.max(s - 0.5, 1))}
                            className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition text-[10px] font-bold text-center flex items-center justify-center gap-1 cursor-pointer hover:text-[#FF4500]"
                          >
                            <ZoomOut className="w-3 h-3" /> ZOOM_OUT
                          </button>
                          <button
                            onClick={() => { setLbScale(1.0); setLbOffset({ x: 0, y: 0 }); }}
                            className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition text-[10px] font-bold text-center flex items-center justify-center gap-1 cursor-pointer hover:text-[#FF4500]"
                          >
                            RESET
                          </button>
                        </div>
                        {lbScale > 1 && (
                          <div className="text-[8px] text-zinc-500 text-center animate-pulse tracking-wide italic font-bold">
                            🔍 CLICK & DRAG TO PAN ACREAGE
                          </div>
                        )}
                        <div className="text-[10px] flex justify-between bg-zinc-950 p-1.5 border border-zinc-900 mt-1">
                          <span className="text-zinc-600">SCALE:</span>
                          <span className="text-white font-bold">{lbScale.toFixed(1)}x</span>
                          <span className="text-zinc-600 pl-2 font-mono">PAN:</span>
                          <span className="text-white font-bold">X:{lbOffset.x.toFixed(0)} Y:{lbOffset.y.toFixed(0)}</span>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC VIDEO PLAYBACK CONTROLS */}
                    {tacticalMediaList[lightboxIndex].type === 'video' && (
                      <div className="space-y-3 pt-2 border-t border-zinc-900">
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">TACTICAL_VIDEO_PLAYER_HUD_CONTROLS</div>
                        
                        {/* Play/Pause & Mute / Speed */}
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => setLbVideoPlaying(!lbVideoPlaying)}
                            className="px-2 py-1.5 bg-zinc-900 hover:bg-[#FF4500]/10 border border-zinc-800 hover:border-[#FF4500]/50 transition text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer uppercase text-zinc-200"
                          >
                            {lbVideoPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5 text-[#FF4500]" /> PAUSE_REC
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 text-green-500" /> PLAY_LIVE
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => setLbVideoMuted(!lbVideoMuted)}
                            className="px-2 py-1.5 bg-zinc-900 hover:bg-[#FF4500]/10 border border-zinc-800 hover:border-[#FF4500]/50 transition text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer uppercase text-zinc-200"
                          >
                            {lbVideoMuted ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> UNMUTE_AUDIO
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-[#FF4500]" /> AUDIO_ON
                              </>
                            )}
                          </button>
                        </div>

                        {/* TIME SCRUBBER */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] text-zinc-500">
                            <span>TIMELINE_SCRUB</span>
                            <span className="font-mono text-zinc-300 font-bold">
                              {lbVideoTime.toFixed(1)}s / {lbVideoDuration.toFixed(1)}s
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={lbVideoDuration || 100}
                            step="0.05"
                            value={lbVideoTime}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (lbVideoRef.current) {
                                lbVideoRef.current.currentTime = val;
                              }
                              setLbVideoTime(val);
                            }}
                            className="w-full accent-[#FF4500] bg-zinc-900 border border-zinc-800 h-1.5 cursor-pointer rounded-none"
                          />
                        </div>

                        {/* SPEED SELECTOR */}
                        <div className="space-y-1">
                          <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">SPEED_RATE</div>
                          <div className="grid grid-cols-4 gap-1 p-0.5 bg-zinc-950 border border-zinc-900 font-mono text-[9px]">
                            {[0.25, 0.5, 1.0, 2.0].map((spd) => (
                              <button
                                key={spd}
                                onClick={() => setLbVideoSpeed(spd)}
                                className={`py-1 font-bold tracking-tighter transition cursor-pointer ${
                                  lbVideoSpeed === spd
                                    ? 'bg-[#FF4500] text-black'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HUD SENSORY FILTERS SELECTION */}
                    <div className="space-y-2 pt-2 border-t border-zinc-900">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">SENSORY_FILTERS_GRID</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'normal', label: 'NORMAL_RAW', color: 'border-zinc-800 text-zinc-300' },
                          { id: 'night', label: 'NIGHT_PHOSPHOR', color: 'border-emerald-900/60 text-emerald-400 focus-within:ring-emerald-500' },
                          { id: 'thermal', label: 'THERMAL_INFRARED', color: 'border-rose-900/60 text-rose-400 focus-within:ring-rose-500' },
                          { id: 'amber', label: 'AMBER_HUD_SIGNAL', color: 'border-amber-900/60 text-amber-400 focus-within:ring-amber-500' },
                          { id: 'grayscale', label: 'MONOCHROMIC', color: 'border-zinc-700/60 text-zinc-400 focus-within:ring-zinc-400' },
                        ].map((flt) => (
                          <button
                            key={flt.id}
                            onClick={() => setLbFilter(flt.id as any)}
                            className={`px-1.5 py-1 text-[9px] uppercase font-bold text-left border transition flex items-center justify-between cursor-pointer ${flt.color} ${
                              lbFilter === flt.id 
                                ? 'bg-zinc-900 text-[#FF4500] border-[#FF4500] shadow-md shadow-[#FF4500]/10' 
                                : 'bg-transparent hover:bg-zinc-950 hover:border-zinc-700'
                            }`}
                          >
                            {flt.label}
                            {lbFilter === flt.id && <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-ping" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM DECK LOGS */}
                  <div className="text-[9px] border-t border-zinc-900 pt-2 text-zinc-600 font-mono leading-relaxed bg-zinc-950/20 p-2 border border-zinc-900">
                    <div>DEVICE: TR-800 RECON SPEC</div>
                    <div>RESOLUTION: {tacticalMediaList[lightboxIndex].type === 'image' ? '2560 X 1440 QHD' : '1920 X 1080 FHD'}</div>
                    <div className="text-[#FF4500] font-bold mt-1 uppercase animate-pulse">● SIGNAL CONNECTED // ENCRYPTION: OK</div>
                  </div>
                </div>
              </main>

              {/* OVERALL LIGHTBOX FOOTER PROGRESS */}
              <footer className="z-20 bg-zinc-950 border-t border-zinc-900 px-4 py-2.5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-zinc-500 gap-2 shrink-0">
                <div className="flex gap-4">
                  <span>FRAME INDEX: 0x0{lightboxIndex + 1}</span>
                  <span>TIME OF RECORD: {timeStr}</span>
                </div>
                <div className="flex gap-2">
                  {tacticalMediaList.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => { setLightboxIndex(idx); playWeirdSound('glitch'); }}
                      className={`w-4 h-4 text-[8px] font-bold font-mono transition border rounded-full flex items-center justify-center cursor-pointer ${
                        lightboxIndex === idx
                          ? 'bg-[#FF4500] text-black border-[#FF4500]'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-500'
                      }`}
                      title={`Go to detail ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <div>SECURE CONNECTION ENCRYPTED STATUS // SYSTEM: 4.0.2</div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
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
