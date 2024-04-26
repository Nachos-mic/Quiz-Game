// ScoreContext.tsx
import React from 'react';

type ScoreContextType = {
  scores: number[];
  setScores: React.Dispatch<React.SetStateAction<number[]>>;
};

const ScoreContext = React.createContext<ScoreContextType>({ scores: [], setScores: () => {} });

export default ScoreContext;