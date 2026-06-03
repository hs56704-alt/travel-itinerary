# ✈️ TripAI — AI-Powered Travel Itinerary Generator

TripAI lets you upload your travel booking documents (flight tickets, hotel confirmations, train passes) and automatically generates a structured day-by-day itinerary using Claude AI.

---

## 🔗 Live Demo

| | URL |
|---|---|
| **Frontend** | https://travel-itinerary-pearl.vercel.app |
| **Backend** | https://travel-itinerary-tjpy.onrender.com/api/health |

> ⚠️ Backend is hosted on Render free tier — first request may take ~30 seconds to wake up.

---

## 📸 Features

- **JWT Authentication** — Secure register/login with token-based auth
- **Document Upload** — Drag & drop PDFs and images (flight tickets, hotel bookings, etc.) to AWS S3
- **AI Extraction** — Claude AI reads and extracts structured data from uploaded documents
- **Itinerary Generation** — Automatically generates a detailed day-by-day travel plan
- **Itinerary History** — All generated itineraries saved and accessible from dashboard
- **Sharing** — Generate a public link to share your itinerary with anyone (no login required)
- **Responsive UI** — Clean, mobile-friendly interface built with Tailwind CSS

---

## 🛠️ Tech Stack

### Backend
- **Node.js + Express.js** — REST API
- **MongoDB + Mongoose** — Database
- **JWT + bcryptjs** — Authentication
- **AWS S3 + Multer** — File storage
- **Anthropic Claude API** — AI document extraction and itinerary generation

### Frontend
- **React.js + Vite** — UI framework
- **Tailwind CSS** — Styling
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **react-dropzone** — Drag and drop uploads
- **react-hot-toast** — Notifications

### Infrastructure
- **Vercel** — Frontend deployment
- **Render** — Backend deployment
- **MongoDB Atlas** — Database hosting
- **AWS S3** — Document storage

---

## 🏗️ Architecture

```
client/                          # React frontend (Vite)
│   src/
│   ├── api/                     # Axios API calls
│   ├── components/
│   │   ├── common/              # Navbar, Loader, ProtectedRoute
│   │   ├── upload/              # DropZone component
│   │   └── itinerary/           # ItineraryCard, ItineraryView
│   ├── context/                 # AuthContext (global auth state)
│   ├── hooks/                   # useAuth hook
│   ├── pages/                   # Landing, Login, Register, Dashboard,
│   │                            # Upload, ItineraryDetail, ShareView
│   └── utils/                   # Axios instance with interceptors

server/                          # Express backend
│   src/
│   ├── config/                  # DB, AWS S3, AI client setup
│   ├── modules/                 # Feature modules
│   │   ├── auth/                # routes, controller, service, model
│   │   ├── upload/              # routes, controller, service, model
│   │   └── itinerary/           # routes, controller, service, model
│   ├── services/                # Shared AI services
│   │   ├── extraction.service.js   # Document → structured data
│   │   └── generation.service.js   # Structured data → itinerary
│   ├── middlewares/             # Auth, error handling, upload
│   └── utils/                   # asyncHandler, apiResponse
```

### AI Processing Pipeline

```
Upload Documents → S3 Storage
       ↓
Fetch from S3 → Convert to Base64
       ↓
Claude AI: Extract raw text (PDF/Image)
       ↓
Claude AI: Structure into JSON (dates, locations, refs)
       ↓
Claude AI: Generate day-by-day itinerary
       ↓
Save to MongoDB → Return to client
```

---

## 🗄️ Database Schema

### User
```js
{ name, email, password (hashed), timestamps }
```

### Document
```js
{
  userId, fileUrl, fileKey, fileType,
  originalFileName, status,        // uploaded | processing | processed | failed
  extractedText, extractedData,    // raw text + structured AI output
  timestamps
}
```

### Itinerary
```js
{
  userId, documents[],             // ref to source documents
  title, destination, startDate, endDate,
  generatedContent: {              // full AI output
    summary, days[], bookings{}, tips[]
  },
  shareToken,                      // unique UUID for public sharing
  isPublic,                        // toggle sharing on/off
  timestamps
}
```

---

## 🚀 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |

### Upload
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/upload` | Private | Upload documents to S3 |
| GET | `/api/upload` | Private | Get user's documents |
| DELETE | `/api/upload/:id` | Private | Delete document |

### Itinerary
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/itinerary/generate` | Private | Generate itinerary from documents |
| GET | `/api/itinerary` | Private | Get all itineraries |
| GET | `/api/itinerary/:id` | Private | Get single itinerary |
| PATCH | `/api/itinerary/:id/share` | Private | Toggle public/private |
| GET | `/api/itinerary/share/:token` | Public | View shared itinerary |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- AWS account (S3)
- Anthropic API key

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/travel-itinerary.git
cd travel-itinerary
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 4. Environment Variables

**`server/.env`**
```env
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your_bucket_name

ANTHROPIC_API_KEY=sk-ant-...
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 💡 Key Design Decisions

**Module-based backend architecture** — Each feature (auth, upload, itinerary) is self-contained with its own routes, controller, service, and model. Adding a new feature means adding a new folder, nothing else changes.

**Two-step AI processing** — Documents are first processed to extract raw text, then a second AI call structures it into JSON. This produces cleaner, more reliable data than a single-pass approach.

**Separated `extractedText` vs `extractedData`** — Raw text is preserved for debugging while structured data is used for generation. If AI parsing fails, raw text is available as fallback.

**Share via token** — Itineraries use a UUID share token instead of exposing MongoDB IDs publicly. `isPublic: false` by default — users explicitly opt in to sharing.

**S3 `fileKey` storage** — Storing both `fileUrl` and `fileKey` enables proper S3 deletion, not just database cleanup.

---

## 👨‍💻 Author

**Himanshu Singh**
- GitHub: https://github.com/hs56704-alt
- LinkedIn: https://www.linkedin.com/in/himanshu-singh-tech/