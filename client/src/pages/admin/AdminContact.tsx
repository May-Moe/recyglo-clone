import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, Layout, MapPin, MessageCircle, Plus, Trash2, UploadCloud, GripVertical, Loader2, HelpCircle, Languages, Wand2 } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminContact() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE: HERO SECTION ---
  const [heroData, setHeroData] = useState<any>({
    subtitle_en: "", title_en: "", description_en: "", imagePreview: ""
  });

  // --- STATE: CONTACT INFO ---
  const [contactInfo, setContactInfo] = useState<any>({
    locations_en: "", email: "", phone: "", lineId: "", facebook: "", linkedin: "", instagram: ""
  });

  // --- STATE: FAQS & HINTS ---
  const [faqs, setFaqs] = useState<any[]>([]);
  const [messageHints, setMessageHints] = useState<any[]>([]);

  // --- 1. FETCH INITIAL DATA FROM FIREBASE ON LOAD ---
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const docRef = doc(db, "website_content", "contact_page");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          if (data.heroData) setHeroData(data.heroData);
          if (data.contactInfo) setContactInfo({ ...data.contactInfo, phone: data.contactInfo.phone || "" });
          if (data.faqs && data.faqs.length > 0) setFaqs(data.faqs);
          if (data.messageHints && data.messageHints.length > 0) setMessageHints(data.messageHints);
        } else {
          // Defaults for easy migration
          setHeroData({
            subtitle_en: "Get in Touch with Our Team",
            title_en: "Contact RecyGlo",
            description_en: "Contact RecyGlo for more information about our sustainability solutions and ESG data analytics services. We're here to help you achieve your goals.",
            imagePreview: ""
          });
          setContactInfo({
            locations_en: "Thailand, Vietnam, Myanmar, Indonesia, South Korea, Singapore, Malaysia",
            email: "Contact@recyglo.com", phone: "(+66) 81 412 6842", lineId: "@RecyGlo",
            facebook: "", linkedin: "", instagram: ""
          });
          setFaqs([
            { id: 'faq-1', q_en: "What is RecyGlo?", a_en: "RecyGlo is a pioneering sustainability solutions provider..." },
            { id: 'faq-2', q_en: "Where is RecyGlo office located?", a_en: "We have operations and offices across Thailand..." }
          ]);
          setMessageHints([
            { id: 'hint-1', text_en: "How does your ESG data analytics platform work?" },
            { id: 'hint-2', text_en: "Can you help our company achieve Zero Waste to Landfill?" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching contact page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactData();
  }, []);

  // --- 2. SAVE EVERYTHING TO FIREBASE ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "website_content", "contact_page");
      await setDoc(docRef, {
        heroData, contactInfo, faqs, messageHints, lastUpdated: new Date()
      }, { merge: true });

      alert("Contact Page successfully updated in the database!");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save changes. Check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FAQ & HINT HANDLERS (UPDATED TO BE STATE-SAFE FOR TRANSLATIONS) ---
  const addFaq = () => setFaqs(prev => [...prev, { id: `faq-${Date.now()}` }]);
  const removeFaq = (id: string) => setFaqs(prev => prev.filter(f => f.id !== id));
  const updateFaq = (id: string, field: string, value: string) => setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));

  const addHint = () => setMessageHints(prev => [...prev, { id: `hint-${Date.now()}` }]);
  const removeHint = (id: string) => setMessageHints(prev => prev.filter(h => h.id !== id));
  const updateHint = (id: string, field: string, value: string) => setMessageHints(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Contact Page</h1>
          <p className="text-gray-500 text-sm">Update contact details, social links, FAQs, and form ideas.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2 px-6">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />} Save All Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE: Tab Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <TabButton id="hero" label="Hero Banner" icon={<Layout size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="contact" label="Contact & Socials" icon={<MapPin size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="hints" label="Form Ideas" icon={<HelpCircle size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="faqs" label="Manage FAQs" icon={<MessageCircle size={18} />} activeTab={activeTab} onClick={setActiveTab} />
        </div>

        {/* RIGHT SIDE: Editor Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[500px]">
          
          {/* TAB 1: HERO BANNER */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Hero Banner</h2>
                <p className="text-sm text-gray-500">Edit the main introductory banner at the top of the contact page.</p>
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
                    baseValue={{ en: heroData.subtitle_en || heroData.subtitle, th: heroData.subtitle_th, my: heroData.subtitle_my, vi: heroData.subtitle_vi, ko: heroData.subtitle_ko, id: heroData.subtitle_id, ms: heroData.subtitle_ms, zh: heroData.subtitle_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setHeroData(prev => ({...prev, [`subtitle_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Main Title"
                    baseValue={{ en: heroData.title_en || heroData.title, th: heroData.title_th, my: heroData.title_my, vi: heroData.title_vi, ko: heroData.title_ko, id: heroData.title_id, ms: heroData.title_ms, zh: heroData.title_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setHeroData(prev => ({...prev, [`title_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Description"
                    isTextArea={true}
                    baseValue={{ en: heroData.description_en || heroData.description, th: heroData.description_th, my: heroData.description_my, vi: heroData.description_vi, ko: heroData.description_ko, id: heroData.description_id, ms: heroData.description_ms, zh: heroData.description_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setHeroData(prev => ({...prev, [`description_${lang}`]: val}))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT & SOCIALS */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
                <p className="text-sm text-gray-500">Update the information displayed next to the contact form.</p>
              </div>
              
              <div className="space-y-6">
                <TranslatableField 
                  label="Office Locations (Comma Separated)"
                  isTextArea={true}
                  baseValue={{ en: contactInfo.locations_en || contactInfo.locations, th: contactInfo.locations_th, my: contactInfo.locations_my, vi: contactInfo.locations_vi, ko: contactInfo.locations_ko, id: contactInfo.locations_id, ms: contactInfo.locations_ms, zh: contactInfo.locations_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setContactInfo(prev => ({...prev, [`locations_${lang}`]: val}))}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={contactInfo.email} onChange={(e) => setContactInfo(prev => ({...prev, email: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                    <input type="text" value={contactInfo.phone} onChange={(e) => setContactInfo(prev => ({...prev, phone: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="e.g. (+66) 81 412 6842" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">LINE Official ID</label>
                    <input type="text" value={contactInfo.lineId} onChange={(e) => setContactInfo(prev => ({...prev, lineId: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <h3 className="font-bold text-gray-900">Social Media Links</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Facebook URL</label>
                    <input type="url" value={contactInfo.facebook} onChange={(e) => setContactInfo(prev => ({...prev, facebook: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn URL</label>
                    <input type="url" value={contactInfo.linkedin} onChange={(e) => setContactInfo(prev => ({...prev, linkedin: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="https://linkedin.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Instagram URL</label>
                    <input type="url" value={contactInfo.instagram} onChange={(e) => setContactInfo(prev => ({...prev, instagram: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20] bg-white" placeholder="https://instagram.com/..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FORM HINTS */}
          {activeTab === 'hints' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Form Message Ideas</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the example questions that appear when users click "Need ideas?".</p>
                </div>
                <Button onClick={addHint} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Idea
                </Button>
              </div>

              <div className="space-y-6">
                {messageHints.length === 0 && <p className="text-gray-400 text-center py-8">No ideas added yet.</p>}
                
                {messageHints.map((hint) => (
                  <div key={hint.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex gap-4 items-start group">
                    <div className="cursor-grab text-gray-400 mt-2"><GripVertical size={20} /></div>
                    <div className="flex-1">
                      <TranslatableField 
                        label="Form Message Idea"
                        baseValue={{ en: hint.text_en || hint.text, th: hint.text_th, my: hint.text_my, vi: hint.text_vi, ko: hint.text_ko, id: hint.text_id, ms: hint.text_ms, zh: hint.text_zh }}
                        onUpdateTranslation={(lang: string, val: string) => updateHint(hint.id, `text_${lang}`, val)}
                      />
                    </div>
                    <div>
                      <button onClick={() => removeHint(hint.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors mt-1"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Manage FAQs</h2>
                  <p className="text-sm text-gray-500 mt-1">Add or remove frequently asked questions.</p>
                </div>
                <Button onClick={addFaq} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add FAQ
                </Button>
              </div>

              <div className="bg-[#1B5E20]/5 border border-[#1B5E20]/20 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-700 font-medium">
                  <strong>💡 Pro Tip:</strong> You can add clickable links inside your FAQ answers using standard HTML tags. For example:<br/>
                  <code className="text-xs bg-white border border-gray-200 px-2 py-1 rounded mt-2 inline-block">
                    &lt;a href="https://facebook.com/recyglo" target="_blank"&gt;Facebook&lt;/a&gt;
                  </code>
                </p>
              </div>

              <div className="space-y-6">
                {faqs.length === 0 && <p className="text-gray-400 text-center py-8">No FAQs added yet.</p>}
                
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex gap-4 group">
                    <div className="pt-2 cursor-grab text-gray-400"><GripVertical size={20} /></div>
                    <div className="flex-1 space-y-4">
                      <TranslatableField 
                        label="Question"
                        baseValue={{ en: faq.q_en || faq.q, th: faq.q_th, my: faq.q_my, vi: faq.q_vi, ko: faq.q_ko, id: faq.q_id, ms: faq.q_ms, zh: faq.q_zh }}
                        onUpdateTranslation={(lang: string, val: string) => updateFaq(faq.id, `q_${lang}`, val)}
                      />
                      <TranslatableField 
                        label="Answer (HTML allowed for links)"
                        isTextArea={true}
                        baseValue={{ en: faq.a_en || faq.a, th: faq.a_th, my: faq.a_my, vi: faq.a_vi, ko: faq.a_ko, id: faq.a_id, ms: faq.a_ms, zh: faq.a_zh }}
                        onUpdateTranslation={(lang: string, val: string) => updateFaq(faq.id, `a_${lang}`, val)}
                      />
                    </div>
                    <div>
                      <button onClick={() => removeFaq(faq.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors mt-1"><Trash2 size={18} /></button>
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

function ImageUploader({ preview, onUploadSuccess }: any) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileRef = ref(storage, `contact-page/${Date.now()}_${file.name}`);
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
    <div className={`border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors rounded-xl h-full w-full min-h-[120px]`}>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center p-2 text-[#1B5E20]"><Loader2 className="animate-spin mb-1" size={24} /></div>
      ) : preview ? (
        <><img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" alt="Preview" /><div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity"><UploadCloud className="text-[#1B5E20] mb-1" size={24} /></div></>
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-center text-gray-400"><ImageIcon size={32} className="mb-1" /></div>
      )}
    </div>
  );
}

// --- REUSABLE AUTO-TRANSLATE FIELD (FULL 8 LANGUAGES) ---
// ✅ FIX: Removed 'flex-col h-full justify-center' from the outer wrapper
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
          body: JSON.stringify({ q: text, source: 'en', target: targetLang, format: 'html' }) // HTML ensures it doesn't break FAQ links
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