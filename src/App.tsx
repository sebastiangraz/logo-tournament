import React, { useState } from "react";
import { ImageInput } from "./components/ImageInput";
import { Scoreboard } from "./components/Scoreboard";
import { TournamentMatch } from "./components/TournamentMatch";

export interface Logo {
  url: string;
  name: string;
  totalWins: number;
}

interface LogoMatch {
  logo1: Logo;
  logo2: Logo;
  winner: Logo | null;
}

export interface MatchResult {
  winner: string;
  loser: string;
}

export default function App() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [tournament, setTournament] = useState<LogoMatch[]>([]);
  const [currentMatch, setCurrentMatch] = useState<number>(0);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);

  const handleLogoInput = (uploadedLogos: Logo[]) => {
    const initializedLogos = uploadedLogos.map((logo) => ({
      ...logo,
      wins: 0,
      losses: 0,
    }));
    setLogos(initializedLogos);
    initializeTournament(initializedLogos);
  };

  const MAX_COMPARISONS = 48;

  const initializeTournament = (uploadedLogos: Logo[]) => {
    const matches: LogoMatch[] = [];
    const possiblePairs: [Logo, Logo][] = [];

    // Generate all possible pairs
    for (let i = 0; i < uploadedLogos.length; i++) {
      for (let j = i + 1; j < uploadedLogos.length; j++) {
        possiblePairs.push([uploadedLogos[i], uploadedLogos[j]]);
      }
    }

    // Shuffle the pairs
    for (let i = possiblePairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possiblePairs[i], possiblePairs[j]] = [
        possiblePairs[j],
        possiblePairs[i],
      ];
    }

    // Select up to MAX_COMPARISONS pairs
    const selectedPairs = possiblePairs.slice(0, MAX_COMPARISONS);

    selectedPairs.forEach(([logo1, logo2]) => {
      matches.push({ logo1, logo2, winner: null });
    });

    setTournament(matches);
    setCurrentMatch(0);
  };

  const handleMatchSelection = (winner: Logo, loser: Logo) => {
    // Record the match result
    setMatchResults((prevResults) => [
      ...prevResults,
      { winner: winner.name, loser: loser.name },
    ]);

    // Update total wins
    setLogos((prevLogos) =>
      prevLogos.map((logo) => {
        if (logo.name === winner.name) {
          return { ...logo, totalWins: logo.totalWins + 1 };
        } else {
          return logo;
        }
      })
    );

    // Proceed to the next match
    if (currentMatch < tournament.length - 1) {
      setCurrentMatch(currentMatch + 1); // Correct: Pass a number
    } else {
      setCurrentMatch(-1); // Correct: Pass a number
    }
  };

  return (
    <div>
      {logos.length === 0 ? (
        <ImageInput onLogoInput={handleLogoInput} />
      ) : currentMatch !== -1 && tournament.length > 0 ? (
        <TournamentMatch
          logo1={tournament[currentMatch].logo1}
          logo2={tournament[currentMatch].logo2}
          onSelect={(winner) =>
            handleMatchSelection(
              winner,
              winner.name === tournament[currentMatch].logo1.name
                ? tournament[currentMatch].logo2
                : tournament[currentMatch].logo1
            )
          }
          currentMatchNumber={currentMatch + 1}
          totalMatches={tournament.length}
        />
      ) : (
        <Scoreboard logos={logos} matchResults={matchResults} />
      )}
    </div>
  );
}
