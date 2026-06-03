import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedItineraryAPI } from '../api/itinerary';
import ItineraryView from '../components/itinerary/ItineraryView';
import { MapPin, Calendar, Plane } from 'lucide-react';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;

export default function ShareView() {
  const { shareToken } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSharedItineraryAPI(shareToken);
        setItinerary(res.data.data.itinerary);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [shareToken]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <p className="text-2xl font-bold text-gray-800 mb-2">Itinerary not found</p>
      <p className="text-gray-500 mb-6">This itinerary may have been made private or doesn't exist.</p>
      <Link to="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition">
        Go Home
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Plane size={18} />
            </div>
            <span className="text-lg font-bold text-gray-800">TripAI</span>
          </div>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            Create your own →
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2">
            Shared Itinerary
          </p>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{itinerary.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {itinerary.destination && (
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-blue-500" /> {itinerary.destination}
              </span>
            )}
            {itinerary.startDate && (
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-blue-500" />
                {formatDate(itinerary.startDate)} → {formatDate(itinerary.endDate)}
              </span>
            )}
          </div>
        </div>

        <ItineraryView itinerary={itinerary} />

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Plan your own trip with AI</h3>
          <p className="text-blue-100 text-sm mb-6">
            Upload your travel documents and get a personalized itinerary in seconds
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
          >
            Get started for free →
          </Link>
        </div>
      </div>
    </div>
  );
}