'use client';

import * as React from 'react';
import { Printer, ArrowLeft, Download, Check, AlertCircle, Youtube, Gamepad2, ExternalLink } from 'lucide-react';

export default function CVPrintPage() {
  const [printInitiated, setPrintInitiated] = React.useState(false);

  // Automatically trigger the browser's printing dialog after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.print();
        setPrintInitiated(true);
      } catch (err) {
        console.error('Trigger print error:', err);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleManualPrint = () => {
    try {
      window.print();
      setPrintInitiated(true);
    } catch (err) {
      alert('Printing is not supported or blocked in this browser context.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-300 font-sans p-4 sm:p-8 flex flex-col items-center">
      
      {/* Print CSS Override to ensure only the A4 sheet prints beautifully */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html {
            background: white !important;
            color: #0c0a09 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .a4-print-sheet {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            background: white !important;
            color: #0c0a09 !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm 12mm;
          }
        }
      `}} />

      {/* Top action header for client view (hidden on printed pages) */}
      <header className="no-print w-full max-w-[210mm] mb-8 bg-zinc-950 border border-zinc-850 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.close()}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer flex items-center justify-center"
            title="Go back / close window"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-mono font-bold text-white tracking-wider flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#FF4500]" /> TOBBY_LV_PRINT_ENGINE
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono">STANDALONE VECTOR RESUME CONTEXT</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {printInitiated ? (
            <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> DIALOG TRIGGERED
            </span>
          ) : (
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono px-3 py-1.5 rounded-lg flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> QUEUING SYSTEM...
            </span>
          )}

          <button
            onClick={handleManualPrint}
            className="px-4 py-1.5 bg-[#FF4500] hover:bg-orange-600 text-black font-extrabold text-xs uppercase rounded-lg transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-orange-500/10"
          >
            <Printer className="w-3.5 h-3.5" /> Print CV
          </button>
        </div>
      </header>

      {/* Instructions Overlay for Desktop/Users */}
      <div className="no-print w-full max-w-[210mm] mb-6 bg-zinc-950/40 border border-zinc-800/60 p-4 rounded-xl text-[11px] leading-relaxed text-zinc-400 space-y-1 font-mono">
        <p className="text-zinc-200 font-bold">&gt; OPTIMAL PDF EXPORT PRESETS FOR BROWSER PRINT DIALOG:</p>
        <p className="pl-3 text-red-400">&gt; Destination: <span className="text-white font-bold">Save as PDF</span></p>
        <p className="pl-3 text-red-400">&gt; Background Graphics: <span className="text-[#FF4500] font-bold">ENABLED (Check box under More Settings)</span></p>
        <p className="pl-3 text-red-400">&gt; Margin: <span className="text-white font-bold">None or Default</span></p>
      </div>

      {/* The Printable Page Sheet */}
      <main className="a4-print-sheet bg-white text-stone-950 p-10 w-full max-w-[210mm] shadow-2xl rounded-sm border border-stone-200 print:shadow-none print:border-none aspect-[1/1.414] select-text">
        <div className="border border-stone-950 p-6 md:p-8 h-full flex flex-col justify-between">
          <div>
            {/* Header section with title and Reference */}
            <div className="flex justify-between items-start border-b-2 border-stone-950 pb-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-stone-950 font-sans uppercase">TOBBY LV</h2>
                <p className="text-xs font-mono text-stone-700 mt-1 uppercase tracking-wider">Tactical Presence & Experimental Flavor Specialist</p>
                <p className="text-stone-600 mt-1 text-[11px]">Location: Tokyo-based Profile (Chinese Cultural Background)</p>
                <div className="text-[10px] space-y-1 mt-1.5 text-stone-700 flex flex-col font-mono">
                  <a href="https://www.youtube.com/shorts/cB2BndeFG_Q" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    <Youtube className="w-3 h-3 text-red-600" /> 
                    <span>YouTube: youtube.com/shorts/cB2BndeFG_Q</span>
                  </a>
                  <a href="https://tobby.cc.cd" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3 text-[#FF4500]" /> 
                    <span>Game: tobby.cc.cd</span>
                  </a>
                </div>
              </div>
              <div className="text-right font-mono text-[9px] text-stone-600 space-y-0.5 uppercase">
                <p>Reference ID: TL-992-G</p>
                <p className="text-stone-950 font-bold">CLASSIFICATION: APEX ADVISOR</p>
                <p>GRID REF: Tokyo-Japanese</p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6 mt-6">
              
              {/* Profile Overview */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950 text-stone-950 font-mono">
                  1. Professional Overview
                </h3>
                <p className="text-[11px] leading-relaxed text-stone-800 text-justify">
                  A highly distinctive professional characterized by an intense, commanding presence and an innovative, experimental approach to sensory and spatial experiences. Tobby possesses a strong aptitude for Chinese regional and cultural academic studies, operating primarily in non-linguistic areas. He is currently working on refining his highly specific culinary theories regarding sweet-and-savory flavor combinations and maintains a specialized set of tactical physical abilities.
                </p>
              </div>

              {/* Grid Column Layout for Parameters & Lab */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950 text-stone-950 font-mono">
                    2. Physical & Tactical Parameters
                  </h3>
                  <ul className="list-disc list-inside space-y-2 pl-1 leading-relaxed text-[10.5px] text-stone-800">
                    <li><strong>Spatial Hazard Control:</strong> Rapidly deploys water hazard cones (0.6m, 80° cone area, temporary 10-second duration) to manage physical territorial lanes.</li>
                    <li><strong>Targeted Eyesight Focus:</strong> High-intensity pupil visual alignment; locks and tracks single coordinate positions with absolute focus.</li>
                    <li><strong>Acoustic Radial Sound Strike:</strong> Quick-activation radial shock sound (3.0m radius capacity) for instant defensive environmental control.</li>
                    <li><strong>Close-Quarter Scratch:</strong> Advanced agile physical contact, applying continuous targeted scratch and impact patterns.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950 text-stone-950 font-mono">
                    3. Experimental Culinary Lab
                  </h3>
                  <p className="text-[10.5px] leading-relaxed text-stone-800 mb-2">
                    Highly developed, non-traditional preference for sweet-savory combinations. Daily starches include mixes of confectionery sugars inside white rice and standard noodle dishes.
                  </p>
                  <div className="pt-2 border-t border-stone-300">
                    <span className="font-bold underline text-[10px] text-stone-950">Active Chef Professionalization:</span>
                    <ul className="list-disc list-inside space-y-1 mt-1 pl-1 text-[10px] text-stone-700 leading-normal">
                      <li>Transitioning artificial sugars to organic whole fruits and sauce glazes.</li>
                      <li>Applying soy base to Thai Pineapple fried rice.</li>
                      <li>Preparing pear-marinated sesame Korean Bulgogi beef.</li>
                      <li>Glazing home-made sweet-sour ginger honey salmon.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Grid or simple boxes for Studies & Constraints */}
              <div className="grid grid-cols-2 gap-6 pt-3 border-t border-stone-200">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950 text-stone-950 font-mono">
                    4. Academic Focus & Studies
                  </h3>
                  <p className="text-[11px] leading-relaxed text-stone-800">
                    <strong>Focus Area:</strong> Demonstrated high score aptitude in Chinese cultural, regional historical, and archaeological studies (focusing on non-verbal artifacts and cultural gastronomy rather than language translation).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border-l-4 border-stone-950 text-stone-950 font-mono">
                    5. Constraints & Operational Boundaries
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[10px] text-stone-700 font-mono leading-relaxed">
                    <li>Linguistic: Limited English & Chinese verbal speech structures.</li>
                    <li>Technical: 0% corporate Information Technology (IT) proficiency.</li>
                    <li>Legal: 0% jurisprudence or law studies.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-stone-400 pt-3 text-center text-[9px] text-stone-500 font-mono uppercase mt-6">
            Certified authentic. Generated via Tobby Lv&apos;s Secure Digital Portal. All active records locked and verified.
          </div>
        </div>
      </main>

    </div>
  );
}
