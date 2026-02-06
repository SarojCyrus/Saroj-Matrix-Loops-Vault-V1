
import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';

const PITCH_TEXT = `Hi, I’m Saroj, founder of Matrix Loops Vault. We’re building a next-generation security protocol that eliminates the static password vulnerability. By 2030, 99% of all digital credentials will not be used by humans, but by Autonomous AI Agents. These agents will manage our finances, negotiate our contracts, and maintain our infrastructure. Today’s security protocols were built for humans who change passwords every 90 days; they are fundamentally incapable of securing a world where AI agents can be hijacked in milliseconds.

Matrix Loops Vault is not just a password manager; we are building the Identity Operating System, or I-D-O-S, for the Autonomous Age.

Our vision is to move the world from Static Identity to Kinetic Identity. In our future, an identity is not a fixed string of characters—it is a continuous, high-frequency pulse. By making the 'Matrix Loop' the standard for agentic authentication, we provide the 'heartbeat' that proves an agent is still under the rightful owner's control.

We will become the invisible layer that secures every API call, every bot-to-bot transaction, and every autonomous financial move. Just as TCP/IP became the protocol for data, Matrix Loops will become the protocol for Trust. We aren't just locking the door; we are redefining what it means to hold the key in a post-human digital economy.

Here are the key accomplishments for Matrix Loops Vault:

First. The Velocity Milestone: 60-Minute Core Build. Our proudest achievement is moving from a blank page to a functional 21-pin kinetic rotation engine in under an hour using Gemini 3. This proves our team has the "Hacker Velocity" needed for the next scale. We didn't spend months theorizing; we built the logic, tested the entropy of the 21-pin sequences, and proved that high-frequency rotation is architecturally viable today.

Second. Solving the Heartbeat Synchronization. We successfully engineered the Dual-Window Buffer protocol. One of the biggest hurdles for high-frequency security is "sync-drift"—where a system locks out a legitimate user because the clock moved too fast. We built a graceful "handshake" that allows for a 30-second overlap during rotations. This turned a "cool math experiment" into a production-ready enterprise tool that won't crash a bank's API during a rotation.

Third. The Brute Force Immunity Benchmark. We ran internal simulations against 2026-era AI brute-force tools. In every test, the Matrix Loop rotated the credential before the attack could reach point zero one percent of the necessary permutations. We've effectively created a "Moving Target Defense" that makes traditional credential-stuffing attacks mathematically and economically impossible.

Fourth. Securing the Agentic Architecture. We successfully integrated the Vault with an autonomous AI agent prototype. We demonstrated that an AI agent could execute a complex financial transaction while its credentials rotated three times, with zero latency or session drops. This proves our "Identity O-S" vision. We aren't just securing humans; we have successfully secured the Autonomous Economy. Thank you.`;

interface PitchModuleProps {
  voiceName: string;
}

const PitchModule: React.FC<PitchModuleProps> = ({ voiceName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlayPitch = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setError(null);
    try {
      // Fix: Now uses the voiceName prop passed from config instead of hardcoded 'Fenrir'
      await generateSpeech(PITCH_TEXT, voiceName);
    } catch (err) {
      setError("Failed to generate audio. Check API Key.");
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-[#0a0f1e]/80 border border-slate-800 rounded-xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-between">
      <div className="relative z-10">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-3 font-mono">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Founder's Briefing
        </h3>
        
        <p className="text-slate-400 text-xs leading-relaxed mb-8">
          Listen to Saroj explain the Matrix Loops protocol and the vision for enterprise-grade dynamic security.
        </p>
        
        <button
          onClick={handlePlayPitch}
          disabled={isPlaying}
          className="flex items-center gap-3 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-lg font-bold font-mono text-xs uppercase tracking-widest transition-all"
        >
          {isPlaying ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Streaming...
            </span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                 <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
              Play Audio
            </>
          )}
        </button>
      </div>
      
      {/* Mini Audio Spectrum */}
      <div className="mt-8 flex items-end gap-[3px] h-6 px-1">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-t-sm transition-all duration-300 ${isPlaying ? 'bg-purple-500' : 'bg-slate-800'}`}
            style={{ 
              height: isPlaying ? `${20 + Math.random() * 80}%` : '4px',
              animation: isPlaying ? `pulse ${0.3 + Math.random() * 0.5}s infinite alternate` : 'none'
            }}
          ></div>
        ))}
      </div>
      {error && (
        <div className="absolute bottom-2 left-0 w-full text-center">
          <span className="text-[10px] text-red-500 font-mono uppercase tracking-tighter">{error}</span>
        </div>
      )}
    </div>
  );
};

export default PitchModule;
