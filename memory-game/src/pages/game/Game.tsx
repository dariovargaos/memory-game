import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStorage } from "../../hooks/useStorage";

import {
  Button,
  Text,
  Flex,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

//components
import SingleCard from "./SingleCard";

export interface Card {
  id: number;
  src: string;
  cardBackImage: string;
  matched: boolean;
}

export default function Game() {
  const [cards, setCards] = useState<Card[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [choiceOne, setChoiceOne] = useState<Card | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const { data: cardImages, isLoading, isError, error } = useStorage();
  const navigate = useNavigate();

  const shuffleCards = () => {
    if (cardImages) {
      const shuffledCards: Card[] = [...cardImages, ...cardImages]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({
          ...card,
          id: Math.random(),
          matched: false,
        }));

      setCards(shuffledCards);
      setTurns(0);
      setChoiceOne(null);
      setChoiceTwo(null);
      setIsGameWon(false);
    }
  };

  //handle choice
  const handleChoice = (card: Card) => {
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

  //check whether the all cards have matched property on true
  useEffect(() => {
    const allMatched = cards.every((card) => card.matched);
    if (allMatched && cards.length > 0) {
      setIsGameWon(true);
    }
  }, [cards]);

  return (
    <Flex justify="center" flexDir="column" alignItems="center" gap={10}>
      {isLoading && <Text color="white">Loading...</Text>}
      <Flex w="100%" justify="space-between" px={3}>
        <Flex justify="center" flex="1">
          <Button
            color="white"
            background="transparent"
            onClick={shuffleCards}
            _hover={{ background: "#301934" }}
          >
            New game
          </Button>
        </Flex>
        <Button
          color="white"
          background="transparent"
          onClick={() => navigate("/")}
          _hover={{ background: "#301934" }}
        >
          Home
        </Button>
      </Flex>

      <SimpleGrid columns={4} spacingY="20px">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </SimpleGrid>

      <Text color="white">Turns: {turns}</Text>

      {isGameWon && (
        <Modal
          isOpen={isGameWon}
          onClose={() => setIsGameWon(false)}
          isCentered
        >
          <ModalOverlay />
          <ModalContent backgroundColor="#301934" color="white" opacity="0.3">
            <ModalHeader>You've won! Congratulations!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              You've matched all the cards in {turns} turns!
            </ModalBody>
            <ModalFooter>
              <Button
                color="white"
                background="transparent"
                onClick={() => setIsGameWon(false)}
                _hover={{ background: "#1b1523" }}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
}
