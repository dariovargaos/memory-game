import { Link as RouterLink } from "react-router-dom";
import { Button, Flex, Heading, Spacer, Link } from "@chakra-ui/react";

export default function Navbar() {
  return (
    <Flex as="nav" p="10px" alignItems="center" gap="20px">
      <Heading size="md" color="white">
        Magic Match
      </Heading>

      <Spacer />

      <Button color="white">Login</Button>
      <Button color="white">Register</Button>
    </Flex>
  );
}
