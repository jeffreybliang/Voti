import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDateTime }) => {
  // Validate the date format and create Date object
  const targetDate = new Date(targetDateTime);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Validate if the date is valid
    if (isNaN(targetDate.getTime())) {
      console.error('Invalid date format. Please use ISO format (e.g., 2025-02-28T00:00:00Z)');
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]); // Added targetDate as dependency
return (
    <div className="grid grid-flow-col gap-10 text-center auto-cols-max">
      <div className="flex flex-col p-5 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-9xl">
          <span style={{ "--value": timeLeft.days }}></span>
        </span>
        days
      </div>
      <div className="flex flex-col p-5 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-9xl">
          <span style={{ "--value": timeLeft.hours }}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col p-5 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-9xl">
          <span style={{ "--value": timeLeft.minutes }}></span>
        </span>
        min
      </div>
      <div className="flex flex-col p-5 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-9xl">
          <span style={{ "--value": timeLeft.seconds }}></span>
        </span>
        sec
      </div>
    </div>
  );
};

export default CountdownTimer;
