import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string; // e.g. "+12%"
  trendColor?: 'green' | 'red' | 'gray';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendColor = 'green', color = 'text-white' }) => {
  return (
    <div className="bg-cyber-dark border border-cyber-gray p-4 rounded-lg flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-1">{title}</p>
          <h4 className={`text-2xl font-bold font-mono ${color}`}>{value}</h4>
        </div>
        <div className="p-2 bg-white/5 rounded-md text-gray-400">
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`text-xs mt-3 font-mono flex items-center gap-1 ${trendColor === 'green' ? 'text-cyber-green' : trendColor === 'red' ? 'text-cyber-red' : 'text-gray-500'}`}>
           <span>{trend}</span>
           <span className="text-gray-500">from last min</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
