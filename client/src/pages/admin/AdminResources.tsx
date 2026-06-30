import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Layout, FileText, Plus, Trash2, UploadCloud, GripVertical, Loader2, CheckCircle2, Languages, Wand2 } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

// --- EXISTING WEBSITE ASSET IMPORTS (For Hero) ---
import aboutHero from '@/assets/images/about-hero.jpg';

export default function AdminResources() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- DEFAULT STATE: PRE-LOADED WITH YOUR EXISTING DATA & TRANSLATION KEYS ---
  const [heroData, setHeroData] = useState<any>({
    subtitle_en: "Making the World a Cleaner Place",
    title_en: "RecyGlo Resources & Knowledge Hub",
    description_en: "Tailored waste management strategies to help businesses reduce, reuse, and recycle efficiently.",
    imagePreview: aboutHero
  });

  const [caseStudies, setCaseStudies] = useState<any[]>([
    { id: 'cs-1', title_en: "Thailand's Battle with Climate Change", fileUrl: "" },
    { id: 'cs-2', title_en: "Steel in Thailand", fileUrl: "" },
    { id: 'cs-3', title_en: "Digital Transformation & ESG", fileUrl: "" },
    { id: 'cs-4', title_en: "PM2.5 Pollution and Waste Management in Northern Thailand", fileUrl: "" },
    { id: 'cs-5', title_en: "Greening Indonesia", fileUrl: "" },
  ]);

  const [annualReports, setAnnualReports] = useState<any[]>([
    { id: 'ar-1', title_en: "RecyGlo ESG 2024 Report", fileUrl: "" },
    { id: 'ar-2', title_en: "RecyGlo Carbon Footprint 2022-2023 Report", fileUrl: "" },
    { id: 'ar-3', title_en: "RecyGlo 2023 Annual Report", fileUrl: "" },
    { id: 'ar-4', title_en: "RecyGlo 2022 Annual Report", fileUrl: "" },
  ]);

  // --- 1. FETCH INITIAL DATA FROM FIREBASE ON LOAD ---
  useEffect(() => {
    const fetchResourcesData = async () => {
      try {
        const docRef = doc(db, "website_content", "resources_page");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          if (data.heroData) setHeroData(data.heroData);
          if (data.caseStudies && data.caseStudies.length > 0) setCaseStudies(data.caseStudies);
          if (data.annualReports && data.annualReports.length > 0) setAnnualReports(data.annualReports);
        }
      } catch (error) {
        console.error("Error fetching resources page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResourcesData();
  }, []);

  // --- 2. SAVE EVERYTHING TO FIREBASE ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "website_content", "resources_page");
      await setDoc(docRef, {
        heroData,
        caseStudies,
        annualReports,
        lastUpdated: new Date()
      }, { merge: true });

      alert("Resources Page successfully updated in the database!");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save changes. Check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- HANDLERS FOR LISTS (State-Safe) ---
  const addCaseStudy = () => setCaseStudies(prev => [...prev, { id: `cs-${Date.now()}`, title_en: "", fileUrl: "" }]);
  const removeCaseStudy = (id: string) => setCaseStudies(prev => prev.filter(cs => cs.id !== id));
  const updateCaseStudy = (id: string, field: string, value: string) => setCaseStudies(prev => prev.map(cs => cs.id === id ? { ...cs, [field]: value } : cs));

  const addReport = () => setAnnualReports(prev => [...prev, { id: `ar-${Date.now()}`, title_en: "", fileUrl: "" }]);
  const removeReport = (id: string) => setAnnualReports(prev => prev.filter(ar => ar.id !== id));
  const updateReport = (id: string, field: string, value: string) => setAnnualReports(prev => prev.map(ar => ar.id === id ? { ...ar, [field]: value } : ar));

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Resources Page</h1>
          <p className="text-gray-500 text-sm">Upload PDF reports and case studies to the cloud.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2 px-6">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving to Database...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE: Tab Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <TabButton id="hero" label="Hero Banner" icon={<Layout size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="case-studies" label="Case Studies" icon={<FileText size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="reports" label="Annual Reports" icon={<FileText size={18} />} activeTab={activeTab} onClick={setActiveTab} />
        </div>

        {/* RIGHT SIDE: Editor Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[500px]">
          
          {/* TAB 1: HERO BANNER */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Hero Banner</h2>
                <p className="text-sm text-gray-500">Edit the main introductory banner.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Background Image</label>
                  <div className="h-[250px] w-full rounded-xl overflow-hidden shadow-sm">
                    <ImageUploader preview={heroData.imagePreview} onUploadSuccess={(url: string) => setHeroData(prev => ({...prev, imagePreview: url}))} />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-5">
                  <TranslatableField 
                    label="Small Subtitle"
                    baseValue={{ en: heroData.subtitle_en || heroData.subtitle, th: heroData.subtitle_th, my: heroData.subtitle_my, vi: heroData.subtitle_vi }}
                    onUpdateTranslation={(lang: string, val: string) => setHeroData(prev => ({...prev, [`subtitle_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Main Title"
                    baseValue={{ en: heroData.title_en || heroData.title, th: heroData.title_th, my: heroData.title_my, vi: heroData.title_vi }}
                    onUpdateTranslation={(lang: string, val: string) => setHeroData(prev => ({...prev, [`title_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Description"
                    isTextArea={true}
                    baseValue={{ en: heroData.description_en || heroData.description, th: heroData.description_th, my: heroData.description_my, vi: heroData.description_vi }}
                    onUpdateTranslation={(lang: string, val: string) => setHeroData(prev => ({...prev, [`description_${lang}`]: val}))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CASE STUDIES */}
          {activeTab === 'case-studies' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Case Studies & Research</h2>
                  <p className="text-sm text-gray-500 mt-1">Upload PDF files for users to download.</p>
                </div>
                <Button onClick={addCaseStudy} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Document
                </Button>
              </div>

              <div className="space-y-4">
                {caseStudies.length === 0 && <p className="text-gray-400 text-center py-8">No documents added yet.</p>}
                
                {caseStudies.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-4 group items-center">
                    <div className="cursor-grab text-gray-400">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <TranslatableField 
                          label="Document Title"
                          baseValue={{ en: doc.title_en || doc.title, th: doc.title_th, my: doc.title_my, vi: doc.title_vi }}
                          onUpdateTranslation={(lang: string, val: string) => updateCaseStudy(doc.id, `title_${lang}`, val)}
                        />
                      </div>
                      <div className="pt-2 lg:pt-6">
                        {/* SPECIAL PDF UPLOADER */}
                        <FileUploader fileUrl={doc.fileUrl} onUploadSuccess={(url: string) => updateCaseStudy(doc.id, 'fileUrl', url)} folder="case-studies" />
                      </div>
                    </div>
                    <div>
                      <button onClick={() => removeCaseStudy(doc.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors mt-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ANNUAL REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Annual Reports</h2>
                  <p className="text-sm text-gray-500 mt-1">Upload yearly corporate PDFs.</p>
                </div>
                <Button onClick={addReport} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Report
                </Button>
              </div>

              <div className="space-y-4">
                {annualReports.length === 0 && <p className="text-gray-400 text-center py-8">No reports added yet.</p>}
                
                {annualReports.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-4 group items-center">
                    <div className="cursor-grab text-gray-400">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <TranslatableField 
                          label="Report Title"
                          baseValue={{ en: doc.title_en || doc.title, th: doc.title_th, my: doc.title_my, vi: doc.title_vi }}
                          onUpdateTranslation={(lang: string, val: string) => updateReport(doc.id, `title_${lang}`, val)}
                        />
                      </div>
                      <div className="pt-2 lg:pt-6">
                        {/* SPECIAL PDF UPLOADER */}
                        <FileUploader fileUrl={doc.fileUrl} onUploadSuccess={(url: string) => updateReport(doc.id, 'fileUrl', url)} folder="annual-reports" />
                      </div>
                    </div>
                    <div>
                      <button onClick={() => removeReport(doc.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors mt-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
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
    <button onClick={() => onClick(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${isActive ? 'bg-[#1B5E20] text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}>
      <span className={isActive ? 'text-[#76FF03]' : 'text-gray-400'}>{icon}</span>
      {label}
    </button>
  );
}

// --- PDF/DOCUMENT UPLOADER ---
function FileUploader({ fileUrl, onUploadSuccess, folder }: { fileUrl: string, onUploadSuccess: (url: string) => void, folder: string }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Document upload failed! Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative border border-gray-200 bg-white rounded-lg flex items-center justify-between px-3 py-3 text-sm overflow-hidden hover:border-[#1B5E20] transition-colors h-full`}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      
      {isUploading ? (
        <div className="flex items-center gap-2 text-[#1B5E20] font-bold mx-auto">
          <Loader2 className="animate-spin" size={16} /> Uploading...
        </div>
      ) : fileUrl ? (
        <div className="flex items-center gap-2 text-[#1B5E20] font-bold mx-auto">
          <CheckCircle2 size={16} /> <span className="truncate w-32 md:w-48">PDF Uploaded to Cloud</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-400 mx-auto font-medium">
          <UploadCloud size={16} /> Upload PDF Document
        </div>
      )}
    </div>
  );
}

// --- IMAGE UPLOADER (For Hero Banner) ---
function ImageUploader({ preview, onUploadSuccess }: any) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileRef = ref(storage, `resources-page/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors rounded-xl h-full w-full min-h-[120px]`}>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      {isUploading ? (
        <Loader2 className="animate-spin text-[#1B5E20]" size={24} />
      ) : preview ? (
        <>
          <img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" alt="Preview" />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
            <UploadCloud className="text-[#1B5E20]" size={24} />
          </div>
        </>
      ) : (
        <UploadCloud className="text-gray-400" size={32} />
      )}
    </div>
  );
}

// --- REUSABLE AUTO-TRANSLATE FIELD (REAL GOOGLE AI TRANSLATION) ---
// ✅ FIXED: Removed `h-full justify-center` so the boxes don't stretch weirdly!
function TranslatableField({ label, baseValue, onUpdateTranslation, isTextArea = false }: any) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const handleAutoTranslate = async () => {
    if (!baseValue.en) return alert("Please enter English text first!");
    
    setIsTranslating(true);
    
    // PULL THE API KEY FROM YOUR .env FILE
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
        
        // Decode HTML entities automatically
        const translated = data.data.translations[0].translatedText;
        const txt = document.createElement("textarea");
        txt.innerHTML = translated;
        return txt.value;
      };

      // Translate all three languages simultaneously
      const [thText, myText, viText] = await Promise.all([
        translateText(baseValue.en, 'th'),
        translateText(baseValue.en, 'my'),
        translateText(baseValue.en, 'vi')
      ]);
      
      // Save the real translations
      onUpdateTranslation('th', thText);
      onUpdateTranslation('my', myText);
      onUpdateTranslation('vi', viText);
      
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
          <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
            🇬🇧 {label} (English base)
          </label>
          {isTextArea ? (
            <textarea rows={2} value={baseValue.en || ''} onChange={(e) => onUpdateTranslation('en', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm" />
          ) : (
            <input type="text" value={baseValue.en || ''} onChange={(e) => onUpdateTranslation('en', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm font-medium" />
          )}
        </div>
        
        <div className="flex md:flex-col gap-2 shrink-0 md:pt-5 w-full md:w-auto">
          <Button type="button" onClick={handleAutoTranslate} disabled={isTranslating} className="flex-1 md:flex-none bg-[#76FF03] hover:bg-[#5dbb02] text-[#1B5E20] font-bold h-9 text-xs">
            {isTranslating ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} className="mr-1" />}
            Auto-Translate
          </Button>
          <Button type="button" variant="ghost" onClick={() => setShowLanguages(!showLanguages)} className="flex-1 md:flex-none h-9 md:h-7 text-xs text-gray-500 bg-gray-200 md:bg-transparent">
            <Languages size={12} className="mr-1" /> {showLanguages ? 'Hide' : 'Edit'} Languages
          </Button>
        </div>
      </div>

      {showLanguages && (
        <div className="p-3 grid grid-cols-1 gap-3 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-8 text-center bg-gray-100 p-1 rounded">TH</span>
            {isTextArea ? (
               <textarea rows={2} value={baseValue.th || ''} onChange={(e) => onUpdateTranslation('th', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="Thai translation..." />
            ) : (
               <input type="text" value={baseValue.th || ''} onChange={(e) => onUpdateTranslation('th', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="Thai translation..." />
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-8 text-center bg-gray-100 p-1 rounded">MY</span>
            {isTextArea ? (
               <textarea rows={2} value={baseValue.my || ''} onChange={(e) => onUpdateTranslation('my', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="Myanmar translation..." />
            ) : (
               <input type="text" value={baseValue.my || ''} onChange={(e) => onUpdateTranslation('my', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="Myanmar translation..." />
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-8 text-center bg-gray-100 p-1 rounded">VN</span>
            {isTextArea ? (
               <textarea rows={2} value={baseValue.vi || ''} onChange={(e) => onUpdateTranslation('vi', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="Vietnamese translation..." />
            ) : (
               <input type="text" value={baseValue.vi || ''} onChange={(e) => onUpdateTranslation('vi', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="Vietnamese translation..." />
            )}
          </div>
        </div>
      )}
    </div>
  );
}