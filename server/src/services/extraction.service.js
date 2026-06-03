import anthropic from '../config/ai.js';


const fetchFileAsBase64 = async (fileUrl, fileType, originalFileName) => {
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');

  let mimeType;
  if (fileType === 'pdf') {
    mimeType = 'application/pdf';
  } else {
    const ext = originalFileName.split('.').pop().toLowerCase();
    mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  }

  return { base64, mimeType };
};


const extractRawText = async (base64, mimeType, fileType) => {
  const contentBlock = fileType === 'pdf'
    ? {
        type: 'document',
        source: { type: 'base64', media_type: mimeType, data: base64 },
      }
    : {
        type: 'image',
        source: { type: 'base64', media_type: mimeType, data: base64 },
      };

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          contentBlock,
          {
            type: 'text',
            text: 'Extract all text and information visible in this travel document. Return the raw text exactly as it appears, preserving all details like dates, times, names, booking references, and locations.',
          },
        ],
      },
    ],
  });

  return response.content[0].text;
};


const structureExtractedData = async (rawText) => {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a travel document parser. Given the raw text below, extract key information and return ONLY a valid JSON object (no markdown, no code blocks).

Raw text:
${rawText}

Return JSON with only the fields that are present in the document:
{
  "type": "flight|hotel|train|bus|other",
  "from": "departure city/location",
  "to": "destination city/location",
  "departureDate": "YYYY-MM-DD",
  "departureTime": "HH:MM",
  "arrivalDate": "YYYY-MM-DD",
  "arrivalTime": "HH:MM",
  "airline": "airline name if flight",
  "flightNumber": "flight number if flight",
  "hotelName": "hotel name if hotel",
  "checkIn": "YYYY-MM-DD if hotel",
  "checkOut": "YYYY-MM-DD if hotel",
  "location": "hotel location if hotel",
  "passengerName": "passenger/guest name",
  "bookingRef": "booking reference or PNR"
}

Omit any fields not found in the document.`,
      },
    ],
  });

  const text = response.content[0].text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(text);
  } catch {
    return { type: 'other', rawText };
  }
};


export const extractDocumentData = async (document) => {
  const { base64, mimeType } = await fetchFileAsBase64(
    document.fileUrl,
    document.fileType,
    document.originalFileName
  );

  const rawText = await extractRawText(base64, mimeType, document.fileType);
  const extractedData = await structureExtractedData(rawText);

  return { rawText, extractedData };
};