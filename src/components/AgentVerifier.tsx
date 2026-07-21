import React, { useState, useEffect } from 'react';
import { Search, Shield, ShieldCheck, ShieldAlert, MapPin, Phone, Mail, Award, AlertTriangle, FileSpreadsheet, Eye, HelpCircle } from 'lucide-react';
import { Agent, ScamReport } from '../types';
import PosterGenerator from './PosterGenerator';

export default function AgentVerifier() {
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [scams, setScams] = useState<ScamReport[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPosterEntity, setSelectedPosterEntity] = useState<string | null>(null);

  // Pre-fetch some top certified agencies on load to display as "Certified Registries"
  useEffect(() => {
    // We can show featured verified agencies to establish trust
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setSelectedPosterEntity(null);

    try {
      // Query certified agents
      const agentRes = await fetch(`/api/agents/search?query=${encodeURIComponent(searchQuery)}`);
      const agentData = await agentRes.json();
      setAgents(agentData);

      // Query crowdsourced scam reports too
      const scamRes = await fetch(`/api/scams/search?query=${encodeURIComponent(searchQuery)}`);
      const scamData = await scamRes.json();
      setScams(scamData);

    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setAgents([]);
    setScams([]);
    setHasSearched(false);
    setSelectedPosterEntity(null);
  };

  return (
    <div id="agent-verifier-root" className="space-y-8">
      {/* Hero Visual Section */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-3xl">
          <span className="bg-blue-500/20 text-blue-400 text-xs font-mono font-bold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
            🚨 media and information literacy (MIL)
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl mt-3 text-slate-100 tracking-tight leading-none">
            Verify Foreign Recruiters & Job Offers Instantly
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Protect your life savings and safety. Search the official registry database for licensed recruitment agents, or check matching crowdsourced scam complaints.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                id="search-input-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type agent name, agency name, phone number, or license (e.g. RL-1084)"
                className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl pl-12 pr-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 transition"
              />
            </div>
            <button
              type="submit"
              id="search-submit-button"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-lg shadow-blue-500/15 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Searching...' : 'Check Registry'}</span>
            </button>
          </form>
          
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-mono">
            <span>Try searching:</span>
            <button type="button" onClick={() => { setSearchQuery('Overseas Careers'); }} className="text-blue-400 hover:underline cursor-pointer">Overseas Careers</button>
            <span>•</span>
            <button type="button" onClick={() => { setSearchQuery('Alpha Trust'); }} className="text-blue-400 hover:underline cursor-pointer">Alpha Trust (Revoked)</button>
            <span>•</span>
            <button type="button" onClick={() => { setSearchQuery('Poland'); }} className="text-blue-400 hover:underline cursor-pointer">Poland Fruit Picking</button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div id="search-results-section" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-slate-800">
              Registry Match Results
            </h3>
            <button
              onClick={handleClear}
              className="text-xs font-mono font-semibold text-slate-500 hover:text-slate-800 underline"
            >
              Clear Search
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-xs font-mono text-slate-500">Checking government licenses and crowdsourced database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              
              {/* 1. Certified Registry Matches */}
              {agents.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-600 flex items-center space-x-1.5">
                    <ShieldCheck className="h-4.5 w-4.5" />
                    <span>Government Certified Registry Matches ({agents.length})</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`border rounded-2xl p-5 shadow-sm transition-all bg-white ${
                          agent.status === 'CERTIFIED'
                            ? 'border-emerald-200 bg-emerald-50/10 hover:border-emerald-300'
                            : agent.status === 'REVOKED'
                            ? 'border-red-200 bg-red-50/10 hover:border-red-300'
                            : 'border-yellow-200 bg-yellow-50/10 hover:border-yellow-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                              agent.status === 'CERTIFIED'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : agent.status === 'REVOKED'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                              {agent.status}
                            </span>
                            <h5 className="font-display font-bold text-lg text-slate-800 mt-2">{agent.name}</h5>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">License: {agent.licenseNumber}</p>
                          </div>
                          
                          {agent.rating && (
                            <div className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded flex items-center space-x-0.5">
                              <span>★</span>
                              <span>{agent.rating}</span>
                            </div>
                          )}
                        </div>

                        {agent.agencyName && (
                          <div className="text-sm text-slate-600 font-semibold mt-3">
                            Agency: {agent.agencyName}
                          </div>
                        )}

                        <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-500">
                          {agent.officeAddress && (
                            <div className="flex items-start space-x-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                              <span>{agent.officeAddress}</span>
                            </div>
                          )}
                          {agent.contactPhone && (
                            <div className="flex items-center space-x-1.5">
                              <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                              <span>{agent.contactPhone}</span>
                            </div>
                          )}
                          {agent.contactEmail && (
                            <div className="flex items-center space-x-1.5">
                              <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                              <span>{agent.contactEmail}</span>
                            </div>
                          )}
                          {agent.countryScope && (
                            <div className="flex items-center space-x-1.5 pt-1">
                              <Award className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                              <span>Countries Accredited: {agent.countryScope.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {agent.remarks && (
                          <div className={`mt-4 p-3 rounded-xl text-xs leading-relaxed ${
                            agent.status === 'CERTIFIED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                              : agent.status === 'REVOKED'
                              ? 'bg-red-50 text-red-800 border border-red-100'
                              : 'bg-yellow-50 text-yellow-800 border border-yellow-100'
                          }`}>
                            <strong className="block mb-0.5 font-bold uppercase tracking-wider text-[10px]">
                              {agent.status === 'CERTIFIED' ? 'Registry Remarks' : 'Enforcement Reason'}
                            </strong>
                            {agent.remarks}
                          </div>
                        )}

                        {/* Action for dangerous states */}
                        {agent.status !== 'CERTIFIED' && (
                          <button
                            onClick={() => setSelectedPosterEntity(agent.name)}
                            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Create Awareness Warning Poster</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Crowdsourced Scam Matches */}
              {scams.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-rose-600 flex items-center space-x-1.5">
                    <ShieldAlert className="h-4.5 w-4.5" />
                    <span>Crowdsourced Scam Database Matches ({scams.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scams.map((scam) => (
                      <div key={scam.id} className="border border-red-200 bg-red-50/5 rounded-2xl p-5 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                              VERIFIED SCAM REPORT
                            </span>
                            <h5 className="font-display font-bold text-base text-slate-800 mt-2">{scam.title}</h5>
                            <p className="text-xs text-slate-400 font-mono">Reported Target: {scam.countryTargeted}</p>
                          </div>
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-mono font-bold px-2 py-1 rounded">
                            {scam.verifiedCount} complaints
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl font-sans">
                          {scam.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                          {scam.phoneNumber && (
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-mono">Phone used</span>
                              <span className="text-slate-700 font-mono font-semibold">{scam.phoneNumber}</span>
                            </div>
                          )}
                          {scam.upiId && (
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-mono">UPI address</span>
                              <span className="text-slate-700 font-mono font-semibold">{scam.upiId}</span>
                            </div>
                          )}
                          {scam.bankAccount && (
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-mono">Bank details</span>
                              <span className="text-slate-700 font-mono font-semibold">{scam.bankAccount}</span>
                            </div>
                          )}
                          {scam.agentName && (
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-mono">Alias Recruiter</span>
                              <span className="text-slate-700 font-semibold">{scam.agentName}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedPosterEntity(scam.agentName || scam.title)}
                          className="w-full bg-slate-900 hover:bg-slate-950 text-blue-400 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Generate Awareness Poster for this Scam</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Empty State (No registry matches found) */}
              {agents.length === 0 && scams.length === 0 && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-500 text-slate-950 p-2.5 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-lg text-slate-950">
                        ⚠️ WARNING: UNVERIFIED ENTITY (Registry Not Found)
                      </h4>
                      <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                        No agency named <strong>"{searchQuery}"</strong> is listed in our verified government registry records, and no previous crowdsourced reports match.
                      </p>
                      
                      <div className="bg-white border border-amber-200/60 p-4 rounded-xl mt-3 space-y-2 text-xs text-slate-600">
                        <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">MIL Safety Checklist:</span>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Unlicensed brokers or sub-agents operate illegally and account for 90% of recruitment scams.</li>
                          <li>They frequently charge exorbitant upfront cash fees for non-existent jobs.</li>
                          <li>They may ask you to travel on a standard visitor/tourist visa, promising conversion upon arrival. This is highly illegal.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-200/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <p className="text-xs text-slate-500 font-mono">
                      Print warning notices to caution friends in your community.
                    </p>
                    <button
                      onClick={() => setSelectedPosterEntity(searchQuery)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow cursor-pointer"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>Generate Community Awareness Poster</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Embedded Poster Generator Section when Triggered */}
      {selectedPosterEntity && (
        <div id="selected-poster-anchor" className="border-t border-slate-200 pt-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-lg text-slate-800 flex items-center space-x-2">
              <span className="bg-red-100 text-red-800 p-1 rounded-md">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <span>Campaign Tool: Generate Warning Poster for "{selectedPosterEntity}"</span>
            </h4>
            <button
              onClick={() => setSelectedPosterEntity(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Close Poster Tool
            </button>
          </div>
          <PosterGenerator entityName={selectedPosterEntity} riskRating="HIGH" />
        </div>
      )}

      {/* Informative Security Practices */}
      {!hasSearched && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-2.5">
            <div className="bg-emerald-100 text-emerald-800 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="font-display font-bold text-slate-800 text-sm">Verify Agency License</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Legitimate agencies hold valid MEA/POEA registration. Cross-check license codes and statuses instantly in our engine.
            </p>
          </div>

          <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-2.5">
            <div className="bg-emerald-100 text-emerald-800 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="font-display font-bold text-slate-800 text-sm">Zero Upfront Cash</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Legal processing fees are paid after contracts and visa verification. Refuse instant deposits via mobile wallets.
            </p>
          </div>

          <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-2.5">
            <div className="bg-emerald-100 text-emerald-800 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="font-display font-bold text-slate-800 text-sm">Say No to Tourist Visas</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Work stamps must reside on your passport before boarding. Traveling on a visitor visa leaves you illegal and unprotected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
