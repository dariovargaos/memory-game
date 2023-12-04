import { useNavigate } from "react-router-dom";
import { Flex, Heading } from "@chakra-ui/react";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <Flex as="nav" p="10px" alignItems="center" gap="20px">
      <Heading
        size={{ base: "lg" }}
        color="white"
        onClick={() => navigate("/")}
        cursor="pointer"
      >
        Magic Match
      </Heading>
    </Flex>
  );
}
