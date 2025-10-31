import React from 'react';
import useCountAnimation from '../hooks/useCountAnimation';

const CountUp = ({ 
  endValue, 
  duration = 2000, 
  className = '', 
  label = '',
  delay = 0 
}) => {
  const { count, ref, isVisible } = useCountAnimation(endValue, duration);

  return (
    <div ref={ref} className={`stat-item ${className}`}>
      <span 
        className="stat-number"
        style={{
          animationDelay: `${delay}ms`
        }}
      >
        {count}
      </span>
      {label && <span className="stat-label">{label}</span>}
    </div>
  );
};

export default CountUp;
