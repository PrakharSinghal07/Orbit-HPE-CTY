import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './utils/AuthContext'
import AuthenticatedRoute from './utils/AuthenticatedRoute'
import ProtectedRoute from './utils/ProtectedRoute'
import UserLayout from './layouts/UserLayout'
import DefaultLayout from './layouts/DefaultLayout'
import Login from './pages/Login'
import Home from './pages/Home'
import Chatboard from './pages/user/Chatboard'
import { ToastContainer } from 'react-toastify'
import Signup from './pages/Signup'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <Routes>
          {/* Authentication Routes */}
          <Route element={<AuthenticatedRoute />}>
            {/* Restricted routes for logged in user */}
            <Route path="/" element={<DefaultLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
          </Route>

          {/* Unrestricted Routes */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
          </Route>

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<UserLayout />}>
              <Route path="chat" element={<Chatboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
