import React, { useEffect, useState } from 'react';
import { db } from '../../Services/firebase';
import { useAuth } from '../../Context/AuthContext';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user) {
      console.log("No user logged in yet...");
      return;
    }

    console.log("Logged in Teacher UID:", user.uid);


    const q = query(
      collection(db, "appointments"), 
     where("teacherId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched Appointments:", data); // ഇവിടെ ഡാറ്റ വരുന്നുണ്ടോ എന്ന് നോക്കുക
      setAppointments(data);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status: newStatus });
      toast.success(`Appointment ${newStatus}!`);
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      t-<h1 className='text-2xl m-auto text-yellow-600'>Welcome <span className="text-indigo-600 text-bold text-3xl">{user.name}</span></h1>
      <h1 className="text-2xl font-bold mb-6 text-center tracking-tight text-yellow-600">My Appointments</h1>
      
      <div className="grid gap-4">
        {appointments.length > 0 ? (
          appointments.map((app) => (
            <div key={app.id} className="p-5 bg-white shadow-sm rounded-2xl border border-slate-200 flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{app.studentName || "New Student"}</h3>
                <p className="text-slate-500 text-sm italic">"{app.message || "No message"}"</p>
                <div className="mt-2 flex items-center gap-2">
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                     {app.status}
                   </span>
                </div>
              </div>
              
              {app.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(app.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition">Approve</button>
                  <button onClick={() => updateStatus(app.id, 'cancelled')} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition">Cancel</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            No appointments found for your ID.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
