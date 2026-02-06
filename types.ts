export enum IdentityState {
  KNOWN = 'KNOWN',
  UNKNOWN = 'UNKNOWN'
}

export enum AccessState {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED'
}

export enum VaultStatus {
  SECURE = 'SECURE',
  ROTATING = 'ROTATING',
  LOCKED = 'LOCKED'
}

export interface SecurityConfig {
  pinLength: number;
  rotationIntervalSeconds: number;
  voiceName: string;
  showScanlines: boolean;
  bluetoothEnabled: boolean;
}

export interface VaultLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  type: 'info' | 'warning' | 'critical';
}
