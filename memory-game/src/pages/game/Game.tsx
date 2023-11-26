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
  Card,
  CardBody,
  Stack,
  StackDivider,
  Box,
  RadioGroup,
  Radio,
  Heading,
  VStack,
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
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [timerEnabled, setTimerEnabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [shuffledDifficulty, setShuffledDifficulty] = useState<string>("easy");

  const shuffleCards = () => {
    if (cardImages) {
      const numberOfPairs =
        difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;

      //shuffle card images so they are not same sequence over and over again
      const shuffledImageUrls = [...cardImages].sort(() => Math.random() - 0.5);

      const selectedNumberOfPairs = shuffledImageUrls.slice(0, numberOfPairs);

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

      if (timerEnabled) {
        const timeLimit =
          difficulty === "easy" ? 40 : difficulty === "medium" ? 55 : 65;
        setTimer(timeLimit);
      } else {
        setTimer(0);
      }

      setCards(shuffledCards);
      setTurns(0);
      setChoiceOne(null);
      setChoiceTwo(null);
      setIsGameWon(false);
      setGameStarted(false);
      setIsTimeOut(false);
      setShuffledDifficulty(difficulty);
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
      setGameStarted(false);
      setRemainingTime(timer);
    }
  }, [cards, timer]);

  //countdown timer based on selected difficulty
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerEnabled && gameStarted && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && timerEnabled && gameStarted) {
      setIsTimeOut(true);
      setGameStarted(false);
    }

    return () => clearInterval(interval);
  }, [timerEnabled, gameStarted, timer]);

  //cleanup function
  useEffect(() => {
    return () => {
      setCards([]);
      setTurns(0), setChoiceOne(null), setChoiceTwo(null), setIsGameWon(false);
      setGameStarted(false);
    };
  }, []);

  //function that determines the number of columns based on difficulty
  const getGridColumns = () => {
    switch (shuffledDifficulty) {
      case "easy":
        return 4;
      case "medium":
        return 4;
      case "hard":
        return 5;
      default:
        return 4;
    }
  };

  const isSmallScreen = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
  });

  return (
    <Flex align="center" flexDir="column" gap={3}>
      {error && (
        <Text color="white">
          There was an error fetching data. Please try refresh the page.
        </Text>
      )}
      {isLoading && (
        <Progress size="xs" colorScheme="telegram" isIndeterminate />
      )}
      <Flex w="100%" justify="flex-end" px={2} py={isSmallScreen ? 3 : 0}>
        <Link as={RouterLink} to="/" color="white">
          Home
        </Link>
      </Flex>

      {isSmallScreen && (
        <Flex w="100%" flexDir="column" align="center" gap={4}>
          {!gameStarted && (
            <Card
              background="transparent"
              color="white"
              size={{ base: "sm" }}
              border="1px solid white"
              w="70%"
            >
              <CardBody>
                <Stack divider={<StackDivider />} spacing={4}>
                  <Box>
                    <Heading size="xs">Difficulty</Heading>
                    <RadioGroup value={difficulty} onChange={setDifficulty}>
                      <Stack direction="row">
                        <Radio colorScheme="customRadio" value="easy">
                          Easy
                        </Radio>
                        <Radio colorScheme="customRadio" value="medium">
                          Medium
                        </Radio>
                        <Radio colorScheme="customRadio" value="hard">
                          Hard
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>
                  <Box>
                    <Heading size="xs">Timer</Heading>
                    <RadioGroup
                      value={timerEnabled ? "yes" : "no"}
                      onChange={(e) => setTimerEnabled(e === "yes")}
                    >
                      <Stack direction="row">
                        <Radio colorScheme="customRadio" value="yes">
                          Yes
                        </Radio>
                        <Radio colorScheme="customRadio" value="no">
                          No
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>
                  <Box>
                    <Button
                      variant="outline"
                      color="white"
                      _hover={{ background: "#c23866" }}
                      onClick={shuffleCards}
                    >
                      Shuffle
                    </Button>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          )}

          {gameStarted && (
            <Text color="white">
              <b>Turns:</b> {turns}{" "}
            </Text>
          )}
          {timerEnabled && (
            <Text color="white">
              <b>Time left:</b> {timerEnabled && `${timer}s`}
            </Text>
          )}
          <SimpleGrid columns={4} spacing={2} ml={3}>
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
        </Flex>
      )}
      {!isSmallScreen && (
        <Flex w="100%" p={2} justify="center">
          <Flex flex="1">
            <SimpleGrid
              columns={getGridColumns()}
              spacingY="5px"
              spacingX="10px"
            >
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
          </Flex>

          <VStack>
            {!gameStarted && (
              <Card
                background="transparent"
                color="white"
                size={{ base: "sm" }}
                border="1px solid white"
                w="300px"
                h="220px"
              >
                <CardBody>
                  <Stack divider={<StackDivider />} spacing={4}>
                    <Box>
                      <Heading size="xs">Difficulty</Heading>
                      <RadioGroup value={difficulty} onChange={setDifficulty}>
                        <Stack direction="row">
                          <Radio colorScheme="customRadio" value="easy">
                            Easy
                          </Radio>
                          <Radio colorScheme="customRadio" value="medium">
                            Medium
                          </Radio>
                          <Radio colorScheme="customRadio" value="hard">
                            Hard
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                    <Box>
                      <Heading size="xs">Timer</Heading>
                      <RadioGroup
                        value={timerEnabled ? "yes" : "no"}
                        onChange={(e) => setTimerEnabled(e === "yes")}
                      >
                        <Stack direction="row">
                          <Radio colorScheme="customRadio" value="yes">
                            Yes
                          </Radio>
                          <Radio colorScheme="customRadio" value="no">
                            No
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                    <Box>
                      <Button
                        variant="outline"
                        color="white"
                        _hover={{ background: "#c23866" }}
                        onClick={shuffleCards}
                      >
                        Shuffle
                      </Button>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            )}

            {gameStarted && (
              <>
                <Text color="white">
                  <b>Turns:</b> {turns}{" "}
                </Text>
                <Text color="white">
                  <b>Time left:</b> {timerEnabled && `${timer}s`}
                </Text>
              </>
            )}
          </VStack>
        </Flex>
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
              {timerEnabled && ` Time Left: ${remainingTime}s`}
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
      {isTimeOut && (
        <Modal
          isOpen={isTimeOut}
          onClose={() => setIsTimeOut(false)}
          isCentered
        >
          <ModalOverlay />
          <ModalContent
            backgroundColor="#301934"
            color="white"
            w={{ base: "90%", sm: "60%" }}
          >
            <ModalHeader>Game Over</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Time's up! Better luck next time.</ModalBody>
            <ModalFooter>
              <Button color="white" onClick={() => setIsTimeOut(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
}
