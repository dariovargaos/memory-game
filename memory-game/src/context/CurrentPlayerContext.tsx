import React, { createContext, useState } from "react";

export const CurrentPlayerContext = createContext({
  currentPlayer: null,
  setCurrentPlayer: () => {},
});

export const CurrentPlayerProvider = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const value = {
    currentPlayer,
    setCurrentPlayer,
  };

  return (
    <CurrentPlayerContext.Provider value={value}>
      {children}
    </CurrentPlayerContext.Provider>
  );
};
