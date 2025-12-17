import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Activity, Shield, Wifi, AlertOctagon, Play, Square, Settings, Lock } from 'lucide-react';
import PacketLog from './components/PacketLog';
import TrafficChart from './components/TrafficChart';
import StatCard from './components/StatCard';
import ThreatAnalysisModal from './components/ThreatAnalysisModal';
import { generatePacket } from './services/packetGenerator';
import { Packet, ThreatLevel } from './types';

// How many packets to keep in memory for the log
const MAX_LOG_SIZE = 100;
// Chart history points
const MAX_CHART_POINTS = 20;

const App: React.FC = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [active, setActive] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  
  // Stats
  const [totalPackets, setTotalPackets] = useState(0);
  const [threatCount, setThreatCount] = useState(0);
  
  // Chart Data
  const [chartData, setChartData] = useState<{ time: string; packets: number; threats: number }[]>([]);

  // Refs for interval management and accurate "per second" counting
  const packetIntervalRef = useRef<number | null>(null);
  const statsIntervalRef = useRef<number | null>(null);
  
  // Buffers for the current second
  const currentSecondPackets = useRef(0);
  const currentSecondThreats = useRef(0);

  const handleToggleCapture = () => {
    setActive(!active);
  };

  const addPacket = useCallback(() => {
    const newPacket = generatePacket();
    
    // Update real-time stats buffers
    currentSecondPackets.current += 1;
    if (newPacket.threatLevel !== ThreatLevel.NONE) {
      currentSecondThreats.current += 1;
      setThreatCount(prev => prev + 1);
    }
    setTotalPackets(prev => prev + 1);

    // Update Log State
    setPackets(prev => {
      const updated = [newPacket, ...prev];
      if (updated.length > MAX_LOG_SIZE) return updated.slice(0, MAX_LOG_SIZE);
      return updated;
    });
  }, []);

  // Effect: Packet Generation Loop
  useEffect(() => {
    if (active) {
      // Generate packets at random intervals to simulate traffic variability
      const scheduleNextPacket = () => {
         const delay = Math.random() * 500 + 50; // 50ms to 550ms
         packetIntervalRef.current = window.setTimeout(() => {
           addPacket();
           scheduleNextPacket(); // Recursive timeout for variable delay
         }, delay);
      };
      
      scheduleNextPacket();
    } else {
      if (packetIntervalRef.current) clearTimeout(packetIntervalRef.current);
    }

    return () => {
      if (packetIntervalRef.current) clearTimeout(packetIntervalRef.current);
    };
  }, [active, addPacket]);

  // Effect: Chart Update Loop (Every 1 second)
  useEffect(() => {
    if (active) {
        statsIntervalRef.current = window.setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
            
            setChartData(prev => {
                const newData = [...prev, { 
                    time: timeStr, 
                    packets: currentSecondPackets.current, 
                    threats: currentSecondThreats.current 
                }];
                if (newData.length > MAX_CHART_POINTS) return newData.slice(newData.length - MAX_CHART_POINTS);
                return newData;
            });

            // Reset buffers
            currentSecondPackets.current = 0;
            currentSecondThreats.current = 0;

        }, 1000);
    } else {
        if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    }

    return () => {
        if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    };
  }, [active]);


  return (
    <div className="min-h-screen bg-cyber-black text-gray-200 font-sans flex flex-col">
      
      {/* Header */}
      <header className="h-16 border-b border-cyber-gray flex items-center justify-between px-6 bg-cyber-dark/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Shield className="text-cyber-green w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight text-white font-mono">
            SENTINEL <span className="text-cyber-green text-sm opacity-80">NIDS DASHBOARD</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${active ? 'border-cyber-green/30 bg-cyber-green/10' : 'border-gray-700 bg-gray-900'}`}>
                <div className={`w-2 h-2 rounded-full ${active ? 'bg-cyber-green animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-xs font-mono font-medium text-gray-300">
                    {active ? 'SYSTEM ARMED' : 'MONITORING PAUSED'}
                </span>
            </div>

            <button 
                onClick={handleToggleCapture}
                className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-sm font-bold transition-all
                  ${active 
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50' 
                    : 'bg-cyber-green text-black hover:bg-green-400 border border-cyber-green'}`}
            >
                {active ? <><Square className="w-4 h-4 fill-current"/> STOP CAPTURE</> : <><Play className="w-4 h-4 fill-current"/> START CAPTURE</>}
            </button>
            
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* Top Stats Row */}
        <div className="col-span-12 grid grid-cols-4 gap-6 h-32">
            <StatCard 
                title="Total Packets" 
                value={totalPackets.toLocaleString()} 
                icon={<Activity className="w-5 h-5" />} 
                trend="+120"
                trendColor="green"
            />
            <StatCard 
                title="Threats Detected" 
                value={threatCount} 
                icon={<AlertOctagon className="w-5 h-5" />} 
                trend={threatCount > 0 ? "+2" : "0"}
                trendColor="red"
                color="text-cyber-red"
            />
             <StatCard 
                title="Active Sessions" 
                value={active ? Math.floor(Math.random() * 20) + 5 : 0} 
                icon={<Wifi className="w-5 h-5" />} 
                trend="-1"
                trendColor="gray"
            />
            <StatCard 
                title="Security Status" 
                value={threatCount > 5 ? "CRITICAL" : threatCount > 0 ? "WARNING" : "SECURE"} 
                icon={<Lock className="w-5 h-5" />} 
                color={threatCount > 5 ? "text-cyber-red" : threatCount > 0 ? "text-cyber-yellow" : "text-cyber-green"}
            />
        </div>

        {/* Middle Section: Chart & Controls */}
        <div className="col-span-12 lg:col-span-8 h-96">
            <TrafficChart data={chartData} />
        </div>

        <div className="col-span-12 lg:col-span-4 h-96 flex flex-col gap-4">
             {/* Info Panel / Last Threat */}
             <div className="bg-cyber-dark border border-cyber-gray rounded-lg p-5 flex-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield className="w-32 h-32" />
                </div>
                <h3 className="text-gray-400 font-mono text-sm uppercase mb-4 font-bold">System Status</h3>
                
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                        <span className="text-gray-500">Engine</span>
                        <span className="text-cyber-green font-mono">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                        <span className="text-gray-500">Ruleset</span>
                        <span className="text-white font-mono">V.2024.10.15</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                        <span className="text-gray-500">AI Analysis</span>
                        <span className={process.env.API_KEY ? "text-cyber-green font-mono" : "text-gray-600 font-mono"}>
                          {process.env.API_KEY ? "AVAILABLE" : "NO API KEY"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-2">
                        <span className="text-gray-500">Last Scan</span>
                        <span className="text-white font-mono">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-gray-700">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        The Sentinel NIDS continuously monitors network interfaces for anomalous signatures. 
                        Detected threats are logged below. Click "Analyze" on any threat to use Gemini AI for deep inspection.
                    </p>
                </div>
             </div>
        </div>

        {/* Bottom Section: Packet Log */}
        <div className="col-span-12 h-[calc(100vh-32rem)] min-h-[300px]">
            <PacketLog packets={packets} onAnalyze={setSelectedPacket} />
        </div>

      </main>

      {/* Modal for AI Analysis */}
      {selectedPacket && (
        <ThreatAnalysisModal 
            packet={selectedPacket} 
            onClose={() => setSelectedPacket(null)} 
        />
      )}
    </div>
  );
};

export default App;
