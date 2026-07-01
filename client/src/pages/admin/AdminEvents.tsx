import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar, Edit, X, Loader2, Save, Image as ImageIcon, UploadCloud, MapPin, Video, Languages, Wand2 } from "lucide-react";
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminEvents() {
  // Main view toggle
  const [viewMode, setViewMode] = useState<'webinars' | 'inPerson'>('webinars');

  // Data states
  const [webinars, setWebinars] = useState<any[]>([]);
  const [inPersonEvents, setInPersonEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal states
  const [isWebinarModalOpen, setIsWebinarModalOpen] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<any>(null);

  const [isInPersonModalOpen, setIsInPersonModalOpen] = useState(false);
  const [editingInPerson, setEditingInPerson] = useState<any>(null);

  // --- FETCH & AUTO-SORT DATA ---
  useEffect(() => {
    // Fetch Webinars
    const unsubWebinars = onSnapshot(collection(db, "events"), (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const now = new Date().getTime();
      loaded.sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        if (timeA > now && timeB > now) return timeA - timeB; // Both future: nearest first
        if (timeA <= now && timeB <= now) return timeB - timeA; // Both past: newest first
        return timeA > now ? -1 : 1; // Future always beats past
      });
      setWebinars(loaded);
      setIsLoading(false);
    });

    // Fetch In-Person Events
    const unsubInPerson = onSnapshot(collection(db, "industry_events"), (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setInPersonEvents(loaded);
    });

    return () => { unsubWebinars(); unsubInPerson(); };
  }, []);

  // --- WEBINAR HANDLERS ---
  const handleSaveWebinar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingWebinar.id) {
        await updateDoc(doc(db, "events", editingWebinar.id), editingWebinar);
      } else {
        await addDoc(collection(db, "events"), editingWebinar);
      }
      setIsWebinarModalOpen(false);
    } catch (error) {
      alert("Failed to save webinar.");
    }
    setIsSaving(false);
  };

  const handleDeleteWebinar = async (id: string) => {
    if (window.confirm("Delete this webinar?")) await deleteDoc(doc(db, "events", id));
  };

  const openNewWebinarModal = () => {
    setEditingWebinar({
      title_en: "", date: new Date().toISOString().slice(0, 16), category_en: "Webinar", speakers_en: "", description_en: "", link: "", youtubeLink: "", imagePreview: ""
    });
    setIsWebinarModalOpen(true);
  };

  // --- IN-PERSON EVENT HANDLERS ---
  const handleSaveInPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingInPerson.id) {
        await updateDoc(doc(db, "industry_events", editingInPerson.id), editingInPerson);
      } else {
        await addDoc(collection(db, "industry_events"), editingInPerson);
      }
      setIsInPersonModalOpen(false);
    } catch (error) {
      alert("Failed to save event.");
    }
    setIsSaving(false);
  };

  const handleDeleteInPerson = async (id: string) => {
    if (window.confirm("Delete this event?")) await deleteDoc(doc(db, "industry_events", id));
  };

  const openNewInPersonModal = () => {
    setEditingInPerson({
      title_en: "", date: new Date().toISOString().slice(0, 10), type_en: "Conference", location_en: "", description_en: "", images: []
    });
    setIsInPersonModalOpen(true);
  };

  // Gallery Array Handlers for In-Person
  const addGalleryImage = (url: string) => {
    setEditingInPerson((prev: any) => ({ ...prev, images: [...(prev.images || []), url] }));
  };
  const removeGalleryImage = (index: number) => {
    setEditingInPerson((prev: any) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Events & Webinars</h1>
          <p className="text-gray-500 text-sm">Control online webinars and physical industry events.</p>
        </div>
        
        {/* Toggle Switches */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('webinars')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${viewMode === 'webinars' ? 'bg-white text-[#1B5E20] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Video size={16} /> Online Webinars
          </button>
          <button 
            onClick={() => setViewMode('inPerson')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${viewMode === 'inPerson' ? 'bg-white text-[#1B5E20] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <MapPin size={16} /> In-Person Events
          </button>
        </div>
      </div>

      {/* --- WEBINARS VIEW --- */}
      {viewMode === 'webinars' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">All Webinars ({webinars.length})</h3>
            <Button onClick={openNewWebinarModal} className="bg-[#E2552B] hover:bg-[#c94b26] text-white h-9 px-4">
              <Plus size={16} className="mr-2" /> Add Webinar
            </Button>
          </div>
          {webinars.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <Calendar size={48} className="text-gray-300 mb-4" />
              <p>No webinars found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {webinars.map((ev) => {
                const isPast = new Date(ev.date).getTime() < new Date().getTime();
                return (
                  <div key={ev.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        {ev.imagePreview ? <img src={ev.imagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{ev.title_en || ev.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isPast ? 'bg-gray-100 text-gray-500' : 'bg-[#E2552B]/10 text-[#E2552B]'}`}>
                            {isPast ? 'Past' : 'Upcoming'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1"><Calendar size={14} className="inline mr-1"/> {new Date(ev.date).toLocaleString()}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{ev.description_en || ev.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button onClick={() => { setEditingWebinar(ev); setIsWebinarModalOpen(true); }} variant="outline" size="sm" className="text-[#1B5E20] border-[#1B5E20]">
                        <Edit size={16} className="mr-2" /> Edit
                      </Button>
                      <Button onClick={() => handleDeleteWebinar(ev.id)} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- IN-PERSON EVENTS VIEW --- */}
      {viewMode === 'inPerson' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">All In-Person Events ({inPersonEvents.length})</h3>
            <Button onClick={openNewInPersonModal} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white h-9 px-4">
              <Plus size={16} className="mr-2" /> Add Event
            </Button>
          </div>
          {inPersonEvents.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <MapPin size={48} className="text-gray-300 mb-4" />
              <p>No in-person events found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inPersonEvents.map((ev) => (
                <div key={ev.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 relative">
                      {ev.images && ev.images.length > 0 ? (
                        <>
                          <img src={ev.images[0]} className="w-full h-full object-cover rounded-lg" />
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">+{ev.images.length}</div>
                        </>
                      ) : <ImageIcon className="text-gray-300" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{ev.title_en || ev.title}</h3>
                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{ev.type_en || ev.type}</span>
                      </div>
                      <p className="text-sm text-[#E2552B] font-bold mb-1"><MapPin size={14} className="inline mr-1"/> {ev.location_en || ev.location}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{ev.description_en || ev.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button onClick={() => { setEditingInPerson(ev); setIsInPersonModalOpen(true); }} variant="outline" size="sm" className="text-[#1B5E20] border-[#1B5E20]">
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                    <Button onClick={() => handleDeleteInPerson(ev.id)} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* WEBINAR EDITOR MODAL */}
      {isWebinarModalOpen && editingWebinar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-gray-900">{editingWebinar.id ? 'Edit Webinar' : 'Create Webinar'}</h2>
              <button onClick={() => setIsWebinarModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveWebinar} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Image */}
                <div className="lg:col-span-4 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Cover Image</label>
                  <div className="aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden">
                    <ImageUploader preview={editingWebinar.imagePreview} onUploadSuccess={(url: string) => setEditingWebinar((prev: any) => ({...prev, imagePreview: url}))} />
                  </div>
                </div>
                
                {/* Right Side: Fields */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Date & Time</label>
                      <input required type="datetime-local" value={editingWebinar.date} onChange={(e) => setEditingWebinar((prev: any) => ({...prev, date: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                    </div>
                    <div>
                      <TranslatableField 
                        label="Category"
                        baseValue={{ en: editingWebinar.category_en || editingWebinar.category, th: editingWebinar.category_th, my: editingWebinar.category_my, vi: editingWebinar.category_vi, ko: editingWebinar.category_ko, id: editingWebinar.category_id, ms: editingWebinar.category_ms, zh: editingWebinar.category_zh }}
                        onUpdateTranslation={(lang: string, val: string) => setEditingWebinar((prev: any) => ({...prev, [`category_${lang}`]: val}))}
                      />
                    </div>
                  </div>
                  
                  <TranslatableField 
                    label="Webinar Title"
                    baseValue={{ en: editingWebinar.title_en || editingWebinar.title, th: editingWebinar.title_th, my: editingWebinar.title_my, vi: editingWebinar.title_vi, ko: editingWebinar.title_ko, id: editingWebinar.title_id, ms: editingWebinar.title_ms, zh: editingWebinar.title_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setEditingWebinar((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                  />
                  
                  <TranslatableField 
                    label="Speakers"
                    baseValue={{ en: editingWebinar.speakers_en || editingWebinar.speakers, th: editingWebinar.speakers_th, my: editingWebinar.speakers_my, vi: editingWebinar.speakers_vi, ko: editingWebinar.speakers_ko, id: editingWebinar.speakers_id, ms: editingWebinar.speakers_ms, zh: editingWebinar.speakers_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setEditingWebinar((prev: any) => ({...prev, [`speakers_${lang}`]: val}))}
                  />
                  
                  <TranslatableField 
                    label="Description"
                    isTextArea={true}
                    baseValue={{ en: editingWebinar.description_en || editingWebinar.description, th: editingWebinar.description_th, my: editingWebinar.description_my, vi: editingWebinar.description_vi, ko: editingWebinar.description_ko, id: editingWebinar.description_id, ms: editingWebinar.description_ms, zh: editingWebinar.description_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setEditingWebinar((prev: any) => ({...prev, [`description_${lang}`]: val}))}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Registration Link (Upcoming)</label>
                      <input type="url" value={editingWebinar.link} onChange={(e) => setEditingWebinar((prev: any) => ({...prev, link: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="https://zoom.us/..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#E2552B] mb-1">YouTube Link (Past)</label>
                      <input type="url" value={editingWebinar.youtubeLink} onChange={(e) => setEditingWebinar((prev: any) => ({...prev, youtubeLink: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="https://youtube.com/..." />
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-white rounded-b-2xl">
              <Button type="button" variant="outline" onClick={() => setIsWebinarModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveWebinar} disabled={isSaving || !(editingWebinar.title_en || editingWebinar.title)} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white">
                {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />} Save Webinar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* IN-PERSON EVENT EDITOR MODAL */}
      {isInPersonModalOpen && editingInPerson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-gray-900">{editingInPerson.id ? 'Edit In-Person Event' : 'Create In-Person Event'}</h2>
              <button onClick={() => setIsInPersonModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveInPerson} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TranslatableField 
                  label="Event Title"
                  baseValue={{ en: editingInPerson.title_en || editingInPerson.title, th: editingInPerson.title_th, my: editingInPerson.title_my, vi: editingInPerson.title_vi, ko: editingInPerson.title_ko, id: editingInPerson.title_id, ms: editingInPerson.title_ms, zh: editingInPerson.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setEditingInPerson((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                />
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input required type="date" value={editingInPerson.date} onChange={(e) => setEditingInPerson((prev: any) => ({...prev, date: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] h-10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TranslatableField 
                  label="Location"
                  baseValue={{ en: editingInPerson.location_en || editingInPerson.location, th: editingInPerson.location_th, my: editingInPerson.location_my, vi: editingInPerson.location_vi, ko: editingInPerson.location_ko, id: editingInPerson.location_id, ms: editingInPerson.location_ms, zh: editingInPerson.location_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setEditingInPerson((prev: any) => ({...prev, [`location_${lang}`]: val}))}
                />
                <TranslatableField 
                  label="Event Type / Tag"
                  baseValue={{ en: editingInPerson.type_en || editingInPerson.type, th: editingInPerson.type_th, my: editingInPerson.type_my, vi: editingInPerson.type_vi, ko: editingInPerson.type_ko, id: editingInPerson.type_id, ms: editingInPerson.type_ms, zh: editingInPerson.type_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setEditingInPerson((prev: any) => ({...prev, [`type_${lang}`]: val}))}
                />
              </div>
              
              <TranslatableField 
                label="Event Description"
                isTextArea={true}
                baseValue={{ en: editingInPerson.description_en || editingInPerson.description, th: editingInPerson.description_th, my: editingInPerson.description_my, vi: editingInPerson.description_vi, ko: editingInPerson.description_ko, id: editingInPerson.description_id, ms: editingInPerson.description_ms, zh: editingInPerson.description_zh }}
                onUpdateTranslation={(lang: string, val: string) => setEditingInPerson((prev: any) => ({...prev, [`description_${lang}`]: val}))}
              />

              {/* IMAGE GALLERY UPLOADER */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-3">Event Photo Gallery (Slideshow)</label>
                <div className="flex flex-wrap gap-4">
                  {editingInPerson.images?.map((img: string, i: number) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(i)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={24} />
                      </button>
                    </div>
                  ))}
                  
                  <div className="w-24 h-24 shrink-0">
                    <ImageUploader onUploadSuccess={(url: string) => addGalleryImage(url)} small />
                  </div>
                </div>
              </div>
            </form>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-white rounded-b-2xl">
              <Button type="button" variant="outline" onClick={() => setIsInPersonModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveInPerson} disabled={isSaving || !(editingInPerson.title_en || editingInPerson.title)} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white">
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
function ImageUploader({ preview, small, onUploadSuccess }: any) {
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
    <div className={`border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors rounded-xl w-full h-full ${small ? 'min-h-full' : 'min-h-[160px]'}`}>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      {isUploading ? <Loader2 className="animate-spin text-[#1B5E20]" size={small ? 16 : 24} /> : preview ? (
        <><img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" /><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity"><UploadCloud className="text-[#1B5E20]" size={small ? 16 : 24} /></div></>
      ) : <UploadCloud className="text-gray-400" size={small ? 20 : 32} />}
    </div>
  );
}

// --- REUSABLE AUTO-TRANSLATE FIELD ---
// ✅ FIXED: Removed layout stretching bug classes
function TranslatableField({ label, baseValue, onUpdateTranslation, isTextArea = false }: any) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const handleAutoTranslate = async () => {
    if (!baseValue.en) return alert("Please enter English text first!");
    
    setIsTranslating(true);
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY; 

    if (!GOOGLE_API_KEY) {
      alert("Missing Google Translate API Key in .env file!");
      setIsTranslating(false);
      return;
    }
    
    try {
      const translateText = async (text: string, targetLang: string) => {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: text, source: 'en', target: targetLang, format: 'html' })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        const translated = data.data.translations[0].translatedText;
        const txt = document.createElement("textarea");
        txt.innerHTML = translated;
        return txt.value;
      };

      const [thText, myText, viText, koText, idText, msText, zhText] = await Promise.all([
        translateText(baseValue.en, 'th'),
        translateText(baseValue.en, 'my'),
        translateText(baseValue.en, 'vi'),
        translateText(baseValue.en, 'ko'),
        translateText(baseValue.en, 'id'),
        translateText(baseValue.en, 'ms'),
        translateText(baseValue.en, 'zh-CN')
      ]);
      
      onUpdateTranslation('th', thText);
      onUpdateTranslation('my', myText);
      onUpdateTranslation('vi', viText);
      onUpdateTranslation('ko', koText);
      onUpdateTranslation('id', idText);
      onUpdateTranslation('ms', msText);
      onUpdateTranslation('zh', zhText);
      setShowLanguages(true); 
    } catch (error) {
      console.error("Translation failed", error);
      alert("Auto-translation failed. Check console for details.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row items-start gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">🇬🇧 {label} (English base)</label>
          {isTextArea ? (
            <textarea rows={2} value={baseValue.en || ''} onChange={(e) => onUpdateTranslation('en', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm" />
          ) : (
            <input type="text" value={baseValue.en || ''} onChange={(e) => onUpdateTranslation('en', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm font-medium" />
          )}
        </div>
        <div className="flex md:flex-col gap-2 shrink-0 md:pt-5 w-full md:w-auto">
          <Button type="button" onClick={handleAutoTranslate} disabled={isTranslating} className="flex-1 md:flex-none bg-[#76FF03] hover:bg-[#5dbb02] text-[#1B5E20] font-bold h-9 text-xs">
            {isTranslating ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} className="mr-1" />} Auto-Translate
          </Button>
          <Button type="button" variant="ghost" onClick={() => setShowLanguages(!showLanguages)} className="flex-1 md:flex-none h-9 md:h-7 text-xs text-gray-500 bg-gray-200 md:bg-transparent">
            <Languages size={12} className="mr-1" /> {showLanguages ? 'Hide' : 'Edit'} Languages
          </Button>
        </div>
      </div>

      {showLanguages && (
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3 bg-white">
          {[
            { key: 'th', label: 'TH' },
            { key: 'my', label: 'MY' },
            { key: 'vi', label: 'VN' },
            { key: 'ko', label: 'KO' },
            { key: 'id', label: 'ID' },
            { key: 'ms', label: 'MS' },
            { key: 'zh', label: 'ZH' }
          ].map(lang => (
            <div key={lang.key} className="flex items-center gap-3">
              <span className="text-xs font-bold w-8 text-center bg-gray-100 p-1 rounded shrink-0">{lang.label}</span>
              {isTextArea ? (
                 <textarea rows={2} value={baseValue[lang.key] || ''} onChange={(e) => onUpdateTranslation(lang.key, e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" />
              ) : (
                 <input type="text" value={baseValue[lang.key] || ''} onChange={(e) => onUpdateTranslation(lang.key, e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}