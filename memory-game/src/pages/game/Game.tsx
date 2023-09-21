import { useState } from "react";

import { Button, Text } from "@chakra-ui/react";
import { useStorage } from "../../hooks/useStorage";

export default function Game() {
  const [cards, setCards] = useState<object[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const cardImages = useStorage();

  const shuffleCards = async () => {
    const shuffledCards = [...(await cardImages), ...(await cardImages)]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

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
    </>
  );
}
