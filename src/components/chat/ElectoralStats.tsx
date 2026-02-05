import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';

export interface StatsData {
  title: string;
  stats: Array<{
    label: string;
    value: string | number;
    icon?: 'chart' | 'pie' | 'trend' | 'users';
    color?: string;
  }>;
  description?: string;
}

export const ElectoralStats: React.FC<StatsData> = ({ title, stats, description }) => {
  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'chart':
        return <BarChart3 className="w-5 h-5" />;
      case 'pie':
        return <PieChart className="w-5 h-5" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'teal':
        return 'bg-teal-100 text-teal-700 border-teal-300';
      case 'blue':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'green':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'red':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-teal-100 text-teal-700 border-teal-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-600 px-5 py-4">
        <h3 className="text-white font-bold text-lg">{title}</h3>
        {description && (
          <p className="text-teal-100 text-sm mt-1">{description}</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="p-5 grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 border-2 ${getColorClasses(stat.color)} transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              {getIcon(stat.icon)}
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs font-medium opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
