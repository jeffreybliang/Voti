import React, { useState, useEffect, useMemo } from 'react';

const CountdownTimer = ({ targetDateTime }) => {
  // Memoize targetDate to avoid it changing on every render
  const targetDate = useMemo(() => new Date(targetDateTime), [targetDateTime]);
  
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

// Define common class names
const containerClass = "flex flex-col p-3 bg-red-600/95 dark:bg-red-700/95 rounded-box text-white";
const countdownTextClass = "dui-countdown text-[2.6rem] lg:text-7xl md:text-7xl sm:text-5xl px-1";
const timeLabelClass = "text-xs sm:text-sm md:text-sm lg:text-base";

return (
  <div className="grid grid-flow-col gap-1 sm:gap-3 md:gap-3 text-center auto-cols-max" >
    <div className={containerClass}>
      <span className={countdownTextClass}>
        <span style={{ "--value": timeLeft.days }}></span>
      </span>
      <span className={timeLabelClass}>days</span>
    </div>
    <div className={containerClass}>
      <span className={countdownTextClass}>
        <span style={{ "--value": timeLeft.hours }}></span>
      </span>
      <span className={timeLabelClass}>hours</span>
    </div>
    <div className={containerClass}>
      <span className={countdownTextClass}>
        <span style={{ "--value": timeLeft.minutes }}></span>
      </span>
      <span className={timeLabelClass}>minutes</span>
    </div>
    <div className={containerClass}>
      <span className={countdownTextClass}>
        <span style={{ "--value": timeLeft.seconds }}></span>
      </span>
      <span className={timeLabelClass}>seconds</span>
    </div>
  </div>
);
};

export default CountdownTimer;
