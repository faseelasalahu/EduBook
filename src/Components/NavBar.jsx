import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Services/firebase';
import { signOut } from 'firebase/auth';

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-black text-yellow-600 p-4 shadow-lg flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-bold tracking-wider">
        <Link to="/">🎓 EDU-BOOK</Link>
      </div>

      <div className="space-x-6 flex items-center">
        <Link to="/" className="hover:text-yellow-400 transition">Home</Link>


        {/*admin link */}
        {userRole === 'admin' && (
          <Link to="/admin-dashboard" className="hover:text-yellow-400 transition">Admin Panel</Link>
        )}

        {/* teacher link */}
        {userRole === 'teacher' && (
          <Link to="/teacher-dashboard" className="hover:text-yellow-400 transition">Schedules</Link>
        )}

        {/* student link */}
        {userRole === 'student' && (
          <Link to="/student-dashboard" className="hover:text-yellow-400 transition">Book Now</Link>
        )}
       <div className="space-x-6 flex items-center">
        <Link to="/register" className="hover:text-yellow-400 transition">Register</Link>
        <button 
          onClick={handleLogout}
          className="bg-yellow-600 text-black hover:bg-yellow-700 px-4 py-1 rounded-lg text-sm font-semibold transition cursor-pointer"
        >
          Logout
        </button>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
