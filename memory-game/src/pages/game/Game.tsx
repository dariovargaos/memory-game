import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useStorage } from "../../hooks/useStorage";
import { useGameSettingsContext } from "../../hooks/useGameSettingsContext";

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
  Link,
  useBreakpointValue,
  Progress,
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
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const { data: cardImages, isLoading, error } = useStorage();
  const { difficulty } = useGameSettingsContext();

  const shuffleCards = () => {
    if (cardImages) {
      const numberOfPairs =
        difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;

      const selectedNumberOfPairs = cardImages.slice(0, numberOfPairs);

      const shuffledCards: Card[] = [
        ...selectedNumberOfPairs,
        ...selectedNumberOfPairs,
      ]
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
      setGameStarted(false);
    }
  };

  //handle choice
  const handleChoice = (card: Card) => {
    if (!gameStarted) setGameStarted(true);
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

  //cleanup function
  useEffect(() => {
    return () => {
      setCards([]);
      setTurns(0), setChoiceOne(null), setChoiceTwo(null), setIsGameWon(false);
      setGameStarted(false);
    };
  }, []);

  const isSmallScreen = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
  });

  return (
    <Flex align="center" flexDir="column" gap={5}>
      {error && (
        <>
          <Text color="white">
            There was an error fetching data. Please try refresh the page.
          </Text>
        </>
      )}
      {isLoading && (
        <Progress size="xs" colorScheme="telegram" isIndeterminate />
      )}
      <Flex w="100%" justify="flex-end" px={2} py={isSmallScreen ? 3 : 0}>
        <Link as={RouterLink} to="/" color="white" fontWeight="bold">
          Home
        </Link>
      </Flex>

      <Button
        color="white"
        background="transparent"
        onClick={shuffleCards}
        _hover={{ background: "#c23866" }}
      >
        New game
      </Button>
      {isSmallScreen && (
        <Flex flexDir="column" align="center" gap={4} ml={4} mr="auto">
          <SimpleGrid columns={4} spacingY="20px">
            {cards.map((card) => (
              <SingleCard
                key={card.id}
                card={card}
                handleChoice={handleChoice}
                flipped={
                  card === choiceOne || card === choiceTwo || card.matched
                }
                disabled={disabled}
              />
            ))}
          </SimpleGrid>

          {gameStarted && <Text color="white">Turns: {turns}</Text>}
        </Flex>
      )}
      {!isSmallScreen && (
        <>
          <SimpleGrid columns={4} spacingY="20px" spacingX="20px">
            {cards.map((card) => (
              <SingleCard
                key={card.id}
                card={card}
                handleChoice={handleChoice}
                flipped={
                  card === choiceOne || card === choiceTwo || card.matched
                }
                disabled={disabled}
              />
            ))}
          </SimpleGrid>

          {gameStarted && <Text color="white">Turns: {turns}</Text>}
        </>
      )}

      {isGameWon && (
        <Modal
          isOpen={isGameWon}
          onClose={() => setIsGameWon(false)}
          isCentered
        >
          <ModalOverlay />
          <ModalContent
            backgroundColor="#301934"
            color="white"
            w={{ base: "90%", sm: "60%" }}
          >
            <ModalHeader>Congratulations!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              You've matched all the cards in <b>{turns} turns</b>!
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
