import { useState, FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
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
  Text,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login, error, isPending } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password);
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
            <Heading>Login</Heading>
            <Text color="gray.500">Glad to see you back</Text>
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
                  placeholder="Your email"
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
                  placeholder="Your password"
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    onClick={handleClick}
                    _hover={{ opacity: "0.7" }}
                    color="#c23866"
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {error && (
              <Text fontWeight="bold" color="red">
                {error.message}
              </Text>
            )}
            <Flex justify="center">
              {!isPending ? (
                <Button
                  type="submit"
                  background="#c23866"
                  color="white"
                  _hover={{ bg: "#c23866" }}
                >
                  Login
                </Button>
              ) : (
                <Button
                  isLoading
                  loadingText="Logging in..."
                  background="#c23866"
                  color="white"
                  _hover={{ bg: "#c23866" }}
                ></Button>
              )}
            </Flex>
          </Flex>
        </form>
        <Link as={RouterLink} color="white" to="/signup">
          Not signed up yet? <b>Signup here.</b>
        </Link>
      </Box>
    </Flex>
  );
}
