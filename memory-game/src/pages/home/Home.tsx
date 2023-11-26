import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useGameSettingsContext } from "../../hooks/useGameSettingsContext";
import { useLogout } from "../../hooks/useLogout";
import {
  Heading,
  Text,
  Flex,
  Image,
  OrderedList,
  ListItem,
  Button,
  Link,
  VStack,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
export default function Home() {
  const { user } = useAuthContext();
  const { logout, error, isPending } = useLogout();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <VStack gap={2} maxW="100%">
        <Flex w="100%" justify="flex-end" p={2}>
          {!user ? (
            <Flex gap={2}>
              <Link as={RouterLink} to="/login" color="white" fontWeight="bold">
                Login
              </Link>
              <Link
                as={RouterLink}
                to="/signup"
                color="white"
                fontWeight="bold"
              >
                Signup
              </Link>
            </Flex>
          ) : (
            <Flex gap={2} align="center">
              <Text color="white">hello, {user.displayName}</Text>
              {isPending ? (
                <Button
                  isLoading
                  loadingText="Logging out..."
                  colorScheme="whiteAlpha"
                ></Button>
              ) : (
                <Button
                  color="white"
                  variant="outline"
                  onClick={() => handleLogout()}
                  _hover={{ background: "#301934" }}
                >
                  Logout
                </Button>
              )}
            </Flex>
          )}
        </Flex>
        <VStack>
          <Heading as="h1" color="white" size={{ base: "lg" }}>
            Welcome to Magic Match!
          </Heading>
          <Button
            variant="outline"
            color="white"
            _hover={{ background: "#c23866" }}
            onClick={() => navigate("/game")}
          >
            Start
          </Button>
        </VStack>

        <Grid
          templateColumns={{ base: "repeat(1,1fr)", md: "1fr 1fr" }}
          alignItems="center"
          p={2}
        >
          <GridItem>
            <VStack>
              <Text color="white">How to play the memory game</Text>

              <Image
                src="https://firebasestorage.googleapis.com/v0/b/memory-game-a32fa.appspot.com/o/cardImages%2Flogo.jpg?alt=media&token=c61931e0-4b1d-49e5-9d95-57cf3ce2f611"
                alt="homepage image"
                w="80%"
              />
            </VStack>
          </GridItem>

          <GridItem p={2}>
            <VStack>
              <Text color="white">
                <b>Objective:</b> The goal of the memory game is to find all
                pairs of matching cards.
              </Text>
              <Text color="white">Steps:</Text>
              <OrderedList color="white">
                <ListItem>Click 'Start' to begin.</ListItem>
                <ListItem>Click on cards to turn them over.</ListItem>
                <ListItem>
                  Find two matching cards. Matched pairs stay open.
                </ListItem>
                <ListItem>Game ends when all pairs are matched.</ListItem>
              </OrderedList>

              <Text color="white">
                Tip: Remember each card's position to match pairs quicker!
              </Text>

              <Text color="white">
                Have Fun! Remember, the key is to enjoy the game and improve
                your memory skills.
              </Text>
            </VStack>
          </GridItem>
        </Grid>
        {error &&
          toast({
            title: "Something went wrong.",
            description: "Logout failed.",
            status: "error",
            variant: "customError",
            duration: 3000,
            isClosable: true,
          })}
      </VStack>
    </>
  );
}
