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
import Game from "./pages/game/Game";
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
        <Route path="/game" element={<Game />} />
        <Route path="/room" element={<GameRoom />} />

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
