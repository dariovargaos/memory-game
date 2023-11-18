import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import {
  Heading,
  Text,
  Flex,
  Image,
  OrderedList,
  ListItem,
  Button,
} from "@chakra-ui/react";
export default function Home() {
  const { user } = useAuthContext();
  const { logout, error, isPending } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <Flex justify="center" flexDir="column" gap={6} alignItems="center">
      <Flex w="100%" justify="space-between" px={3}>
        <Flex justify="center" flex="1">
          <Heading as="h1" color="white">
            Welcome to Magic Match!
          </Heading>
        </Flex>

        {user && <Text color="white">hello, {user.displayName}</Text>}
        <Button variant="link" color="white" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button
          variant="link"
          color="white"
          onClick={() => navigate("/signup")}
        >
          Signup
        </Button>
        {user && (
          <Button variant="link" color="white" onClick={() => handleLogout()}>
            Logout
          </Button>
        )}
      </Flex>

      <Button
        variant="outline"
        color="white"
        _hover={{ opacity: "0.8" }}
        onClick={() => navigate("/game")}
      >
        Start
      </Button>

      {/* <Text color="white">Thank you for visiting us!</Text> */}

      <Text color="white">How to play the memory game</Text>

      <Image
        src="https://firebasestorage.googleapis.com/v0/b/memory-game-a32fa.appspot.com/o/cardImages%2Flogo.jpg?alt=media&token=c61931e0-4b1d-49e5-9d95-57cf3ce2f611"
        alt="homepage image"
        w="50%"
      />

      <Text color="white">
        Objective: The goal of the memory game is to find all pairs of matching
        cards.
      </Text>
      <Text color="white">Steps:</Text>
      <OrderedList color="white">
        <ListItem>Click 'Start' to begin.</ListItem>
        <ListItem>Click on cards to turn them over.</ListItem>
        <ListItem>Find two matching cards. Matched pairs stay open.</ListItem>
        <ListItem>Game ends when all pairs are matched.</ListItem>
      </OrderedList>

      <Text color="white">
        Tip: Remember each card's position to match pairs quicker!
      </Text>

      <Text color="white">
        Have Fun! Remember, the key is to enjoy the game and improve your memory
        skills.
      </Text>
    </Flex>
  );
}
