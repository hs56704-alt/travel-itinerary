import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const activitySchema = new mongoose.Schema(
  {
    time: String,
    type: {
      type: String,
      enum: ['flight', 'hotel', 'explore', 'transport', 'meal', 'other'],
      default: 'other',
    },
    title: String,
    description: String,
    details: String,
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    day: Number,
    date: String,
    title: String,
    activities: [activitySchema],
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
    title: { type: String, required: true },
    destination: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    generatedContent: {
      summary: String,
      days: [daySchema],
      bookings: {
        flights: [mongoose.Schema.Types.Mixed],
        hotels: [mongoose.Schema.Types.Mixed],
        transport: [mongoose.Schema.Types.Mixed],
      },
      tips: [String],
    },
    shareToken: {
      type: String,
      unique: true,
      default: () => uuidv4(),
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;