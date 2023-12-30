import { useState, FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";
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
  FormHelperText,
  Text,
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

  const { signup, error, isPending } = useSignup();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup(email, password, displayName);
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
          <Flex flexDir="column" gap={2}>
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
                  minLength={1}
                  maxLength={20}
                />
              </InputGroup>
              <FormHelperText color="gray.400">
                Display name can have maximum of 20 characters.
              </FormHelperText>
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
                  <Button variant="ghost" onClick={handleClick}>
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText color="gray.400">
                Password must have at least 6 characters.
              </FormHelperText>
            </FormControl>
            <Flex justify="center">
              {!isPending ? (
                <Button type="submit">Sign up</Button>
              ) : (
                <Button isLoading loadingText="Signing up..."></Button>
              )}
            </Flex>
          </Flex>
        </form>
        {error && (
          <Text color="red" fontWeight="bold">
            {error.message}
          </Text>
        )}
        <Link as={RouterLink} color="white" to="/login">
          Signed up already? <b>Login here.</b>
        </Link>
      </Box>
    </Flex>
  );
}
