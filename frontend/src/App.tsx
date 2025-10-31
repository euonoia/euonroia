// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Homepage from './pages/homepage'
import Dashboard from './pages/dashboard'
import AboutPage from './pages/aboutpage'
import UserList from './pages/userlist'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  )
}
