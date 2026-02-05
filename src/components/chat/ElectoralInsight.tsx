import React from 'react';
import { Lightbulb, AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface InsightData {
  type: 'insight' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  details?: string[];
}

export const ElectoralInsight: React.FC<InsightData> = ({ type, title, message, details }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'insight':
        return {
          bg: 'bg-teal-50',
          border: 'border-teal-300',
          icon: <Lightbulb className="w-6 h-6 text-teal-600" />,
          titleColor: 'text-teal-900',
          textColor: 'text-teal-800',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
          titleColor: 'text-yellow-900',
          textColor: 'text-yellow-800',
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-300',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          titleColor: 'text-green-900',
          textColor: 'text-green-800',
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          icon: <Info className="w-6 h-6 text-blue-600" />,
          titleColor: 'text-blue-900',
          textColor: 'text-blue-800',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          icon: <Info className="w-6 h-6 text-gray-600" />,
          titleColor: 'text-gray-900',
          textColor: 'text-gray-800',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`${styles.bg} rounded-xl border-2 ${styles.border} p-5 max-w-lg shadow-md`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">{styles.icon}</div>
        <div className="flex-1">
          <h4 className={`font-bold text-lg mb-2 ${styles.titleColor}`}>{title}</h4>
          <p className={`text-sm mb-3 ${styles.textColor}`}>{message}</p>
          
          {details && details.length > 0 && (
            <ul className={`space-y-1 text-sm ${styles.textColor}`}>
              {details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
