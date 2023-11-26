import { createContext, ReactNode, useState } from "react";

export interface GameSettingsContextType {
  difficulty: string;
  timerEnabled: boolean;
  setDifficulty: (difficulty: string) => void;
  setTimerEnabled: (timerEnabled: boolean) => void;
}

interface GameSettingsContextProviderProps {
  children: ReactNode;
}

export const GameSettingsContext = createContext<
  GameSettingsContextType | undefined
>(undefined);

export const GameSettingsContextProvider = ({
  children,
}: GameSettingsContextProviderProps) => {
  const [difficulty, setDifficulty] = useState("easy");
  const [timerEnabled, setTimerEnabled] = useState(false);

  const contextValue: GameSettingsContextType = {
    difficulty,
    timerEnabled,
    setDifficulty,
    setTimerEnabled,
  };

  return (
    <GameSettingsContext.Provider value={contextValue}>
      {children}
    </GameSettingsContext.Provider>
  );
};
