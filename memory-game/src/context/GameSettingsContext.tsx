import { createContext, ReactNode, useState } from "react";

export interface GameSettingsContextType {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
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

  const contextValue: GameSettingsContextType = {
    difficulty,
    setDifficulty,
  };

  return (
    <GameSettingsContext.Provider value={contextValue}>
      {children}
    </GameSettingsContext.Provider>
  );
};
