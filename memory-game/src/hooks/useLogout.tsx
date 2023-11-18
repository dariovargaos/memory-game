import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

interface LogoutError {
  message: string;
}

interface FirebaseError extends Error {
  code: string;
}

export const useLogout = () => {
  const [error, setError] = useState<LogoutError | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isComponentMounted, setIsComponentMounted] = useState<boolean>(true);
  const { dispatch, user } = useAuthContext();
  const toast = useToast();

  const navigate = useNavigate();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      if (user) {
        const { uid } = user;
        await updateDoc(doc(db, "users", uid), {
          online: false,
        });

        await signOut(auth);

        //dispatch logout action
        dispatch({ type: "LOGOUT" });

        toast({
          title: "Logged out.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        //update state
        if (isComponentMounted) {
          setError(null);
          setIsPending(false);
          navigate("/");
        }
      }
    } catch (err) {
      if (!isComponentMounted) return;

      const firebaseError = err as FirebaseError;
      console.log(firebaseError.code);
      setError({ message: "Something went wrong." });
      setIsPending(false);
    }
  };

  useEffect(() => {
    return () => setIsComponentMounted(false);
  }, []);

  return { logout, error, isPending };
};
