import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import DropZone from '../components/upload/DropZone';
import { uploadDocumentsAPI } from '../api/upload';
import { generateItineraryAPI } from '../api/itinerary';
import { Sparkles, ArrowLeft } from 'lucide-react';

const STEPS = ['Upload Documents', 'Generate Itinerary'];

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const navigate = useNavigate();

  
  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Please select at least one document');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('documents', file));
      const res = await uploadDocumentsAPI(formData);
      setUploadedDocs(res.data.data.documents);
      setStep(1);
      toast.success('Documents uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

 
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const documentIds = uploadedDocs.map((d) => d._id);
      const res = await generateItineraryAPI(documentIds);
      toast.success('Itinerary generated!');
      navigate(`/itinerary/${res.data.data.itinerary._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6 transition"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition ${
                  i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm font-medium ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-12 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {step === 0 ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Upload Travel Documents</h2>
              <p className="text-gray-500 text-sm mb-6">
                Upload your flight tickets, hotel bookings, or any travel documents
              </p>
              <DropZone files={files} setFiles={setFiles} />
              <button
                onClick={handleUpload}
                disabled={!files.length || uploading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition"
              >
                {uploading ? 'Uploading...' : `Upload ${files.length > 0 ? `${files.length} ` : ''}Document${files.length !== 1 ? 's' : ''}`}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Generate Your Itinerary</h2>
              <p className="text-gray-500 text-sm mb-6">
                AI will read your documents and build a detailed day-by-day plan
              </p>

              {/* Uploaded docs summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {uploadedDocs.length} document{uploadedDocs.length > 1 ? 's' : ''} ready
                </p>
                {uploadedDocs.map((doc) => (
                  <div key={doc._id} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    {doc.originalFileName}
                  </div>
                ))}
              </div>

              {generating && (
                <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
                  <p className="text-blue-700 text-sm font-medium animate-pulse">
                    ✨ AI is reading your documents and building your itinerary...
                  </p>
                  <p className="text-blue-500 text-xs mt-1">This may take 10-15 seconds</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                {generating ? 'Generating...' : 'Generate Itinerary with AI'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}