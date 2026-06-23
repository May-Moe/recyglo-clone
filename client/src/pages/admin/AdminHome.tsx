import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, Layout, Target, Heart, MessageSquareQuote, Plus, Trash2, UploadCloud, GripVertical, Quote, Loader2, Users, Briefcase, Monitor } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState('hero'); 
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- LIVE DATABASE STATE ---
  const [visionData, setVisionData] = useState({
    mission: "",
    vision: "",
    goal: ""
  });

  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  
  // ALL SECTION HEADERS
  const [partnersHeader, setPartnersHeader] = useState({ title: "", description: "" });
  const [testimonialsHeader, setTestimonialsHeader] = useState({ title: "", description: "" });
  const [valuesHeader, setValuesHeader] = useState({ title: "", description: "" });
  const [visionHeader, setVisionHeader] = useState({ title: "", description: "" });
  const [galleryHeader, setGalleryHeader] = useState({ title: "", description: "" });

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]); 
  
  // Services Section State
  const [servicesHeader, setServicesHeader] = useState({
    subtitle: "What We Do",
    title: "Comprehensive Waste & ESG Services"
  });
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);

  // Digital Platforms Section State
  const [platformsHeader, setPlatformsHeader] = useState({
    subtitle: "Technology",
    title: "Digital Platforms"
  });
  const [digitalPlatforms, setDigitalPlatforms] = useState<any[]>([]);

  // --- 1. FETCH INITIAL DATA FROM FIREBASE ON LOAD ---
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const docRef = doc(db, "website_content", "home_page");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          if (data.visionData) setVisionData(data.visionData);
          if (data.heroSlides) setHeroSlides(data.heroSlides);
          if (data.values) setValues(data.values);
          if (data.testimonials) setTestimonials(data.testimonials);
          if (data.galleryImages) setGalleryImages(data.galleryImages);
          if (data.partners) setPartners(data.partners); 
          if (data.servicesHeader) setServicesHeader(data.servicesHeader);
          if (data.featuredServices) setFeaturedServices(data.featuredServices);
          if (data.platformsHeader) setPlatformsHeader(data.platformsHeader);
          if (data.digitalPlatforms) setDigitalPlatforms(data.digitalPlatforms);

          // Fetch Section Headers
          if (data.partnersHeader) setPartnersHeader(data.partnersHeader);
          if (data.testimonialsHeader) setTestimonialsHeader(data.testimonialsHeader);
          if (data.valuesHeader) setValuesHeader(data.valuesHeader);
          if (data.visionHeader) setVisionHeader(data.visionHeader);
          if (data.galleryHeader) setGalleryHeader(data.galleryHeader);
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
        partners, 
        servicesHeader,
        featuredServices,
        platformsHeader,
        digitalPlatforms,
        partnersHeader,
        testimonialsHeader, 
        valuesHeader,
        visionHeader,
        galleryHeader,
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

  // --- HANDLERS FOR UPDATING LOCAL STATE (FIXED WITH `prev =>` TO PREVENT BATCHING BUGS) ---
  const addHeroSlide = () => setHeroSlides(prev => [...prev, { id: `slide-${Date.now()}`, subtitle: "", title: "", description: "", imagePreview: "", button1Text: "", button1Link: "", button2Text: "", button2Link: "" }]);
  const removeHeroSlide = (id: string) => setHeroSlides(prev => prev.filter(s => s.id !== id));
  const updateHeroSlide = (id: string, field: string, value: string) => setHeroSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addValue = () => setValues(prev => [...prev, { id: `val-${Date.now()}`, title: "", desc: "", iconPreview: "" }]);
  const removeValue = (id: string) => setValues(prev => prev.filter(v => v.id !== id));
  const updateValue = (id: string, field: string, value: string) => setValues(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));

  const addTestimonial = () => setTestimonials(prev => [...prev, { id: `test-${Date.now()}`, author: "", organization: "", quote: "", imagePreview: "" }]);
  const removeTestimonial = (id: string) => setTestimonials(prev => prev.filter(t => t.id !== id));
  const updateTestimonial = (id: string, field: string, value: string) => setTestimonials(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));

  const addGalleryImage = () => setGalleryImages(prev => [...prev, { id: `img-${Date.now()}`, preview: "", fileName: "" }]);
  const removeGalleryImage = (id: string) => setGalleryImages(prev => prev.filter(img => img.id !== id));
  const updateGalleryImage = (id: string, field: string, value: string) => setGalleryImages(prev => prev.map(img => img.id === id ? { ...img, [field]: value } : img));

  const addPartner = () => setPartners(prev => [...prev, { id: `partner-${Date.now()}`, imagePreview: "", fileName: "" }]);
  const removePartner = (id: string) => setPartners(prev => prev.filter(p => p.id !== id));
  const updatePartner = (id: string, field: string, value: string) => setPartners(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));

  const addService = () => setFeaturedServices(prev => [...prev, { id: `service-${Date.now()}`, title: "", desc: "", link: "", imagePreview: "" }]);
  const removeService = (id: string) => setFeaturedServices(prev => prev.filter(s => s.id !== id));
  const updateService = (id: string, field: string, value: string) => setFeaturedServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addPlatform = () => setDigitalPlatforms(prev => [...prev, { id: `plat-${Date.now()}`, title: "", desc: "", link: "", imagePreview: "" }]);
  const removePlatform = (id: string) => setDigitalPlatforms(prev => prev.filter(p => p.id !== id));
  const updatePlatform = (id: string, field: string, value: string) => setDigitalPlatforms(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));


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
          <TabButton id="services" label="Featured Services" icon={<Briefcase size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="platforms" label="Digital Platforms" icon={<Monitor size={18} />} activeTab={activeTab} onClick={setActiveTab} />
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
                    
                    {/* DYNAMIC BUTTONS ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Button 1 Text (Left)</label>
                        <input type="text" value={slide.button1Text || ''} onChange={(e) => updateHeroSlide(slide.id, 'button1Text', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="Calculate Carbon Footprint" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Button 1 Link / Path</label>
                        <input type="text" value={slide.button1Link || ''} onChange={(e) => updateHeroSlide(slide.id, 'button1Link', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="/carbon-calculator" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Button 2 Text (Right)</label>
                        <input type="text" value={slide.button2Text || ''} onChange={(e) => updateHeroSlide(slide.id, 'button2Text', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="Our Solutions" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Button 2 Link / Path</label>
                        <input type="text" value={slide.button2Link || ''} onChange={(e) => updateHeroSlide(slide.id, 'button2Link', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="/solutions" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FEATURED SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Featured Services</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the core services displayed on the home page grid.</p>
                </div>
                <Button onClick={addService} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Service
                </Button>
              </div>

              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Small Subtitle</label>
                    <input type="text" value={servicesHeader.subtitle} onChange={(e) => setServicesHeader({...servicesHeader, subtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. What We Do" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={servicesHeader.title} onChange={(e) => setServicesHeader({...servicesHeader, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. Comprehensive Waste & ESG Services" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {featuredServices.length === 0 && <p className="text-gray-400 text-center py-8">No services added yet. Click "Add Service" to begin.</p>}
                
                {featuredServices.map((service) => (
                  <div key={service.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative group">
                    <button onClick={() => removeService(service.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors z-10">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-4 space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Cover Image (1:1 Ratio)</label>
                        <div className="aspect-square w-full">
                          <ImageUploader 
                            preview={service.imagePreview} 
                            onUploadSuccess={(url: string) => updateService(service.id, 'imagePreview', url)} 
                          />
                        </div>
                      </div>
                      <div className="md:col-span-8 space-y-4 pt-1">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Service Title</label>
                          <input type="text" value={service.title} onChange={(e) => updateService(service.id, 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" placeholder="e.g. Waste Management Solutions" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                          <textarea rows={2} value={service.desc} onChange={(e) => updateService(service.id, 'desc', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="Short description for the card..." />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Link (URL Path)</label>
                          <input type="text" value={service.link} onChange={(e) => updateService(service.id, 'link', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. /solutions/waste-management" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL PLATFORMS */}
          {activeTab === 'platforms' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Digital Platforms</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage external links and cards for your software platforms.</p>
                </div>
                <Button onClick={addPlatform} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Platform
                </Button>
              </div>

              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Small Subtitle</label>
                    <input type="text" value={platformsHeader.subtitle} onChange={(e) => setPlatformsHeader({...platformsHeader, subtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. Technology" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={platformsHeader.title} onChange={(e) => setPlatformsHeader({...platformsHeader, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. Digital Platforms" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {digitalPlatforms.length === 0 && <p className="text-gray-400 text-center py-8">No platforms added yet. Click "Add Platform" to begin.</p>}
                
                {digitalPlatforms.map((plat) => (
                  <div key={plat.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative group">
                    <button onClick={() => removePlatform(plat.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors z-10">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-5 space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Preview Image (16:9 Ratio)</label>
                        <div className="aspect-video w-full">
                          <ImageUploader 
                            preview={plat.imagePreview} 
                            onUploadSuccess={(url: string) => updatePlatform(plat.id, 'imagePreview', url)} 
                          />
                        </div>
                      </div>
                      <div className="md:col-span-7 space-y-4 pt-1">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Platform Name</label>
                          <input type="text" value={plat.title} onChange={(e) => updatePlatform(plat.id, 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" placeholder="e.g. SanaTerra" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                          <textarea rows={2} value={plat.desc} onChange={(e) => updatePlatform(plat.id, 'desc', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="Enterprise carbon tracking..." />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">External Link (URL)</label>
                          <input type="text" value={plat.link} onChange={(e) => updatePlatform(plat.id, 'link', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="https://sanaterra.co" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PARTNERS */}
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

              {/* SECTION HEADERS FOR PARTNERS */}
              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={partnersHeader.title} onChange={(e) => setPartnersHeader({...partnersHeader, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. Trusted by Global Brands" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                    <textarea rows={2} value={partnersHeader.description} onChange={(e) => setPartnersHeader({...partnersHeader, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="Optional short description under the title..." />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="relative group bg-gray-50 rounded-xl border border-gray-200 p-2 flex flex-col gap-2">
                    <div className="aspect-video relative">
                      <ImageUploader 
                        preview={partner.imagePreview} 
                        onUploadSuccess={(url: string, fileName: string) => {
                          updatePartner(partner.id, 'imagePreview', url);
                          if(fileName) updatePartner(partner.id, 'fileName', fileName);
                        }}
                      />
                      <button 
                        onClick={() => removePartner(partner.id)}
                        className="absolute top-1 right-1 bg-white text-red-500 p-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {/* Editable Extracted File Name Field */}
                    <input 
                      type="text" 
                      value={partner.fileName || ''} 
                      onChange={(e) => updatePartner(partner.id, 'fileName', e.target.value)} 
                      className="w-full text-xs text-center px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white text-gray-600" 
                      placeholder="Upload to see filename" 
                    />
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

          {/* TAB 5: STRATEGIC VISION */}
          {activeTab === 'vision' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Strategic Vision</h2>
                <p className="text-sm text-gray-500">Edit the main title, description, and the three vision blocks.</p>
              </div>

              {/* SECTION HEADERS FOR VISION */}
              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={visionHeader.title} onChange={(e) => setVisionHeader({...visionHeader, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. Our Strategic Vision" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                    <textarea rows={2} value={visionHeader.description} onChange={(e) => setVisionHeader({...visionHeader, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="Optional short description..." />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Our Mission Block</label>
                <textarea rows={4} value={visionData.mission} onChange={(e) => setVisionData({...visionData, mission: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700">Our Vision Block</label>
                <textarea rows={4} value={visionData.vision} onChange={(e) => setVisionData({...visionData, vision: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700">Our Goal Block</label>
                <textarea rows={6} value={visionData.goal} onChange={(e) => setVisionData({...visionData, goal: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-gray-50 focus:bg-white transition-colors" />
              </div>
            </div>
          )}

          {/* TAB 6: OUR VALUES */}
          {activeTab === 'values' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Our Values</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the section title and the core values grid displayed on your home page.</p>
                </div>
                <Button onClick={addValue} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Value
                </Button>
              </div>

              {/* SECTION HEADERS FOR VALUES */}
              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={valuesHeader.title} onChange={(e) => setValuesHeader({...valuesHeader, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. Our Values" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                    <textarea rows={2} value={valuesHeader.description} onChange={(e) => setValuesHeader({...valuesHeader, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="Optional short description..." />
                  </div>
                </div>
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

          {/* TAB 7: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the title, description, and client quotes.</p>
                </div>
                <Button onClick={addTestimonial} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Testimonial
                </Button>
              </div>

              {/* TESTIMONIAL HEADER INPUTS */}
              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input 
                      type="text" 
                      value={testimonialsHeader.title} 
                      onChange={(e) => setTestimonialsHeader({...testimonialsHeader, title: e.target.value})} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" 
                      placeholder="e.g. What Our Clients Say" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea 
                      rows={2} 
                      value={testimonialsHeader.description} 
                      onChange={(e) => setTestimonialsHeader({...testimonialsHeader, description: e.target.value})} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" 
                      placeholder="e.g. Hear directly from industry leaders..." 
                    />
                  </div>
                </div>
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

          {/* TAB 8: IMPACT GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Impact Gallery</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the grid of images and the section title.</p>
                </div>
                <Button onClick={addGalleryImage} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Image Box
                </Button>
              </div>

              {/* SECTION HEADERS FOR GALLERY */}
              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={galleryHeader.title} onChange={(e) => setGalleryHeader({...galleryHeader, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. Impact in Action" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                    <textarea rows={2} value={galleryHeader.description} onChange={(e) => setGalleryHeader({...galleryHeader, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="Optional short description..." />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map((img) => (
                  <div key={img.id} className="relative group bg-gray-50 rounded-xl border border-gray-200 p-2 flex flex-col gap-2">
                    <div className="aspect-square relative">
                      <ImageUploader 
                        preview={img.preview} 
                        onUploadSuccess={(url: string, fileName: string) => {
                          updateGalleryImage(img.id, 'preview', url);
                          if(fileName) updateGalleryImage(img.id, 'fileName', fileName);
                        }}
                      />
                      <button 
                        onClick={() => removeGalleryImage(img.id)}
                        className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {/* Editable Extracted File Name Field */}
                    <input 
                      type="text" 
                      value={img.fileName || ''} 
                      onChange={(e) => updateGalleryImage(img.id, 'fileName', e.target.value)} 
                      className="w-full text-xs text-center px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white text-gray-600" 
                      placeholder="Upload to see filename" 
                    />
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
      if (onUploadSuccess) onUploadSuccess(url, file.name);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed! Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`
      border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors w-full h-full
      ${circle ? 'rounded-full aspect-square' : 'rounded-xl min-h-[100px]'}
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
          <img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" alt="Preview" />
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