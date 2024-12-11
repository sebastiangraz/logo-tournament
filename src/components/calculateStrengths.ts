import { Logo } from "../App";

interface MatchResult {
  winner: string;
  loser: string;
}

export const calculateStrengths = (
  logos: Logo[],
  matchResults: MatchResult[]
) => {
  // Initialize strengths
  const strengths: { [key: string]: number } = {};
  logos.forEach((logo) => {
    strengths[logo.name] = 1; // Start with 1
  });

  // Initialize counts
  const winCounts: { [i: string]: { [j: string]: number } } = {};
  const totalComparisons: { [i: string]: { [j: string]: number } } = {};

  logos.forEach((logoI) => {
    winCounts[logoI.name] = {};
    totalComparisons[logoI.name] = {};
    logos.forEach((logoJ) => {
      if (logoI.name !== logoJ.name) {
        winCounts[logoI.name][logoJ.name] = 0;
        totalComparisons[logoI.name][logoJ.name] = 0;
      }
    });
  });

  // Populate counts from matchResults
  matchResults.forEach(({ winner, loser }) => {
    winCounts[winner][loser] += 1;
    totalComparisons[winner][loser] += 1;
    totalComparisons[loser][winner] += 1;
  });

  // Iteratively estimate strengths
  const maxIterations = 1000;
  const tolerance = 1e-6;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let maxChange = 0;

    logos.forEach((logoI) => {
      const i = logoI.name;
      let numerator = 0;
      let denominator = 0;

      logos.forEach((logoJ) => {
        const j = logoJ.name;
        if (i !== j && totalComparisons[i][j] > 0) {
          const s_i = strengths[i];
          const s_j = strengths[j];
          const w_ij = winCounts[i][j];
          const w_ji = winCounts[j][i];
          const totalGames = w_ij + w_ji;

          numerator += w_ij;
          denominator += totalGames / (s_i + s_j);
        }
      });

      if (denominator === 0) {
        // Avoid division by zero
        return;
      }

      const newStrength = numerator / denominator;
      maxChange = Math.max(maxChange, Math.abs(strengths[i] - newStrength));
      strengths[i] = newStrength;
    });

    if (maxChange < tolerance) {
      break;
    }
  }

  // Ensure all strengths are positive numbers
  for (const key in strengths) {
    if (!isFinite(strengths[key]) || strengths[key] <= 0) {
      strengths[key] = 1e-6; // Set a minimal positive value
    }
  }

  return strengths;
};
