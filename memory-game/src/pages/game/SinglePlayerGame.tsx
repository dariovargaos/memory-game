import { useState, useEffect, useCallback } from "react";
import { useDocument } from "../../hooks/useDocument";

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
} from "@chakra-ui/react";

//components
import SingleCard from "./SingleCard";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface Card {
  id: number;
  src: string;
  cardBackImage: string;
  matched: boolean;
}

export default function SinglePlayerGame({
  roomData,
  user,
  timer,
  timerEnabled,
}) {
  const [cards, setCards] = useState<Card[]>([]);
  const [choiceOne, setChoiceOne] = useState<Card | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(timer);
  const { document: userData, error: userError } = useDocument(
    "users",
    user?.uid
  );

  useEffect(() => {
    if (roomData?.id) {
      const gameRoomRef = doc(db, "spRooms", roomData?.id);
      const unsubscribe = onSnapshot(gameRoomRef, (doc) => {
        if (doc.exists()) {
          const gameData = doc.data();
          setCards(gameData.shuffledCards);
        }
      });

      return () => unsubscribe();
    }
  }, [roomData?.id]);

  //handle choice
  const handleChoice = async (selectedCard: Card) => {
    if (timerEnabled && timer === 0) {
      console.log("TIME'S UP, NO MORE MOVES ALLOWED.");
      return;
    }
    if (user?.uid) {
      const gameRoomRef = doc(db, "spRooms", roomData?.id);

      //find the card in the shuffleCards array and flip it
      const updatedCards = roomData?.shuffledCards.map((card) =>
        card.id === selectedCard.id ? { ...card, flipped: !card.flipped } : card
      );

      //update Firestore document
      await updateDoc(gameRoomRef, {
        shuffledCards: updatedCards,
      });

      //set the choice in the local state
      choiceOne ? setChoiceTwo(selectedCard) : setChoiceOne(selectedCard);
    } else {
      console.log("Error making choice");
    }
  };

  //reset choices and increase turn
  const resetTurn = useCallback(async () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);

    const gameRoomRef = doc(db, "spRooms", roomData?.id);
    await updateDoc(gameRoomRef, {
      turns: roomData?.turns + 1,
    });
  }, [roomData?.id, roomData?.turns]);

  //compare two selected card
  useEffect(() => {
    const checkMatch = async () => {
      if (choiceOne && choiceTwo) {
        setDisabled(true);

        if (choiceOne.src === choiceTwo.src) {
          //cards are matched
          //update matched cards in firestore
          const updatedCards = roomData?.shuffledCards.map((card) => {
            return card.src === choiceOne.src
              ? { ...card, matched: true }
              : card;
          });

          const gameRoomRef = doc(db, "spRooms", roomData?.id);
          await updateDoc(gameRoomRef, {
            shuffledCards: updatedCards,
          });
          resetTurn();
        } else {
          //cards do not match, flip them back after a delay
          setTimeout(async () => {
            //reset the flipped state of the cards in firestore
            const updatedCards = roomData?.shuffledCards.map((card) => {
              return card.id === choiceOne.id || card.id === choiceTwo.id
                ? { ...card, flipped: false }
                : card;
            });

            const gameRoomRef = doc(db, "spRooms", roomData?.id);
            await updateDoc(gameRoomRef, {
              shuffledCards: updatedCards,
            });

            resetTurn();
          }, 1000);
        }
      }
    };

    checkMatch();
  }, [choiceOne, choiceTwo, roomData?.id, roomData?.shuffledCards, resetTurn]);

  //check whether the all cards have matched property on true
  useEffect(() => {
    const checkIsGameDone = async () => {
      const allMatched = cards.every((card) => card.matched);
      if (allMatched && cards.length > 0) {
        const gameRoomRef = doc(db, "spRooms", roomData?.id);
        const userDocRef = doc(db, "users", userData?.id);
        await updateDoc(gameRoomRef, {
          gameState: { playing: false, completed: true },
        });
        await updateDoc(userDocRef, {
          withoutTimer: {
            turns: {
              easy: roomData?.turns,
            },
          },
        });
        setIsGameWon(true);
      }
    };

    checkIsGameDone();
  }, [cards, roomData?.id]);

  //cleanup function
  useEffect(() => {
    return () => {
      setCards([]);
      setChoiceOne(null), setChoiceTwo(null), setIsGameWon(false);
    };
  }, []);

  //function that determines the number of columns based on difficulty
  const getGridColumns = () => {
    switch (roomData?.difficulty) {
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

  return (
    <Box>
      <SimpleGrid columns={getGridColumns()} spacing={2}>
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card.flipped || card.matched}
            disabled={disabled}
          />
        ))}
      </SimpleGrid>

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
              You've matched all the cards in <b>{roomData?.turns} turns</b>!
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
    </Box>
  );
}
