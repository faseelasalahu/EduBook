import React, { useState,useEffect } from 'react';
import Scene3D from '../Components/Scence3D';
import { auth,db } from '../Services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDoc,doc } from 'firebase/firestore';

const Login = () => {
  useEffect(() => {
    
      document.title = "Login | Edu-Book";
    }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e)=>{
    e.preventDefault()
    // login through firebase 
    try{
      const userCredential =await signInWithEmailAndPassword(auth, email,password)
      const user = userCredential.user
      //take logged user details from firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if(userDoc.exists()){
  const userData = userDoc.data()
// check according to role
  if(userData.role ==='admin'){
    navigate('/admin-dashboard')
  }else if(userData.role ==='teacher'){
    navigate('/teacher-dashboard')
  }else{
    // check student approved or not
    if(userData.status === 'active'){
      navigate('/student-dashboard')
    }else{
      alert("Your Account is pending admin approval")
      await auth.signOut
    }
  }


      }
    }catch(error){
      alert("Login failed :" + error.message)
    }

  } 

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <Scene3D /> 
      
      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-yellow-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            autoComplete="current-password"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-yellow-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition duration-300">
            Sign In
          </button>
        </form>
        
        <p className="text-gray-300 mt-4 text-center">
          Don't have an account? <span className="text-yellow-500 cursor-pointer" onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
