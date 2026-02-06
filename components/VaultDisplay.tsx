import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { VaultStatus, IdentityState, AccessState } from '../types';

interface VaultDisplayProps {
  status: VaultStatus;
  onRotate: (newPin: string, isLeapfrog: boolean, phase?: string) => void;
  pinLength: number;
  rotationInterval: number;
  identity: IdentityState;
  access: AccessState;
}

// The "Start Row" as requested based on the version 1 specification and screenshot
const START_ROW = 'vst}?!kx0H6BD!k;#AE$U';

const generateRandomPin = (length: number) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = uppercase + lowercase + numbers + symbols;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  return result;
};

const VaultDisplay: React.FC<VaultDisplayProps> = ({ status, onRotate, pinLength, rotationInterval, identity, access }) => {
  const [primaryPin, setPrimaryPin] = useState<string>('');
  const [bufferPin, setBufferPin] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(rotationInterval);
  const [rotationCount, setRotationCount] = useState<number>(0);
  const [changeIndices, setChangeIndices] = useState<Set<number>>(new Set());
  const [isGlitching, setIsGlitching] = useState(false);

  // V1 Logic: Determine the loop index (1-10) and rotation position (1-10)
  // Loop increments every 10 rotations (1 hour)
  const currentRotationInLoop = useMemo(() => (rotationCount % 10) + 1, [rotationCount]);
  const currentLoopIndex = useMemo(() => (Math.floor(rotationCount / 10) % 10) + 1, [rotationCount]);

  const getTargetPin = useCallback(() => {
    // If current rotation position matches the current loop index, use START_ROW
    if (currentRotationInLoop === currentLoopIndex) {
      return START_ROW;
    }
    return generateRandomPin(pinLength);
  }, [currentRotationInLoop, currentLoopIndex, pinLength]);

  const rotateKey = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);

    const nextPin = bufferPin || getTargetPin();
    setBufferPin(null);

    const newChanges = new Set<number>();
    for (let i = 0; i < pinLength; i++) {
      if (primaryPin[i] !== nextPin[i]) {
        newChanges.add(i);
      }
    }
    
    setChangeIndices(newChanges);
    setPrimaryPin(nextPin);
    setRotationCount(prev => prev + 1);
    
    setTimeout(() => setChangeIndices(new Set()), 2000);
    setTimeLeft(rotationInterval);
    onRotate(nextPin, false);
  }, [onRotate, rotationInterval, bufferPin, primaryPin, pinLength, getTargetPin]);

  useEffect(() => {
    if (!primaryPin) {
      // Initialize with correct logic for rotation 0
      setPrimaryPin(getTargetPin());
    }
  }, [getTargetPin, primaryPin]);

  useEffect(() => {
    if (access === AccessState.LOCKED && identity === IdentityState.UNKNOWN) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const nextVal = prev - 1;
        
        // Prepare buffer pin 30 seconds before rotation
        if (nextVal === 30) {
          // Increment count mentally to see what the next pin should be
          const nextRotationCount = rotationCount + 1;
          const nextRotInLoop = (nextRotationCount % 10) + 1;
          const nextLoopIdx = (Math.floor(nextRotationCount / 10) % 10) + 1;
          
          const nextKey = (nextRotInLoop === nextLoopIdx) ? START_ROW : generateRandomPin(pinLength);
          setBufferPin(nextKey);
          onRotate(nextKey, true, 'PRE-CALCULATION');
        }

        if (nextVal <= 0) {
          rotateKey();
          return rotationInterval;
        }
        return nextVal;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [rotateKey, rotationInterval, onRotate, pinLength, access, identity, rotationCount]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isKnown = identity === IdentityState.KNOWN;
  const progress = (timeLeft / rotationInterval) * 100;

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="bg-[#0a0f1e]/80 border border-cyan-500/20 rounded-2xl p-10 backdrop-blur-md shadow-[0_0_80px_rgba(34,211,238,0.1)] overflow-hidden">
        
        {/* Card Header Labels */}
        <div className="flex justify-between items-center mb-12 font-mono text-[10px] uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 text-cyan-400">
            <span className={`w-1.5 h-1.5 rounded-full ${isKnown ? 'bg-emerald-400' : 'bg-red-500'} animate-pulse`}></span>
            {status}
          </div>
          <div className="text-slate-500 flex items-center gap-4">
            <span className="opacity-40">LOOP_{currentLoopIndex}/10</span>
            <span className="opacity-40">ROT_{currentRotationInLoop}/10</span>
            <span>MATRIX LOOP PROTOCOL V3.2</span>
          </div>
        </div>

        {/* Primary 21-Pin Display */}
        <div className="flex flex-col items-center justify-center mb-12 relative min-h-[100px]">
          <div className={`text-4xl md:text-6xl font-bold font-mono text-cyan-400 neon-text transition-all duration-300 break-all text-center tracking-widest ${!isKnown ? 'blur-2xl opacity-40' : ''} ${isGlitching ? 'skew-x-12 opacity-50' : ''}`}>
            {isKnown ? primaryPin.split('').map((char, i) => (
              <span key={`${i}-${char}`} className={`inline-block transition-all duration-500 ${changeIndices.has(i) ? 'text-white scale-110' : 'text-cyan-400'}`}>
                {char}
              </span>
            )) : '•••••••••••••••••••••'}
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="grid grid-cols-3 items-end font-mono text-[9px] uppercase tracking-widest">
          <div className="space-y-2">
            <div className="text-slate-500">Time to Rotation</div>
            <div className="text-xl text-white font-bold">{formatTime(timeLeft)}</div>
          </div>

          <div className="flex flex-col items-center space-y-3 pb-2">
            <div className="w-full max-w-[200px] h-1 bg-slate-800 rounded-full relative overflow-hidden">
              <div 
                className="h-full bg-cyan-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_#22d3ee]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-full max-w-[200px] text-[8px] text-slate-600">
              <span>100%</span>
              <span>EXPIRING</span>
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="text-slate-500">Entropy</div>
            <div className="text-xs text-white">
              High <span className="text-emerald-400">(Mixed-Case)</span>
            </div>
          </div>
        </div>

        {/* Subtle Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default VaultDisplay;