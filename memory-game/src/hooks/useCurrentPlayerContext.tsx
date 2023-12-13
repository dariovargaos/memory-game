import { CurrentPlayerContext } from "../context/CurrentPlayerContext";
import { useContext } from "react";

export const useCurrentPlayerContext = () => {
  const context = useContext(CurrentPlayerContext);

  if (!context) {
    throw new Error("useAuthContext must be inside and CurrentPlayerProvider");
  }

  return context;
};
