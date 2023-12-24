import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages and layouts
import Home from "./pages/home/Home";
import SinglePlayerRoom from "./pages/gameRoom/SinglePlayerRoom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Singup";
import LoginSignupLayout from "./layouts/LoginSignupLayout";
import GameRoom from "./pages/gameRoom/GameRoom";

function App() {
  const { user, authIsReady } = useAuthContext();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Home />} />
        <Route path="/game/:gameId" element={<SinglePlayerRoom />} />
        <Route path="/room/:gameId" element={<GameRoom />} />

        <Route element={<LoginSignupLayout />}>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
        </Route>
      </Route>
    )
  );
  return authIsReady && <RouterProvider router={router} />;
}

export default App;
