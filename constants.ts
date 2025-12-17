import { Protocol } from "./types";

export const MOCK_IPS = [
  '192.168.1.10', '192.168.1.15', '192.168.1.23', // Internal
  '10.0.0.5', '10.0.0.8', // DMZ
  '45.33.22.11', '104.21.55.2', '185.199.108.153', // External benign
  '198.51.100.2', '203.0.113.5' // External suspicious
];

export const COMMON_PORTS: Record<number, string> = {
  80: 'HTTP',
  443: 'HTTPS',
  22: 'SSH',
  21: 'FTP',
  25: 'SMTP',
  53: 'DNS',
  3306: 'MySQL',
  8080: 'HTTP-Alt'
};

export const PROTOCOLS = [Protocol.TCP, Protocol.UDP, Protocol.ICMP, Protocol.HTTP, Protocol.HTTPS, Protocol.SSH];

export const THREAT_SIGNATURES = [
  { name: 'SYN Flood', description: 'Rapid sequence of SYN packets from single IP', type: 'DDoS' },
  { name: 'Port Scan', description: 'Sequential connection attempts to multiple ports', type: 'Reconnaissance' },
  { name: 'SQL Injection Attempt', description: 'Malicious SQL payload detected in HTTP body', type: 'Injection' },
  { name: 'SSH Brute Force', description: 'Multiple failed login attempts on port 22', type: 'Brute Force' }
];
