import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
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
  Grid,
  GridItem,
  List,
  ListItem,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

//components
import MultiplayerGame from "../game/MultiplayerGame";

export default function GameRoom() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);

  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [currentPlayer, setCurrentPlayer] = useState();
  const { document: roomData, error: roomError } = useDocument(
    "gameRooms",
    gameId
  );
  const toast = useToast();

  useEffect(() => {
    if (gameId) {
      const gameRoomRef = doc(db, "gameRooms", gameId);
      const unsubscribe = onSnapshot(gameRoomRef, (doc) => {
        //update your local state based on the document
        if (doc.exists()) {
          const gameData = doc.data();
          console.log("Snapshot Update:", gameData);
          setCurrentPlayer(gameData.currentPlayer);
          setPlayerOneScore(gameData.playerOneScore);
          setPlayerTwoScore(gameData.playerTwoScore);
          console.log("Current player after update:", gameData.currentPlayer);
        }
      });

      return () => unsubscribe();
    }
  }, [gameId, setCurrentPlayer]);

  useEffect(() => {
    if (roomData?.gameState.playing) {
      setIsGameStarted(true);
    }
  }, [roomData]);

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

  const handleStartGame = async () => {
    if (gameId && roomData?.opponent && !roomData?.gameState.waiting) {
      const gameRoomRef = doc(db, "gameRooms", gameId);
      await updateDoc(gameRoomRef, {
        "gameState.playing": true,
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

  return (
    <>
      <Button onClick={handleLeaveRoom}>Leave Room</Button>
      <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}>
        <GridItem w={isGameStarted ? "150px" : ""}>
          <Flex flexDir="column" align="center" justify="center" h="100vh">
            <Text color="white">{roomData?.createdBy?.displayName}</Text>
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
                {currentPlayer === roomData?.opponent?.id && (
                  <>
                    <Text color="white">Waiting for turn</Text>
                    <Spinner color="white" />
                  </>
                )}
              </>
            )}
          </Flex>
        </GridItem>

        {!isGameStarted ? (
          <GridItem color="white">
            <Flex flexDir="column" align="center" justify="center" h="100vh">
              <Text>Game ID: {gameId}</Text>
              <Button onClick={handleCopyToClipboard}>Copy Game ID</Button>
              {user?.uid === roomData?.createdBy?.id && (
                <Button
                  onClick={handleStartGame}
                  isDisabled={
                    !roomData?.opponent || roomData?.gameState?.waiting
                  }
                >
                  Play
                </Button>
              )}
            </Flex>
          </GridItem>
        ) : (
          <GridItem>
            <MultiplayerGame
              playerOne={roomData?.createdBy?.id}
              playerTwo={roomData?.opponent?.id}
              currentPlayer={currentPlayer}
              roomData={roomData}
              user={user}
            />
          </GridItem>
        )}

        <GridItem color="white">
          <Flex flexDir="column" align="center" justify="center" h="100vh">
            {roomData?.opponent === null && (
              <>
                <Text color="white">Waiting for the opponent...</Text>
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
                    {currentPlayer === roomData?.createdBy?.id && (
                      <>
                        <Text color="white">Waiting for turn</Text>
                        <Spinner />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Flex>
        </GridItem>
      </Grid>
      <Text>{roomError}</Text>
    </>
  );
}
