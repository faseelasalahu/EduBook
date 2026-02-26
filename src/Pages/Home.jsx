import { Link, useNavigate } from 'react-router-dom';
import Scence3D from '../Components/Scence3D'
import { useEffect } from 'react';


const Home = () => {
  const bgUrl = "https://images.pexels.com/photos/8500305/pexels-photo-8500305.jpeg";
  const navigate= useNavigate()
  useEffect(() => {
  
    document.title = "Home | Edu-Book";
  }, []);
  return (
    <div 
  style={{ backgroundImage: `url(${bgUrl})` }} 
  className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative overflow-hidden"
>
  {/* 1. black background (Overlay) */}
  <div className="absolute inset-0 bg-black/60 z-0"></div>

  {/* 2. 3D layer*/}
  <div className="absolute inset-0 z-10 pointer-events-none">
    <Scence3D />
  </div>

  {/* 3. container layer*/}
  <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-5xl font-bold text-yellow-600 mb-6 drop-shadow-lg">
   EDU-BOOK
    </h1>
    <p className="text-gray-200 text-xl mb-8 max-w-2xl">
      Book your appointments with the best teachers in just a few clicks.
    </p>
    <Link 
      to="/login" 
      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-10 rounded-full transition-all duration-300 relative z-30 cursor-pointer"
    >
      Get Started
    </Link>
  </div>
</div>

  );
};

export default Home;
