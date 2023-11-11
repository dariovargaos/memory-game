import { useState, useEffect } from "react";
import { useStorage } from "../../hooks/useStorage";

import { Button, Text, Grid, Flex } from "@chakra-ui/react";

//components
import SingleCard from "./SingleCard";

export default function Game() {
  const [cards, setCards] = useState<object[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const cardImages = useStorage();

  const shuffleCards = async () => {
    const shuffledCards = [...(await cardImages), ...(await cardImages)]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        id: Math.random(),
        matched: false,
      }));

    setCards(shuffledCards);
    setTurns(0);
  };

  //handle choice
  const handleChoice = (card: object) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  //reset choices and increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  //compare two selected card
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1500);
      }
    }
  }, [choiceOne, choiceTwo]);

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
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </Grid>
      </Flex>
    </>
  );
}
