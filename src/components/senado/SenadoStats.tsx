import { useState, useEffect, useRef } from 'react';
import { Landmark, Users, FileText, AlertTriangle, ShieldAlert, Scale, HelpCircle, LayoutGrid } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  accent: 'purple' | 'red' | 'orange';
}

const useCountUp = (target: number, duration = 1500, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
};

const StatCounter = ({ item, animate }: { item: StatItem; animate: boolean }) => {
  const count = useCountUp(item.value, 1800, animate);

  const accentClasses = {
    purple: {
      icon: 'text-purple-600',
      value: 'text-gray-900',
      bg: 'bg-purple-50',
    },
    red: {
      icon: 'text-red-500',
      value: 'text-red-600',
      bg: 'bg-red-50',
    },
    orange: {
      icon: 'text-orange-500',
      value: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  };

  const styles = accentClasses[item.accent];

  return (
    <div className={`text-center px-2 py-4 rounded-2xl ${styles.bg}`}>
      <div className={`flex justify-center mb-3 ${styles.icon}`}>{item.icon}</div>
      <div className={`text-3xl md:text-4xl font-black mb-1 ${styles.value}`}>
        {item.prefix || ''}
        {count.toLocaleString('es-CO')}
        {item.suffix || ''}
      </div>
      <div className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide leading-tight">
        {item.label}
      </div>
    </div>
  );
};

const SenadoStats = () => {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats: StatItem[] = [
    {
      icon: <Landmark className="h-8 w-8" />,
      value: 103,
      label: 'Senadores a elegir',
      accent: 'purple',
    },
    {
      icon: <LayoutGrid className="h-8 w-8" />,
      value: 16,
      label: 'Partidos en el tarjetón',
      accent: 'purple',
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: 3144,
      label: 'Aspirantes totales',
      accent: 'purple',
    },
    {
      icon: <FileText className="h-8 w-8" />,
      value: 195,
      label: 'Candidatos cuestionados',
      accent: 'red',
    },
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      value: 78,
      label: 'Cuestionados al Senado',
      accent: 'red',
    },
    {
      icon: <ShieldAlert className="h-8 w-8" />,
      value: 41,
      label: 'Posibles inhabilidades',
      accent: 'orange',
    },
    {
      icon: <HelpCircle className="h-8 w-8" />,
      value: 88,
      suffix: '%',
      label: 'No conoce candidatos al Senado',
      accent: 'orange',
    },
    {
      icon: <Scale className="h-8 w-8" />,
      value: 3,
      label: 'Tarjetones el mismo día',
      accent: 'purple',
    },
  ];

  return (
    <section
      ref={ref}
      className="bg-white border-b border-gray-100 relative z-20 -mt-10 mx-4 md:mx-12 rounded-3xl shadow-xl shadow-purple-900/5"
    >
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {stats.map((item, index) => (
            <StatCounter key={index} item={item} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SenadoStats;
