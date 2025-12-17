import { Packet, Protocol, ThreatLevel } from "../types";
import { MOCK_IPS, PROTOCOLS } from "../constants";

let packetCounter = 0;

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generatePacket = (forceThreat: boolean = false): Packet => {
  packetCounter++;
  const id = `pkt-${packetCounter}-${Date.now()}`;
  const timestamp = Date.now();
  
  // 10% chance of threat if not forced, else random normal traffic
  const isThreat = forceThreat || Math.random() < 0.05;
  
  const sourceIp = getRandomItem(MOCK_IPS);
  let destIp = getRandomItem(MOCK_IPS);
  while (destIp === sourceIp) destIp = getRandomItem(MOCK_IPS);

  const protocol = getRandomItem(PROTOCOLS);
  
  let sourcePort = getRandomInt(1024, 65535);
  let destPort = getRandomInt(1, 1000) > 800 ? getRandomInt(1024, 9000) : getRandomItem([80, 443, 22, 53, 3306, 8080]);
  
  let threatLevel = ThreatLevel.NONE;
  let description = 'Normal traffic';

  if (isThreat) {
    const threatType = Math.random();
    if (threatType < 0.3) {
      // Port Scan Simulation
      threatLevel = ThreatLevel.MEDIUM;
      description = 'Potential Port Scan detected';
      // Keep IPs but randomize ports in rapid succession (simulated by caller usually, but here we just mark one)
    } else if (threatType < 0.6) {
      // DDoS / Flood
      threatLevel = ThreatLevel.HIGH;
      description = 'High frequency packet volume (SYN Flood)';
    } else {
      // Malicious Payload
      threatLevel = ThreatLevel.CRITICAL;
      description = 'Suspicious payload signature detected';
      destPort = 80;
    }
  }

  return {
    id,
    timestamp,
    sourceIp,
    destIp,
    sourcePort,
    destPort,
    protocol,
    payloadSize: getRandomInt(64, 1500),
    threatLevel,
    flag: protocol === Protocol.TCP ? getRandomItem(['SYN', 'ACK', 'PSH,ACK', 'FIN']) : undefined,
    description
  };
};
