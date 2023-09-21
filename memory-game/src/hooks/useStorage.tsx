import { storage } from "../firebase/config";
import { ref, getDownloadURL } from "firebase/storage";

export const useStorage = async () => {
  const cardImages: object[] = [];

  const imagePaths: string[] = [
    "cardImages/helmet-1.png",
    "cardImages/potion-1.png",
    "cardImages/ring-1.png",
    "cardImages/scroll-1.png",
    "cardImages/shield-1.png",
    "cardImages/sword-1.png",
  ];

  await Promise.all(
    imagePaths.map(async (path) => {
      const url = await getDownloadURL(ref(storage, path));
      cardImages.push({ src: url });
    })
  );

  return cardImages;
};
