import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// pages and layouts
import Home from "./pages/home/Home";
import Game from "./pages/game/Game";
import Login from "./pages/login/Login";
import Singup from "./pages/signup/Singup";
import LoginSignupLayout from "./layouts/LoginSignupLayout";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />

        <Route element={<LoginSignupLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Singup />} />
        </Route>
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
