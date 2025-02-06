import { useState, useEffect, useMemo } from "react";

const InlineCountdownTimer = ({ targetDateTime }) => {
  // Memoize targetDate so it doesn't change on every render
  const targetDate = useMemo(() => new Date(targetDateTime), [targetDateTime]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (isNaN(targetDate.getTime())) {
      console.error(
        "Invalid date format. Please use ISO format (e.g., 2025-02-28T00:00:00Z)"
      );
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
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div style={{ fontFamily: "Futura" }}>
      <p>
        Voting closes in &nbsp;
        <span className="dui-countdown text-base">
          <span style={{ "--value": timeLeft.days }}></span> :
          <span style={{ "--value": timeLeft.hours }}></span> :
          <span style={{ "--value": timeLeft.minutes }}></span> :
          <span style={{ "--value": timeLeft.seconds }}></span>
        </span>
      </p>
    </div>
  );
};

export default InlineCountdownTimer;
