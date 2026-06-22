import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar, Edit, X, Loader2, Save, Image as ImageIcon, UploadCloud } from "lucide-react";
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // --- FETCH EVENTS ---
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const loadedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date descending
      loadedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEvents(loadedEvents);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- SAVE EVENT ---
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingEvent.id) {
        await updateDoc(doc(db, "events", editingService.id), editingEvent);
        alert("Event updated successfully!");
      } else {
        await addDoc(collection(db, "events"), editingEvent);
        alert("Event created successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event: ", error);
      alert("Failed to save event.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DELETE EVENT ---
  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event? This cannot be undone.")) {
      await deleteDoc(doc(db, "events", id));
    }
  };

  const openNewEventModal = () => {
    setEditingEvent({
      title: "",
      date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
      category: "Webinar",
      speakers: "",
      description: "",
      link: "", // External registration link
      youtubeLink: "", // For past recording
      imagePreview: ""
    });
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Events & Webinars</h1>
          <p className="text-gray-500 text-sm">Add upcoming events or upload past webinar recordings.</p>
        </div>
        <Button onClick={openNewEventModal} className="bg-[#E2552B] hover:bg-[#E2552B]/90 text-white flex items-center gap-2 px-6">
          <Plus size={18} /> Create New Event
        </Button>
      </div>

      {/* Events List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Calendar size={48} className="text-gray-300 mb-4" />
            <p>No events found. Click "Create New Event" to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {events.map((ev) => {
              const isPast = new Date(ev.date).getTime() < new Date().getTime();
              return (
                <div key={ev.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                      {ev.imagePreview ? <img src={ev.imagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{ev.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isPast ? 'bg-gray-100 text-gray-500' : 'bg-[#E2552B]/10 text-[#E2552B]'}`}>
                          {isPast ? 'Past' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1"><Calendar size={14} className="inline mr-1"/> {new Date(ev.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{ev.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <Button onClick={() => { setEditingEvent(ev); setIsModalOpen(true); }} variant="outline" size="sm" className="text-[#1B5E20] border-[#1B5E20]">
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                    <Button onClick={() => handleDeleteEvent(ev.id)} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-gray-900">{editingEvent.id ? 'Edit Event' : 'Create New Event'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveEvent} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Cover Image</label>
                  <ImageUploader preview={editingEvent.imagePreview} onUploadSuccess={(url: string) => setEditingEvent({...editingEvent, imagePreview: url})} />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Event Title</label>
                    <input required type="text" value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] font-bold" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Date & Time</label>
                      <input required type="datetime-local" value={editingEvent.date} onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                      <p className="text-[10px] text-gray-400 mt-1">If date is in the future, it automatically becomes the Hero Countdown Event.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Category / Tag</label>
                      <input type="text" value={editingEvent.category} onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="e.g. Reporting, Waste..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Speakers</label>
                    <input type="text" value={editingEvent.speakers} onChange={(e) => setEditingEvent({...editingEvent, speakers: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="e.g. Jane Doe, John Smith" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Event Description</label>
                <textarea required rows={4} value={editingEvent.description} onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="Describe the webinar or event..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Registration Link (For Upcoming)</label>
                  <input type="url" value={editingEvent.link} onChange={(e) => setEditingEvent({...editingEvent, link: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="https://zoom.us/..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#E2552B] mb-1">YouTube Recording Link (For Past)</label>
                  <input type="url" value={editingEvent.youtubeLink} onChange={(e) => setEditingEvent({...editingEvent, youtubeLink: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="https://youtube.com/..." />
                </div>
              </div>

            </form>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-white rounded-b-2xl">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEvent} disabled={isSaving || !editingEvent.title} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white">
                {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />} Save Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- REUSABLE UPLOADER COMPONENT ---
function ImageUploader({ preview, onUploadSuccess }: any) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileRef = ref(storage, `events/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed! Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors rounded-xl h-full w-full min-h-[160px]">
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      {isUploading ? <Loader2 className="animate-spin text-[#1B5E20]" size={24} /> : preview ? (
        <><img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" /><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity"><UploadCloud className="text-[#1B5E20]" size={24} /></div></>
      ) : <UploadCloud className="text-gray-400" size={32} />}
    </div>
  );
}