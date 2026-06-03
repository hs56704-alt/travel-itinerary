import { Link } from 'react-router-dom';
import { MapPin, Calendar, Globe, Lock, ArrowRight } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

export default function ItineraryCard({ itinerary }) {
  return (
    <Link
      to={`/itinerary/${itinerary._id}`}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-6 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition line-clamp-2">
          {itinerary.title}
        </h3>
        <span className={`shrink-0 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          itinerary.isPublic
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {itinerary.isPublic ? <Globe size={10} /> : <Lock size={10} />}
          {itinerary.isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2">
        {itinerary.destination && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={14} className="text-blue-500 shrink-0" />
            <span>{itinerary.destination}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={14} className="text-blue-500 shrink-0" />
          <span>{formatDate(itinerary.startDate)} → {formatDate(itinerary.endDate)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Created {formatDate(itinerary.createdAt)}
        </span>
        <span className="flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
          View <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}