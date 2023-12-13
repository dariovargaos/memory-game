import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { CurrentPlayerProvider } from "./context/CurrentPlayerContext.tsx";

const queryClient = new QueryClient();

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "#1b1523",
      },
    },
  },
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Poppins, sans-serif",
  },
  colors: {
    customRadio: {
      pink: "#c23866",
    },
  },
  components: {
    Alert: {
      variants: {
        customError: {
          container: {
            bg: "red.500",
            color: "white",
          },
        },
        customSuccess: {
          container: {
            bg: "#301934",
            color: "white",
          },
        },
      },
    },
    Radio: {
      baseStyle: () => ({
        control: {
          _checked: {
            bg: "customRadio.pink",
            borderColor: "customRadio.pink",
            _hover: {
              bg: "customRadio.pink",
              borderColor: "customRadio.Pink",
            },
          },
        },
      }),
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <CurrentPlayerProvider>
            <App />
          </CurrentPlayerProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
