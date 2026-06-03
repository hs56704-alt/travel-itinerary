import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Plane, LogOut, Plus, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Plane size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">TripAI</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/upload" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition">
              <Plus size={16} /> New Trip
            </Link>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              <span className="text-sm text-gray-600 font-medium hidden sm:block">{user?.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition">
                <LogOut size={16} />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}