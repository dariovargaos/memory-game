import { Link as RouterLink } from "react-router-dom";
import { Button, Flex, Heading, Spacer, Link } from "@chakra-ui/react";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navbar() {
  const { user } = useAuthContext();
  return (
    <Flex as="nav" p="10px" alignItems="center" gap="20px">
      <Heading size="md" color="white">
        Magic Match
      </Heading>

      <Spacer />

      <Link as={RouterLink} to="/login" color="white">
        Login
      </Link>
      <Link as={RouterLink} to="/signup" color="white">
        Signup
      </Link>
    </Flex>
  );
}
