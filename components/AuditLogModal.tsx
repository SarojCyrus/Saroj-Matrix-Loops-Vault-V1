import React from 'react';
import { VaultLog } from '../types';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: VaultLog[];
}

const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <h2 className="text-xl font-bold text-white tracking-tight font-mono">SECURE_AUDIT_LOG.V3</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Log List */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-3 bg-black/20">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic text-center py-10">No security events logged in current session.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="group border-l-2 border-slate-800 hover:border-cyan-500 pl-4 py-1 transition-colors">
                <div className="flex items-center gap-3 text-slate-500 mb-1">
                  <span>[{log.timestamp}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                    log.type === 'critical' ? 'bg-red-900/40 text-red-400' : 
                    log.type === 'warning' ? 'bg-yellow-900/40 text-yellow-400' : 
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {log.type}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-cyan-400 font-bold">{log.event}:</span>
                  <span className="text-slate-300">{log.details}</span>
                </div>
              </div>
            ))
          )}
          <div className="h-4"></div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">
          <span>{logs.length} Entries Encrypted</span>
          <span>Matrix Loops Sec_Audit</span>
        </div>
      </div>
    </div>
  );
};

export default AuditLogModal;
