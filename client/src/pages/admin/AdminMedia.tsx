import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, FileText, Trash2, Copy, UploadCloud, Loader2, CheckCircle2, Download } from "lucide-react";
import { ref, listAll, getDownloadURL, getMetadata, deleteObject, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

// These are all the folders we created across the CMS
const STORAGE_FOLDERS = [
  'home-slider', 'home-partners', 
  'about-page', 'contact-page', 
  'solutions-page', 'service-covers', 'service-heroes', 'service-blocks', 
  'resources-page', 'case-studies', 'annual-reports',
  'articles-page', 'article-covers', 'article-images', 
  'misc'
];

export default function AdminMedia() {
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'images', 'documents'
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- FETCH ALL MEDIA FROM ALL FOLDERS ---
  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const allFetchedFiles: any[] = [];

      // Scan all known folders
      for (const folder of STORAGE_FOLDERS) {
        const folderRef = ref(storage, folder);
        try {
          const res = await listAll(folderRef);
          
          // Get metadata and URLs for each file
          for (const itemRef of res.items) {
            const [url, meta] = await Promise.all([
              getDownloadURL(itemRef),
              getMetadata(itemRef)
            ]);

            allFetchedFiles.push({
              id: itemRef.fullPath,
              name: itemRef.name,
              path: itemRef.fullPath,
              url: url,
              type: meta.contentType || 'unknown',
              size: meta.size,
              folder: folder,
              createdAt: meta.timeCreated
            });
          }
        } catch (error) {
          // It's normal for some folders to not exist yet if they are empty
          console.log(`Skipped folder ${folder} (might be empty)`);
        }
      }

      // Sort files by newest first
      allFetchedFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMediaFiles(allFetchedFiles);

    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // --- UPLOAD NEW FILE (Defaults to 'misc' folder) ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileRef = ref(storage, `misc/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      alert("File uploaded successfully!");
      fetchMedia(); // Refresh the list
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check the console.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- DELETE FILE ---
  const handleDelete = async (path: string) => {
    if (window.confirm("Are you sure you want to permanently delete this file? If it is currently being used on the website, it will break the image/link.")) {
      try {
        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
        setMediaFiles(prev => prev.filter(f => f.path !== path));
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file.");
      }
    }
  };

  // --- COPY URL TO CLIPBOARD ---
  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- FORCE DOWNLOAD FILE ---
  const handleDownload = async (url: string, filename: string) => {
    try {
      // Fetch the file as a blob so the browser forces a download instead of opening a new tab
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed, opening in new tab instead.", error);
      // Fallback: If CORS blocks the fetch, just open the link
      window.open(url, '_blank');
    }
  };

  // --- UTILS ---
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // --- FILTER LOGIC ---
  const filteredFiles = mediaFiles.filter(file => {
    if (filter === 'images') return file.type.includes('image');
    if (filter === 'documents') return file.type.includes('pdf') || file.type.includes('document');
    return true;
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header & Upload */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Media Library</h1>
          <p className="text-gray-500 text-sm">View, upload, and manage all images and documents across your site.</p>
        </div>
        
        <div className="relative">
          <input 
            type="file" 
            onChange={handleUpload} 
            disabled={isUploading} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            accept="image/*,application/pdf"
          />
          <Button disabled={isUploading} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2 w-full sm:w-auto">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud size={18} />}
            {isUploading ? 'Uploading...' : 'Upload New Media'}
          </Button>
        </div>
      </div>

      {/* Filters & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm w-fit">
          <button onClick={() => setFilter('all')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-[#1B5E20] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>All Files</button>
          <button onClick={() => setFilter('images')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'images' ? 'bg-[#1B5E20] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Images</button>
          <button onClick={() => setFilter('documents')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'documents' ? 'bg-[#1B5E20] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Documents</button>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          {filteredFiles.length} files found
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Loader2 className="animate-spin text-[#1B5E20] mb-4" size={32} />
          <p className="text-gray-500 font-medium">Scanning storage folders...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-sm text-gray-400 border-dashed">
          <ImageIcon size={48} className="mb-4 opacity-50" />
          <p className="font-medium text-lg">No media files found.</p>
          <p className="text-sm">Upload files using the button above or directly in page editors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group relative">
              
              {/* Thumbnail */}
              <div className="h-32 bg-gray-100 relative flex items-center justify-center border-b border-gray-100 shrink-0">
                {file.type.includes('image') ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="text-[#E2552B] flex flex-col items-center gap-2">
                    <FileText size={32} />
                    <span className="text-xs font-bold text-gray-500 uppercase">PDF</span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  
                  {/* Download Button */}
                  <button 
                    onClick={() => handleDownload(file.url, file.name)}
                    className="p-2 bg-white rounded-full text-gray-800 hover:bg-[#E2552B] hover:text-white transition-colors shadow-lg"
                    title="Download File"
                  >
                    <Download size={16} />
                  </button>

                  {/* Copy Button */}
                  <button 
                    onClick={() => copyToClipboard(file.url, file.id)}
                    className="p-2 bg-white rounded-full text-gray-800 hover:bg-[#76FF03] hover:text-[#1B5E20] transition-colors shadow-lg"
                    title="Copy URL"
                  >
                    {copiedId === file.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(file.path)}
                    className="p-2 bg-white rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                    title="Delete File"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* File Details */}
              <div className="p-3 flex flex-col justify-between flex-1">
                <p className="text-xs font-bold text-gray-900 truncate mb-1" title={file.name}>
                  {file.name.split('_').slice(1).join('_') || file.name} {/* Hides the timestamp prefix */}
                </p>
                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <span className="truncate max-w-[60px]">{file.folder}</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}