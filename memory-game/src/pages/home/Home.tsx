import { useState, FormEvent } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import { useDocument } from "../../hooks/useDocument";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Spacer,
} from "@chakra-ui/react";

export default function Home() {
  const [isOpenMPModal, setIsOpenMPModal] = useState<boolean>(false);
  const { user } = useAuthContext();
  const { logout, error, isPending } = useLogout();
  const {
    data: userData,
    error: userError,
    isLoading,
  } = useDocument("users", user?.uid);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
  };

  const handleCreateGameRoom = async () => {
    const gameId = uuid4();
    try {
      await setDoc(doc(db, "gameRooms", gameId), {
        createdBy: {
          id: userData?.id,
          displayName: userData?.displayName,
          wins: userData?.wins,
          losses: userData?.losses,
        },
        opponent: null,
        currentPlayer: user?.uid,
        playerOneScore: 0,
        playerTwoScore: 0,
        gameState: { waiting: true, playing: false, completed: false },
        shuffledCards: [],
      });
      navigate(`/room/${gameId}`);
    } catch (err) {
      console.log("Error creating game room: ", err);
    }
  };

  const handleJoinGame = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameId = (
      e.currentTarget.elements.namedItem("gameId") as HTMLInputElement
    ).value;

    try {
      const gameRoomRef = doc(db, "gameRooms", gameId);
      const gameRoomSnap = await getDoc(gameRoomRef);

      if (gameRoomSnap.exists()) {
        const gameRoom = gameRoomSnap.data();

        if (gameRoom.createdBy.id !== user?.uid && !gameRoom.opponent) {
          await updateDoc(gameRoomRef, {
            opponent: {
              id: userData?.id,
              displayName: userData?.displayName,
              wins: userData?.wins,
              losses: userData?.losses,
            },
            gameState: { waiting: false },
          });
          navigate(`/room/${gameId}`);
        } else {
          toast({
            title: "Game room issue",
            description:
              "The game room is already full or you are the creator.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Game Room not found.",
          description: "Please check the code and try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log("Error joining game: ", err);
      toast({
        title: "Error",
        description: "There was and issue joining the game room.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <VStack gap={2} maxW="100%">
        <Flex w="100%" p={2} align="center">
          {!user ? (
            <>
              <Spacer />
              <Link as={RouterLink} to="/login" color="white" fontWeight="bold">
                Login
              </Link>
            </>
          ) : (
            <>
              <Button
                color="white"
                variant="outline"
                _hover={{ background: "#c23866" }}
                onClick={() => setIsOpenMPModal(true)}
              >
                Play with friend
              </Button>
              <Spacer />
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
            </>
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
                <b>Have Fun!</b> Remember, the key is to enjoy the game and
                improve your memory skills.
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
      <Modal
        isOpen={isOpenMPModal}
        onClose={() => setIsOpenMPModal(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          backgroundColor="#301934"
          color="white"
          w={{ base: "90%", sm: "60%" }}
        >
          <ModalHeader>Play with friend</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" gap={4}>
            <Button onClick={handleCreateGameRoom} w="70%">
              Invite Friend via Code
            </Button>
            <form onSubmit={handleJoinGame}>
              <FormControl>
                <FormLabel>Enter code</FormLabel>
                <Input name="gameId" />
                <Button type="submit">Submit</Button>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="white"
              background="transparent"
              onClick={() => setIsOpenMPModal(false)}
              _hover={{ background: "#1b1523" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Text color="white">{userError}</Text>
    </>
  );
}
