import React, { useState, useEffect } from 'react';

// 1. The formatting function we built
export const formatToLongUppercaseDate = (date: Date = new Date()): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options)
    .format(date)
    .toUpperCase();
};

// 2. The Real-Time Component
export const RealTimeDateDisplay: React.FC = () => {
  // Initialize state with the exact current live time
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    // Set up an interval to update the date object every 1 second
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Live System Date:</h2>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3' }}>
        {formatToLongUppercaseDate(currentDate)}
      </div>
    </div>
  );
};
