import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./components/routes/PublicRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Toaster position="bottom-right" reverseOrder={false} />

      <Routes>
        <Route
          exact
          path="/"
          element={
            <PublicRoute redirectRoute={"/chats"}>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route
          exact
          path="/chats"
          element={
            <ProtectedRoute redirectRoute={"/"}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
