import { addDoc, collection,onSnapshot ,doc, deleteDoc, updateDoc,query,where} from 'firebase/firestore'
import { db } from '../../Services/firebase'
import React, { useState, useEffect } from 'react'
import { Trash2, UserPlus, BookOpen, Layers, UserCheck,Clock,UserX } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
const [tname, setTName] = useState('')
const[tDep, setTDep] = useState('')
const[tSubject, setTSubject]= useState('')
const [teacher, setTeacher] = useState([''])
const [pendingStudents, setPendingStudents] = useState([''])
 useEffect(() => {
  
    document.title = "Admin Panel | Edu-Book";
  }, []);
// take teacher list as realtime
 useEffect(()=>{
  const unsubscribe = onSnapshot(collection(db,'teacher'),(snapshot)=>{
    setTeacher(snapshot.docs.map(doc=>({id:doc.id, ...doc.data()})))
  })
  return()=> unsubscribe
 },
 [])
 // function delete teacher
const deleteTeacher = async (id) => {
  console.log("Attempting to delete ID:", id); // ഇത് കൺസോളിൽ വരുന്നുണ്ടോ എന്ന് നോക്കുക
  
  try {
    const docRef = doc(db, "teacher", id);
    await deleteDoc(docRef);
    toast.success('Deleted Successfully! 🗑️');
  } catch (error) {
    console.error("Delete Error:", error);
    toast.error('Delete failed: ' + error.message);
  }
};
// function to add teacher
const addTeacher = async(e) =>{
  e.preventDefault()
  try{
    //add Teacher details to 'teacher' collection
    await addDoc (collection(db,'teacher'),{
      name:tname,
      dept:tDep,
      subject:tSubject,
      createdAt: new Date()
    })
   toast.success("Teacher Added Successfully")
    setTName(''), setTDep(''), setTSubject('')
  }catch(error){
    toast.error(error.message)
  }
}
// take students where ststus as 'pending
useEffect(()=>{
  const q= query(collection(db, 'users'), where ('role','==','student'),where('status','==','pending'))
  const unsubscribe = onSnapshot(q,(snapshot)=>{
    setPendingStudents(snapshot.docs.map(doc=>({id:doc.id, ...doc.data()})))
    return ()=> unsubscribe()
  })
},[])
// function to approve students

const approveStudent = async(id)=>{
  try{
  const studentRef = doc(db,'users', id)
  await updateDoc(studentRef,{status:'active'})
  toast.success("Student Approved! ✅");
  } catch (error) {
    toast.error("Approval failed!");
  }
  }


  return (
     <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-2">
          <Layers className="text-indigo-600" /> Admin Control Panel
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---- FORM SECTION ---- */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-slate-700">
              <UserPlus size={20} className="text-indigo-500" /> Add New Teacher
            </h2>
            <form onSubmit={addTeacher} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 ml-1">Full Name</label>
                <input type="text" value={tname} onChange={(e) => setTName(e.target.value)} className="w-full p-3 mt-1 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition" placeholder="Dr. Arjun" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 ml-1">Department</label>
                <input type="text" value={tDep} onChange={(e) => setTDep(e.target.value)} className="w-full p-3 mt-1 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition" placeholder="Computer Science" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 ml-1">Subject</label>
                <input type="text" value={tSubject} onChange={(e) => setTSubject(e.target.value)} className="w-full p-3 mt-1 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition" placeholder="React & Firebase" required />
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
                Register Teacher
              </button>
            </form>
          </div>

          {/* ---- LIST SECTION ---- */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-5 text-slate-700 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-500" /> Active Faculty Members ({teacher.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              {teacher.map((teachers) => (
                <div key={teachers.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group  ">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{teachers.name}</h3>
                      <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider mt-1">{teachers.dept}</p>
                      <div className="mt-3 inline-block bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">
                        Subject: {teachers.subject}
                      </div>
                    </div>
                    <button type='button' 
                      onClick={(e)=>{ e.stopPropagation(); // മറ്റ് ക്ലിക്കുകൾ തടയാൻ
    console.log("Button Clicked!");  deleteTeacher(teachers.id)}}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {teacher.length === 0 && (
              <div className="text-center py-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                No teachers added yet.
              </div>
            )}
          </div>
        </div>
     

{/* Approve Students*/}

<div className="mt-12 lg:col-span-3">
  <h2 className="text-2xl font-bold mb-6 text-slate-700 flex items-center gap-2 border-b pb-2">
    <UserCheck size={24} className="text-green-500" /> Pending Student Approvals
  </h2>

  {pendingStudents.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pendingStudents.map((student) => (
        <div key={student.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-yellow-400 border border-slate-100 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{student.name}</h3>
              <p className="text-xs text-slate-500">{student.email}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => approveStudent(student.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl transition shadow-lg shadow-green-100 text-sm"
            >
              Approve Access
            </button>
            <button 
              onClick={() => rejectStudent(student.id)}
              className="px-4 py-2 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            >
              <UserX size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-12 text-center text-slate-400">
      No pending student registrations at the moment.
    </div>
  )}
</div>

      </div>
    </div>
  );
;
}  

