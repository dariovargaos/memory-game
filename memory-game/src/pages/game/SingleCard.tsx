import { Image, GridItem, Box } from "@chakra-ui/react";

interface Card {
  src: string;
  cardBackImage: string;
}
interface SingleCardProps {
  card: object;
  handleChoice: (card: Card) => void;
  flipped: boolean;
  disabled: boolean;
}

const cardImagesStyle = {
  width: "80%",
  border: "2px solid #fff",
  borderRadius: "6px",
  display: "block",
};

export default function SingleCard({
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
