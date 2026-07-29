/**
 * ScoreDisplay Component (translated labels)
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
  const getColor = () => {
    if (score >= 80) return "text-primary";
    if (score >= 50) return "text-moderate";
    return "text-critical";
  };

  const getLabel = () => {
    if (score >= 80) return dict.scoreGood;
    if (score >= 50) return dict.scoreNeedsWork;
    return dict.scorePoor;
  };

  return (
    <div className="inline-flex flex-col items-center" aria-label={`${score}/100 — ${getLabel()}`}>
      <div className={`text-5xl font-bold ${getColor()}`}>
        {score}<span className="text-2xl text-muted">/100</span>
      </div>
      <p className={`text-sm font-medium mt-1 ${getColor()}`}>{getLabel()}</p>
    </div>
  );
}
