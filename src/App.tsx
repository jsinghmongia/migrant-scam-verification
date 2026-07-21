/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import AgentVerifier from './components/AgentVerifier';
import ScamAnalyzer from './components/ScamAnalyzer';
import WhatsAppSimulator from './components/WhatsAppSimulator';
import ScamReporter from './components/ScamReporter';
import Footer from './components/Footer';
import { ShieldCheck, Sparkles, MessageCircle, AlertTriangle, BookOpen, Star, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('verifier');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-slate-900">
      
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tab Views */}
        {activeTab === 'verifier' && (
          <div className="space-y-12">
            
            {/* Primary Entry Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left 7 Columns: Search and Check government registers */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 mb-6">
                    <ShieldCheck className="h-5.5 w-5.5 text-blue-600" />
                    <h3 className="font-display font-bold text-lg text-slate-800">
                      Step 1: Verify Agency or Recruiter Status
                    </h3>
                  </div>
                  <AgentVerifier />
                </div>
              </div>

              {/* Right 5 Columns: AI Text analyze tool */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 mb-6">
                    <Sparkles className="h-5.5 w-5.5 text-blue-600" />
                    <h3 className="font-display font-bold text-lg text-slate-800">
                      Step 2: Scan Job Ad or Chat Message
                    </h3>
                  </div>
                  <ScamAnalyzer />
                </div>
              </div>

            </div>

            {/* Public Awareness and Campaign section */}
            <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-600">
                    Community Action
                  </span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                    Raise Public Awareness: Print Warnings for Bulletin Boards
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Did you spot a scam offline? Use our custom generator to design hazard warnings, print physical flyers, or share digital PNG notices to save rural families from losing their hard-earned cash.
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Let's scroll to the selected poster anchor or search an unlicensed agent to open the poster tool.
                    const searchInput = document.getElementById('search-input-field') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.value = 'Alpha Trust';
                      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                      searchInput.focus();
                      // Submit event to show results
                      const submitBtn = document.getElementById('search-submit-button');
                      if (submitBtn) submitBtn.click();
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-blue-500/10 flex-shrink-0 cursor-pointer"
                >
                  Launch Poster Campaign
                </button>
              </div>
            </div>

            {/* Quick Informational Guide Section */}
            <div className="space-y-6">
              <h3 className="font-display font-extrabold text-xl text-slate-800 text-center flex items-center justify-center space-x-2">
                <BookOpen className="h-5.5 w-5.5 text-blue-600" />
                <span>Media and Information Literacy (MIL) Safe Work Guide</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-150 p-6 rounded-2xl space-y-3 shadow-sm hover:border-slate-300 transition">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-50 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <h4 className="font-display font-bold text-slate-800 text-sm">Analyze Text Critically</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Beware of vague promises such as "Guaranteed Visa in 10 Days" or "No Qualifications Needed." Fraudsters use extreme urgency and high payout lures to manipulate decision-making.
                  </p>
                </div>

                <div className="bg-white border border-slate-150 p-6 rounded-2xl space-y-3 shadow-sm hover:border-slate-300 transition">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-50 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <h4 className="font-display font-bold text-slate-800 text-sm">Refuse Upfront Fees</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    If an agent demands "visa processing deposits," "medical registration advances," or "badge fees" to private bank accounts or UPI links, STOP immediately. This is the primary indicator of fraud.
                  </p>
                </div>

                <div className="bg-white border border-slate-150 p-6 rounded-2xl space-y-3 shadow-sm hover:border-slate-300 transition">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-50 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <h4 className="font-display font-bold text-slate-800 text-sm">Stay on Official Visas</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Legal foreign employment requires a stamped, embassy-verified work permit on your passport before travel. Traveling on tourist/visitor visas strips you of legal labor rights upon entry.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Hackathon Pitch Feature
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Simulated WhatsApp Bot Environment
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Interact with our public safety verification channel. Click preset messages or type custom job descriptions below to see how our automated AI bot evaluates risks in real-time.
              </p>
            </div>
            
            <WhatsAppSimulator />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="bg-rose-100 text-rose-800 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Crowdsourced Protection
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Report & Trace Active Scams
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Help block unlicensed agents and fraudulent accounts. Contribute known scam phone numbers, UPI addresses, and bank accounts to build the public shield.
              </p>
            </div>

            <ScamReporter />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
