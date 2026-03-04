import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy,Suspense } from 'react';
import ProtectedRoute from './Components/ProtectedRoute'
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register= lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const TeacherDashboard = lazy(() => import('./pages/Teacher/TeacherDashboard'));
const StudentDashboard = lazy(() => import('./pages/Students/StudentDashboard'));
import Navbar from './Components/NavBar'
import { AuthProvider } from './Context/AuthContext'

export default function App({userRole}) {

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <AuthProvider>
   <Router>
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold">Loading...</div>}>
    <Navbar userRole={userRole} /> 
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
     <Route path='register' element={<Register />} />
     <Route path='admin-dashboard' element={ <ProtectedRoute allowedRole="admin"><AdminDashboard /> </ProtectedRoute>} />
     <Route path='teacher-dashboard' element={  <ProtectedRoute allowedRole="teacher"><TeacherDashboard /> </ProtectedRoute>} />
     <Route path='student-dashboard' element={<StudentDashboard />} />
    </Routes>
    </Suspense>
   </Router>
   </AuthProvider> 
   </>
  )
}
