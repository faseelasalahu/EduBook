import { Search, Calendar, User, Clock, CheckCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where,serverTimestamp,addDoc } from 'firebase/firestore';
import { db } from '../../Services/firebase';
import toast from 'react-hot-toast';


   


const StudentDashboard = () => {
const {user}= useAuth()
const[teacher, setTeacher] = useState([])
const[myBooking, setMyBooking] = useState([])
const[searchTerm, setSearchTerm] = useState('')

useEffect(()=>{
  if(!user) return
// Take list of teachers
  const unsubscribeTeachers = onSnapshot(collection(db, 'teachers'),(snapshot)=>{
    setTeacher(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})))
  })
// take booking of perticular student
const q= query(collection(db,'appointments'),where('studentId','==',user.uid))
const unsubscribeBooking = onSnapshot(q,(snapshot)=>{
  setMyBooking(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})))
})
return ()=>{
  unsubscribeTeachers()
  unsubscribeBooking()
}
},[user])

const handleBooking = async (selectedteacher) => {
  const userMsg = window.prompt("Message for Teacher:", "Need an appointment");
    if (!userMsg) return;
   try {
      
      await addDoc(collection(db, "appointments"), {
        teacherId: selectedteacher.id, 
        teacherName: selectedteacher.name,
        studentId: user.uid,
        studentName: user.name || "Student",
        message: userMsg,
        subject:selectedteacher.subject,
        status: 'pending',
        date:new Date().toLocaleDateString(),
        createdAt: serverTimestamp()
      });
      toast.success("Booking Request Sent! 🚀");
    } catch (error) {
      console.log("FULL ERROR:", error);
      toast.error("Booking Failed: " + error.message);
    }
  };

  const filteredTeachers = teacher.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-black min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-yellow-600 tracking-tight">
              Student <span className="text-indigo-600">Portal</span>
                <p>Welcome, {user.name}</p>
            </h1>
          
            <p className="text-yellow-600 mt-1">Find your mentor and book a session</p>
          </div>
          
          {/* Modern Search Bar */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              onChange={(e)=>setSearchTerm(e.target.value)}
              placeholder="Search by teacher or subject..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl shadow-sm border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Teachers List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-yellow-600 flex items-center gap-2">
                <GraduationCap className="text-yellow-600" /> Available Teachers
              </h2>
              <span className="text-sm font-medium text-slate-400">Showing {filteredTeachers.length} results</span>
            </div>
             
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample Teacher Card */}
              {filteredTeachers.map((teacher) => (
                <div key={teacher.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group border-b-4 border-b-indigo-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <User size={28} />
                    </div>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Part-Time
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{teacher.name}</h3>
                  <p className="text-indigo-600 font-semibold text-sm mb-4">{teacher.subject}</p>
                  
                  <button onClick={()=>handleBooking(teacher)} className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200">
                    <Calendar size={18} /> Book Appointment
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Status Section */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-yellow-600 mb-6 flex items-center gap-2">
              <Clock className="text-amber-500" /> Recent Bookings
            </h2>
            
            <div className="space-y-4">
              {/* Sample Booking Status Card */}
              {myBooking.map((book) => (
                <div key={book.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{book.subject}</h4>
                      <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Teacher:  {book.teacherName}</p>
                    </div>
                  </div>
                  { book.status === 'pending'? (<span className="bg-green-100 text-red-700 text-[10px] font-black px-2.5 py-1 rounded-md">
                    PENDING
                  </span>) : (<span className="bg-green-100 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-md">
                    APPROVED
                  </span> ) }
                  
                </div>
             ))} 

              </div>

            {/* Quick Stats or Promo */}
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] text-white shadow-xl shadow-indigo-200">
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-indigo-100 text-sm mb-4">Contact our support if you face any issues with booking.</p>
              <button className="bg-white/20 hover:bg-white/30 w-full py-2.5 rounded-xl font-bold transition-colors">
                Support Chat
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

  

