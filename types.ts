export enum ThreatLevel {
  SAFE = 'SAFE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  UNKNOWN = 'UNKNOWN'
}

export interface SystemProcess {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  isHidden: boolean;
  status: 'Running' | 'Suspended' | 'Background';
}

export interface AppPermission {
  name: string;
  isDangerous: boolean;
  description: string;
}

export interface InstalledApp {
  packageName: string;
  appName: string;
  version: string;
  permissions: AppPermission[];
  threatLevel: ThreatLevel;
  installSource: 'Play Store' | 'Sideload' | 'System';
}

export interface ScanResult {
  id: string;
  target: string;
  type: 'File' | 'Process' | 'Network' | 'Manifest';
  timestamp: number;
  status: ThreatLevel;
  details: string;
}

export interface NetworkPacket {
  time: string;
  upload: number;
  download: number;
  connections: number;
}