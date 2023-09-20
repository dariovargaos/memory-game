import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "#1b1523",
      },
      h1: {
        fontStyle: "Tahoma",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
