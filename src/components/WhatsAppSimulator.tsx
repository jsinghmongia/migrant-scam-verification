import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Check, CheckCheck, Smile, Paperclip, AlertTriangle, Sparkles, Award } from 'lucide-react';
import { ChatMessage, AnalysisResult } from '../types';

export default function WhatsAppSimulator() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "👋 Hello! I am the MobiVerifier Safety Bot. You can forward any suspicious foreign job offer, Facebook ad, or WhatsApp text here. I will instantly analyze it for recruitment scam red flags and give you a safety rating. Try pasting a message or clicking one of the sample forwards below!",
      timestamp: '13:30'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Preset sample scams for fast demonstration
  const sampleForwards = [
    {
      label: "🇨🇦 Canada Work Visa",
      text: "🚨 URGENT CANADA WORK VISA OFFER! High Salary $4500 CAD/month. Food & Accommodation provided. Registration charges only ₹25,000 upfront. Send passport copies + payment screenshot to secure your visa."
    },
    {
      label: "🇦🇪 Dubai Security Guard",
      text: "URGENT hiring 100 Dubai Security Guards! Salary 3,800 AED. Travel on tourist visa first, then convert to work visa. Immediate flight ticket costs only $400. Message me to lock your slot!"
    },
    {
      label: "🇸🇬 Singapore Changi Cleaner",
      text: "Changi Airport cargo handlers. Salary $3200 SGD. No studies, no interview. Transfer $200 deposit for uniform and security ID card to account 123-456-789. Departure next Tuesday!"
    }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Create unique user message
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'u_' + Math.random().toString(36).substr(2, 9);
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text,
      timestamp: currentTime,
      status: 'sent'
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');

    // Update statuses for simulated checks
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMsgId ? { ...msg, status: 'delivered' } : msg))
      );
    }, 500);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMsgId ? { ...msg, status: 'read' } : msg))
      );
    }, 1000);

    // Trigger Bot Typing state
    setTimeout(() => {
      setIsTyping(true);
    }, 1200);

    try {
      // Query our backend analyzer API
      const res = await fetch('/api/analyze-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const analysisResult: AnalysisResult = await res.json();
      
      setTimeout(() => {
        setIsTyping(false);
        const botMsgId = 'b_' + Math.random().toString(36).substr(2, 9);
        
        let riskHeader = "";
        if (analysisResult.riskRating === 'HIGH') {
          riskHeader = "🚨⚠️ HIGH RISK SCAM WARNING! ⚠️🚨\n\n";
        } else if (analysisResult.riskRating === 'MEDIUM') {
          riskHeader = "⚠️ WARNING: SUSPICIOUS OFFER (MEDIUM RISK) ⚠️\n\n";
        } else {
          riskHeader = "✅ LOW DETECTED RISK\n\n";
        }

        const formattedText = `${riskHeader}${analysisResult.explanation}\n\n📍 RED FLAGS FOUND:\n${analysisResult.redFlags.map(f => `• ${f}`).join('\n')}\n\n🛡️ SAFETY NEXT STEPS:\n${analysisResult.actionSteps.map(s => `✓ ${s}`).join('\n')}`;

        const newBotMessage: ChatMessage = {
          id: botMsgId,
          sender: 'bot',
          text: formattedText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          analysis: analysisResult
        };

        setMessages((prev) => [...prev, newBotMessage]);
      }, 1500);

    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'err_' + Date.now(),
            sender: 'bot',
            text: "⚠️ Sorry, my AI analysis engine is currently offline. However, as an immediate safety tip: Never pay any recruiter upfront money. Legitimate agencies only charge fees once stamping and legal contracts are verified.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div id="whatsapp-simulator-root" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Instructions & Interactive controls column */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Award className="h-5.5 w-5.5 text-blue-600" />
            <h3 className="font-display font-extrabold text-base text-slate-800">
              Interactive Bot Demo
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            WhatsApp is the primary channel recruiters use to contact rural youth and migrant workers in Southeast Asia and Africa. 
          </p>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2 text-xs text-slate-700">
            <strong className="text-blue-800 font-bold block uppercase text-[10px]">
              How the Live Bot Works:
            </strong>
            <ul className="list-disc pl-4 space-y-1">
              <li>Candidates save the verification number on their smartphones.</li>
              <li>When they receive a fishy message, they forward it directly.</li>
              <li>The AI evaluates the text and sends an immediate response in under 5 seconds.</li>
            </ul>
          </div>

          {/* Preset Buttons area */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Forwards to Send:
            </span>
            <div className="flex flex-col gap-2">
              {sampleForwards.map((sf, idx) => (
                <button
                  key={idx}
                  id={`sf-btn-${idx}`}
                  onClick={() => handleSendMessage(sf.text)}
                  className="text-left text-xs bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl p-3 font-semibold text-slate-700 hover:text-blue-800 transition cursor-pointer"
                >
                  <span className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">Sample Forward #{idx + 1}</span>
                  {sf.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Interface Column */}
      <div className="lg:col-span-2 flex justify-center">
        <div className="w-full max-w-xl bg-slate-100 border border-slate-300 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px]">
          
          {/* WhatsApp Header */}
          <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <ArrowLeft className="h-5 w-5 text-slate-300 cursor-pointer md:hidden" />
              <div className="relative">
                {/* Simulated circular avatar with green checkmark badge */}
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center font-display text-sm border-2 border-emerald-500/50">
                  MV
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-emerald-800 flex items-center justify-center">
                  <Check className="h-2 w-2 text-white stroke-3" />
                </div>
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm leading-tight">
                  MobiVerifier Safety Bot
                </h4>
                <span className="text-[10px] text-emerald-200 font-medium tracking-wide">
                  {isTyping ? 'Typing analysis...' : 'Online'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-white/90">
              <Video className="h-5 w-5 cursor-pointer hover:text-white" />
              <Phone className="h-4.5 w-4.5 cursor-pointer hover:text-white" />
              <MoreVertical className="h-5 w-5 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* WhatsApp Chat Area / Wallpaper */}
          <div 
            className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#E5DDD5] relative"
            style={{
              backgroundImage: 'radial-gradient(rgba(0, 100, 80, 0.05) 1px, transparent 0)',
              backgroundSize: '16px 16px'
            }}
          >
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-md relative leading-relaxed text-slate-800 text-xs ${
                      isBot
                        ? 'bg-white rounded-tl-none text-slate-800 border-l-4 border-emerald-600'
                        : 'bg-[#DCF8C6] rounded-tr-none text-slate-900'
                    }`}
                  >
                    {/* Multi-line text formatting */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {/* Analysis Badges if bot analysis details exist */}
                    {msg.analysis && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                        <span className={`font-extrabold ${
                          msg.analysis.riskRating === 'HIGH' ? 'text-red-600' : msg.analysis.riskRating === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          Risk Score: {msg.analysis.riskRating}
                        </span>
                        <span className="text-slate-400">Confidence: {msg.analysis.confidence}%</span>
                      </div>
                    )}

                    {/* Timestamp & Read/Sent indicator */}
                    <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-slate-400 float-right">
                      <span>{msg.timestamp}</span>
                      {!isBot && (
                        msg.status === 'read' ? (
                          <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="h-3.5 w-3.5 text-slate-400" />
                        ) : (
                          <Check className="h-3.5 w-3.5 text-slate-400" />
                        )
                      )}
                    </div>
                    <div className="clear-both"></div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-md text-xs text-slate-500 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="font-mono text-[10px]">Analyzing red flags...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* WhatsApp Footer Input form */}
          <form onSubmit={handleFormSubmit} className="bg-[#EFEEE9] px-3 py-2.5 flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-slate-500">
              <Smile className="h-5 w-5 cursor-pointer hover:text-slate-700" />
              <Paperclip className="h-5 w-5 cursor-pointer hover:text-slate-700" />
            </div>

            <input
              type="text"
              id="whatsapp-chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste a suspicious recruitment message..."
              className="flex-1 bg-white text-xs text-slate-800 rounded-full py-2.5 px-4 focus:outline-none placeholder-slate-400 border border-slate-200"
            />

            <button
              type="submit"
              id="whatsapp-send-btn"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
