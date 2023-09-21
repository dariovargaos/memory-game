import { Image, GridItem } from "@chakra-ui/react";

interface Card {
  src: string;
  cardBackImage: string;
}
interface SingleCardProps {
  card: object;
  handleChoice: (card: Card) => void;
}

export default function SingleCard({ card, handleChoice }: SingleCardProps) {
  const handleClick = () => {
    handleChoice(card);
  };
  return (
    <>
      <GridItem>
        <Image
          src={card.src}
          alt="card front image"
          w="60%"
          border="2px solid #fff"
          borderRadius="6px"
        />
        <Image
          onClick={handleClick}
          src={card.cardBackImage}
          alt="card back image"
          w="60%"
          border="2px solid #fff"
          borderRadius="6px"
        />
      </GridItem>
    </>
  );
}
