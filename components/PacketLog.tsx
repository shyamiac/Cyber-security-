import React from 'react';
import { Packet, ThreatLevel } from '../types';
import { AlertTriangle, Search } from 'lucide-react';

interface PacketLogProps {
  packets: Packet[];
  onAnalyze: (packet: Packet) => void;
}

const PacketLog: React.FC<PacketLogProps> = ({ packets, onAnalyze }) => {
  return (
    <div className="flex flex-col h-full bg-cyber-dark border border-cyber-gray rounded-lg overflow-hidden">
      <div className="p-3 bg-cyber-black border-b border-cyber-gray flex justify-between items-center">
        <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-wider">Live Traffic Log</h3>
        <span className="text-xs text-cyber-green animate-pulse">● LIVE CAPTURE</span>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-cyber-gray/50 sticky top-0 backdrop-blur-sm z-10">
            <tr>
              <th className="p-3 text-xs font-mono text-gray-500 font-medium">TIME</th>
              <th className="p-3 text-xs font-mono text-gray-500 font-medium">SOURCE</th>
              <th className="p-3 text-xs font-mono text-gray-500 font-medium">DESTINATION</th>
              <th className="p-3 text-xs font-mono text-gray-500 font-medium">PROTO</th>
              <th className="p-3 text-xs font-mono text-gray-500 font-medium">INFO</th>
              <th className="p-3 text-xs font-mono text-gray-500 font-medium text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs divide-y divide-cyber-gray/30">
            {packets.map((packet) => (
              <tr 
                key={packet.id} 
                className={`hover:bg-white/5 transition-colors ${packet.threatLevel !== ThreatLevel.NONE ? 'bg-red-900/10' : ''}`}
              >
                <td className="p-3 text-gray-400 whitespace-nowrap">
                  {new Date(packet.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="p-3 text-cyber-blue whitespace-nowrap">{packet.sourceIp}</td>
                <td className="p-3 text-gray-300 whitespace-nowrap">{packet.destIp}:{packet.destPort}</td>
                <td className="p-3">
                   <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold 
                     ${packet.protocol === 'TCP' ? 'bg-blue-900 text-blue-200' : 
                       packet.protocol === 'UDP' ? 'bg-orange-900 text-orange-200' : 'bg-gray-800 text-gray-300'}`}>
                     {packet.protocol}
                   </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {packet.threatLevel !== ThreatLevel.NONE && (
                      <AlertTriangle className={`w-3 h-3 ${packet.threatLevel === ThreatLevel.CRITICAL ? 'text-cyber-red' : 'text-cyber-yellow'}`} />
                    )}
                    <span className={packet.threatLevel !== ThreatLevel.NONE ? 'text-red-200' : 'text-gray-500'}>
                      {packet.flag ? `[${packet.flag}] ` : ''}{packet.description}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  {packet.threatLevel !== ThreatLevel.NONE && (
                    <button 
                      onClick={() => onAnalyze(packet)}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-cyber-red/20 hover:bg-cyber-red/40 text-cyber-red rounded border border-cyber-red/50 transition-all text-[10px]"
                    >
                      <Search className="w-3 h-3" /> ANALYZE
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {packets.length === 0 && (
                <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-600 italic">Waiting for traffic...</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PacketLog;
