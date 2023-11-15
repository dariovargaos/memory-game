import { useQuery } from "@tanstack/react-query";
import { storage } from "../firebase/config";
import { ref, getDownloadURL } from "firebase/storage";

interface CardImage {
  src: string;
  cardBackImage: string;
}
export const useStorage = () => {
  const fetchCardImages = async (): Promise<CardImage[]> => {
    const cardBackImageUrl = await getDownloadURL(
      ref(storage, "cardImages/cover.png")
    );

    const imagePaths: string[] = [
      "cardImages/helmet-1.png",
      "cardImages/potion-1.png",
      "cardImages/ring-1.png",
      "cardImages/scroll-1.png",
      "cardImages/shield-1.png",
      "cardImages/sword-1.png",
    ];

    const cardImages: CardImage[] = await Promise.all(
      imagePaths.map(async (path): Promise<CardImage> => {
        const url = await getDownloadURL(ref(storage, path));
        return {
          src: url,
          cardBackImage: cardBackImageUrl,
        };
      })
    );

    return cardImages;
  };

  const { data, isLoading, isError, error } = useQuery<CardImage[], Error>({
    queryKey: ["cardImages"],
    queryFn: fetchCardImages,
  });

  return { data, isLoading, isError, error };
};
