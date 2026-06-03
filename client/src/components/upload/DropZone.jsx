import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, FileText, Image } from 'lucide-react';

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default function DropZone({ files, setFiles }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (accepted) => {
      // Avoid duplicates
      const existing = files.map((f) => f.name);
      const newFiles = accepted.filter((f) => !existing.includes(f.name));
      setFiles((prev) => [...prev, ...newFiles]);
    },
    onDropRejected: (rejected) => {
      rejected.forEach(({ errors }) => {
        errors.forEach((e) => console.warn(e.message));
      });
    },
  });

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  return (
    <div className="space-y-4">
      {/* Drop Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <UploadCloud size={32} className={isDragActive ? 'text-blue-600' : 'text-gray-400'} />
          </div>
          {isDragActive ? (
            <p className="text-blue-600 font-semibold">Drop your files here</p>
          ) : (
            <>
              <p className="text-gray-700 font-semibold">
                Drag & drop your travel documents
              </p>
              <p className="text-gray-400 text-sm">or click to browse files</p>
            </>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Supports PDF, JPG, PNG · Max 10MB per file · Up to 5 files
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
            >
              <div className="text-blue-500 shrink-0">
                {file.type === 'application/pdf'
                  ? <FileText size={20} />
                  : <Image size={20} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                className="text-gray-400 hover:text-red-500 transition shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}