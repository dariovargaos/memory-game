import { useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  useBreakpointValue,
  Flex,
  Heading,
  Text,
  List,
  ListItem,
  Button,
  Avatar,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Box,
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

  const isSmallScreen = useBreakpointValue({
    base: true,
    lg: false,
  });
  return (
    <Flex flexDir="column" p={2}>
      <Flex>
        <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Go Back
        </Button>
      </Flex>
      <Flex
        color="white"
        flexDir="column"
        justify="center"
        align={isSmallScreen ? "center" : "center"}
        h={isSmallScreen ? "100vh" : "calc(100vh - 60px)"}
        gap={8}
      >
        <Flex
          flexDir={isSmallScreen ? "column" : "row"}
          justify="space-evenly"
          align="center"
          w="100%"
          gap={10}
        >
          <Flex flexDir="column" textAlign="center" gap={3}>
            <Card
              background="transparent"
              color="white"
              size={isSmallScreen ? "sm" : "lg"}
              border="1px solid white"
            >
              <CardBody>
                <Stack divider={<StackDivider />} spacing={4}>
                  <Box>
                    <Heading size="md">Single Player</Heading>
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
                  </Box>
                  <Box>
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
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Flex>
          <Flex flexDir="column">
            <Avatar
              bg={userData?.avatarColor}
              icon={<AiOutlineUser fontSize="1.5rem" />}
            />
            {user?.displayName}
          </Flex>
          <Flex flexDir="column" textAlign="center" gap={3}>
            <Card
              background="transparent"
              color="white"
              size={isSmallScreen ? "sm" : "lg"}
              border="1px solid white"
            >
              <CardBody>
                <Heading size="md">Multiplayer</Heading>
                <List>
                  <ListItem>Wins: {userData?.wins}</ListItem>
                  <ListItem>Losses: {userData?.losses}</ListItem>
                  <ListItem>Ties: {userData?.ties}</ListItem>
                </List>
              </CardBody>
            </Card>
          </Flex>
        </Flex>
      </Flex>
      <Text color="white">{userError}</Text>
    </Flex>
  );
}
