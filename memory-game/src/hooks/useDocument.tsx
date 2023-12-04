import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { onSnapshot, doc, DocumentData } from "firebase/firestore";

interface UseDocumentReturn {
  document: DocumentData | null;
  error: string | null;
}

export const useDocument = (
  collectionName: string,
  id: string
): UseDocumentReturn => {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  //realtime data for document
  useEffect(() => {
    const docRef = doc(db, collectionName, id);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setDocument(null);
          setError("Something went wrong with user data.");
        }
      },
      (error) => {
        console.log(error.message);
        setError("Could not get the data.");
      }
    );

    return () => unsubscribe();
  }, [collectionName, id]);

  return { document, error };
};
