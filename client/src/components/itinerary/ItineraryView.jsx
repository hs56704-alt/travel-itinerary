import { Plane, Building2, Compass, Car, Utensils, Clock, MapPin, Lightbulb, Star } from 'lucide-react';

const activityConfig = {
  flight:    { icon: Plane,      color: 'bg-blue-100 text-blue-600',   label: 'Flight'     },
  hotel:     { icon: Building2,  color: 'bg-purple-100 text-purple-600', label: 'Hotel'    },
  explore:   { icon: Compass,    color: 'bg-green-100 text-green-600',  label: 'Explore'   },
  transport: { icon: Car,        color: 'bg-orange-100 text-orange-600', label: 'Transport' },
  meal:      { icon: Utensils,   color: 'bg-red-100 text-red-600',      label: 'Meal'      },
  other:     { icon: Star,       color: 'bg-gray-100 text-gray-600',    label: 'Activity'  },
};

function ActivityCard({ activity }) {
  const config = activityConfig[activity.type] || activityConfig.other;
  const Icon = config.icon;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-xl ${config.color} shrink-0`}>
          <Icon size={16} />
        </div>
        <div className="w-px flex-1 bg-gray-200 mt-2" />
      </div>
      <div className="pb-6 flex-1">
        <div className="flex items-center gap-2 mb-1">
          {activity.time && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={10} /> {activity.time}
            </span>
          )}
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}>
            {config.label}
          </span>
        </div>
        <h4 className="font-semibold text-gray-800 mb-1">{activity.title}</h4>
        {activity.description && (
          <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
        )}
        {activity.details && (
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mt-2">
            {activity.details}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ItineraryView({ itinerary }) {
  const { generatedContent } = itinerary;
  if (!generatedContent) return null;

  return (
    <div className="space-y-8">
      {/* Summary */}
      {generatedContent.summary && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <p className="text-blue-800 leading-relaxed">{generatedContent.summary}</p>
        </div>
      )}

      {/* Days */}
      {generatedContent.days?.map((day) => (
        <div key={day.day} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Day Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Day {day.day}</h3>
              <span className="text-blue-200 text-sm">{day.date}</span>
            </div>
            {day.title && (
              <p className="text-blue-100 text-sm mt-0.5">{day.title}</p>
            )}
          </div>

          {/* Activities */}
          <div className="p-6">
            {day.activities?.length > 0 ? (
              day.activities.map((activity, i) => (
                <ActivityCard key={i} activity={activity} />
              ))
            ) : (
              <p className="text-gray-400 text-sm">No activities listed</p>
            )}
          </div>
        </div>
      ))}

      {/* Travel Tips */}
      {generatedContent.tips?.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
          <h3 className="flex items-center gap-2 font-bold text-amber-800 mb-4">
            <Lightbulb size={18} /> Travel Tips
          </h3>
          <ul className="space-y-2">
            {generatedContent.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}