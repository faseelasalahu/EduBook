import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import TeacherDashboard from './Pages/Teacher/TeacherDashboard'
import StudentDashboard from './Pages/Students/StudentDashboard'
import Navbar from './Components/NavBar'
import { AuthProvider } from './Context/AuthContext'

export default function App({userRole}) {

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <AuthProvider>
   <Router>
    <Navbar userRole={userRole} /> 
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
     <Route path='register' element={<Register />} />
     <Route path='admin-dashboard' element={<AdminDashboard />} />
     <Route path='teacher-dashboard' element={<TeacherDashboard />} />
     <Route path='student-dashboard' element={<StudentDashboard />} />
    </Routes>
   </Router>
   </AuthProvider> 
   </>
  )
}
