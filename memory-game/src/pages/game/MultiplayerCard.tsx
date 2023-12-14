import { Image, Box } from "@chakra-ui/react";
import { Card } from "./MultiplayerGame";

interface SingleCardProps {
  card: Card;
  handleChoice: (selectedCard: Card) => Promise<void>;
  flipped: boolean;
  disabled: boolean;
}

const cardImagesStyle = {
  border: "2px solid #fff",
  borderRadius: "6px",
  display: "block",
  width: "80%",
};

export default function MultiplayerCard({
  card,
  handleChoice,
  flipped,
  disabled,
}: SingleCardProps) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <Box position="relative">
      <Image
        src={card.src}
        alt="card front image"
        sx={{
          ...cardImagesStyle,
          position: "absolute",
          transform: flipped ? "rotateY(0deg)" : "rotateY(90deg)",
          transition: "transform 0.2s ease-in",
          zIndex: flipped ? 1 : 0,
        }}
      />
      <Image
        src={card.cardBackImage}
        alt="card back image"
        onClick={handleClick}
        sx={{
          ...cardImagesStyle,
          position: "relative",
          transform: flipped ? "rotateY(90deg)" : "rotateY(0deg)",
          transition: "transform 0.2s ease-in",
          zIndex: flipped ? 0 : 1,
        }}
      />
    </Box>
  );
}
