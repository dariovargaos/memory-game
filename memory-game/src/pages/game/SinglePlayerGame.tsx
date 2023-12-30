import { useState, useEffect, useCallback } from "react";
import { useDocument } from "../../hooks/useDocument";
import { DocumentData, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

import {
  Button,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Card,
  Box,
  Text,
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
  flipped: boolean;
}

interface SinglePlayerGameProps {
  roomData: DocumentData | null;
  user?: User | null;
  timer: number;
  timerEnabled: boolean;
}

export default function SinglePlayerGame({
  roomData,
  user,
  timer,
  timerEnabled,
}: SinglePlayerGameProps) {
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

  useEffect(() => {
    setRemainingTime(timer);
  }, [timer]);

  //handle choice
  const handleChoice = (selectedCard: Card) => {
    if (timerEnabled && timer === 0) {
      console.log("TIME'S UP, NO MORE MOVES ALLOWED.");
      return;
    }

    const gameRoomRef = doc(db, "spRooms", roomData?.id);

    //find the card in the shuffleCards array and flip it
    const updatedCards = roomData?.shuffledCards.map((card: Card) =>
      card.id === selectedCard.id ? { ...card, flipped: !card.flipped } : card
    );

    //update Firestore document
    updateDoc(gameRoomRef, {
      shuffledCards: updatedCards,
    });

    //set the choice in the local state
    choiceOne ? setChoiceTwo(selectedCard) : setChoiceOne(selectedCard);
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
    const checkMatch = () => {
      if (choiceOne && choiceTwo) {
        setDisabled(true);

        if (choiceOne.src === choiceTwo.src) {
          //cards are matched
          //update matched cards in firestore
          const updatedCards = roomData?.shuffledCards.map((card: Card) => {
            return card.src === choiceOne.src
              ? { ...card, matched: true }
              : card;
          });

          const gameRoomRef = doc(db, "spRooms", roomData?.id);
          updateDoc(gameRoomRef, {
            shuffledCards: updatedCards,
          });
          resetTurn();
        } else {
          //cards do not match, flip them back after a delay
          setTimeout(() => {
            //reset the flipped state of the cards in firestore
            const updatedCards = roomData?.shuffledCards.map((card: Card) => {
              return card.id === choiceOne.id || card.id === choiceTwo.id
                ? { ...card, flipped: false }
                : card;
            });

            const gameRoomRef = doc(db, "spRooms", roomData?.id);
            updateDoc(gameRoomRef, {
              shuffledCards: updatedCards,
            });

            resetTurn();
          }, 1000);
        }
      }
    };

    checkMatch();
  }, [choiceOne, choiceTwo, roomData?.id, roomData?.shuffledCards, resetTurn]);

  //update user profile single player section
  const updateUserTurns = useCallback(async () => {
    if (!userData) return;

    const userDocRef = doc(db, "users", userData?.id);
    const difficultyPath = `withTimer.${roomData?.difficulty}`;
    if (!timerEnabled) {
      await updateDoc(userDocRef, {
        [`withoutTimer.turns.${roomData?.difficulty}`]: roomData?.turns,
      });
    } else {
      await updateDoc(userDocRef, {
        [`${difficultyPath}.turns`]: roomData?.turns,
        [`${difficultyPath}.time`]: remainingTime,
      });
    }
  }, [
    roomData?.difficulty,
    roomData?.turns,
    timerEnabled,
    remainingTime,
    userData,
  ]);

  //check whether the all cards have matched property on true
  useEffect(() => {
    const checkIsGameDone = async () => {
      const allMatched = cards.every((card) => card.matched);
      if (allMatched && cards.length > 0) {
        const gameRoomRef = doc(db, "spRooms", roomData?.id);
        await updateDoc(gameRoomRef, {
          gameState: { playing: false, completed: true },
        });
        setIsGameWon(true);
        if (userData) {
          updateUserTurns();
        }
      }
    };

    checkIsGameDone();
  }, [
    cards,
    roomData?.id,
    roomData?.turns,
    userData?.id,
    updateUserTurns,
    userData,
  ]);

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
      <Text>{userError}</Text>
    </Box>
  );
}
