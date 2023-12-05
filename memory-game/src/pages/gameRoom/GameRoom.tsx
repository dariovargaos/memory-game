import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import {
  Flex,
  Grid,
  GridItem,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";

export default function GameRoom() {
  const { gameId } = useParams();
  const { user } = useAuthContext();
  const { document: userData, error } = useDocument("users", user?.uid);
  const { document: roomData, error: roomError } = useDocument(
    "gameRooms",
    gameId
  );

  console.log(roomData);

  return (
    <>
      <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}>
        <GridItem>
          <Flex flexDir="column" align="center" justify="center" h="100vh">
            <Text color="white">{user?.displayName}</Text>
            <List>
              <ListItem color="white">Wins: {userData?.wins}</ListItem>
              <ListItem color="white">Losses: {userData?.losses}</ListItem>
            </List>
          </Flex>
        </GridItem>

        <GridItem color="white">
          <Flex flexDir="column" align="center" justify="center" h="100vh">
            <Text>Game ID: {gameId}</Text>
            {roomData.gameState.status === "pending" && <Spinner />}
          </Flex>
        </GridItem>

        <GridItem color="white">
          <Flex flexDir="column" align="center" justify="center" h="100vh">
            opponet player name and stats
          </Flex>
        </GridItem>
      </Grid>
      <Text>{error}</Text>
    </>
  );
}
