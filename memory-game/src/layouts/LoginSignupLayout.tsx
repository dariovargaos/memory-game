import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

export default function LoginSignupLayout() {
  return (
    <Box
      bg="#1b1523"
      minH="100vh"
      display="flex"
      flexDir="column"
      gap={50}
      overflow="hidden"
    >
      <Navbar />
      <Outlet />
    </Box>
  );
}
