import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import ItineraryView from '../components/itinerary/ItineraryView';
import { getItineraryAPI, toggleShareAPI } from '../api/itinerary';
import { MapPin, Calendar, ArrowLeft, Globe, Lock, Copy, Check } from 'lucide-react';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;

export default function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getItineraryAPI(id);
        setItinerary(res.data.data.itinerary);
      } catch {
        toast.error('Itinerary not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleToggleShare = async () => {
    setSharing(true);
    try {
      const res = await toggleShareAPI(id);
      setItinerary((prev) => ({
        ...prev,
        isPublic: res.data.data.isPublic,
        shareToken: res.data.data.shareToken,
      }));
      toast.success(res.data.data.isPublic ? 'Itinerary is now public!' : 'Itinerary set to private');
    } catch {
      toast.error('Failed to update sharing');
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/share/${itinerary.shareToken}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6 transition">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{itinerary.title}</h1>
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

            {/* Share Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {itinerary.isPublic && (
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              )}
              <button
                onClick={handleToggleShare}
                disabled={sharing}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                  itinerary.isPublic
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {itinerary.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                {sharing ? '...' : itinerary.isPublic ? 'Public' : 'Make Public'}
              </button>
            </div>
          </div>
        </div>

        {/* Itinerary Content */}
        <ItineraryView itinerary={itinerary} />
      </div>
    </div>
  );
}