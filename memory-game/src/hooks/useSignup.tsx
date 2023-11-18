import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuthContext } from "./useAuthContext";
import { useToast } from "@chakra-ui/react";

interface SignupError {
  message: string;
}

interface FirebaseError extends Error {
  code: string;
}

export const useSignup = () => {
  const [error, setError] = useState<SignupError | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const [isComponentMounted, setIsComponentMounted] = useState<boolean>(true);

  const navigate = useNavigate();
  const toast = useToast();

  const validateInput = (
    email: string,
    password: string,
    displayName: string
  ): boolean => {
    if (email.trim() === "") {
      setError({ message: "Email is required." });
      return false;
    }
    if (password.trim() === "") {
      setError({ message: "Password is required." });
      return false;
    }
    if (displayName.trim() === "") {
      setError({ message: "Display name cannot be empty." });
      return false;
    }

    return true;
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    if (!validateInput(email, password, displayName)) {
      setIsPending(false);
      return;
    }

    //sign the user up
    try {
      const res: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!res) {
        throw new Error("Could not complete signup.");
      }

      //add display name to the user
      await updateProfile(res.user, {
        displayName: displayName,
      });

      //create a user document
      await setDoc(doc(collection(db, "users"), res.user.uid), {
        online: true,
        displayName: displayName,
        wins: 0,
        losses: 0,
      });

      //dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      //update state
      if (isComponentMounted) {
        setIsPending(false);
        setError(null);
        navigate("/");
      }
      toast({
        title: "Successfully signed up.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      if (!isComponentMounted) return;

      const firebaseError = err as FirebaseError;
      switch (firebaseError.code) {
        case "auth/email-already-in-use":
          setError({
            message:
              "This email address is already in use. Please choose another email.",
          });
          break;
        case "auth/invalid-email":
          setError({
            message: "Invalid email.",
          });
          break;
        case "auth/missing-password":
          setError({
            message: "You must enter a password.",
          });
          break;
        case "auth/weak-password":
          setError({
            message: "Password should be at least 6 characters.",
          });
          break;
        default:
          setError({ message: firebaseError.message });
      }
      setIsPending(false);
    }
  };

  useEffect(() => {
    return () => setIsComponentMounted(false);
  }, []);

  return { signup, error, isPending };
};
