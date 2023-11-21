import { Link as RouterLink } from "react-router-dom";
import { Flex, Heading, Spacer, Link } from "@chakra-ui/react";

export default function Navbar() {
  return (
    <Flex as="nav" p="10px" alignItems="center" gap="20px">
      <Heading size={{ base: "lg" }} color="white">
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
