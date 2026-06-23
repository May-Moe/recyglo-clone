import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, Layout, MapPin, MessageCircle, Plus, Trash2, UploadCloud, GripVertical, Loader2, HelpCircle } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminContact() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE: HERO SECTION ---
  const [heroData, setHeroData] = useState({
    subtitle: "",
    title: "",
    description: "",
    imagePreview: ""
  });

  // --- STATE: CONTACT INFO ---
  const [contactInfo, setContactInfo] = useState({
    locations: "", 
    email: "",
    phone: "", 
    lineId: "",
    facebook: "",
    linkedin: "",
    instagram: ""
  });

  // --- STATE: FAQS & HINTS ---
  const [faqs, setFaqs] = useState<any[]>([]);
  const [messageHints, setMessageHints] = useState<{id: string, text: string}[]>([]);

  // --- 1. FETCH INITIAL DATA FROM FIREBASE ON LOAD ---
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const docRef = doc(db, "website_content", "contact_page");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          if (data.heroData) setHeroData(data.heroData);
          
          if (data.contactInfo) {
            setContactInfo({
              ...data.contactInfo,
              phone: data.contactInfo.phone || "" 
            });
          }
          
          if (data.faqs && data.faqs.length > 0) setFaqs(data.faqs);
          if (data.messageHints && data.messageHints.length > 0) setMessageHints(data.messageHints);
        } else {
          // If empty, pre-fill with defaults for easy migration
          setHeroData({
            subtitle: "Get in Touch with Our Team",
            title: "Contact RecyGlo",
            description: "Contact RecyGlo for more information about our sustainability solutions and ESG data analytics services. We're here to help you achieve your goals.",
            imagePreview: ""
          });
          setContactInfo({
            locations: "Thailand, Vietnam, Myanmar, Indonesia, South Korea, Singapore, Malaysia",
            email: "Contact@recyglo.com",
            phone: "(+66) 81 412 6842", 
            lineId: "@RecyGlo",
            facebook: "",
            linkedin: "",
            instagram: ""
          });
          setFaqs([
            { id: 'faq-1', q: "What is RecyGlo?", a: "RecyGlo is a pioneering sustainability solutions provider dedicated to helping businesses across Asia-Pacific achieve their environmental and ESG goals." },
            { id: 'faq-2', q: "Where is RecyGlo office located?", a: "We have operations and offices across Thailand, Myanmar, Vietnam, Indonesia, South Korea, Singapore, and Malaysia." },
            { id: 'faq-3', q: "How can we contact the company?", a: "You can reach us via our contact form, email us directly at Contact@recyglo.com, or call our team at (+66) 81 412 6842." },
            { id: 'faq-4', q: "What services does the company provide?", a: "We offer comprehensive B2B Waste Management Solutions, Waste Auditing, ESG Data Analytics, Circular Economy implementations, and Sustainability Consulting." },
            { id: 'faq-5', q: "How do I request a consultation?", a: "Simply fill out the contact form above with your details and subject, and a member of our team will reach out to schedule a consultation." },
            { id: 'faq-6', q: "What are your business hours?", a: "Our standard business hours are Monday to Friday, from 8:30 AM to 5:30 PM." },
            { id: 'faq-7', q: "Do you have social media channels?", a: "Yes! You can follow our journey and updates on <a href='https://facebook.com/recyglo' target='_blank'>Facebook</a>, LinkedIn, and Instagram @RecyGlo." }
          ]);
          setMessageHints([
            { id: 'hint-1', text: "How does your ESG data analytics platform work?" },
            { id: 'hint-2', text: "Can you help our company achieve Zero Waste to Landfill?" },
            { id: 'hint-3', text: "What is the process and cost for scheduling a waste audit?" }
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
        heroData,
        contactInfo,
        faqs,
        messageHints,
        lastUpdated: new Date()
      }, { merge: true });

      alert("Contact Page successfully updated in the database!");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save changes. Check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FAQ & HINT HANDLERS ---
  const addFaq = () => setFaqs([...faqs, { id: `faq-${Date.now()}`, q: "", a: "" }]);
  const removeFaq = (id: string) => setFaqs(faqs.filter(f => f.id !== id));
  const updateFaq = (id: string, field: string, value: string) => setFaqs(faqs.map(f => f.id === id ? { ...f, [field]: value } : f));

  const addHint = () => setMessageHints([...messageHints, { id: `hint-${Date.now()}`, text: "" }]);
  const removeHint = (id: string) => setMessageHints(messageHints.filter(h => h.id !== id));
  const updateHint = (id: string, text: string) => setMessageHints(messageHints.map(h => h.id === id ? { ...h, text } : h));

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Contact Page</h1>
          <p className="text-gray-500 text-sm">Update contact details, social links, FAQs, and form ideas.</p>
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Background Image</label>
                  <ImageUploader preview={heroData.imagePreview} onUploadSuccess={(url: string) => setHeroData({...heroData, imagePreview: url})} />
                </div>
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Small Subtitle</label>
                    <input type="text" value={heroData.subtitle} onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={heroData.title} onChange={(e) => setHeroData({...heroData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea rows={4} value={heroData.description} onChange={(e) => setHeroData({...heroData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                  </div>
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
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Office Locations (Comma Separated)</label>
                  <textarea rows={2} value={contactInfo.locations} onChange={(e) => setContactInfo({...contactInfo, locations: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="e.g. Thailand, Vietnam, Myanmar..." />
                  <p className="text-xs text-gray-500 mt-1">Separate countries with a comma. These generate the list in the location block.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                    <input type="text" value={contactInfo.phone} onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="e.g. (+66) 81 412 6842" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">LINE Official ID</label>
                    <input type="text" value={contactInfo.lineId} onChange={(e) => setContactInfo({...contactInfo, lineId: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <h3 className="font-bold text-gray-900">Social Media Links</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Facebook URL</label>
                    <input type="url" value={contactInfo.facebook} onChange={(e) => setContactInfo({...contactInfo, facebook: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn URL</label>
                    <input type="url" value={contactInfo.linkedin} onChange={(e) => setContactInfo({...contactInfo, linkedin: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="https://linkedin.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Instagram URL</label>
                    <input type="url" value={contactInfo.instagram} onChange={(e) => setContactInfo({...contactInfo, instagram: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="https://instagram.com/..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FORM HINTS (NEW) */}
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

              <div className="space-y-4">
                {messageHints.length === 0 && <p className="text-gray-400 text-center py-8">No ideas added yet.</p>}
                
                {messageHints.map((hint, index) => (
                  <div key={hint.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-4 items-center group">
                    <div className="cursor-grab text-gray-400">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={hint.text} 
                        onChange={(e) => updateHint(hint.id, e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#1B5E20]" 
                        placeholder="e.g. Can you help our company achieve Zero Waste?" 
                      />
                    </div>
                    <div>
                      <button onClick={() => removeHint(hint.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={18} />
                      </button>
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

              <div className="space-y-4">
                {faqs.length === 0 && <p className="text-gray-400 text-center py-8">No FAQs added yet.</p>}
                
                {faqs.map((faq, index) => (
                  <div key={faq.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-4 group">
                    <div className="pt-2 cursor-grab text-gray-400">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <input type="text" value={faq.q} onChange={(e) => updateFaq(faq.id, 'q', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-[#1B5E20]" placeholder="Question..." />
                      </div>
                      <div>
                        <textarea rows={2} value={faq.a} onChange={(e) => updateFaq(faq.id, 'a', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#1B5E20]" placeholder="Answer (HTML allowed for links)..." />
                      </div>
                    </div>
                    <div>
                      <button onClick={() => removeFaq(faq.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
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
        <div className="flex flex-col items-center justify-center p-2 text-[#1B5E20]">
          <Loader2 className="animate-spin mb-1" size={24} />
        </div>
      ) : preview ? (
        <>
          <img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" alt="Preview" />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
            <UploadCloud className="text-[#1B5E20] mb-1" size={24} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-center text-gray-400">
          <ImageIcon size={32} className="mb-1" />
        </div>
      )}
    </div>
  );
}