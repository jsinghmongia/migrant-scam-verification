import React, { useState, useEffect } from 'react';
import { AlertTriangle, PlusCircle, ShieldAlert, CheckCircle, ThumbsUp, HelpCircle, MapPin } from 'lucide-react';
import { ScamReport } from '../types';

export default function ScamReporter() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [scamType, setScamType] = useState<'whatsapp_msg' | 'facebook_ad' | 'job_offer' | 'unlicensed_agent' | 'upfront_fee' | 'other'>('whatsapp_msg');
  const [description, setDescription] = useState('');
  const [agentName, setAgentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [countryTargeted, setCountryTargeted] = useState('');
  const [evidenceText, setEvidenceText] = useState('');

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/scams');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !countryTargeted) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/scams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          scamType,
          description,
          agentName: agentName || undefined,
          phoneNumber: phoneNumber || undefined,
          upiId: upiId || undefined,
          bankAccount: bankAccount || undefined,
          countryTargeted,
          evidenceText: evidenceText || undefined
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTitle('');
        setDescription('');
        setAgentName('');
        setPhoneNumber('');
        setUpiId('');
        setBankAccount('');
        setCountryTargeted('');
        setEvidenceText('');
        fetchReports(); // Refresh recent feed

        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const response = await fetch(`/api/scams/${id}/upvote`, { method: 'POST' });
      if (response.ok) {
        // Optimistic update
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, verifiedCount: r.verifiedCount + 1 } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const typeLabels: Record<string, string> = {
    whatsapp_msg: 'WhatsApp Message',
    facebook_ad: 'Facebook/Social Ad',
    job_offer: 'Job Offer Document',
    unlicensed_agent: 'Unlicensed Broker',
    upfront_fee: 'Upfront Fee Demand',
    other: 'Other Scam Method'
  };

  return (
    <div id="scam-reporter-root" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Form to report a scam */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <PlusCircle className="h-5.5 w-5.5 text-blue-600" />
            <h3 className="font-display font-extrabold text-base text-slate-800">
              Report an Active Scam
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Scam Campaign Title *
              </label>
              <input
                type="text"
                required
                id="report-input-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Poland Fruit Farm Upfront Fee"
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Scam Channel Type *
              </label>
              <select
                id="report-input-type"
                value={scamType}
                onChange={(e) => setScamType(e.target.value as any)}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="whatsapp_msg">WhatsApp Message</option>
                <option value="facebook_ad">Facebook / Social Media Ad</option>
                <option value="job_offer">Written Job Offer Document</option>
                <option value="unlicensed_agent">Unlicensed Broker / Middleman</option>
                <option value="upfront_fee">Upfront Fee Demand</option>
                <option value="other">Other / Multi-channel</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Country Promised *
              </label>
              <input
                type="text"
                required
                id="report-input-country"
                value={countryTargeted}
                onChange={(e) => setCountryTargeted(e.target.value)}
                placeholder="e.g. Poland, UAE, Singapore"
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Detailed Warning Description *
              </label>
              <textarea
                rows={3}
                required
                id="report-input-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what they promised and how they requested money..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Optional Specific Identifiers (Highly helpful for searches) */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="block text-[10px] font-mono uppercase text-slate-400">
                Fraudulent Identifiers (Optional but Recommended):
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">
                    Recruiter Name/Alias
                  </label>
                  <input
                    type="text"
                    id="report-input-agent"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g. Gurpreet Broker"
                    className="w-full text-[11px] border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">
                    Phone used for Scam
                  </label>
                  <input
                    type="text"
                    id="report-input-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 99000 12345"
                    className="w-full text-[11px] border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">
                    Scammer's UPI Address
                  </label>
                  <input
                    type="text"
                    id="report-input-upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. visafee@upi"
                    className="w-full text-[11px] border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">
                    Bank Account Details
                  </label>
                  <input
                    type="text"
                    id="report-input-bank"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="e.g. DBS 123-456-789"
                    className="w-full text-[11px] border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="submit-report-btn"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow transition cursor-pointer"
            >
              <span>{submitting ? 'Submitting Report...' : 'Publish Scam Alert'}</span>
            </button>
          </form>

          {success && (
            <div id="report-toast-success" className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] p-3 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your scam report has been registered. Other seekers can now search and avoid this recruiter.</span>
            </div>
          )}
        </div>
      </div>

      {/* Right 2 Columns: Feed of recent reports */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-extrabold text-base text-slate-800 flex items-center space-x-2">
              <span className="bg-red-50 text-red-600 p-1 rounded-md">
                <ShieldAlert className="h-4.5 w-4.5" />
              </span>
              <span>Recent Crowdsourced Scam Alerts</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Live Database
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-xs text-slate-400 font-mono">Loading scam database...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              No reported scams yet. Use the form to submit one!
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-2">
              {reports.map((report) => (
                <div key={report.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] uppercase font-mono font-bold bg-blue-50 border border-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                          {typeLabels[report.scamType] || 'Recruitment Scam'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(report.reportedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-slate-800 text-base mt-1.5 flex items-center space-x-1">
                        <span>{report.title}</span>
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <span>Target Destination: <strong>{report.countryTargeted}</strong></span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleUpvote(report.id)}
                      id={`upvote-btn-${report.id}`}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-1 px-2.5 text-[10px] font-mono font-semibold text-slate-600 hover:text-slate-900 transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
                      <span>Verify ({report.verifiedCount})</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans pl-1">
                    {report.description}
                  </p>

                  {/* Highlight box for key fraudulent traces */}
                  {(report.agentName || report.phoneNumber || report.upiId || report.bankAccount) && (
                    <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      {report.agentName && (
                        <div>
                          <strong className="block text-slate-400 text-[8px] uppercase">Alias Name</strong>
                          <span className="font-semibold text-slate-700">{report.agentName}</span>
                        </div>
                      )}
                      {report.phoneNumber && (
                        <div>
                          <strong className="block text-slate-400 text-[8px] uppercase">Phone Trace</strong>
                          <span className="font-mono font-semibold text-slate-700">{report.phoneNumber}</span>
                        </div>
                      )}
                      {report.upiId && (
                        <div>
                          <strong className="block text-slate-400 text-[8px] uppercase">UPI ID Trace</strong>
                          <span className="font-mono font-semibold text-slate-700">{report.upiId}</span>
                        </div>
                      )}
                      {report.bankAccount && (
                        <div>
                          <strong className="block text-slate-400 text-[8px] uppercase">Bank Account</strong>
                          <span className="font-mono font-semibold text-slate-700">{report.bankAccount}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
