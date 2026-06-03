import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import ItineraryCard from '../components/itinerary/ItineraryCard';
import { getItinerariesAPI } from '../api/itinerary';
import { useAuth } from '../hooks/useAuth';
import { Plus, MapPin } from 'lucide-react';

export default function Dashboard() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await getItinerariesAPI();
        setItineraries(res.data.data.itineraries);
      } catch {
        toast.error('Failed to load itineraries');
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              {itineraries.length > 0
                ? `You have ${itineraries.length} trip${itineraries.length > 1 ? 's' : ''} planned`
                : 'Start by uploading your travel documents'}
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Plus size={18} />
            New Trip
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : itineraries.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-blue-100 p-6 rounded-full mb-6">
              <MapPin size={40} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Upload your flight tickets, hotel bookings, or travel documents and let AI build your itinerary.
            </p>
            <Link
              to="/upload"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              <Plus size={18} />
              Upload Documents
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <ItineraryCard key={itinerary._id} itinerary={itinerary} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}