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
            {roomData?.gameState?.waiting && <Spinner />}
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
      <Text>{error}</Text>
    </>
  );
}
