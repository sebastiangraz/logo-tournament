import React from "react";
import { calculateStrengths } from "../components/calculateStrengths";
import { Logo, MatchResult } from "../App";

interface ScoreboardProps {
  logos: Logo[];
  matchResults: MatchResult[];
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  logos,
  matchResults,
}) => {
  // Calculate strengths
  const strengths = calculateStrengths(logos, matchResults);
  const maxStrength = Math.max(...Object.values(strengths));
  const normalizedStrengths: { [key: string]: number } = {};
  for (const [logoName, strength] of Object.entries(strengths)) {
    normalizedStrengths[logoName] = strength / maxStrength;
  }
  // Sort logos by strength
  const sortedLogos = [...logos].sort(
    (a, b) => normalizedStrengths[b.name] - normalizedStrengths[a.name]
  );

  return (
    <div className="scoreboard row">
      <h2>Final Ranking</h2>
      <ul>
        {sortedLogos.map((logo) => (
          <li key={logo.name} className="scoreboard-item">
            <img src={logo.url} alt="Logo" className="scoreboard-logo" />
            <span>
              Score: {(normalizedStrengths[logo.name] * 100).toFixed(2)}%
            </span>
            <span>{logo.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
