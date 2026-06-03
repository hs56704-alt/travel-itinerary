import anthropic from '../config/ai.js';

export const generateItinerary = async (extractedDataList) => {
  const documentsContext = extractedDataList
    .map((data, i) => `Document ${i + 1}:\n${JSON.stringify(data, null, 2)}`)
    .join('\n\n');

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are an expert travel planner. Based on the following travel booking documents, generate a detailed day-by-day itinerary.

Booking Documents:
${documentsContext}

Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "title": "Descriptive trip title e.g. Paris Adventure · Jul 2026",
  "destination": "Primary destination city/country",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "summary": "2-3 sentence overview of the trip",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day title e.g. Departure from Delhi",
      "activities": [
        {
          "time": "HH:MM",
          "type": "flight|hotel|explore|transport|meal",
          "title": "Short activity title",
          "description": "Detailed description of the activity",
          "details": "Booking refs, addresses, confirmation numbers etc"
        }
      ]
    }
  ],
  "bookings": {
    "flights": [],
    "hotels": [],
    "transport": []
  },
  "tips": [
    "Practical tip 1 for this trip",
    "Practical tip 2 for this trip"
  ]
}`,
      },
    ],
  });

  const text = response.content[0].text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Failed to parse AI-generated itinerary. Please try again.');
  }
};