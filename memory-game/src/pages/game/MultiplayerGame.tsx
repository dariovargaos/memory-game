import { useState, useEffect, useCallback } from "react";
import { useStorage } from "../../hooks/useStorage";
import { DocumentData, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
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
  useBreakpointValue,
  Progress,
  Card,
} from "@chakra-ui/react";

//components
import SingleCard from "./SingleCard";

//types
import { User } from "../../context/AuthContext";

export interface Card {
  id: number;
  src: string;
  cardBackImage: string;
  matched: boolean;
}

interface MultiplayerGameProps {
  playerOne: string;
  playerTwo: string;
  currentPlayer?: string | null;
  roomData: DocumentData | null;
  user?: User | null;
}

export default function MultiplayerGame({
  playerOne,
  playerTwo,
  currentPlayer,
  roomData,
  user,
}: MultiplayerGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [choiceOne, setChoiceOne] = useState<Card | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);

  console.log(roomData?.shuffledCards);

  //handle choice
  const handleChoice = async (card: Card) => {
    if (user?.uid === roomData?.currentPlayer) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    } else {
      console.log("Not your turn.");
    }
  };

  //reset choices and switch turns
  const resetAndSwitch = async () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);

    const nextPlayer = currentPlayer === playerOne ? playerTwo : playerOne;

    const gameRoomRef = doc(db, "gameRooms", roomData?.id);
    await updateDoc(gameRoomRef, {
      currentPlayer: nextPlayer,
    });
  };

  //update the score
  const scoreUpdate = async () => {
    const gameRoomRef = doc(db, "gameRooms", roomData?.id);
    if (currentPlayer === playerOne) {
      await updateDoc(gameRoomRef, {
        playerOneScore: roomData?.playerOneScore + 1,
      });
    } else {
      await updateDoc(gameRoomRef, {
        playerTwoScore: roomData?.playerTwoScore + 1,
      });
    }
  };

  //compare two selected cards
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
        scoreUpdate();
        resetAndSwitch();
      } else {
        setTimeout(() => resetAndSwitch(), 1000);
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
      setChoiceOne(null), setChoiceTwo(null), setIsGameWon(false);
    };
  }, []);

  const isSmallScreen = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
  });

  return (
    <Flex align="center" flexDir="column" gap={3}>
      {isSmallScreen ? (
        <Flex w="100%" flexDir="column" align="center" gap={4}>
          <SimpleGrid columns={4} spacing={2}>
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
      ) : (
        <Flex w="100%" flexDir="column" align="center" gap={4}>
          <SimpleGrid columns={5} spacing={2}>
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
            <ModalBody>THE WINNER IS</ModalBody>
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
