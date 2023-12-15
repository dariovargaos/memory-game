import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useStorage } from "../../hooks/useStorage";
import { useAuthContext } from "../../hooks/useAuthContext";
import { db } from "../../firebase/config";
import {
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  Button,
  Flex,
  List,
  ListItem,
  Spinner,
  Text,
  useToast,
  useBreakpointValue,
  Box,
} from "@chakra-ui/react";

//components
import MultiplayerGame from "../game/MultiplayerGame";

//types
import { CardImage } from "../../hooks/useStorage";

export default function GameRoom() {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [playerOneScore, setPlayerOneScore] = useState<number>(0);
  const [playerTwoScore, setPlayerTwoScore] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);

  const { gameId } = useParams<string>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { document: roomData, error: roomError } = useDocument(
    "gameRooms",
    gameId
  );
  const { data: cardImages } = useStorage();
  const toast = useToast();

  //updating and getting document data in real time
  useEffect(() => {
    if (gameId) {
      const gameRoomRef = doc(db, "gameRooms", gameId);
      const unsubscribe = onSnapshot(gameRoomRef, (doc) => {
        //update your local state based on the document
        if (doc.exists()) {
          const gameData = doc.data();
          // console.log("Snapshot Update:", gameData);
          setCurrentPlayer(gameData.currentPlayer);
          setPlayerOneScore(gameData.playerOneScore);
          setPlayerTwoScore(gameData.playerTwoScore);
          // console.log("Current player after update:", gameData.currentPlayer);
        }
      });

      return () => unsubscribe();
    }
  }, [gameId, setCurrentPlayer]);

  //shuffling the cards
  const shuffleCards = (cardImages: CardImage[]) => {
    if (cardImages) {
      //shuffle card images so they are not in the same sequence over and over again
      const shuffledImageUrls = [...cardImages].sort(() => Math.random() - 0.5);

      const shuffledImages = [...shuffledImageUrls, ...shuffledImageUrls].sort(
        () => Math.random() - 0.5
      );
      return shuffledImages.map((image, index) => ({
        id: index,
        src: image.src,
        cardBackImage: image.cardBackImage,
        flipped: false,
        matched: false,
      }));
    }
  };

  //function for copying id to the clipboard
  const handleCopyToClipboard = async () => {
    if (gameId) {
      try {
        await navigator.clipboard.writeText(gameId);
        toast({
          title: "Game ID Copied",
          description: "Game ID has been copied to clipboard.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy Game ID.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  //function for handling if one or both players leaves the room
  const handleLeaveRoom = async () => {
    if (gameId) {
      const gameRoomRef = doc(db, "gameRooms", gameId);
      const gameRoomSnap = await getDoc(gameRoomRef);

      if (gameRoomSnap.exists()) {
        const gameRoom = gameRoomSnap.data();
        if (gameRoom.createdBy.id === user?.uid) {
          if (gameRoom.opponent) {
            await updateDoc(gameRoomRef, {
              createdBy: gameRoom.opponent,
              opponent: null,
            });
          } else {
            await deleteDoc(gameRoomRef);
          }
        }
      }
      navigate("/");
    }
  };

  //when everything is set start the game
  const handleStartGame = async () => {
    if (
      gameId &&
      roomData?.opponent &&
      !roomData?.gameState.waiting &&
      cardImages
    ) {
      const shuffledDeck = shuffleCards(cardImages);
      const gameRoomRef = doc(db, "gameRooms", gameId);
      await updateDoc(gameRoomRef, {
        "gameState.playing": true,
        shuffledCards: shuffledDeck,
      });
      console.log("Game started");
      setIsGameStarted(true);
    } else {
      toast({
        title: "Game cannot start.",
        description: "Waiting for and opponent to join.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  //start rematch
  const handleRematch = async () => {
    if (
      gameId &&
      roomData?.opponent &&
      roomData?.gameState?.completed &&
      cardImages
    ) {
      const shuffledDeck = shuffleCards(cardImages);
      const gameRoomRef = doc(db, "gameRooms", gameId);
      await updateDoc(gameRoomRef, {
        "gameState.playing": true,
        "gameState.completed": false,
        playerOneScore: 0,
        playerTwoScore: 0,
        currentPlayer: roomData?.createdBy?.id,
        shuffledCards: shuffledDeck,
      });
      console.log("Rematch started");
      setIsGameStarted(true);
    } else {
      toast({
        title: "Rematch cannot start.",
        description: "Something went wrong.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  //starting the game when game state is playing === true
  useEffect(() => {
    if (roomData?.gameState.playing) {
      setIsGameStarted(true);
    }
  }, [roomData]);

  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Flex
        flexDirection={isSmallScreen ? "column" : "row"}
        align="center"
        m={isSmallScreen ? "4" : "8"}
        p={isSmallScreen ? "2" : "4"}
      >
        <Button alignSelf="flex-start" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
        <Box textAlign="center" mb="4">
          <Text fontSize={isSmallScreen ? "md" : "lg"} color="white">
            {roomData?.createdBy?.displayName}
          </Text>
          {!isGameStarted ? (
            <List>
              <ListItem color="white">
                Wins: {roomData?.createdBy?.wins}
              </ListItem>
              <ListItem color="white">
                Losses: {roomData?.createdBy?.losses}
              </ListItem>
            </List>
          ) : (
            <>
              <Text color="white">Matched pairs: {playerOneScore}</Text>
              {currentPlayer === roomData?.opponent?.id &&
                !roomData?.gameState?.completed && (
                  <>
                    <Text color="white">Waiting for turn</Text>
                    <Spinner color="white" />
                  </>
                )}
            </>
          )}
        </Box>

        {!isGameStarted ? (
          <Box textAlign="center" mb="4" color="white">
            <Text>Game ID: {gameId}</Text>
            <Button onClick={handleCopyToClipboard}>Copy Game ID</Button>
            {user?.uid === roomData?.createdBy?.id && (
              <Button
                onClick={handleStartGame}
                isDisabled={!roomData?.opponent || roomData?.gameState?.waiting}
              >
                Play
              </Button>
            )}
          </Box>
        ) : (
          <Box mb="4">
            <MultiplayerGame
              playerOne={roomData?.createdBy?.id}
              playerTwo={roomData?.opponent?.id}
              currentPlayer={currentPlayer}
              roomData={roomData}
              user={user}
            />
          </Box>
        )}

        <Box color="white" textAlign="center">
          {roomData?.opponent === null && (
            <>
              <Text fontSize={isSmallScreen ? "md" : "lg"} color="white">
                Waiting for the opponent...
              </Text>
              <Spinner />
            </>
          )}
          {roomData?.opponent && (
            <>
              <Text color="white">{roomData?.opponent?.displayName}</Text>
              {!isGameStarted ? (
                <List>
                  <ListItem color="white">
                    Wins: {roomData?.opponent?.wins}
                  </ListItem>
                  <ListItem color="white">
                    Losses: {roomData?.opponent?.losses}
                  </ListItem>
                </List>
              ) : (
                <>
                  <Text color="white">Matched pairs: {playerTwoScore}</Text>
                  {currentPlayer === roomData?.createdBy?.id &&
                    !roomData?.gameState?.completed && (
                      <>
                        <Text color="white">Waiting for turn</Text>
                        <Spinner />
                      </>
                    )}
                </>
              )}
            </>
          )}
        </Box>
        {user?.uid === roomData?.createdBy?.id && (
          <Button
            isDisabled={!roomData?.gameState?.completed}
            alignSelf="flex-start"
            onClick={handleRematch}
          >
            Rematch
          </Button>
        )}
      </Flex>
      <Text>{roomError}</Text>
    </>
  );
}
