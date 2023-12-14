import { useState, useEffect, useCallback } from "react";
import { DocumentData, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Button,
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
  Card,
} from "@chakra-ui/react";

//components
import MultiplayerCard from "./MultiplayerCard";

//types
import { User } from "../../context/AuthContext";

export interface Card {
  id: number;
  src: string;
  cardBackImage: string;
  matched: boolean;
  flipped: boolean;
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
  const [winner, setWinner] = useState<string>("");

  useEffect(() => {
    if (roomData?.id) {
      const gameRoomRef = doc(db, "gameRooms", roomData?.id);
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
    if (user?.uid === roomData?.currentPlayer) {
      const gameRoomRef = doc(db, "gameRooms", roomData?.id);

      //find the card in the suffleCards array and flip it
      const updatedCards = roomData?.shuffledCards.map((card: Card) =>
        card.id === selectedCard.id ? { ...card, flipped: !card.flipped } : card
      );

      //update Firestore document
      await updateDoc(gameRoomRef, {
        shuffledCards: updatedCards,
      });

      //set the choice in the local state
      choiceOne ? setChoiceTwo(selectedCard) : setChoiceOne(selectedCard);
    } else {
      console.log("Not your turn.");
    }
  };

  //reset choices and switch turns
  const resetAndSwitch = useCallback(async () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);

    const nextPlayer = currentPlayer === playerOne ? playerTwo : playerOne;

    const gameRoomRef = doc(db, "gameRooms", roomData?.id);
    await updateDoc(gameRoomRef, {
      currentPlayer: nextPlayer,
    });
  }, [currentPlayer, playerOne, playerTwo, roomData?.id]);

  //update the score
  const scoreUpdate = useCallback(async () => {
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
  }, [
    currentPlayer,
    playerOne,
    roomData?.id,
    roomData?.playerOneScore,
    roomData?.playerTwoScore,
  ]);

  //compare two selected cards
  useEffect(() => {
    const checkMatch = async () => {
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

          const gameRoomRef = doc(db, "gameRooms", roomData?.id);
          await updateDoc(gameRoomRef, {
            shuffledCards: updatedCards,
          });
          scoreUpdate();
          resetAndSwitch();
        } else {
          //cards do not match, flip them back after a delay
          setTimeout(async () => {
            //reset the flipped state of the cards in firestore
            const updatedCards = roomData?.shuffledCards.map((card: Card) => {
              return card.id === choiceOne.id || card.id === choiceTwo.id
                ? { ...card, flipped: false }
                : card;
            });

            const gameRoomRef = doc(db, "gameRooms", roomData?.id);
            await updateDoc(gameRoomRef, {
              shuffledCards: updatedCards,
            });

            resetAndSwitch();
          }, 1000);
        }
      }
    };
    checkMatch();
  }, [
    choiceOne,
    choiceTwo,
    roomData?.id,
    roomData?.shuffledCards,
    resetAndSwitch,
    scoreUpdate,
  ]);

  //check whether the all cards have matched property on true
  useEffect(() => {
    const checkWinner = async () => {
      const allMatched = cards.every((card) => card.matched);
      if (allMatched && cards.length > 0) {
        const gameRoomRef = doc(db, "gameRooms", roomData?.id);
        await updateDoc(gameRoomRef, {
          "gameState.playing": false,
          "gameState.completed": true,
        });
        if (roomData?.playerOneScore > roomData?.playerTwoScore) {
          setWinner(roomData?.createdBy?.displayName);
        } else if (roomData?.playerOneScore < roomData?.playerTwoScore) {
          setWinner(roomData?.opponent?.displayName);
        } else {
          setWinner("It's a tie! No winner!");
        }
        setIsGameWon(true);
      }
    };
    checkWinner();
  }, [
    cards,
    roomData?.createdBy?.displayName,
    roomData?.opponent?.displayName,
    roomData?.playerOneScore,
    roomData?.playerTwoScore,
    roomData?.id,
  ]);

  //cleanup function
  useEffect(() => {
    return () => {
      setCards([]);
      setChoiceOne(null);
      setChoiceTwo(null);
      setIsGameWon(false);
      setWinner("");
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
      <Flex w="100%" flexDir="column" align="center" gap={4}>
        <SimpleGrid columns={isSmallScreen ? 4 : 5} spacing={2}>
          {cards.map((card) => (
            <MultiplayerCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card.flipped || card.matched}
              disabled={disabled}
            />
          ))}
        </SimpleGrid>
      </Flex>
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
            <ModalBody>THE WINNER IS {winner}</ModalBody>
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
