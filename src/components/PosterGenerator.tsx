import React, { useRef, useEffect, useState } from 'react';
import { Download, AlertTriangle, RefreshCw, Printer, CheckCircle, Share2 } from 'lucide-react';

interface PosterGeneratorProps {
  entityName: string;
  sourceText?: string;
  scamPatterns?: string[];
  riskRating?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default function PosterGenerator({ entityName, sourceText, scamPatterns = [], riskRating = 'HIGH' }: PosterGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Poster Customizable Fields
  const [titleText, setTitleText] = useState('WARNING: UNVERIFIED OFFER');
  const [targetName, setTargetName] = useState(entityName || 'Unlicensed Recruiter');
  const [warningMessage, setWarningMessage] = useState('This entity is NOT certified by the Department of Employment. Do not pay any fees upfront!');
  const [primaryColor, setPrimaryColor] = useState('#DC2626'); // default Red
  const [template, setTemplate] = useState<'red' | 'yellow' | 'slate'>('red');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (entityName) {
      setTargetName(entityName);
    }
  }, [entityName]);

  useEffect(() => {
    if (template === 'red') {
      setPrimaryColor('#DC2626'); // Red
      setTitleText('🚨 CRITICAL SCAM WARNING');
      setWarningMessage(`WARNING: "${targetName}" is NOT a verified government agency. Do NOT transfer money!`);
    } else if (template === 'yellow') {
      setPrimaryColor('#EAB308'); // Yellow
      setTitleText('⚠️ COMMUNITY CAUTION NOTICE');
      setWarningMessage(`BEWARE: "${targetName}" has failed license verification. Upfront visa/medical fees are illegal.`);
    } else {
      setPrimaryColor('#1E293B'); // Slate
      setTitleText('📖 MIGRANT SAFE ADVISORY');
      setWarningMessage(`SAFETY FIRST: Always verify agents. Never travel on tourist visas. Check before paying.`);
    }
  }, [template, targetName]);

  // Handle poster rendering
  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions for high resolution print/share (800 x 1200 - Portrait A4 ratio)
    canvas.width = 800;
    canvas.height = 1200;

    // Background color
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw hazard border / stripes
    const borderWidth = 30;
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Inner white board
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(borderWidth, borderWidth, canvas.width - (borderWidth * 2), canvas.height - (borderWidth * 2));

    // Draw caution hazard stripes at top and bottom if red or yellow
    if (template === 'red' || template === 'yellow') {
      const stripeHeight = 25;
      const stripeWidth = 40;
      ctx.fillStyle = '#000000';
      // Top hazard tape
      for (let i = borderWidth; i < canvas.width - borderWidth; i += stripeWidth * 2) {
        ctx.beginPath();
        ctx.moveTo(i, borderWidth);
        ctx.lineTo(i + stripeWidth, borderWidth);
        ctx.lineTo(i + stripeWidth + 15, borderWidth + stripeHeight);
        ctx.lineTo(i + 15, borderWidth + stripeHeight);
        ctx.closePath();
        ctx.fill();
      }
      // Bottom hazard tape
      for (let i = borderWidth; i < canvas.width - borderWidth; i += stripeWidth * 2) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - borderWidth - stripeHeight);
        ctx.lineTo(i + stripeWidth, canvas.height - borderWidth - stripeHeight);
        ctx.lineTo(i + stripeWidth + 15, canvas.height - borderWidth);
        ctx.lineTo(i + 15, canvas.height - borderWidth);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Top Header Badge
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(titleText.toUpperCase(), canvas.width / 2, 120);

    // Divider Line
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, 160);
    ctx.lineTo(700, 160);
    ctx.stroke();

    // WARNING icon or emblem
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    // Center of emblem at x=400, y=260
    ctx.arc(400, 260, 60, 0, Math.PI * 2);
    ctx.fill();

    // White exclamation mark inside
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 80px "Space Grotesk", sans-serif';
    ctx.fillText('!', 400, 285);

    // Target Subject Title
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px "Space Grotesk", sans-serif';
    ctx.fillText('FLAGGED ENTITY / OFFER:', canvas.width / 2, 390);

    // Red Box containing Subject Name
    ctx.fillStyle = template === 'yellow' ? '#FEF9C3' : template === 'red' ? '#FEE2E2' : '#F1F5F9';
    ctx.fillRect(80, 420, 640, 100);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 420, 640, 100);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 34px "Space Grotesk", sans-serif';
    ctx.fillText(targetName.substring(0, 40), canvas.width / 2, 480);

    // Warning Message Wrap Text helper
    ctx.fillStyle = '#1E293B';
    ctx.font = 'normal 24px sans-serif';
    
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      return currentY + lineHeight;
    };

    const textStartY = wrapText(warningMessage, canvas.width / 2, 580, 620, 35);

    // Safe Guidelines section box
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(80, textStartY + 20, 640, 360);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, textStartY + 20, 640, 360);

    // Section Header
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.fillText('CRITICAL PROTECTION RULES:', canvas.width / 2, textStartY + 60);

    // Rules Text (bullet points)
    ctx.textAlign = 'left';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.fillText('❌ RULE 1: NEVER pay money upfront for work visa promises.', 110, textStartY + 110);
    
    ctx.fillStyle = '#1E293B';
    ctx.font = 'normal 18px sans-serif';
    ctx.fillText('Legit agencies charge service fees only AFTER stamping and contracts.', 110, textStartY + 135);

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText('❌ RULE 2: NEVER fly on tourist/visitor visas for employment.', 110, textStartY + 185);
    
    ctx.fillStyle = '#1E293B';
    ctx.font = 'normal 18px sans-serif';
    ctx.fillText('Tourist visas CANNOT be safely converted. It is a Human Trafficking trap.', 110, textStartY + 210);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText('✅ RULE 3: Verify the Agency License before signing anything.', 110, textStartY + 260);
    
    ctx.fillStyle = '#1E293B';
    ctx.font = 'normal 18px sans-serif';
    ctx.fillText('Check license validity on local government portal or MobiVerifier.', 110, textStartY + 285);

    // Bottom Footer in Poster
    ctx.textAlign = 'center';
    ctx.fillStyle = '#475569';
    ctx.font = 'normal 16px monospace';
    ctx.fillText('PROTECT YOUR COMMUNITY. SHARE THIS POSTER.', canvas.width / 2, 1070);

    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.fillText('MobiVerifier Safe Deployment Campaign 2026', canvas.width / 2, 1105);
    
    ctx.fillStyle = '#64748B';
    ctx.font = 'normal 14px sans-serif';
    ctx.fillText('Generated client-side to empower vulnerable youth and raise public awareness.', canvas.width / 2, 1130);
  };

  // Redraw canvas whenever user changes fields
  useEffect(() => {
    drawPoster();
  }, [targetName, titleText, warningMessage, template, primaryColor]);

  // Action: Download Poster
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `MobiVerifier_Warning_${targetName.replace(/\s+/g, '_')}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Action: Print Poster
  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL();
    const windowContent = '<!DOCTYPE html><html><head><title>Print Poster</title></head><body><img src="' + url + '" style="width:100%; max-width:800px; display:block; margin:0 auto;" /></body></html>';
    const printWindow = window.open('', '', 'width=850,height=1000');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(windowContent);
      printWindow.document.close();
      // Wait for image load
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <div id="poster-generator-wrapper" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Customization Form */}
        <div className="flex-1 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <AlertTriangle className="h-6 w-6 text-blue-600" />
            <h3 className="font-display font-bold text-lg text-slate-800">
              Awareness Poster Customizer
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select Template Vibe
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="template-btn-red"
                onClick={() => setTemplate('red')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                  template === 'red'
                    ? 'border-red-600 bg-red-50 text-red-700 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block mr-1"></span>
                Hazard Red
              </button>
              <button
                type="button"
                id="template-btn-yellow"
                onClick={() => setTemplate('yellow')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                  template === 'yellow'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-800 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block mr-1"></span>
                Caution Yellow
              </button>
              <button
                type="button"
                id="template-btn-slate"
                onClick={() => setTemplate('slate')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                  template === 'slate'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block mr-1"></span>
                Safe Blue
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Poster Header Title
            </label>
            <input
              type="text"
              id="input-poster-title"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              placeholder="e.g., CRITICAL SCAM WARNING"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Flagged Recruiter / Job Offer
            </label>
            <input
              type="text"
              id="input-poster-name"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g., Unlicensed Agent"
              className="w-full text-sm font-semibold border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Warning Description Text (plain, local language friendly)
            </label>
            <textarea
              rows={3}
              id="input-poster-desc"
              value={warningMessage}
              onChange={(e) => setWarningMessage(e.target.value)}
              placeholder="Explain the warning in plain local language..."
              className="w-full text-sm border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              id="btn-poster-download"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <Download className="h-4.5 w-4.5" />
              <span>Download Poster (PNG)</span>
            </button>
            
            <button
              onClick={handlePrint}
              id="btn-poster-print"
              className="border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5" />
              <span>Print Poster</span>
            </button>
          </div>

          {downloadSuccess && (
            <div id="poster-toast-success" className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-3.5 py-2.5 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Poster downloaded successfully! Share this graphic on WhatsApp and Facebook to warn your community.</span>
            </div>
          )}
        </div>

        {/* Right Side: Live Poster Canvas Preview */}
        <div className="w-full lg:w-[400px] flex flex-col items-center">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5">
            Real-Time Poster Preview
          </label>
          <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-lg bg-slate-50 max-w-[340px] md:max-w-full">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block"
              style={{ maxHeight: '510px', aspectRatio: '8 / 12' }}
            />
          </div>
          <div className="text-center mt-3 text-[11px] text-slate-400 max-w-[280px]">
            This poster generates as high-contrast print material for community bulletin boards, town halls, and social group shares.
          </div>
        </div>

      </div>
    </div>
  );
}
