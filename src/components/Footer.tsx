import React from 'react';
import { Shield, LifeBuoy, Heart, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="app-footer" className="bg-slate-50 text-slate-600 py-12 mt-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Platform Meta */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 text-slate-800">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-display font-bold text-lg tracking-tight">MobiVerifier</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Empowering migrant workers, rural youth, and vulnerable job seekers through advanced media literacy. Verify before you travel.
            </p>
          </div>

          {/* Column 2: Safety Resources */}
          <div className="space-y-3 text-xs">
            <h4 className="font-display font-bold text-slate-800 text-sm">Emergency Hotlines</h4>
            <ul className="space-y-2 text-slate-500">
              <li className="flex items-center space-x-2">
                <LifeBuoy className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>PH: POEA Hotline - (02) 8722-1144</span>
              </li>
              <li className="flex items-center space-x-2">
                <LifeBuoy className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>BD: BMET Registry Helpdesk - 16124</span>
              </li>
              <li className="flex items-center space-x-2">
                <LifeBuoy className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>KE: National Employment Authority - 0725 000000</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Disclaimer */}
          <div className="space-y-3 text-xs">
            <h4 className="font-display font-bold text-slate-800 text-sm">Legal Advisory Notice</h4>
            <div className="flex items-start space-x-2 text-[11px] leading-relaxed">
              <AlertCircle className="h-4.5 w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-slate-500">
                MobiVerifier is an educational Media & Information Literacy (MIL) platform. While our AI scanner checks for standard scam flags, always perform secondary checks with your official labor ministry before committing or transferring funds.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright/creds */}
        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 MobiVerifier Platform. Safe Recruitment Campaign.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Made for Public Information Protection & Anti-Human Trafficking.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
