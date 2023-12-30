import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStorage } from "../../hooks/useStorage";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { v4 as uuid4 } from "uuid";

import {
  Button,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Box,
  RadioGroup,
  Radio,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

//components
import SinglePlayerGame from "../game/SinglePlayerGame";

//types
import { CardImage } from "../../hooks/useStorage";

export default function SinglePlayerRoom() {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [timerEnabled, setTimerEnabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const { gameId } = useParams<string>();
  const { user } = useAuthContext();
  const { document: roomData, error: roomError } = useDocument(
    "spRooms",
    gameId
  );
  const { data: cardImages } = useStorage();
  const navigate = useNavigate();
  const toast = useToast();

  //shuffling the cards
  const shuffleCards = (cardImages: CardImage[]) => {
    if (cardImages) {
      console.log(cardImages);
      const numberOfPairs =
        difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;

      //shuffle card images so they are not same sequence over and over again
      const shuffledImageUrls = [...cardImages].sort(() => Math.random() - 0.5);

      const selectedNumberOfPairs = shuffledImageUrls.slice(0, numberOfPairs);

      const shuffledImages = [
        ...selectedNumberOfPairs,
        ...selectedNumberOfPairs,
      ].sort(() => Math.random() - 0.5);

      if (timerEnabled) {
        const timeLimit =
          difficulty === "easy" ? 45 : difficulty === "medium" ? 55 : 65;
        setTimer(timeLimit);
      } else {
        setTimer(0);
      }

      return shuffledImages.map((image) => ({
        id: uuid4(),
        src: image.src,
        cardBackImage: image.cardBackImage,
        flipped: false,
        matched: false,
      }));
    }
  };

  //creating countdown timer
  useEffect(() => {
    let interval: number;
    if (roomData?.timer && roomData?.gameState.playing && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && roomData?.timer && roomData?.gameState.playing) {
      console.log("TIME IS UP!");
      const gameRoomRef = doc(db, "spRooms", roomData?.id);
      updateDoc(gameRoomRef, {
        gameState: { playing: false, completed: true },
      });
      setIsTimeOut(true);
    }

    return () => clearInterval(interval);
  }, [timer, roomData]);

  //delete firestore document on leave
  const handleLeaveRoom = async () => {
    if (gameId) {
      const gameRoomRef = doc(db, "spRooms", gameId);
      await deleteDoc(gameRoomRef);
      navigate("/");
    }
  };

  //when everything is set start the game
  const handleStartGame = async () => {
    if (gameId && cardImages) {
      const shuffledDeck = shuffleCards(cardImages);
      const gameRoomRef = doc(db, "spRooms", gameId);
      await updateDoc(gameRoomRef, {
        gameState: { playing: true, completed: false },
        difficulty: difficulty,
        timer: timerEnabled,
        shuffledCards: shuffledDeck,
        turns: 0,
      });
      setIsGameStarted(true);
      setIsTimeOut(false);
      console.log("Game started");
    } else {
      toast({
        title: "Game cannot start.",
        description: "Something went wrong.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isSmallScreen = useBreakpointValue({
    base: true,
    lg: false,
  });

  return (
    <Flex flexDir="column">
      <Flex p={2}>
        <Button onClick={handleLeaveRoom} variant="outline" color="white">
          Leave game
        </Button>
      </Flex>
      <Flex
        flexDir={isSmallScreen ? "column" : "row"}
        justify={isGameStarted ? "space-around" : ""}
        align="center"
        gap={isSmallScreen ? 10 : 0}
        p={2}
      >
        <Flex flexDir="column" gap={5}>
          <Card
            background="transparent"
            color="white"
            size={{ base: "sm", md: "lg" }}
            border="1px solid white"
          >
            <CardBody>
              <Stack divider={<StackDivider />} spacing={4}>
                <Box>
                  <Heading size="xs">Difficulty</Heading>
                  <RadioGroup value={difficulty} onChange={setDifficulty}>
                    <Stack direction="row">
                      <Radio
                        colorScheme="customRadio"
                        value="easy"
                        isDisabled={roomData?.gameState.playing}
                      >
                        Easy
                      </Radio>
                      <Radio
                        colorScheme="customRadio"
                        value="medium"
                        isDisabled={roomData?.gameState.playing}
                      >
                        Medium
                      </Radio>
                      <Radio
                        colorScheme="customRadio"
                        value="hard"
                        isDisabled={roomData?.gameState.playing}
                      >
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
                      <Radio
                        colorScheme="customRadio"
                        value="yes"
                        isDisabled={roomData?.gameState.playing}
                      >
                        Yes
                      </Radio>
                      <Radio
                        colorScheme="customRadio"
                        value="no"
                        isDisabled={roomData?.gameState.playing}
                      >
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
                    onClick={handleStartGame}
                    isDisabled={roomData?.gameState.playing}
                  >
                    Shuffle
                  </Button>
                </Box>
              </Stack>
            </CardBody>
          </Card>

          {isGameStarted && (
            <Flex flexDir="column" justify="center" align="center" h="100%">
              <Text color="white">
                <b>Turns:</b> {roomData?.turns}{" "}
              </Text>
              {timerEnabled && roomData?.timer && (
                <Text color="white">
                  <b>Time left:</b> {timerEnabled && `${timer}s`}
                </Text>
              )}
            </Flex>
          )}
        </Flex>

        {isGameStarted && (
          <Flex>
            <SinglePlayerGame
              roomData={roomData}
              user={user}
              timer={timer}
              timerEnabled={timerEnabled}
            />
          </Flex>
        )}
      </Flex>
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
              <Button
                color="white"
                variant="outline"
                onClick={() => setIsTimeOut(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Text>{roomError}</Text>
    </Flex>
  );
}
