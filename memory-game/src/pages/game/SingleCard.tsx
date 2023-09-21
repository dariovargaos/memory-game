import { Image, GridItem } from "@chakra-ui/react";

interface SingleCardProps {
  card: object;
}

export default function SingleCard({ card }: SingleCardProps) {
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
