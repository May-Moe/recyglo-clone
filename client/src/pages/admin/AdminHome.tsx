import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, Layout, Target, Heart, MessageSquareQuote, Plus, Trash2, UploadCloud, GripVertical, Quote, Loader2, Users } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- LIVE DATABASE STATE (Starts empty, waiting for Firebase) ---
  const [visionData, setVisionData] = useState({
    mission: "",
    vision: "",
    goal: ""
  });

  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]); // NEW: Partners state

  // --- 1. FETCH INITIAL DATA FROM FIREBASE ON LOAD ---
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const docRef = doc(db, "website_content", "home_page");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          if (data.visionData) setVisionData(data.visionData);
          if (data.heroSlides && data.heroSlides.length > 0) setHeroSlides(data.heroSlides);
          if (data.values && data.values.length > 0) setValues(data.values);
          if (data.testimonials && data.testimonials.length > 0) setTestimonials(data.testimonials);
          if (data.galleryImages && data.galleryImages.length > 0) setGalleryImages(data.galleryImages);
          if (data.partners && data.partners.length > 0) setPartners(data.partners); // Load partners
        }
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // --- 2. SAVE EVERYTHING TO FIREBASE ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "website_content", "home_page");
      await setDoc(docRef, {
        visionData,
        heroSlides,
        values,
        testimonials,
        galleryImages,
        partners, // Save partners
        lastUpdated: new Date()
      }, { merge: true });

      alert("Home Page successfully updated in the database!");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save changes. Check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- HANDLERS FOR UPDATING LOCAL STATE ---
  const addHeroSlide = () => setHeroSlides([...heroSlides, { id: `slide-${Date.now()}`, subtitle: "", title: "", description: "", imagePreview: "" }]);
  const removeHeroSlide = (id: string) => setHeroSlides(heroSlides.filter(s => s.id !== id));
  const updateHeroSlide = (id: string, field: string, value: string) => setHeroSlides(heroSlides.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addValue = () => setValues([...values, { id: `val-${Date.now()}`, title: "", desc: "", iconPreview: "" }]);
  const removeValue = (id: string) => setValues(values.filter(v => v.id !== id));
  const updateValue = (id: string, field: string, value: string) => setValues(values.map(v => v.id === id ? { ...v, [field]: value } : v));

  const addTestimonial = () => setTestimonials([...testimonials, { id: `test-${Date.now()}`, author: "", organization: "", quote: "", imagePreview: "" }]);
  const removeTestimonial = (id: string) => setTestimonials(testimonials.filter(t => t.id !== id));
  const updateTestimonial = (id: string, field: string, value: string) => setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t));

  const addGalleryImage = () => setGalleryImages([...galleryImages, { id: `img-${Date.now()}`, preview: "" }]);
  const removeGalleryImage = (id: string) => setGalleryImages(galleryImages.filter(img => img.id !== id));
  const updateGalleryImage = (id: string, value: string) => setGalleryImages(galleryImages.map(img => img.id === id ? { ...img, preview: value } : img));

  // Handlers for Partners
  const addPartner = () => setPartners([...partners, { id: `partner-${Date.now()}`, imagePreview: "" }]);
  const removePartner = (id: string) => setPartners(partners.filter(p => p.id !== id));
  const updatePartner = (id: string, value: string) => setPartners(partners.map(p => p.id === id ? { ...p, imagePreview: value } : p));


  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Home Page</h1>
          <p className="text-gray-500 text-sm">Update the static content, sliders, and images on your landing page.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2 px-6"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving to Database...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE: Tab Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <TabButton id="hero" label="Hero Slideshow" icon={<Layout size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="partners" label="Trusted Partners" icon={<Users size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="vision" label="Strategic Vision" icon={<Target size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="values" label="Our Values" icon={<Heart size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="testimonials" label="Testimonials" icon={<MessageSquareQuote size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="gallery" label="Impact Gallery" icon={<ImageIcon size={18} />} activeTab={activeTab} onClick={setActiveTab} />
        </div>

        {/* RIGHT SIDE: Editor Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[500px]">
          
          {/* TAB 1: HERO SLIDESHOW */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Hero Slideshow</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the main sliding banners at the top of your website.</p>
                </div>
                <Button onClick={addHeroSlide} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Slide
                </Button>
              </div>

              <div className="space-y-8">
                {heroSlides.length === 0 && <p className="text-gray-400 text-center py-8">No slides added yet. Click "Add Slide" to begin.</p>}
                
                {heroSlides.map((slide, index) => (
                  <div key={slide.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative group">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className="text-gray-400 cursor-grab" size={20} />
                        <h3 className="font-bold text-gray-700 text-lg">Slide {index + 1}</h3>
                      </div>
                      <button onClick={() => removeHeroSlide(slide.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-4 space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Background Image</label>
                        <ImageUploader 
                          preview={slide.imagePreview} 
                          onUploadSuccess={(url: string) => updateHeroSlide(slide.id, 'imagePreview', url)} 
                        />
                      </div>
                      <div className="md:col-span-8 space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Small Subtitle</label>
                          <input type="text" value={slide.subtitle} onChange={(e) => updateHeroSlide(slide.id, 'subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-white" placeholder="e.g. Zero Waste to Landfill" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Main Heading</label>
                          <input type="text" value={slide.title} onChange={(e) => updateHeroSlide(slide.id, 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-white font-bold" placeholder="e.g. Circular Economy Strategies" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                          <textarea rows={3} value={slide.description} onChange={(e) => updateHeroSlide(slide.id, 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-white" placeholder="Enter paragraph text..." />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PARTNERS */}
          {activeTab === 'partners' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Trusted Partners & Brands</h2>
                  <p className="text-sm text-gray-500 mt-1">Upload logos of the brands and organizations you work with.</p>
                </div>
                <Button onClick={addPartner} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Logo
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="aspect-video relative group bg-gray-50 rounded-xl border border-gray-200 p-2">
                    <ImageUploader 
                      preview={partner.imagePreview} 
                      onUploadSuccess={(url: string) => updatePartner(partner.id, url)}
                    />
                    <button 
                      onClick={() => removePartner(partner.id)}
                      className="absolute top-1 right-1 bg-white text-red-500 p-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <div 
                  onClick={addPartner}
                  className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#1B5E20] transition-colors text-gray-400 hover:text-[#1B5E20]"
                >
                  <Plus size={24} className="mb-2" />
                  <span className="text-xs font-medium">Add Logo</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRATEGIC VISION */}
          {activeTab === 'vision' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Strategic Vision</h2>
                <p className="text-sm text-gray-500">Edit the three main vision blocks shown on the dark green background.</p>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Our Mission</label>
                <textarea rows={4} value={visionData.mission} onChange={(e) => setVisionData({...visionData, mission: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700">Our Vision</label>
                <textarea rows={4} value={visionData.vision} onChange={(e) => setVisionData({...visionData, vision: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700">Our Goal</label>
                <textarea rows={6} value={visionData.goal} onChange={(e) => setVisionData({...visionData, goal: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-gray-50 focus:bg-white transition-colors" />
              </div>
            </div>
          )}

          {/* TAB 4: OUR VALUES */}
          {activeTab === 'values' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Our Values</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the core values grid displayed on your home page.</p>
                </div>
                <Button onClick={addValue} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Value
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.length === 0 && <p className="text-gray-400 py-8 col-span-2 text-center">No values added yet.</p>}
                
                {values.map((val) => (
                  <div key={val.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative group">
                    <button onClick={() => removeValue(val.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <div className="flex gap-4 mb-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <ImageUploader 
                          preview={val.iconPreview} 
                          circle 
                          small 
                          onUploadSuccess={(url: string) => updateValue(val.id, 'iconPreview', url)}
                        />
                      </div>
                      <div className="flex-1 mt-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Value Title</label>
                        <input type="text" value={val.title} onChange={(e) => updateValue(val.id, 'title', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. Environmental Stewardship" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                      <textarea rows={3} value={val.desc} onChange={(e) => updateValue(val.id, 'desc', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="Enter description..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
                  <p className="text-sm text-gray-500 mt-1">Add or edit client quotes to build trust.</p>
                </div>
                <Button onClick={addTestimonial} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Testimonial
                </Button>
              </div>

              <div className="space-y-6">
                {testimonials.length === 0 && <p className="text-gray-400 py-8 text-center">No testimonials added yet.</p>}

                {testimonials.map((test) => (
                  <div key={test.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative group flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
                      <ImageUploader 
                        preview={test.imagePreview} 
                        circle 
                        onUploadSuccess={(url: string) => updateTestimonial(test.id, 'imagePreview', url)}
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-4 flex-1 pr-8">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Author Name</label>
                            <input type="text" value={test.author} onChange={(e) => updateTestimonial(test.id, 'author', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. John Doe" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Organization / Title</label>
                            <input type="text" value={test.organization} onChange={(e) => updateTestimonial(test.id, 'organization', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. Partner, French Embassy" />
                          </div>
                        </div>
                        <button onClick={() => removeTestimonial(test.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1"><Quote size={12}/> Quote</label>
                        <textarea rows={3} value={test.quote} onChange={(e) => updateTestimonial(test.id, 'quote', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20] bg-white italic" placeholder="Enter their quote here..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: IMPACT GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Impact Gallery</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the grid of images showing your team and impact in action.</p>
                </div>
                <Button onClick={addGalleryImage} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Image Box
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map((img) => (
                  <div key={img.id} className="aspect-square relative group">
                    <ImageUploader 
                      preview={img.preview} 
                      onUploadSuccess={(url: string) => updateGalleryImage(img.id, url)}
                    />
                    <button 
                      onClick={() => removeGalleryImage(img.id)}
                      className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                <div 
                  onClick={addGalleryImage}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#1B5E20] transition-colors text-gray-400 hover:text-[#1B5E20]"
                >
                  <Plus size={32} className="mb-2" />
                  <span className="text-sm font-medium">Add Image Box</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// --- REUSABLE UI COMPONENTS ---

function TabButton({ id, label, icon, activeTab, onClick }: any) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
        isActive ? 'bg-[#1B5E20] text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className={isActive ? 'text-[#76FF03]' : 'text-gray-400'}>{icon}</span>
      {label}
    </button>
  );
}

function ImageUploader({ preview, circle, small, onUploadSuccess }: any) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileRef = ref(storage, `home-page/${Date.now()}_${file.name}`);
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
    <div className={`
      border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors
      ${circle ? 'rounded-full aspect-square' : 'rounded-xl h-full w-full min-h-[100px]'}
    `}>
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />

      {isUploading ? (
        <div className="flex flex-col items-center justify-center p-2 text-[#1B5E20]">
          <Loader2 className="animate-spin mb-2" size={small ? 20 : 32} />
          {!small && <span className="text-xs font-bold">Uploading...</span>}
        </div>
      ) : preview ? (
        <>
          <img src={preview} className="w-full h-full object-contain opacity-80 group-hover/upload:opacity-40 transition-opacity" alt="Preview" />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
            <UploadCloud className="text-[#1B5E20] mb-1" size={small ? 16 : 24} />
            {!small && <span className="text-xs font-bold text-[#1B5E20]">Change</span>}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-center text-gray-400">
          <ImageIcon size={small ? 20 : 32} className="mb-1" />
          {!small && <span className="text-xs font-medium">Upload Image</span>}
        </div>
      )}
    </div>
  );
}