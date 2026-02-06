import React from 'react';
import { SecurityConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SecurityConfig;
  onConfigChange: (newConfig: SecurityConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onConfigChange }) => {
  if (!isOpen) return null;

  const voices = ['Fenrir', 'Kore', 'Puck', 'Charon', 'Zephyr'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white font-mono tracking-tight uppercase">Protocol_Config</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono uppercase text-slate-500">
              <label>Entropy Pin Length</label>
              <span className="text-cyan-400">{config.pinLength} Chars</span>
            </div>
            <input 
              type="range" min="8" max="40" step="1" 
              value={config.pinLength} 
              onChange={(e) => onConfigChange({ ...config, pinLength: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono uppercase text-slate-500">
              <label>Rotation Cycle</label>
              <span className="text-cyan-400">{config.rotationIntervalSeconds}s</span>
            </div>
            <input 
              type="range" min="30" max="3600" step="30" 
              value={config.rotationIntervalSeconds} 
              onChange={(e) => onConfigChange({ ...config, rotationIntervalSeconds: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500 block">Narrator Voice</label>
            <select 
              value={config.voiceName}
              onChange={(e) => onConfigChange({ ...config, voiceName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:ring-1 focus:ring-cyan-500 outline-none"
            >
              {voices.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-800 pt-4">
            <span className="text-xs font-mono uppercase text-slate-500">Wireless AI-Sync (BLE)</span>
            <button 
              onClick={() => onConfigChange({ ...config, bluetoothEnabled: !config.bluetoothEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.bluetoothEnabled ? 'bg-emerald-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.bluetoothEnabled ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-mono uppercase text-slate-500">CRT Scanline Effect</span>
            <button 
              onClick={() => onConfigChange({ ...config, showScanlines: !config.showScanlines })}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.showScanlines ? 'bg-cyan-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.showScanlines ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-800/30 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold font-mono transition-colors">
            APPLY_PROTOCOL_V4
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
