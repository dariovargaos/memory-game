import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export interface User {
  displayName?: string;
  uid?: string;
}

interface AuthState {
  user: User | null;
  authIsReady: boolean;
}

interface AuthAction {
  type: string;
  payload?: any;
}

export interface AuthContextType {
  user: User | null;
  dispatch: React.Dispatch<AuthAction>;
  authIsReady: boolean;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const initalState: AuthState = {
  user: null,
  authIsReady: false,
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initalState);

  const contextValue: AuthContextType = {
    user: state.user,
    authIsReady: state.authIsReady,
    dispatch,
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
    });
    return () => unsub();
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
