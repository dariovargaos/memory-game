import { useState } from "react";
import { useStorage } from "../../hooks/useStorage";

import { Button, Text, Grid, Flex } from "@chakra-ui/react";

//components
import SingleCard from "./SingleCard";

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
            <SingleCard key={card.id} card={card} />
          ))}
        </Grid>
      </Flex>
    </>
  );
}
