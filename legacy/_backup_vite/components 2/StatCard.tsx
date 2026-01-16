import React from 'react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
           {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trendUp ? 'text-emerald-500' : 'text-red-500'} flex items-center`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className="text-slate-400 ml-2">წინა თვესთან შედარებით</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
