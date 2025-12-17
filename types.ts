export enum Protocol {
  TCP = 'TCP',
  UDP = 'UDP',
  ICMP = 'ICMP',
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  SSH = 'SSH'
}

export enum ThreatLevel {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Packet {
  id: string;
  timestamp: number;
  sourceIp: string;
  destIp: string;
  sourcePort: number;
  destPort: number;
  protocol: Protocol;
  payloadSize: number;
  threatLevel: ThreatLevel;
  flag?: string; // e.g., SYN, ACK, FIN
  description?: string; // Reason for threat detection
}

export interface Alert {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  severity: ThreatLevel;
  sourceIp: string;
}

export interface SystemStats {
  totalPackets: number;
  threatsDetected: number;
  activeConnections: number;
  bytesTransferred: number;
}
