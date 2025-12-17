import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import { Packet } from '../types';
import { analyzeThreatWithGemini } from '../services/geminiService';

interface ThreatAnalysisModalProps {
  packet: Packet | null;
  onClose: () => void;
}

interface AnalysisResult {
  analysis: string;
  mitigation: string[];
}

const ThreatAnalysisModal: React.FC<ThreatAnalysisModalProps> = ({ packet, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (packet) {
      setLoading(true);
      analyzeThreatWithGemini(packet)
        .then((text) => {
          try {
            const data = JSON.parse(text);
            setResult(data);
          } catch (e) {
            setResult({
              analysis: "Could not parse AI response.",
              mitigation: []
            });
          }
        })
        .finally(() => setLoading(false));
    } else {
        setResult(null);
    }
  }, [packet]);

  if (!packet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-cyber-dark border border-cyber-gray w-full max-w-2xl rounded-lg shadow-2xl shadow-cyber-red/20 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-gray bg-cyber-black">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-cyber-red w-6 h-6" />
            <h2 className="text-xl font-bold font-mono text-white">AI Threat Intelligence</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Packet Summary */}
          <div className="bg-cyber-gray/30 p-4 rounded border border-cyber-gray font-mono text-sm">
             <div className="grid grid-cols-2 gap-2 text-gray-300">
                <span><span className="text-cyber-blue">SRC:</span> {packet.sourceIp}</span>
                <span><span className="text-cyber-blue">DST:</span> {packet.destIp}:{packet.destPort}</span>
                <span><span className="text-cyber-blue">PROTO:</span> {packet.protocol}</span>
                <span><span className="text-cyber-red">ALERT:</span> {packet.description}</span>
             </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-10 h-10 text-cyber-blue animate-spin" />
              <p className="text-cyber-blue font-mono animate-pulse">Analyzing signature with Gemini AI...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h3 className="text-lg font-semibold text-cyber-green mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Analysis
                </h3>
                <p className="text-gray-300 leading-relaxed">{result.analysis}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyber-yellow mb-2">Recommended Mitigation</h3>
                <ul className="space-y-2">
                  {result.mitigation.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-400 bg-cyber-gray/20 p-2 rounded">
                      <span className="text-cyber-yellow font-bold select-none">{idx + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
             <div className="text-red-400">Analysis failed.</div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyber-gray bg-cyber-black flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-cyber-gray hover:bg-gray-700 text-white rounded font-mono text-sm transition-colors"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};

export default ThreatAnalysisModal;
