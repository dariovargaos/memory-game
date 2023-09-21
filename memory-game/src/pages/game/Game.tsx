import { useState } from "react";
import { useStorage } from "../../hooks/useStorage";

import {
  Button,
  Text,
  Box,
  Image,
  SimpleGrid,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";

export default function Game() {
  const [cards, setCards] = useState<object[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const cardImages = useStorage();

  const shuffleCards = async () => {
    const shuffledCards = [...(await cardImages), ...(await cardImages)]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        id: Math.random(),
      }));

    setCards(shuffledCards);
    setTurns(0);
  };

  console.log(cards);

  return (
    <>
      <Button color="white" background="transparent" onClick={shuffleCards}>
        New game
      </Button>
      <Text color="white">{turns}</Text>

      <Flex justify="center">
        <Grid templateColumns="1fr 1fr 1fr 1fr" w="60%">
          {cards.map((card) => (
            <GridItem key={card.id}>
              <Image src={card.src} alt="card front image" w="60%" />
              <Image src={card.cardBackImage} alt="card back image" w="60%" />
            </GridItem>
          ))}
        </Grid>
      </Flex>
    </>
  );
}
