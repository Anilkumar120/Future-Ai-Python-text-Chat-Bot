import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Chat from "./pages/Chat";


function Home() {

  return (
    <Navigate
      to="/chat"
      replace
    />
  );
}


export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/chat"
          element={<Chat />}
        />

      </Routes>

    </BrowserRouter>
  );
}