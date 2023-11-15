import { useState, FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import {
  EmailIcon,
  LockIcon,
  ViewIcon,
  ViewOffIcon,
  AtSignIcon,
} from "@chakra-ui/icons";

export default function Singup() {
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password, displayName);
  };

  const handleClick = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Flex justify="center">
      <Box
        w={{ base: "90%", sm: "50%", md: "40%", lg: "30%" }}
        border="1px solid white"
        p="20px"
        color="white"
      >
        <form onSubmit={handleSubmit}>
          <Heading>Signup</Heading>
          <FormControl>
            <FormLabel>email:</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <EmailIcon />
              </InputLeftElement>
              <Input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                fontSize="1em"
                color="white"
              />
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>display name:</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <AtSignIcon />
              </InputLeftElement>
              <Input
                type="text"
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                fontSize="1em"
                color="white"
              />
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>password:</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <LockIcon />
              </InputLeftElement>
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                fontSize="1em"
                color="white"
              />
              <InputRightElement>
                <Button
                  colorScheme="whatsapp"
                  variant="ghost"
                  onClick={handleClick}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button type="submit" colorScheme="whatsapp">
            Login
          </Button>
        </form>
        <Link as={RouterLink} color="white">
          Not registered yet?
        </Link>
      </Box>
    </Flex>
  );
}
