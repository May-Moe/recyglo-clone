import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, Layout, Target, Heart, MessageSquareQuote, Plus, Trash2, UploadCloud, GripVertical, Quote, Loader2, Users, Briefcase, Monitor, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Languages, Wand2, FileText, ExternalLink } from "lucide-react";
import { doc, getDoc, setDoc, collection, onSnapshot, query, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Link } from 'wouter';

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState('hero'); 
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- LIVE DATABASE STATE ---
  const [visionData, setVisionData] = useState<any>({ mission: "", vision: "", goal: "" });
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  
  // ALL SECTION HEADERS
  const [partnersHeader, setPartnersHeader] = useState<any>({ title: "", description: "" });
  const [testimonialsHeader, setTestimonialsHeader] = useState<any>({ title: "", description: "" });
  const [visionHeader, setVisionHeader] = useState<any>({ title: "", description: "" });
  const [galleryHeader, setGalleryHeader] = useState<any>({ title: "", description: "" });
  const [servicesHeader, setServicesHeader] = useState<any>({ subtitle: "What We Do", title: "Comprehensive Waste & ESG Services" });
  const [platformsHeader, setPlatformsHeader] = useState<any>({ subtitle: "Technology", title: "Digital Platforms" });
  const [blogHeader, setBlogHeader] = useState<any>({ title: "Blog" }); 

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]); 
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [digitalPlatforms, setDigitalPlatforms] = useState<any[]>([]);
  
  // --- FETCHED LIVE BLOGS ---
  const [latestArticles, setLatestArticles] = useState<any[]>([]);

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
          if (data.testimonials) setTestimonials(data.testimonials);
          if (data.galleryImages) setGalleryImages(data.galleryImages);
          if (data.partners) setPartners(data.partners); 
          if (data.servicesHeader) setServicesHeader(data.servicesHeader);
          if (data.featuredServices) setFeaturedServices(data.featuredServices);
          if (data.platformsHeader) setPlatformsHeader(data.platformsHeader);
          if (data.digitalPlatforms) setDigitalPlatforms(data.digitalPlatforms);

          if (data.partnersHeader) setPartnersHeader(data.partnersHeader);
          if (data.testimonialsHeader) setTestimonialsHeader(data.testimonialsHeader);
          if (data.visionHeader) setVisionHeader(data.visionHeader);
          if (data.galleryHeader) setGalleryHeader(data.galleryHeader);
          if (data.blogHeader) setBlogHeader(data.blogHeader); 
        }

        // Fetch the 3 most recent articles for the preview
        const q = query(collection(db, "articles"));
        const unsubArticles = onSnapshot(q, (snapshot) => {
          const loaded: any[] = [];
          snapshot.forEach(doc => loaded.push({ id: doc.id, ...doc.data() }));
          setLatestArticles(loaded.reverse().slice(0, 3));
        });

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
        visionData, heroSlides, testimonials, galleryImages, partners, 
        servicesHeader, featuredServices, platformsHeader, digitalPlatforms,
        partnersHeader, testimonialsHeader, visionHeader, galleryHeader, blogHeader,
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
  
  // HERO SLIDES
  const addHeroSlide = () => setHeroSlides(prev => [...prev, { id: `slide-${Date.now()}` }]);
  const removeHeroSlide = (id: string) => setHeroSlides(prev => prev.filter(s => s.id !== id));
  const updateHeroSlide = (id: string, field: string, value: string) => setHeroSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  const moveHeroSlide = (index: number, direction: 'up' | 'down') => {
    setHeroSlides(prev => {
      const newArr = [...prev];
      if (direction === 'up' && index > 0) [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      else if (direction === 'down' && index < newArr.length - 1) [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  // TESTIMONIALS
  const addTestimonial = () => setTestimonials(prev => [...prev, { id: `test-${Date.now()}` }]);
  const removeTestimonial = (id: string) => setTestimonials(prev => prev.filter(t => t.id !== id));
  const updateTestimonial = (id: string, field: string, value: string) => setTestimonials(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  const moveTestimonial = (index: number, direction: 'up' | 'down') => {
    setTestimonials(prev => {
      const newArr = [...prev];
      if (direction === 'up' && index > 0) [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      else if (direction === 'down' && index < newArr.length - 1) [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  // GALLERY IMAGES
  const addGalleryImage = () => setGalleryImages(prev => [...prev, { id: `img-${Date.now()}` }]);
  const removeGalleryImage = (id: string) => setGalleryImages(prev => prev.filter(img => img.id !== id));
  const updateGalleryImage = (id: string, field: string, value: string) => setGalleryImages(prev => prev.map(img => img.id === id ? { ...img, [field]: value } : img));
  const moveGalleryImage = (index: number, direction: 'left' | 'right') => {
    setGalleryImages(prev => {
      const newArr = [...prev];
      if (direction === 'left' && index > 0) [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      else if (direction === 'right' && index < newArr.length - 1) [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  // PARTNERS
  const addPartner = () => setPartners(prev => [...prev, { id: `partner-${Date.now()}` }]);
  const removePartner = (id: string) => setPartners(prev => prev.filter(p => p.id !== id));
  const updatePartner = (id: string, field: string, value: string) => setPartners(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  const movePartner = (index: number, direction: 'left' | 'right') => {
    setPartners(prev => {
      const newArr = [...prev];
      if (direction === 'left' && index > 0) [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      else if (direction === 'right' && index < newArr.length - 1) [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  // SERVICES
  const addService = () => setFeaturedServices(prev => [...prev, { id: `service-${Date.now()}` }]);
  const removeService = (id: string) => setFeaturedServices(prev => prev.filter(s => s.id !== id));
  const updateService = (id: string, field: string, value: string) => setFeaturedServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  const moveService = (index: number, direction: 'up' | 'down') => {
    setFeaturedServices(prev => {
      const newArr = [...prev];
      if (direction === 'up' && index > 0) [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      else if (direction === 'down' && index < newArr.length - 1) [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  // PLATFORMS
  const addPlatform = () => setDigitalPlatforms(prev => [...prev, { id: `plat-${Date.now()}` }]);
  const removePlatform = (id: string) => setDigitalPlatforms(prev => prev.filter(p => p.id !== id));
  const updatePlatform = (id: string, field: string, value: string) => setDigitalPlatforms(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  const movePlatform = (index: number, direction: 'up' | 'down') => {
    setDigitalPlatforms(prev => {
      const newArr = [...prev];
      if (direction === 'up' && index > 0) [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      else if (direction === 'down' && index < newArr.length - 1) [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };


  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Home Page</h1>
          <p className="text-gray-500 text-sm">Update the static content, sliders, and images on your landing page.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2 px-6">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />} Save All Changes
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
          <TabButton id="testimonials" label="Testimonials" icon={<MessageSquareQuote size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="gallery" label="Impact Gallery" icon={<ImageIcon size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="blog" label="Blog Section" icon={<FileText size={18} />} activeTab={activeTab} onClick={setActiveTab} />
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
                <Button onClick={addHeroSlide} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10"><Plus size={16} className="mr-2" /> Add Slide</Button>
              </div>

              <div className="space-y-8">
                {heroSlides.length === 0 && <p className="text-gray-400 text-center py-8">No slides added yet.</p>}
                {heroSlides.map((slide, index) => (
                  <div key={slide.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative group">
                    
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 pr-3 border-r border-gray-200 opacity-30 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveHeroSlide(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp size={16}/></button>
                          <button onClick={() => moveHeroSlide(index, 'down')} disabled={index === heroSlides.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown size={16}/></button>
                        </div>
                        <h3 className="font-bold text-gray-700 text-lg">Slide {index + 1}</h3>
                      </div>
                      <button onClick={() => removeHeroSlide(slide.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"><Trash2 size={18} /></button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
                      <div className="lg:col-span-4 flex flex-col gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Background Image</label>
                          <div className="h-[250px] w-full rounded-xl overflow-hidden shadow-sm">
                            <ImageUploader preview={slide.imagePreview} onUploadSuccess={(url: string) => updateHeroSlide(slide.id, 'imagePreview', url)} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Image Alt Text (SEO)</label>
                          <input type="text" value={slide.altText || ''} onChange={(e) => updateHeroSlide(slide.id, 'altText', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="e.g. RecyGlo Team collecting waste" />
                        </div>
                      </div>
                      
                      <div className="lg:col-span-8 space-y-5">
                        <TranslatableField 
                          label="Small Subtitle"
                          baseValue={{ en: slide.subtitle_en || slide.subtitle, th: slide.subtitle_th, my: slide.subtitle_my, vi: slide.subtitle_vi, ko: slide.subtitle_ko, id: slide.subtitle_id, ms: slide.subtitle_ms, zh: slide.subtitle_zh }}
                          onUpdateTranslation={(lang: string, val: string) => updateHeroSlide(slide.id, `subtitle_${lang}`, val)}
                        />
                        <TranslatableField 
                          label="Main Heading"
                          baseValue={{ en: slide.title_en || slide.title, th: slide.title_th, my: slide.title_my, vi: slide.title_vi, ko: slide.title_ko, id: slide.title_id, ms: slide.title_ms, zh: slide.title_zh }}
                          onUpdateTranslation={(lang: string, val: string) => updateHeroSlide(slide.id, `title_${lang}`, val)}
                        />
                        <TranslatableField 
                          label="Description"
                          isTextArea={true}
                          baseValue={{ en: slide.description_en || slide.description, th: slide.description_th, my: slide.description_my, vi: slide.description_vi, ko: slide.description_ko, id: slide.description_id, ms: slide.description_ms, zh: slide.description_zh }}
                          onUpdateTranslation={(lang: string, val: string) => updateHeroSlide(slide.id, `description_${lang}`, val)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-6">
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
                        <input type="text" value={slide.button2Link || ''} onChange={(e) => updateHeroSlide(slide.id, 'button2Link', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="/services" />
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
                <TranslatableField 
                  label="Small Subtitle"
                  baseValue={{ en: servicesHeader.subtitle_en || servicesHeader.subtitle, th: servicesHeader.subtitle_th, my: servicesHeader.subtitle_my, vi: servicesHeader.subtitle_vi, ko: servicesHeader.subtitle_ko, id: servicesHeader.subtitle_id, ms: servicesHeader.subtitle_ms, zh: servicesHeader.subtitle_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setServicesHeader({...servicesHeader, [`subtitle_${lang}`]: val})}
                />
                <TranslatableField 
                  label="Main Title"
                  baseValue={{ en: servicesHeader.title_en || servicesHeader.title, th: servicesHeader.title_th, my: servicesHeader.title_my, vi: servicesHeader.title_vi, ko: servicesHeader.title_ko, id: servicesHeader.title_id, ms: servicesHeader.title_ms, zh: servicesHeader.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setServicesHeader({...servicesHeader, [`title_${lang}`]: val})}
                />
              </div>

              <div className="space-y-6">
                {featuredServices.length === 0 && <p className="text-gray-400 text-center py-8">No services added yet.</p>}
                {featuredServices.map((service, index) => (
                  <div key={service.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative group">
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white shadow-sm border border-gray-100 rounded-lg p-1">
                      <button onClick={() => moveService(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-[#1B5E20] p-1.5 rounded disabled:opacity-30"><ArrowUp size={16} /></button>
                      <button onClick={() => moveService(index, 'down')} disabled={index === featuredServices.length - 1} className="text-gray-400 hover:text-[#1B5E20] p-1.5 rounded disabled:opacity-30"><ArrowDown size={16} /></button>
                      <div className="w-[1px] bg-gray-200 mx-1"></div>
                      <button onClick={() => removeService(service.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded"><Trash2 size={16} /></button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-4 flex flex-col gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image (1:1 Ratio)</label>
                          <div className="aspect-square w-full rounded-xl overflow-hidden shadow-sm">
                            <ImageUploader preview={service.imagePreview} onUploadSuccess={(url: string) => updateService(service.id, 'imagePreview', url)} />
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-8 space-y-5">
                        <TranslatableField 
                          label="Service Title"
                          baseValue={{ en: service.title_en || service.title, th: service.title_th, my: service.title_my, vi: service.title_vi, ko: service.title_ko, id: service.title_id, ms: service.title_ms, zh: service.title_zh }}
                          onUpdateTranslation={(lang: string, val: string) => updateService(service.id, `title_${lang}`, val)}
                        />
                        <TranslatableField 
                          label="Description"
                          isTextArea={true}
                          baseValue={{ en: service.desc_en || service.desc, th: service.desc_th, my: service.desc_my, vi: service.desc_vi, ko: service.desc_ko, id: service.desc_id, ms: service.desc_ms, zh: service.desc_zh }}
                          onUpdateTranslation={(lang: string, val: string) => updateService(service.id, `desc_${lang}`, val)}
                        />
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Link (URL Path)</label>
                          <input type="text" value={service.link} onChange={(e) => updateService(service.id, 'link', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. /services/waste-management" />
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
                <Button onClick={addPlatform} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10"><Plus size={16} className="mr-2" /> Add Platform</Button>
              </div>

              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <TranslatableField 
                  label="Small Subtitle"
                  baseValue={{ en: platformsHeader.subtitle_en || platformsHeader.subtitle, th: platformsHeader.subtitle_th, my: platformsHeader.subtitle_my, vi: platformsHeader.subtitle_vi, ko: platformsHeader.subtitle_ko, id: platformsHeader.subtitle_id, ms: platformsHeader.subtitle_ms, zh: platformsHeader.subtitle_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setPlatformsHeader({...platformsHeader, [`subtitle_${lang}`]: val})}
                />
                <TranslatableField 
                  label="Main Title"
                  baseValue={{ en: platformsHeader.title_en || platformsHeader.title, th: platformsHeader.title_th, my: platformsHeader.title_my, vi: platformsHeader.title_vi, ko: platformsHeader.title_ko, id: platformsHeader.title_id, ms: platformsHeader.title_ms, zh: platformsHeader.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setPlatformsHeader({...platformsHeader, [`title_${lang}`]: val})}
                />
              </div>

              <div className="space-y-6">
                {digitalPlatforms.length === 0 && <p className="text-gray-400 text-center py-8">No platforms added yet.</p>}
                {digitalPlatforms.map((plat, index) => (
                  <div key={plat.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative group">
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white shadow-sm border border-gray-100 rounded-lg p-1">
                      <button onClick={() => movePlatform(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-[#1B5E20] p-1.5 rounded disabled:opacity-30"><ArrowUp size={16} /></button>
                      <button onClick={() => movePlatform(index, 'down')} disabled={index === digitalPlatforms.length - 1} className="text-gray-400 hover:text-[#1B5E20] p-1.5 rounded disabled:opacity-30"><ArrowDown size={16} /></button>
                      <div className="w-[1px] bg-gray-200 mx-1"></div>
                      <button onClick={() => removePlatform(plat.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded"><Trash2 size={16} /></button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-5 flex flex-col gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Preview Image (16:9 Ratio)</label>
                          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm">
                            <ImageUploader preview={plat.imagePreview} onUploadSuccess={(url: string) => updatePlatform(plat.id, 'imagePreview', url)} />
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-7 space-y-5">
                        <TranslatableField 
                          label="Platform Name"
                          baseValue={{ en: plat.title_en || plat.title, th: plat.title_th, my: plat.title_my, vi: plat.title_vi, ko: plat.title_ko, id: plat.title_id, ms: plat.title_ms, zh: plat.title_zh }}
                          onUpdateTranslation={(lang: string, val: string) => updatePlatform(plat.id, `title_${lang}`, val)}
                        />
                        <TranslatableField 
                          label="Description"
                          isTextArea={true}
                          baseValue={{ en: plat.desc_en || plat.desc, th: plat.desc_th, my: plat.desc_my, vi: plat.desc_vi, ko: plat.desc_ko, id: plat.desc_id, ms: plat.desc_ms, zh: plat.desc_zh }}
                          onUpdateTranslation={(lang: string, val: string) => updatePlatform(plat.id, `desc_${lang}`, val)}
                        />
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
                  <p className="text-sm text-gray-500 mt-1">Upload logos of the brands and organizations you work with. Use arrows to reorder.</p>
                </div>
                <Button onClick={addPartner} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Logo
                </Button>
              </div>

              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <TranslatableField 
                  label="Main Title"
                  baseValue={{ en: partnersHeader.title_en || partnersHeader.title, th: partnersHeader.title_th, my: partnersHeader.title_my, vi: partnersHeader.title_vi, ko: partnersHeader.title_ko, id: partnersHeader.title_id, ms: partnersHeader.title_ms, zh: partnersHeader.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setPartnersHeader({...partnersHeader, [`title_${lang}`]: val})}
                />
                <TranslatableField 
                  label="Description"
                  isTextArea={true}
                  baseValue={{ en: partnersHeader.description_en || partnersHeader.description, th: partnersHeader.description_th, my: partnersHeader.description_my, vi: partnersHeader.description_vi, ko: partnersHeader.description_ko, id: partnersHeader.description_id, ms: partnersHeader.description_ms, zh: partnersHeader.description_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setPartnersHeader({...partnersHeader, [`description_${lang}`]: val})}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {partners.map((partner, index) => (
                  <div key={partner.id} className="relative group bg-gray-50 rounded-xl border border-gray-200 p-2 flex flex-col gap-2">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <ImageUploader preview={partner.imagePreview} onUploadSuccess={(url: string, fileName: string) => { updatePartner(partner.id, 'imagePreview', url); if(fileName) updatePartner(partner.id, 'fileName', fileName); }} />
                      
                      {/* REORDER ARROWS - LEFT/RIGHT */}
                      <div className="absolute top-0 right-0 left-0 p-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="flex gap-1">
                          <button onClick={() => movePartner(index, 'left')} disabled={index === 0} className="bg-white/90 backdrop-blur text-gray-600 p-1.5 rounded-md shadow-sm hover:bg-[#1B5E20] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all"><ArrowLeft size={14} /></button>
                          <button onClick={() => movePartner(index, 'right')} disabled={index === partners.length - 1} className="bg-white/90 backdrop-blur text-gray-600 p-1.5 rounded-md shadow-sm hover:bg-[#1B5E20] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all"><ArrowRight size={14} /></button>
                        </div>
                        <button onClick={() => removePartner(partner.id)} className="bg-white/90 backdrop-blur text-red-500 p-1.5 rounded-md shadow-sm hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <input type="text" value={partner.altText || ''} onChange={(e) => updatePartner(partner.id, 'altText', e.target.value)} className="w-full text-xs text-center px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white text-gray-900 font-medium" placeholder="Alt Text (SEO)" />
                    <input type="text" value={partner.fileName || ''} onChange={(e) => updatePartner(partner.id, 'fileName', e.target.value)} className="w-full text-[10px] text-center px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-transparent text-gray-400" placeholder="Upload to see filename" />
                  </div>
                ))}
                <div onClick={addPartner} className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#1B5E20] transition-colors text-gray-400 hover:text-[#1B5E20]"><Plus size={24} className="mb-2" /><span className="text-xs font-medium">Add Logo</span></div>
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
              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <TranslatableField 
                  label="Main Title"
                  baseValue={{ en: visionHeader.title_en || visionHeader.title, th: visionHeader.title_th, my: visionHeader.title_my, vi: visionHeader.title_vi, ko: visionHeader.title_ko, id: visionHeader.title_id, ms: visionHeader.title_ms, zh: visionHeader.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setVisionHeader({...visionHeader, [`title_${lang}`]: val})}
                />
                <TranslatableField 
                  label="Description"
                  isTextArea={true}
                  baseValue={{ en: visionHeader.description_en || visionHeader.description, th: visionHeader.description_th, my: visionHeader.description_my, vi: visionHeader.description_vi, ko: visionHeader.description_ko, id: visionHeader.description_id, ms: visionHeader.description_ms, zh: visionHeader.description_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setVisionHeader({...visionHeader, [`description_${lang}`]: val})}
                />
              </div>
              
              <div className="space-y-6 border-t border-gray-100 pt-6">
                <TranslatableField 
                  label="Our Mission Block"
                  isTextArea={true}
                  baseValue={{ en: visionData.mission_en || visionData.mission, th: visionData.mission_th, my: visionData.mission_my, vi: visionData.mission_vi, ko: visionData.mission_ko, id: visionData.mission_id, ms: visionData.mission_ms, zh: visionData.mission_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setVisionData({...visionData, [`mission_${lang}`]: val})}
                />
                <TranslatableField 
                  label="Our Vision Block"
                  isTextArea={true}
                  baseValue={{ en: visionData.vision_en || visionData.vision, th: visionData.vision_th, my: visionData.vision_my, vi: visionData.vision_vi, ko: visionData.vision_ko, id: visionData.vision_id, ms: visionData.vision_ms, zh: visionData.vision_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setVisionData({...visionData, [`vision_${lang}`]: val})}
                />
                <TranslatableField 
                  label="Our Goal Block"
                  isTextArea={true}
                  baseValue={{ en: visionData.goal_en || visionData.goal, th: visionData.goal_th, my: visionData.goal_my, vi: visionData.goal_vi, ko: visionData.goal_ko, id: visionData.goal_id, ms: visionData.goal_ms, zh: visionData.goal_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setVisionData({...visionData, [`goal_${lang}`]: val})}
                />
              </div>
            </div>
          )}

          {/* TAB 6: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the title, description, and client quotes.</p>
                </div>
                <Button onClick={addTestimonial} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10"><Plus size={16} className="mr-2" /> Add Testimonial</Button>
              </div>
              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <TranslatableField 
                  label="Main Title"
                  baseValue={{ en: testimonialsHeader.title_en || testimonialsHeader.title, th: testimonialsHeader.title_th, my: testimonialsHeader.title_my, vi: testimonialsHeader.title_vi, ko: testimonialsHeader.title_ko, id: testimonialsHeader.title_id, ms: testimonialsHeader.title_ms, zh: testimonialsHeader.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setTestimonialsHeader({...testimonialsHeader, [`title_${lang}`]: val})}
                />
                <TranslatableField 
                  label="Description"
                  isTextArea={true}
                  baseValue={{ en: testimonialsHeader.description_en || testimonialsHeader.description, th: testimonialsHeader.description_th, my: testimonialsHeader.description_my, vi: testimonialsHeader.description_vi, ko: testimonialsHeader.description_ko, id: testimonialsHeader.description_id, ms: testimonialsHeader.description_ms, zh: testimonialsHeader.description_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setTestimonialsHeader({...testimonialsHeader, [`description_${lang}`]: val})}
                />
              </div>
              <div className="space-y-6">
                {testimonials.length === 0 && <p className="text-gray-400 py-8 text-center">No testimonials added yet.</p>}
                {testimonials.map((test, index) => (
                  <div key={test.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative group flex flex-col lg:flex-row gap-8">
                    <div className="w-24 h-24 flex-shrink-0 mx-auto lg:mx-0">
                      <ImageUploader preview={test.imagePreview} circle onUploadSuccess={(url: string) => updateTestimonial(test.id, 'imagePreview', url)} />
                    </div>
                    <div className="flex-1 space-y-5">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 pr-8">
                          <TranslatableField 
                            label="Author Name"
                            baseValue={{ en: test.author_en || test.author, th: test.author_th, my: test.author_my, vi: test.author_vi, ko: test.author_ko, id: test.author_id, ms: test.author_ms, zh: test.author_zh }}
                            onUpdateTranslation={(lang: string, val: string) => updateTestimonial(test.id, `author_${lang}`, val)}
                          />
                          <TranslatableField 
                            label="Organization / Title"
                            baseValue={{ en: test.organization_en || test.organization, th: test.organization_th, my: test.organization_my, vi: test.organization_vi, ko: test.organization_ko, id: test.organization_id, ms: test.organization_ms, zh: test.organization_zh }}
                            onUpdateTranslation={(lang: string, val: string) => updateTestimonial(test.id, `organization_${lang}`, val)}
                          />
                        </div>
                        
                        {/* REORDER ARROWS - UP/DOWN */}
                        <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveTestimonial(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-[#1B5E20] p-1.5 rounded disabled:opacity-30 bg-white shadow-sm border border-gray-100"><ArrowUp size={16} /></button>
                          <button onClick={() => moveTestimonial(index, 'down')} disabled={index === testimonials.length - 1} className="text-gray-400 hover:text-[#1B5E20] p-1.5 rounded disabled:opacity-30 bg-white shadow-sm border border-gray-100"><ArrowDown size={16} /></button>
                          <div className="w-[1px] bg-gray-200 mx-1"></div>
                          <button onClick={() => removeTestimonial(test.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded bg-white shadow-sm border border-gray-100"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <TranslatableField 
                        label="Quote"
                        isTextArea={true}
                        baseValue={{ en: test.quote_en || test.quote, th: test.quote_th, my: test.quote_my, vi: test.quote_vi, ko: test.quote_ko, id: test.quote_id, ms: test.quote_ms, zh: test.quote_zh }}
                        onUpdateTranslation={(lang: string, val: string) => updateTestimonial(test.id, `quote_${lang}`, val)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: IMPACT GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Impact Gallery</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the grid of images, section title, and SEO Alt text.</p>
                </div>
                <Button onClick={addGalleryImage} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10"><Plus size={16} className="mr-2" /> Add Image Box</Button>
              </div>

              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <TranslatableField 
                  label="Main Title"
                  baseValue={{ en: galleryHeader.title_en || galleryHeader.title, th: galleryHeader.title_th, my: galleryHeader.title_my, vi: galleryHeader.title_vi, ko: galleryHeader.title_ko, id: galleryHeader.title_id, ms: galleryHeader.title_ms, zh: galleryHeader.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setGalleryHeader({...galleryHeader, [`title_${lang}`]: val})}
                />
                <TranslatableField 
                  label="Description"
                  isTextArea={true}
                  baseValue={{ en: galleryHeader.description_en || galleryHeader.description, th: galleryHeader.description_th, my: galleryHeader.description_my, vi: galleryHeader.description_vi, ko: galleryHeader.description_ko, id: galleryHeader.description_id, ms: galleryHeader.description_ms, zh: galleryHeader.description_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setGalleryHeader({...galleryHeader, [`description_${lang}`]: val})}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map((img, index) => (
                  <div key={img.id} className="relative group bg-gray-50 rounded-xl border border-gray-200 p-2 flex flex-col gap-2">
                    <div className="aspect-square relative overflow-hidden rounded-lg">
                      <ImageUploader 
                        preview={img.preview} 
                        onUploadSuccess={(url: string, fileName: string) => {
                          updateGalleryImage(img.id, 'preview', url);
                          if(fileName) updateGalleryImage(img.id, 'fileName', fileName);
                        }}
                      />
                      
                      {/* REORDER ARROWS - LEFT/RIGHT */}
                      <div className="absolute top-0 right-0 left-0 p-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="flex gap-1">
                          <button onClick={() => moveGalleryImage(index, 'left')} disabled={index === 0} className="bg-white/90 backdrop-blur text-gray-600 p-1.5 rounded-md shadow-sm hover:bg-[#1B5E20] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all"><ArrowLeft size={14} /></button>
                          <button onClick={() => moveGalleryImage(index, 'right')} disabled={index === galleryImages.length - 1} className="bg-white/90 backdrop-blur text-gray-600 p-1.5 rounded-md shadow-sm hover:bg-[#1B5E20] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all"><ArrowRight size={14} /></button>
                        </div>
                        <button onClick={() => removeGalleryImage(img.id)} className="bg-white/90 backdrop-blur text-red-500 p-1.5 rounded-md shadow-sm hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                      </div>

                    </div>
                    <input type="text" value={img.altText || ''} onChange={(e) => updateGalleryImage(img.id, 'altText', e.target.value)} className="w-full text-xs text-center px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white text-gray-900 font-medium" placeholder="Alt Text (SEO)" />
                    <input type="text" value={img.fileName || ''} onChange={(e) => updateGalleryImage(img.id, 'fileName', e.target.value)} className="w-full text-[10px] text-center px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-transparent text-gray-400" placeholder="Upload to see filename" />
                  </div>
                ))}
                <div onClick={addGalleryImage} className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#1B5E20] transition-colors text-gray-400 hover:text-[#1B5E20]"><Plus size={32} className="mb-2" /><span className="text-sm font-medium">Add Image Box</span></div>
              </div>
            </div>
          )}
          
          {/* TAB 8: BLOG SECTION WITH LIVE FETCHED ARTICLES */}
          {activeTab === 'blog' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Blog Section Header</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the title for the latest articles section on the home page.</p>
                </div>
              </div>

              {/* Title Editor */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                <TranslatableField 
                  label="Blog Section Title"
                  baseValue={{ en: blogHeader?.title_en || blogHeader?.title || "Blog", th: blogHeader?.title_th, my: blogHeader?.title_my, vi: blogHeader?.title_vi, ko: blogHeader?.title_ko, id: blogHeader?.title_id, ms: blogHeader?.title_ms, zh: blogHeader?.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setBlogHeader((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                />
              </div>

              {/* Preview of Live Blogs */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-gray-900 text-lg">Latest Articles (Live on Home Page)</h3>
                   <Link href="/admin/articles">
                     <Button variant="outline" size="sm" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                       <FileText size={16} className="mr-2" /> Manage Articles
                     </Button>
                   </Link>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {latestArticles.map(article => (
                      <div key={article.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                          {article.imagePreview && <img src={article.imagePreview} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                        </div>
                        <h4 className="font-bold text-sm text-[#1B5E20] line-clamp-2 leading-snug">{article.title_en || article.title}</h4>
                        <p className="text-xs text-gray-500">{article.date}</p>
                      </div>
                   ))}
                   {latestArticles.length === 0 && <p className="text-gray-400 italic">No articles found. Go to the Articles tab to add some.</p>}
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
      ${circle ? 'rounded-full aspect-square' : 'rounded-xl min-h-[120px]'}
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

// --- REUSABLE AUTO-TRANSLATE FIELD (FULL 8 LANGUAGES) ---
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
          body: JSON.stringify({
            q: text,
            source: 'en',
            target: targetLang,
            format: 'html' 
          })
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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm w-full mb-4">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row items-start gap-4">
        
        <div className="flex-1 w-full min-w-0">
          <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
            🇬🇧 {label} (English base)
          </label>
          {isTextArea ? (
            <textarea rows={3} value={baseValue.en || ''} onChange={(e) => onUpdateTranslation('en', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent text-sm min-w-0 shadow-sm" />
          ) : (
            <input type="text" value={baseValue.en || ''} onChange={(e) => onUpdateTranslation('en', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent text-sm font-medium min-w-0 shadow-sm" />
          )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 md:pt-6">
          <Button type="button" onClick={handleAutoTranslate} disabled={isTranslating} className="w-full md:w-auto bg-[#76FF03] hover:bg-[#5dbb02] text-[#1B5E20] font-bold h-9 text-xs shadow-sm px-4">
            {isTranslating ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} className="mr-1" />}
            Auto-Translate
          </Button>
          <Button type="button" variant="ghost" onClick={() => setShowLanguages(!showLanguages)} className="w-full md:w-auto h-9 text-xs text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-200 border-none shadow-none px-4">
            <Languages size={14} className="mr-2" /> {showLanguages ? 'Hide' : 'Edit Languages'}
          </Button>
        </div>
      </div>

      {showLanguages && (
        <div className="p-4 grid grid-cols-1 gap-4 bg-white">
          {[
            { key: 'th', label: 'TH' },
            { key: 'my', label: 'MY' },
            { key: 'vi', label: 'VN' },
            { key: 'ko', label: 'KO' },
            { key: 'id', label: 'ID' },
            { key: 'ms', label: 'MS' },
            { key: 'zh', label: 'ZH' }
          ].map(lang => (
            <div key={lang.key} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">{lang.label} Translation</label>
              <div className="flex items-start gap-2">
                {isTextArea ? (
                   <textarea rows={2} value={baseValue[lang.key] || ''} onChange={(e) => onUpdateTranslation(lang.key, e.target.value)} className="flex-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1B5E20] focus:border-[#1B5E20] min-w-0 bg-gray-50" />
                ) : (
                   <input type="text" value={baseValue[lang.key] || ''} onChange={(e) => onUpdateTranslation(lang.key, e.target.value)} className="flex-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1B5E20] focus:border-[#1B5E20] min-w-0 bg-gray-50" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}