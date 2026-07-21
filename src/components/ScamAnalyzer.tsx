import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle, ShieldAlert, FileText, ChevronRight, CornerDownRight, RefreshCw, Download, HelpCircle } from 'lucide-react';
import { AnalysisResult } from '../types';
import PosterGenerator from './PosterGenerator';

export default function ScamAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPoster, setShowPoster] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setShowPoster(false);

    try {
      const response = await fetch('/api/analyze-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Server analysis request failed.");
      }

      const result: AnalysisResult = await response.json();
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to analysis server. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (presetText: string) => {
    setInputText(presetText);
    setAnalysis(null);
    setShowPoster(false);
  };

  // Preset job descriptions / social forwards for easy testing
  const presets = [
    {
      label: "Poland Farm Worker",
      text: "URGENT OPPORTUNITY! Fruit Picking job in Poland. Pay: €2,500/month. No English, no qualifications, no visa problems. Just pay €400 registration & medical fees upfront to our UPI ID polandjobs@paytm. Work permit ready in 7 days! Send passport copy now."
    },
    {
      label: "Dubai Airport Security",
      text: "Hiring Airport Security in Dubai Mall! Monthly salary 4,500 AED + food + accommodation. Apply now. Flight tickets arranged. Fly on a 3-month tourist visa, we will convert to residence permit upon arrival in UAE. Fees to convert is only $350. Message now!"
    },
    {
      label: "Singapore Baggage Handler",
      text: "Airport Baggage Handler in Singapore Changi. Earn SGD $3,200/month. No high school needed. Immediate departure. Deposit $250 security clearance fee to DBS Savings 123-4567-890. Slots filling fast. Act immediately."
    }
  ];

  return (
    <div id="scam-analyzer-root" className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center space-x-2.5">
        <div className="bg-blue-50 text-blue-700 p-2 rounded-xl flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-xl text-slate-800">
            AI-Powered Scam Analyzer
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Paste suspicious WhatsApp forwards, Facebook ads, or Telegram job offers. Our MIL analyzer detects fraudulent traps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Input area */}
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleAnalyze} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Paste Job Ad or Chat Message
              </label>
              <textarea
                rows={6}
                id="analyzer-text-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Example: 'Congratulations! Your passport is selected for a Canada visa. Please deposit visa processing fee...'"
                className="w-full text-sm border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed placeholder-slate-400"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Click a Preset Scam Forward to Test:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    id={`preset-btn-${idx}`}
                    onClick={() => loadPreset(preset.text)}
                    className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-1.5 px-3 rounded-lg font-medium transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
                <span>MIL Analyzer Engine 1.2</span>
              </span>
              <button
                type="submit"
                id="analyzer-submit-btn"
                disabled={loading || !inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>Analyzing Text...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    <span>Run AI Check</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div id="analyzer-error-alert" className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Guidelines info card */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">MIL Literacy Guide: How our AI assesses risk:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 leading-relaxed">
              <div className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">●</span>
                <span><strong>Upfront Processing Fees:</strong> High-risk. Direct demands for payment via personal mobile accounts or links.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">●</span>
                <span><strong>Tourist Visa Traps:</strong> High-risk. Fly as visitor, change to worker. Leaves victims vulnerable to trafficking.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-amber-500 font-bold">●</span>
                <span><strong>Informal Channels:</strong> Medium-risk. Recruitment solely handled through private WhatsApp group chats.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-amber-500 font-bold">●</span>
                <span><strong>Vague Details:</strong> Medium-risk. Offers high pay for zero requirements or zero qualifications.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Analysis Display */}
        <div className="lg:col-span-1">
          {analysis ? (
            <div id="analyzer-results-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
              
              {/* Traffic Light Header */}
              <div className="text-center pb-4 border-b border-slate-100 space-y-2">
                <div className="flex justify-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs ${
                    analysis.riskRating === 'HIGH' ? 'bg-red-600 border-red-700 text-white animate-pulse' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    H
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs ${
                    analysis.riskRating === 'MEDIUM' ? 'bg-amber-500 border-amber-600 text-white' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    M
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs ${
                    analysis.riskRating === 'LOW' ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    L
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
                    CALCULATED RISK RATING
                  </span>
                  <span className={`font-display font-extrabold text-xl ${
                    analysis.riskRating === 'HIGH' ? 'text-red-600' : analysis.riskRating === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {analysis.riskRating} RISK ({analysis.confidence}% Confidence)
                  </span>
                </div>
              </div>

              {/* Empathetic Explanation */}
              <div className="space-y-1.5">
                <h5 className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                  Analysis Explanation
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                  {analysis.explanation}
                </p>
              </div>

              {/* Red Flags Found */}
              <div className="space-y-2">
                <h5 className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                  Red Flags Detected ({analysis.redFlags.length})
                </h5>
                <ul className="space-y-1.5">
                  {analysis.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 flex items-start space-x-1.5">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to do next (Actionable advice) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h5 className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                  Actionable Protection Advice
                </h5>
                <ul className="space-y-1.5">
                  {analysis.actionSteps.map((step, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 flex items-start space-x-1.5">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Generate Poster button for High Risk */}
              {analysis.riskRating === 'HIGH' && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowPoster(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow cursor-pointer"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Generate Awareness Poster</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
              <FileText className="h-10 w-10 text-slate-300 stroke-1" />
              <p className="mt-3 text-xs font-semibold">Ready for Analysis</p>
              <p className="mt-1 text-[10px] text-slate-400 max-w-[180px] leading-relaxed mx-auto">
                Paste suspicious recruitments on the left and tap "Run AI Check".
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Embedded Poster Generator Section when Triggered */}
      {showPoster && analysis && (
        <div id="analyzer-poster-anchor" className="border-t border-slate-200 pt-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-lg text-slate-800 flex items-center space-x-2">
              <span className="bg-red-100 text-red-800 p-1 rounded-md">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <span>Campaign Tool: Generate Warning Poster for Detected Scam Offer</span>
            </h4>
            <button
              onClick={() => setShowPoster(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Close Poster Tool
            </button>
          </div>
          <PosterGenerator 
            entityName="Unverified Offer" 
            sourceText={inputText} 
            scamPatterns={analysis.scamPatternsDetected}
            riskRating={analysis.riskRating}
          />
        </div>
      )}

    </div>
  );
}
