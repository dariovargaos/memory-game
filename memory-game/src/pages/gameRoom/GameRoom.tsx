import { Flex, Grid, GridItem, List, ListItem, Text } from "@chakra-ui/react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";

export default function GameRoom() {
  const { user } = useAuthContext();
  const { document: userData, error } = useDocument("users", user?.uid);
  return (
    <>
      <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}>
        <GridItem>
          <Flex flexDir="column" align="center">
            <Text color="white">{user?.displayName}</Text>
            <List>
              <ListItem color="white">Wins: {userData?.wins}</ListItem>
              <ListItem color="white">Losses: {userData?.losses}</ListItem>
            </List>
          </Flex>
        </GridItem>

        <GridItem color="white">
          <Flex flexDir="column" align="center">
            GAME ID and play button
          </Flex>
        </GridItem>

        <GridItem color="white">
          <Flex flexDir="column" align="center">
            opponet player name and stats
          </Flex>
        </GridItem>
      </Grid>
      <Text>{error}</Text>
    </>
  );
}
