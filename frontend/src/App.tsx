// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Dashboard from "./pages/dashboard";
import AboutPage from "./pages/aboutpage";
import UserList from "./pages/userlist";
import LandingPage from "./pages/LandingPage";
import OAuthCallback from "./components/OAuthCallBack";
import { UserProvider } from "./context/UserContext"; 
export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
