import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Flex, Heading, Spacer, Link } from "@chakra-ui/react";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <Flex as="nav" p="10px" alignItems="center" gap="20px">
      <Heading
        size={{ base: "lg" }}
        color="white"
        onClick={() => navigate("/")}
        _hover={{ fontSize: { base: "150%", md: "190%" } }}
        cursor="pointer"
        transition="font-size 0.3s ease-in-out"
      >
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
