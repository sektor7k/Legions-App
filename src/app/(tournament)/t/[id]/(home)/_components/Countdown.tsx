
import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date; 
}

export default function Countdown({ targetDate }:CountdownProps){
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeDifference = targetDate.getTime() - now.getTime();

      if (timeDifference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds
      });
    };

    // Güncellemeyi her saniye yap
    const intervalId = setInterval(updateCountdown, 1000);

    // Temizlik işlemi
    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (

      <div className="flex flex-row items-center justify-center space-x-3">
        <div className="flex flex-col items-center justify-center bg-red-950 bg-opacity-70 px-1 p-2 rounded-lg">
          <p className="text-3xl font-extrabold font-mono">{String(timeLeft.days).padStart(2, '0')}</p>
          <p className="text-red-700 font-bold font-mono text-sm">DAYS</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-red-950 bg-opacity-70 px-1 p-2 rounded-lg">
          <p className="text-3xl font-extrabold font-mono">{String(timeLeft.hours).padStart(2, '0')}</p>
          <p className="text-red-700 font-bold font-mono text-sm">HRS</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-red-950 bg-opacity-70 px-1 p-2 rounded-lg">
          <p className="text-3xl font-extrabold font-mono">{String(timeLeft.minutes).padStart(2, '0')}</p>
          <p className="text-red-700 font-bold font-mono text-sm">MINS</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-red-950 bg-opacity-70 px-1 p-2 rounded-lg">
          <p className="text-3xl font-extrabold font-mono">{String(timeLeft.seconds).padStart(2, '0')}</p>
          <p className="text-red-700 font-bold font-mono text-sm">SECS</p>
        </div>
      </div>

  );
};

