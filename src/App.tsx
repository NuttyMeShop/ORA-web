import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Reading from './pages/Reading'
import History from './pages/History'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Feedback from './pages/Feedback'
import { useAuth } from './contexts/AuthContext'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  return token ? <>{children}</> : <Navigate to="/login" />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { token, isAdmin } = useAuth()
  if (!token) return <Navigate to="/login" />
  if (!isAdmin) return <Navigate to="/" />
  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reading/:type" element={<PrivateRoute><Reading /></PrivateRoute>} />
          <Route path="history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path="admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
