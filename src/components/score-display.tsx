"use client";

import { useEffect, useState } from "react";

/**
 * ScoreDisplay Component — animated counter (FIFA-style reveal)
 */

interface Props {
  score: number;
  dict: {
    scoreGood: string;
    scoreNeedsWork: string;
    scorePoor: string;
  };
}

export function ScoreDisplay({ score, dict }: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);

  // Animate from 0 to final score
  useEffect(() => {
    if (score === 0) return;

    const duration = 1500; // 1.5 seconds
    const steps = 60;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out curve: fast start, slow finish
      const progress = 1 - Math.pow(1 - step / steps, 3);
      const current = Math.round(score * progress);
      setDisplayScore(Math.min(current, score));

      if (step >= steps) {
        setDisplayScore(score);
        setAnimationDone(true);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getColor = () => {
    if (displayScore >= 80) return "text-primary";
    if (displayScore >= 50) return "text-moderate";
    return "text-critical";
  };

  const getLabel = () => {
    if (score >= 80) return dict.scoreGood;
    if (score >= 50) return dict.scoreNeedsWork;
    return dict.scorePoor;
  };

  return (
    <div
      className="inline-flex flex-col items-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={animationDone ? `Score: ${score} out of 100 — ${getLabel()}` : "Calculating score..."}
    >
      <div className={`text-6xl font-bold ${getColor()} transition-colors duration-300`}>
        {displayScore}<span className="text-3xl text-muted" aria-hidden="true">/100</span>
      </div>
      <p className={`text-sm font-medium mt-2 ${getColor()}`}>{getLabel()}</p>
    </div>
  );
}
