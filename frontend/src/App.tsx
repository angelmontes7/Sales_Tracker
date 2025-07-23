import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Home from './pages/Home/Home'
import ProtectedRoute from './components/ProtectedRoutes'
import NotFound from './pages/NotFound/NotFound'

function Logout() {
  localStorage.clear()
  return <Navigate to="/"/>
}
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/dashboard" element={  <Dashboard />} />
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </>
  )
}

export default App
