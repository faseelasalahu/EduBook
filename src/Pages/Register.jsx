import  { useState ,useEffect} from 'react';
import Scene3D from '../Components/Scence3D';
import { useNavigate } from 'react-router-dom';
import {auth, db} from '../Services/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore'
import toast from 'react-hot-toast';


const Register = () => {
  useEffect(() => {
    
      document.title = "Register | Edu-Book";
    }, []);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [department, setDepartment] = useState('')

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
  e.preventDefault();
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // 1.save user information
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      role: role,
      status: role === 'student' ? 'pending' : 'active'
    });

    // 2. റോൾ 'teacher' ആണെങ്കിൽ 'teachers' കളക്ഷനിലേക്കും ആഡ് ചെയ്യുന്നു
    if (role === 'teacher') {
      await setDoc(doc(db, "teachers", user.uid), { // ഇവിടെ user.uid ആണ് പ്രധാനം
        id: user.uid, 
        name: name,
        subject: subject, // രജിസ്ട്രേഷൻ ഫോമിൽ ഇത് ചോദിക്കണം
        department: department
      });
    }

    toast.success("Registered Successfully!");
    navigate('/login');
  } catch (error) {
    toast.error(error.message);
  }
};


  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <Scene3D />
      
      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        <form className="space-y-4">
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full Name" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-yellow-500" />
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-yellow-500" />
          <input type="password" value={password} autoComplete="current-password" onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-yellow-500" />
          
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="student">I am a Student</option>
            <option value="teacher">I am a Teacher</option>

          </select>
          {role === 'teacher' ? <> <input type="text" value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-yellow-500" />
           <input type="text" value={department} onChange={(e)=>setDepartment(e.target.value)} placeholder="Department" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-yellow-500" /></>: ''}

          <button onClick={handleSignUp} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition duration-300">
            Sign Up
          </button>
        </form>
        
        <p className="text-gray-300 mt-4 text-center">
          Already have an account? <span className="text-yellow-500 cursor-pointer" onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
