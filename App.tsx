import React, { useState, useCallback, useEffect } from 'react';
import VaultDisplay from './components/VaultDisplay';
import PitchModule from './components/PitchModule';
import AuditLogModal from './components/AuditLogModal';
import SettingsModal from './components/SettingsModal';
import AuthIntelligence from './components/AuthIntelligence';
import { VaultStatus, VaultLog, SecurityConfig, IdentityState, AccessState } from './types';

const App: React.FC = () => {
  const [identityState, setIdentityState] = useState<IdentityState>(IdentityState.KNOWN);
  const [accessState, setAccessState] = useState<AccessState>(AccessState.LOCKED);
  const [signalStrength, setSignalStrength] = useState<number>(4);
  
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [logs, setLogs] = useState<VaultLog[]>([]);
  const [config, setConfig] = useState<SecurityConfig>({
    pinLength: 21,
    rotationIntervalSeconds: 360,
    voiceName: 'Fenrir',
    showScanlines: true,
    bluetoothEnabled: true
  });

  const addLog = useCallback((event: string, details: string, type: VaultLog['type'] = 'info') => {
    const newLog: VaultLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event,
      details,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  const handleConfigChange = useCallback((newConfig: SecurityConfig) => {
    setConfig(newConfig);
    addLog('PROTOCOL_RECONFIG', 'Security protocol parameters adjusted via master control.', 'info');
  }, [addLog]);

  useEffect(() => {
    if (!config.bluetoothEnabled) return;
    const proximityTimer = setInterval(() => {
      const chance = Math.random();
      if (chance < 0.05) {
        setIdentityState(IdentityState.UNKNOWN);
        setAccessState(AccessState.LOCKED); 
        setSignalStrength(1);
        addLog('IDENTITY_ASYNC', 'Credential loop mismatch. External broadcast rejected.', 'critical');
      } else if (chance > 0.9 && identityState === IdentityState.UNKNOWN) {
        setIdentityState(IdentityState.KNOWN);
        setSignalStrength(4);
        addLog('AI_SYNC_REESTABLISHED', 'Wireless identity recognized. Protocol handshake successful.', 'info');
      } else if (identityState === IdentityState.KNOWN) {
        setSignalStrength(prev => Math.max(2, Math.min(4, prev + (Math.random() > 0.6 ? 1 : -1))));
      }
    }, 10000);
    return () => clearInterval(proximityTimer);
  }, [config.bluetoothEnabled, identityState, addLog]);

  const handleRotation = useCallback((pin: string, isLeapfrog: boolean, phase?: string) => {
    if (isLeapfrog) {
      addLog('LEAPFROG_PROTOCOL', `Phase Shift: ${phase || 'SYNC'}.`, 'warning');
    } else {
      addLog('PROTOCOL_HANDOVER', `Authority jump complete. Final entropy verified.`, 'info');
    }
  }, [addLog]);

  const handleEmergencyLock = () => {
    setAccessState(AccessState.LOCKED);
    setIdentityState(IdentityState.UNKNOWN);
    addLog('EMERGENCY_LOCK', 'Manual override triggered. Global lockout engaged.', 'critical');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 font-sans relative overflow-x-hidden">
      {config.showScanlines && <div className="scanline"></div>}
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Top Navbar */}
      <nav className="relative z-20 border-b border-slate-800/50 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-cyan-600 rounded flex items-center justify-center text-white font-mono font-bold text-xs">M</div>
            <span className="font-bold tracking-tight text-white flex items-center gap-2">
              Matrix Loops <span className="text-cyan-400">Vault</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono uppercase font-bold tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Protocol Active
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsAuditModalOpen(true)} className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Audit Log</button>
              <button onClick={() => setIsSettingsModalOpen(true)} className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Settings</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        {/* Hero Section (Matching Screenshot) */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter drop-shadow-2xl">
            Moving Target Defense
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-medium opacity-80 leading-relaxed font-mono">
            Session hijacking is obsolete. Your 21-pin credential rotates automatically every {config.rotationIntervalSeconds} seconds.
          </p>
        </div>

        {/* Vault Main Container */}
        <div className="w-full space-y-12">
          <VaultDisplay 
            status={VaultStatus.SECURE} 
            onRotate={handleRotation} 
            pinLength={config.pinLength} 
            rotationInterval={config.rotationIntervalSeconds}
            identity={identityState}
            access={accessState}
          />

          {/* Bottom Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PitchModule voiceName={config.voiceName} />
            
            <div className="grid grid-cols-1 gap-8">
               <AuthIntelligence 
                  identity={identityState} 
                  access={accessState} 
                  signalStrength={signalStrength} 
                />

                <div className="bg-[#0a0f1e]/80 border border-slate-800 rounded-xl p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between border-t border-t-slate-700/50">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-6 font-mono tracking-tight uppercase opacity-60">Vault Analytics</h3>
                    <div className="space-y-4 font-mono">
                      <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Cycle Frequency</span>
                        <span className="text-xs text-cyan-400 font-bold">10 / hour</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active Sessions</span>
                        <span className="text-xs text-white">1</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Encryption Standard</span>
                        <span className="text-xs text-white">AES-256-GCM</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleEmergencyLock}
                    className="w-full mt-8 py-3 bg-red-900/10 hover:bg-red-900/30 border border-red-500/30 text-red-500 rounded-lg font-bold font-mono text-[10px] uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    Emergency Lock
                  </button>
                </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-16 text-center text-slate-600 font-mono text-[9px] uppercase tracking-[0.3em] opacity-40">
        &copy; 2024 Matrix Loops Vault Inc. Enterprise Grade Security.
      </footer>

      <AuditLogModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} logs={logs} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} config={config} onConfigChange={handleConfigChange} />
    </div>
  );
};

export default App;
