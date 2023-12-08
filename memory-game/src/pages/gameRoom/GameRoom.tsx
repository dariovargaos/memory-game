import { useParams, useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { db } from "../../firebase/config";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
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

export default function GameRoom() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { document: roomData, error: roomError } = useDocument(
    "gameRooms",
    gameId
  );
  const toast = useToast();

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

  return (
    <>
      <Button onClick={handleLeaveRoom}>Leave Room</Button>
      <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}>
        <GridItem>
          <Flex flexDir="column" align="center" justify="center" h="100vh">
            <Text color="white">{roomData?.createdBy?.displayName}</Text>
            <List>
              <ListItem color="white">
                Wins: {roomData?.createdBy?.wins}
              </ListItem>
              <ListItem color="white">
                Losses: {roomData?.createdBy?.losses}
              </ListItem>
            </List>
          </Flex>
        </GridItem>

        <GridItem color="white">
          <Flex flexDir="column" align="center" justify="center" h="100vh">
            <Text>Game ID: {gameId}</Text>
            <Button onClick={handleCopyToClipboard}>Copy Game ID</Button>
            {roomData?.gameState?.waiting && <Spinner />}
            <Button>Play</Button>
          </Flex>
        </GridItem>

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
                <List>
                  <ListItem color="white">
                    Wins: {roomData?.opponent?.wins}
                  </ListItem>
                  <ListItem color="white">
                    Losses: {roomData?.opponent?.losses}
                  </ListItem>
                </List>
              </>
            )}
          </Flex>
        </GridItem>
      </Grid>
      <Text>{roomError}</Text>
    </>
  );
}
