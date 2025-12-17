import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TrafficData {
  time: string;
  packets: number;
  threats: number;
}

interface TrafficChartProps {
  data: TrafficData[];
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  return (
    <div className="h-full w-full bg-cyber-dark border border-cyber-gray rounded-lg p-4 flex flex-col">
       <div className="mb-4 flex justify-between items-center">
        <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-wider">Network Traffic Volume</h3>
        <div className="flex gap-4 text-xs font-mono">
            <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyber-green"></span>
                <span className="text-gray-400">Normal</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyber-red"></span>
                <span className="text-gray-400">Threats</span>
            </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00ff41" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis 
                dataKey="time" 
                tick={{fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono'}}
                tickLine={false}
                axisLine={false}
            />
            <YAxis 
                tick={{fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono'}}
                tickLine={false}
                axisLine={false}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '4px' }}
                itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                labelStyle={{ color: '#999', fontFamily: 'JetBrains Mono', fontSize: '12px', marginBottom: '4px' }}
            />
            <Area 
                type="monotone" 
                dataKey="packets" 
                stroke="#00ff41" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPackets)" 
                isAnimationActive={false}
            />
             <Area 
                type="monotone" 
                dataKey="threats" 
                stroke="#ff003c" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorThreats)" 
                isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficChart;
