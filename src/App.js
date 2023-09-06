import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import FriendPage from "./pages/FriendPage/FriendPage";
import GuideDiscoveryPage from "./pages/GuideDiscoveryPage/GuideDiscoveryPage";
import ChatLayout from "./components/ChatLayout/ChatLayout";
import { UserProvider } from "./context/UserContext";
import { VideoProvider } from "./context/VideoContext";
import EmojisProvider from "./context/EmojiContext";
import GroupChatPage from "./pages/GroupChatPage/GroupChatPage";
import GptChatPage from "./pages/ChatPage/GptChat/GptChatPage";

function App() {
  return (
    <UserProvider>
      <VideoProvider>
        <EmojisProvider>
          <ToastContainer style={{ width: "400px" }} />
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/" element={<ChatLayout />}>
                <Route path="/chat/:chatId" element={<ChatPage />} />
                <Route path="/chat/gpt" element={<GptChatPage />} />
                <Route path="/friends" element={<FriendPage />} />
                <Route
                  path="/chat/group/:groupId"
                  element={<GroupChatPage />}
                />
                <Route
                  path="/guide-discovery"
                  element={<GuideDiscoveryPage />}
                />
              </Route>
            </Routes>
          </Router>
        </EmojisProvider>
      </VideoProvider>
    </UserProvider>
  );
}

export default App;
