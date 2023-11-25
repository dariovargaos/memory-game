import { useContext } from "react";
import {
  GameSettingsContext,
  GameSettingsContextType,
} from "../context/GameSettingsContext";

export const useGameSettingsContext = (): GameSettingsContextType => {
  const context = useContext(GameSettingsContext);

  if (!context) {
    throw new Error(
      "useGameSettingsContext must be used within a GameSettingsProvider"
    );
  }
  return context;
};
