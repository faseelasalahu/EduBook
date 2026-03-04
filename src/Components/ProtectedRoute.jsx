import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  // 1. ലോഡിംഗ് ആണെങ്കിൽ തൽക്കാലം ഒന്നും കാണിക്കണ്ട
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // 2. ലോഗിൻ ചെയ്തിട്ടില്ലെങ്കിൽ ലോഗിൻ പേജിലേക്ക് വിടുക
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 3. ലോഗിൻ ചെയ്ത യൂസറുടെ റോൾ മാച്ച് ചെയ്യുന്നില്ലെങ്കിൽ ഹോമിലേക്ക് വിടുക
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  // 4. എല്ലാം ഓക്കെയാണെങ്കിൽ ആ പേജ് കാണിക്കാം
  return children;
};

export default ProtectedRoute;
