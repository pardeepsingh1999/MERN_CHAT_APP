import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./components/routes/PublicRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import FullPageLoader from "./components/miscellaneous/FullPageLoader";

function App() {
  return (
    <div>
      <FullPageLoader />

      <Toaster position="bottom-right" reverseOrder={false} />

      <Routes>
        <Route path="" element={<PublicRoute redirectRoute={"/chats"} />}>
          <Route exact path="/" element={<HomePage />} />

          {/* <Route index element={<Navigate replace to="/" />} /> */}
        </Route>

        <Route path="" element={<ProtectedRoute redirectRoute={"/"} />}>
          <Route exact path="/chats" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
