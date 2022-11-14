import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Activate from "./pages/home/activate";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Reset from "./pages/reset";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route path="/" exact element={<Home />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/activate/:token" exact element={<Activate />} />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" exact element={<Login />} />
        </Route>
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  );
}

export default App;
