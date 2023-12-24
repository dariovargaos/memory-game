import { useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  Box,
  Flex,
  Heading,
  Text,
  List,
  ListItem,
  Button,
  Avatar,
} from "@chakra-ui/react";

//icons
import { ArrowBackIcon } from "@chakra-ui/icons";
import { AiOutlineUser } from "react-icons/ai";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { document: userData, error: userError } = useDocument(
    "users",
    user?.uid
  );
  return (
    <Flex flexDir="column" p={1}>
      <Flex>
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          variant="outline"
          color="white"
        >
          Go Back
        </Button>
      </Flex>
      <Flex
        color="white"
        flexDir="column"
        justify="center"
        align="center"
        h="calc(100vh - 50px)"
        gap={8}
      >
        <Flex flexDir="column">
          <Avatar bg="red.500" icon={<AiOutlineUser fontSize="1.5rem" />} />
          {user?.displayName}
        </Flex>
        <Flex justify="space-evenly" w="100%">
          <Flex flexDir="column" textAlign="center" gap={3}>
            <Heading size="md">Single Player</Heading>
            <Flex flexDir="column" gap={4} align="center">
              <Flex>
                <Text fontWeight="bold">Without timer:</Text>
                <List>
                  <ListItem>
                    easy - {userData?.withoutTimer.turns.easy} turns
                  </ListItem>
                  <ListItem>
                    medium - {userData?.withoutTimer.turns.medium} turns
                  </ListItem>
                  <ListItem>
                    hard - {userData?.withoutTimer.turns.hard} turns
                  </ListItem>
                </List>
              </Flex>
              <Flex>
                <Text fontWeight="bold">With timer:</Text>
                <List>
                  <ListItem>
                    easy - {userData?.withTimer.easy.turns} turns with{" "}
                    {userData?.withTimer.easy.time}s left
                  </ListItem>
                  <ListItem>
                    medium - {userData?.withTimer.medium.turns} turns with{" "}
                    {userData?.withTimer.medium.time}s left
                  </ListItem>
                  <ListItem>
                    hard - {userData?.withTimer.hard.turns} turns with{" "}
                    {userData?.withTimer.hard.time}s left
                  </ListItem>
                </List>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDir="column" textAlign="center" gap={3}>
            <Heading size="md">Multiplayer</Heading>
            <Text>Wins: {userData?.wins}</Text>
            <Text>Losses: {userData?.losses}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
