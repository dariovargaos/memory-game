import { Image, GridItem, Box } from "@chakra-ui/react";

interface Card {
  src: string;
  cardBackImage: string;
}
interface SingleCardProps {
  card: object;
  handleChoice: (card: Card) => void;
  flipped: boolean;
}

const cardImagesStyle = {
  width: "60%",
  border: "2px solid #fff",
  borderRadius: "6px",
  display: "block",
  position: "absolute",
};

export default function SingleCard({
  card,
  handleChoice,
  flipped,
}: SingleCardProps) {
  const handleClick = () => {
    handleChoice(card);
  };
  return (
    <Box position="relative">
      <GridItem>
        <Image
          src={card.src}
          alt="card front image"
          sx={{
            ...cardImagesStyle,
            transform: flipped ? "rotateY(0deg)" : "rotateY(90deg)",
            transitionDelay: flipped ? "0.2s" : "",
            transition: flipped ? "" : "transform 0.2s ease-in",
          }}
        />
        <Image
          src={card.cardBackImage}
          alt="card back image"
          onClick={handleClick}
          sx={{
            ...cardImagesStyle,
            transform: flipped ? "rotateY(90deg)" : "",
            transitionDelay: flipped ? "0s" : "0.2s",
            transition: flipped ? "" : "transform 0.2s ease-in",
            position: "relative",
          }}
        />
      </GridItem>
    </Box>
  );
}
