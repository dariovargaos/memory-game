import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface FetchedDocument {
  id: string;
  [key: string]: string | number | boolean;
}

async function fetchDocument(collectionName: string, id: string) {
  if (!id) throw new Error("Document ID is undefined.");

  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  } else {
    throw new Error("Document does not exist");
  }
}

export const useDocument = (
  collectionName: string,
  id: string | undefined
): UseQueryResult<FetchedDocument, Error> => {
  return useQuery<FetchedDocument, Error>({
    queryKey: ["document", collectionName, id],
    queryFn: () => fetchDocument(collectionName, id!),
    enabled: !!id,
  });
};
