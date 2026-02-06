import React from 'react';
import { IdentityState, AccessState } from '../types';

interface AuthIntelligenceProps {
  identity: IdentityState;
  access: AccessState;
  signalStrength: number;
}

const AuthIntelligence: React.FC<AuthIntelligenceProps> = ({ identity, access, signalStrength }) => {
  const isKnown = identity === IdentityState.KNOWN;
  
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isKnown ? 'text-emerald-400' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a1 1 0 011 1v2.5a.5.5 0 001 0V3a2 2 0 10-4 0v2.5a.5.5 0 001 0V3a1 1 0 011-1zM5 8h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
          </svg>
          Auth_Intelligence.v4
        </h3>
        <div className="flex items-center gap-1">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-3 rounded-full transition-all duration-500 ${
                i < signalStrength ? (isKnown ? 'bg-emerald-500' : 'bg-red-500') : 'bg-slate-800'
              }`}
            ></div>
          ))}
          <span className="text-[10px] font-mono text-slate-500 ml-2">RSSI: -{80 - signalStrength * 10}dBm</span>
        </div>
      </div>

      {/* Logic Matrix */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase tracking-tighter">
        <div className={`p-3 rounded border transition-all ${isKnown && access === AccessState.UNLOCKED ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400' : 'bg-slate-950/20 border-slate-800 text-slate-600'}`}>
          <div className="font-bold mb-1">Known + Open</div>
          <div>Authorized / Active</div>
        </div>
        <div className={`p-3 rounded border transition-all ${isKnown && access === AccessState.LOCKED ? 'bg-amber-950/40 border-amber-500 text-amber-400' : 'bg-slate-950/20 border-slate-800 text-slate-600'}`}>
          <div className="font-bold mb-1">Known + Closed</div>
          <div>Authorized / Idle</div>
        </div>
        <div className={`p-3 rounded border col-span-2 transition-all ${!isKnown ? 'bg-red-950/40 border-red-500 text-red-400 animate-pulse' : 'bg-slate-950/20 border-slate-800 text-slate-600'}`}>
          <div className="font-bold mb-1">Unknown Identity</div>
          <div>Hard_Lock_Engaged / Intrusion_Shield_v9</div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>AI-Sync status:</span>
          <span className={isKnown ? 'text-emerald-400' : 'text-red-400'}>
            {isKnown ? 'SYNCHRONIZED' : 'ASYNC_DETECTED'}
          </span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${isKnown ? 'bg-emerald-500' : 'bg-red-500'}`}
            style={{ width: isKnown ? '100%' : '15%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AuthIntelligence;
