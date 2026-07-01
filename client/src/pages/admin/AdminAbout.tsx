import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, Layout, Users, BookOpen, Trophy, Plus, Trash2, UploadCloud, Loader2, Target, Briefcase, ArrowLeft, ArrowRight, Languages, Wand2, Heart } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

// --- EXISTING WEBSITE ASSET IMPORTS ---
import aboutHero from '@/assets/images/about-hero.jpg';
import teamGroup from '@/assets/images/gallery2.jpg';
import ceoPhoto from '@/assets/images/ceo.png';
import team1 from '@/assets/images/ceo.png';
import team2 from '@/assets/images/team2.png';

export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- PRE-LOADED DEFAULT DATA (So you don't have to type it manually!) ---
  const defaultValues = [
    { 
      id: 'val-1', 
      title_en: "Sustainability First", 
      desc_en: "We prioritize the environment in every decision, ensuring our solutions leave a lasting positive impact on the planet.", 
      iconPreview: "" 
    },
    { 
      id: 'val-2', 
      title_en: "Innovation & Technology", 
      desc_en: "We leverage cutting-edge tech and data analytics to drive efficient, transparent, and scalable waste management.", 
      iconPreview: "" 
    },
    { 
      id: 'val-3', 
      title_en: "Empowerment & Inclusion", 
      desc_en: "We uplift informal workers, women, and marginalized communities by integrating them into the formal circular economy.", 
      iconPreview: "" 
    },
    { 
      id: 'val-4', 
      title_en: "Integrity & Transparency", 
      desc_en: "We maintain the highest standards of accountability in our ESG reporting, operations, and partnerships.", 
      iconPreview: "" 
    }
  ];

  // --- LIVE DATABASE STATE WITH ALL TRANSLATION KEYS ---
  const [heroData, setHeroData] = useState<any>({ subtitle_en: "Empowering businesses across Asia-Pacific.", title_en: "Welcome to RecyGlo", description_en: "At RecyGlo, our mission is to foster a more sustainable future...", imagePreview: aboutHero, button1Text: "", button1Link: "", button2Text: "", button2Link: "" });
  const [introData, setIntroData] = useState<any>({ title_en: "Introducing To Best Waste Management.", description_en: "RecyGlo is a pioneering sustainability solutions provider...", address_en: "190 Middle Road #19-05 Fortune Centre Singapore", email: "Contact@recyglo.com", phone: "(+66) 81 412 6842", lineId: "@RecyGlo", imagePreview: teamGroup });
  const [storyData, setStoryData] = useState<any>({ title_en: "Our Story: From a Local Problem to a Global Vision", paragraph1_en: "RecyGlo was born out of a stark realization...", paragraph2_en: "We saw businesses struggling to balance operational growth...", paragraph3_en: "Today, RecyGlo has evolved into a comprehensive ESG platform...", ceoName_en: "Ms. Shwe Yamin Oo", ceoTitle_en: "CEO & Co-founder", ceoImagePreview: ceoPhoto });
  
  // SECTION HEADERS
  const [teamHeader, setTeamHeader] = useState<any>({ title_en: "Our Team", description_en: "" });
  const [awardsHeader, setAwardsHeader] = useState<any>({ title_en: "Award-Winning Excellence", description_en: "" });
  const [partnersHeader, setPartnersHeader] = useState<any>({ title_en: "Strategic Partnerships", description_en: "" });
  const [valuesHeader, setValuesHeader] = useState<any>({ title_en: "Our Values", description_en: "" }); 

  // ARRAYS
  const [teamMembers, setTeamMembers] = useState<any[]>([{ id: 'team-1', name_en: "Ms. Shwe Yamin Oo", title_en: "CEO & Co-founder", imagePreview: team1 }, { id: 'team-2', name_en: "Mr. Okka Phyo Maung", title_en: "CMO & Co-founder", imagePreview: team2 }]);
  const [awards, setAwards] = useState<any[]>([{ id: 'award-1', title_en: "Sustainability Excellence", year: "2024", description_en: "", imagePreview: "" }]);
  const [partners, setPartners] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>(defaultValues); 

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "website_content", "about_page");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          if (data.heroData) setHeroData(data.heroData);
          if (data.introData) setIntroData(data.introData);
          if (data.storyData) setStoryData(data.storyData);
          
          if (data.teamHeader) setTeamHeader(data.teamHeader);
          if (data.awardsHeader) setAwardsHeader(data.awardsHeader);
          if (data.partnersHeader) setPartnersHeader(data.partnersHeader);
          if (data.valuesHeader) setValuesHeader(data.valuesHeader); 

          if (data.teamMembers && data.teamMembers.length > 0) setTeamMembers(data.teamMembers);
          if (data.awards && data.awards.length > 0) setAwards(data.awards);
          if (data.partners && data.partners.length > 0) setPartners(data.partners); 
          if (data.values && data.values.length > 0) setValues(data.values); 
        }
      } catch (error) {
        console.error("Error fetching about page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "website_content", "about_page");
      await setDoc(docRef, {
        heroData, introData, storyData, teamHeader, awardsHeader, partnersHeader, valuesHeader,
        teamMembers, awards, partners, values, lastUpdated: new Date()
      }, { merge: true });

      alert("About Us Page successfully updated in the database!");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save changes. Check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- HANDLERS FOR UPDATING LOCAL STATE ARRAYS ---
  const addTeamMember = () => setTeamMembers(prev => [...prev, { id: `team-${Date.now()}` }]);
  const removeTeamMember = (id: string) => setTeamMembers(prev => prev.filter(m => m.id !== id));
  const updateTeamMember = (id: string, field: string, value: string) => setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));

  const addAward = () => setAwards(prev => [...prev, { id: `award-${Date.now()}` }]);
  const removeAward = (id: string) => setAwards(prev => prev.filter(a => a.id !== id));
  const updateAward = (id: string, field: string, value: string) => setAwards(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  const moveAward = (index: number, direction: 'left' | 'right') => {
    setAwards(prev => {
      const newAwards = [...prev];
      if (direction === 'left' && index > 0) [newAwards[index - 1], newAwards[index]] = [newAwards[index], newAwards[index - 1]];
      else if (direction === 'right' && index < newAwards.length - 1) [newAwards[index + 1], newAwards[index]] = [newAwards[index], newAwards[index + 1]];
      return newAwards;
    });
  };

  const addPartner = () => setPartners(prev => [...prev, { id: `partner-${Date.now()}` }]);
  const removePartner = (id: string) => setPartners(prev => prev.filter(p => p.id !== id));
  const updatePartner = (id: string, field: string, value: string) => setPartners(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  const movePartner = (index: number, direction: 'left' | 'right') => {
    setPartners(prev => {
      const newPartners = [...prev];
      if (direction === 'left' && index > 0) [newPartners[index - 1], newPartners[index]] = [newPartners[index], newPartners[index - 1]];
      else if (direction === 'right' && index < newPartners.length - 1) [newPartners[index + 1], newPartners[index]] = [newPartners[index], newPartners[index + 1]];
      return newPartners;
    });
  };

  const addValue = () => setValues(prev => [...prev, { id: `val-${Date.now()}` }]);
  const removeValue = (id: string) => setValues(prev => prev.filter(v => v.id !== id));
  const updateValue = (id: string, field: string, value: string) => setValues(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit About Us Page</h1>
          <p className="text-gray-500 text-sm">Update company history, leadership profiles, values, and contact info.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2 px-6">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />} Save All Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT SIDE: Tab Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <TabButton id="hero" label="Hero Banner" icon={<Layout size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="intro" label="Who We Are" icon={<Target size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="story" label="Our Story" icon={<BookOpen size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="values" label="Our Values" icon={<Heart size={18} />} activeTab={activeTab} onClick={setActiveTab} /> 
          <TabButton id="team" label="Our Team" icon={<Users size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="awards" label="Awards" icon={<Trophy size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="partners" label="Partnerships" icon={<Briefcase size={18} />} activeTab={activeTab} onClick={setActiveTab} />
        </div>

        {/* RIGHT SIDE: Editor Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[500px]">
          
          {/* TAB 1: HERO BANNER */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Hero Banner</h2>
                <p className="text-sm text-gray-500">Edit the main introductory banner at the top of the page.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Background Image</label>
                  <div className="h-[250px] w-full rounded-xl overflow-hidden shadow-sm">
                    <ImageUploader preview={heroData.imagePreview} onUploadSuccess={(url: string) => setHeroData((prev: any) => ({...prev, imagePreview: url}))} />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-5">
                  <TranslatableField 
                    label="Small Subtitle"
                    baseValue={{ en: heroData.subtitle_en || heroData.subtitle, th: heroData.subtitle_th, my: heroData.subtitle_my, vi: heroData.subtitle_vi, ko: heroData.subtitle_ko, id: heroData.subtitle_id, ms: heroData.subtitle_ms, zh: heroData.subtitle_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setHeroData((prev: any) => ({...prev, [`subtitle_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Main Title"
                    baseValue={{ en: heroData.title_en || heroData.title, th: heroData.title_th, my: heroData.title_my, vi: heroData.title_vi, ko: heroData.title_ko, id: heroData.title_id, ms: heroData.title_ms, zh: heroData.title_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setHeroData((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Description"
                    isTextArea={true}
                    baseValue={{ en: heroData.description_en || heroData.description, th: heroData.description_th, my: heroData.description_my, vi: heroData.description_vi, ko: heroData.description_ko, id: heroData.description_id, ms: heroData.description_ms, zh: heroData.description_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setHeroData((prev: any) => ({...prev, [`description_${lang}`]: val}))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Button 1 Text (Left)</label>
                  <input type="text" value={heroData.button1Text || ''} onChange={(e) => setHeroData((prev: any) => ({...prev, button1Text: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="Calculate Carbon Footprint" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Button 1 Link / Path</label>
                  <input type="text" value={heroData.button1Link || ''} onChange={(e) => setHeroData((prev: any) => ({...prev, button1Link: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="/carbon-calculator" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Button 2 Text (Right)</label>
                  <input type="text" value={heroData.button2Text || ''} onChange={(e) => setHeroData((prev: any) => ({...prev, button2Text: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="Our Solutions" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Button 2 Link / Path</label>
                  <input type="text" value={heroData.button2Link || ''} onChange={(e) => setHeroData((prev: any) => ({...prev, button2Link: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#1B5E20] text-sm bg-white" placeholder="/solutions" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHO WE ARE */}
          {activeTab === 'intro' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Who We Are</h2>
                <p className="text-sm text-gray-500">Edit the company introduction and contact information.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Side Image</label>
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden shadow-sm">
                    <ImageUploader preview={introData.imagePreview} onUploadSuccess={(url: string) => setIntroData((prev: any) => ({...prev, imagePreview: url}))} />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-5">
                  <TranslatableField 
                    label="Heading"
                    baseValue={{ en: introData.title_en || introData.title, th: introData.title_th, my: introData.title_my, vi: introData.title_vi, ko: introData.title_ko, id: introData.title_id, ms: introData.title_ms, zh: introData.title_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setIntroData((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Company Description"
                    isTextArea={true}
                    baseValue={{ en: introData.description_en || introData.description, th: introData.description_th, my: introData.description_my, vi: introData.description_vi, ko: introData.description_ko, id: introData.description_id, ms: introData.description_ms, zh: introData.description_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setIntroData((prev: any) => ({...prev, [`description_${lang}`]: val}))}
                  />
                  
                  <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div className="col-span-2"><h3 className="font-bold text-sm">Contact Info Box</h3></div>
                    <div className="col-span-2">
                      <TranslatableField 
                        label="Address"
                        baseValue={{ en: introData.address_en || introData.address, th: introData.address_th, my: introData.address_my, vi: introData.address_vi, ko: introData.address_ko, id: introData.address_id, ms: introData.address_ms, zh: introData.address_zh }}
                        onUpdateTranslation={(lang: string, val: string) => setIntroData((prev: any) => ({...prev, [`address_${lang}`]: val}))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                      <input type="email" value={introData.email || ''} onChange={(e) => setIntroData((prev: any) => ({...prev, email: e.target.value}))} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none text-sm bg-white focus:border-[#1B5E20]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                      <input type="text" value={introData.phone || ''} onChange={(e) => setIntroData((prev: any) => ({...prev, phone: e.target.value}))} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none text-sm bg-white focus:border-[#1B5E20]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Line Official</label>
                      <input type="text" value={introData.lineId || ''} onChange={(e) => setIntroData((prev: any) => ({...prev, lineId: e.target.value}))} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none text-sm bg-white focus:border-[#1B5E20]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OUR STORY */}
          {activeTab === 'story' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Our Story & Leadership</h2>
                <p className="text-sm text-gray-500">Edit the origin story paragraphs and the CEO profile picture.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 space-y-4">
                  <div className="aspect-square">
                    <label className="block text-sm font-bold text-gray-700 mb-2">CEO Image</label>
                    <ImageUploader circle preview={storyData.ceoImagePreview} onUploadSuccess={(url: string) => setStoryData((prev: any) => ({...prev, ceoImagePreview: url}))} />
                  </div>
                  <TranslatableField 
                    label="CEO Name"
                    baseValue={{ en: storyData.ceoName_en || storyData.ceoName, th: storyData.ceoName_th, my: storyData.ceoName_my, vi: storyData.ceoName_vi, ko: storyData.ceoName_ko, id: storyData.ceoName_id, ms: storyData.ceoName_ms, zh: storyData.ceoName_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setStoryData((prev: any) => ({...prev, [`ceoName_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="CEO Title"
                    baseValue={{ en: storyData.ceoTitle_en || storyData.ceoTitle, th: storyData.ceoTitle_th, my: storyData.ceoTitle_my, vi: storyData.ceoTitle_vi, ko: storyData.ceoTitle_ko, id: storyData.ceoTitle_id, ms: storyData.ceoTitle_ms, zh: storyData.ceoTitle_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setStoryData((prev: any) => ({...prev, [`ceoTitle_${lang}`]: val}))}
                  />
                </div>
                <div className="md:col-span-8 space-y-5">
                  <TranslatableField 
                    label="Story Heading"
                    baseValue={{ en: storyData.title_en || storyData.title, th: storyData.title_th, my: storyData.title_my, vi: storyData.title_vi, ko: storyData.title_ko, id: storyData.title_id, ms: storyData.title_ms, zh: storyData.title_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setStoryData((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Paragraph 1"
                    isTextArea={true}
                    baseValue={{ en: storyData.paragraph1_en || storyData.paragraph1, th: storyData.paragraph1_th, my: storyData.paragraph1_my, vi: storyData.paragraph1_vi, ko: storyData.paragraph1_ko, id: storyData.paragraph1_id, ms: storyData.paragraph1_ms, zh: storyData.paragraph1_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setStoryData((prev: any) => ({...prev, [`paragraph1_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Paragraph 2"
                    isTextArea={true}
                    baseValue={{ en: storyData.paragraph2_en || storyData.paragraph2, th: storyData.paragraph2_th, my: storyData.paragraph2_my, vi: storyData.paragraph2_vi, ko: storyData.paragraph2_ko, id: storyData.paragraph2_id, ms: storyData.paragraph2_ms, zh: storyData.paragraph2_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setStoryData((prev: any) => ({...prev, [`paragraph2_${lang}`]: val}))}
                  />
                  <TranslatableField 
                    label="Paragraph 3"
                    isTextArea={true}
                    baseValue={{ en: storyData.paragraph3_en || storyData.paragraph3, th: storyData.paragraph3_th, my: storyData.paragraph3_my, vi: storyData.paragraph3_vi, ko: storyData.paragraph3_ko, id: storyData.paragraph3_id, ms: storyData.paragraph3_ms, zh: storyData.paragraph3_zh }}
                    onUpdateTranslation={(lang: string, val: string) => setStoryData((prev: any) => ({...prev, [`paragraph3_${lang}`]: val}))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OUR VALUES */}
          {activeTab === 'values' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Our Values</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the section title and the core values grid displayed on the About Us page.</p>
                </div>
                <Button onClick={addValue} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10"><Plus size={16} className="mr-2" /> Add Value</Button>
              </div>
              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <TranslatableField 
                  label="Main Title"
                  baseValue={{ en: valuesHeader.title_en || valuesHeader.title, th: valuesHeader.title_th, my: valuesHeader.title_my, vi: valuesHeader.title_vi, ko: valuesHeader.title_ko, id: valuesHeader.title_id, ms: valuesHeader.title_ms, zh: valuesHeader.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setValuesHeader((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                />
                <TranslatableField 
                  label="Description"
                  isTextArea={true}
                  baseValue={{ en: valuesHeader.description_en || valuesHeader.description, th: valuesHeader.description_th, my: valuesHeader.description_my, vi: valuesHeader.description_vi, ko: valuesHeader.description_ko, id: valuesHeader.description_id, ms: valuesHeader.description_ms, zh: valuesHeader.description_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setValuesHeader((prev: any) => ({...prev, [`description_${lang}`]: val}))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.length === 0 && <p className="text-gray-400 py-8 col-span-2 text-center">No values added yet.</p>}
                {values.map((val) => (
                  <div key={val.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative group flex flex-col">
                    <button onClick={() => removeValue(val.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors z-10"><Trash2 size={16} /></button>
                    <div className="mb-6 flex justify-center">
                      <div className="w-16 h-16 flex-shrink-0">
                        <ImageUploader preview={val.iconPreview} circle small onUploadSuccess={(url: string) => updateValue(val.id, 'iconPreview', url)}/>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <TranslatableField 
                        label="Value Title"
                        baseValue={{ en: val.title_en || val.title, th: val.title_th, my: val.title_my, vi: val.title_vi, ko: val.title_ko, id: val.title_id, ms: val.title_ms, zh: val.title_zh }}
                        onUpdateTranslation={(lang: string, v: string) => updateValue(val.id, `title_${lang}`, v)}
                      />
                      <TranslatableField 
                        label="Description"
                        isTextArea={true}
                        baseValue={{ en: val.desc_en || val.desc, th: val.desc_th, my: val.desc_my, vi: val.desc_vi, ko: val.desc_ko, id: val.desc_id, ms: val.desc_ms, zh: val.desc_zh }}
                        onUpdateTranslation={(lang: string, v: string) => updateValue(val.id, `desc_${lang}`, v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: OUR TEAM */}
          {activeTab === 'team' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Our Team</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the profiles shown in the team grid.</p>
                </div>
                <Button onClick={addTeamMember} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Member
                </Button>
              </div>

              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <TranslatableField 
                  label="Main Title"
                  baseValue={{ en: teamHeader.title_en || teamHeader.title, th: teamHeader.title_th, my: teamHeader.title_my, vi: teamHeader.title_vi, ko: teamHeader.title_ko, id: teamHeader.title_id, ms: teamHeader.title_ms, zh: teamHeader.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setTeamHeader((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                />
                <TranslatableField 
                  label="Description"
                  isTextArea={true}
                  baseValue={{ en: teamHeader.description_en || teamHeader.description, th: teamHeader.description_th, my: teamHeader.description_my, vi: teamHeader.description_vi, ko: teamHeader.description_ko, id: teamHeader.description_id, ms: teamHeader.description_ms, zh: teamHeader.description_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setTeamHeader((prev: any) => ({...prev, [`description_${lang}`]: val}))}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teamMembers.length === 0 && <p className="text-gray-400 py-8 col-span-2 text-center">No team members added yet.</p>}
                
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative group flex gap-6 items-center">
                    <button onClick={() => removeTeamMember(member.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors z-10">
                      <Trash2 size={16} />
                    </button>
                    <div className="w-24 h-24 flex-shrink-0">
                      <ImageUploader preview={member.imagePreview} circle small onUploadSuccess={(url: string) => updateTeamMember(member.id, 'imagePreview', url)} />
                    </div>
                    <div className="flex-1 space-y-4 pr-4">
                      <TranslatableField 
                        label="Name"
                        baseValue={{ en: member.name_en || member.name, th: member.name_th, my: member.name_my, vi: member.name_vi, ko: member.name_ko, id: member.name_id, ms: member.name_ms, zh: member.name_zh }}
                        onUpdateTranslation={(lang: string, val: string) => updateTeamMember(member.id, `name_${lang}`, val)}
                      />
                      <TranslatableField 
                        label="Job Title"
                        baseValue={{ en: member.title_en || member.title, th: member.title_th, my: member.title_my, vi: member.title_vi, ko: member.title_ko, id: member.title_id, ms: member.title_ms, zh: member.title_zh }}
                        onUpdateTranslation={(lang: string, val: string) => updateTeamMember(member.id, `title_${lang}`, val)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AWARDS */}
          {activeTab === 'awards' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Awards & Recognition</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the logos/badges shown in the awards carousel.</p>
                </div>
                <Button onClick={addAward} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10">
                  <Plus size={16} className="mr-2" /> Add Award
                </Button>
              </div>

              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Section Headings</h3>
                <TranslatableField 
                  label="Main Title"
                  baseValue={{ en: awardsHeader.title_en || awardsHeader.title, th: awardsHeader.title_th, my: awardsHeader.title_my, vi: awardsHeader.title_vi, ko: awardsHeader.title_ko, id: awardsHeader.title_id, ms: awardsHeader.title_ms, zh: awardsHeader.title_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setAwardsHeader((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                />
                <TranslatableField 
                  label="Description"
                  isTextArea={true}
                  baseValue={{ en: awardsHeader.description_en || awardsHeader.description, th: awardsHeader.description_th, my: awardsHeader.description_my, vi: awardsHeader.description_vi, ko: awardsHeader.description_ko, id: awardsHeader.description_id, ms: awardsHeader.description_ms, zh: awardsHeader.description_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setAwardsHeader((prev: any) => ({...prev, [`description_${lang}`]: val}))}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {awards.length === 0 && <p className="text-gray-400 py-8 col-span-2 text-center">No awards added yet.</p>}
                
                {awards.map((award, index) => (
                  <div key={award.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative group flex flex-col sm:flex-row gap-6">
                    
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button onClick={() => moveAward(index, 'left')} disabled={index === 0} className="bg-white text-gray-600 p-1.5 rounded-md shadow-sm hover:bg-[#1B5E20] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all border border-gray-100"><ArrowLeft size={14} /></button>
                      <button onClick={() => moveAward(index, 'right')} disabled={index === awards.length - 1} className="bg-white text-gray-600 p-1.5 rounded-md shadow-sm hover:bg-[#1B5E20] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all border border-gray-100"><ArrowRight size={14} /></button>
                      <button onClick={() => removeAward(award.id)} className="bg-white text-red-500 p-1.5 rounded-md shadow-sm hover:bg-red-500 hover:text-white transition-all border border-gray-100"><Trash2 size={14} /></button>
                    </div>

                    <div className="w-full sm:w-1/3 flex flex-col gap-4">
                      <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <ImageUploader preview={award.imagePreview} onUploadSuccess={(url: string) => updateAward(award.id, 'imagePreview', url)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Year</label>
                        <input type="text" value={award.year || ''} onChange={(e) => updateAward(award.id, 'year', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none text-sm bg-white focus:border-[#1B5E20]" placeholder="e.g. 2024" />
                      </div>
                    </div>
                    
                    <div className="w-full sm:w-2/3 space-y-4 pt-4 sm:pt-0">
                      <TranslatableField 
                        label="Award Title"
                        baseValue={{ en: award.title_en || award.title, th: award.title_th, my: award.title_my, vi: award.title_vi, ko: award.title_ko, id: award.title_id, ms: award.title_ms, zh: award.title_zh }}
                        onUpdateTranslation={(lang: string, val: string) => updateAward(award.id, `title_${lang}`, val)}
                      />
                      <TranslatableField 
                        label="Description"
                        isTextArea={true}
                        baseValue={{ en: award.description_en || award.description, th: award.description_th, my: award.description_my, vi: award.description_vi, ko: award.description_ko, id: award.description_id, ms: award.description_ms, zh: award.description_zh }}
                        onUpdateTranslation={(lang: string, val: string) => updateAward(award.id, `description_${lang}`, val)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PARTNERSHIPS */}
          {activeTab === 'partners' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Strategic Partnerships</h2>
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
                  onUpdateTranslation={(lang: string, val: string) => setPartnersHeader((prev: any) => ({...prev, [`title_${lang}`]: val}))}
                />
                <TranslatableField 
                  label="Description"
                  isTextArea={true}
                  baseValue={{ en: partnersHeader.description_en || partnersHeader.description, th: partnersHeader.description_th, my: partnersHeader.description_my, vi: partnersHeader.description_vi, ko: partnersHeader.description_ko, id: partnersHeader.description_id, ms: partnersHeader.description_ms, zh: partnersHeader.description_zh }}
                  onUpdateTranslation={(lang: string, val: string) => setPartnersHeader((prev: any) => ({...prev, [`description_${lang}`]: val}))}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {partners.map((partner, index) => (
                  <div key={partner.id} className="relative group bg-gray-50 rounded-xl border border-gray-200 p-2 flex flex-col gap-2">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <ImageUploader preview={partner.imagePreview} onUploadSuccess={(url: string, fileName: string) => { updatePartner(partner.id, 'imagePreview', url); if(fileName) updatePartner(partner.id, 'fileName', fileName); }} />
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

function ImageUploader({ preview, circle, small, onUploadSuccess }: any) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileRef = ref(storage, `about-page/${Date.now()}_${file.name}`);
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
    <div className={`border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors w-full h-full ${circle ? 'rounded-full aspect-square' : 'rounded-xl min-h-[120px]'}`}>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center p-2 text-[#1B5E20]">
          <Loader2 className="animate-spin mb-1" size={small ? 16 : 24} />
        </div>
      ) : preview ? (
        <>
          <img src={preview} className="w-full h-full object-contain opacity-80 group-hover/upload:opacity-40 transition-opacity" alt="Preview" />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
            <UploadCloud className="text-[#1B5E20] mb-1" size={small ? 16 : 24} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-center text-gray-400">
          <ImageIcon size={small ? 20 : 32} className="mb-1" />
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
        translateText(baseValue.en, 'th'), translateText(baseValue.en, 'my'), translateText(baseValue.en, 'vi'),
        translateText(baseValue.en, 'ko'), translateText(baseValue.en, 'id'), translateText(baseValue.en, 'ms'), translateText(baseValue.en, 'zh-CN') 
      ]);
      
      onUpdateTranslation('th', thText); onUpdateTranslation('my', myText); onUpdateTranslation('vi', viText);
      onUpdateTranslation('ko', koText); onUpdateTranslation('id', idText); onUpdateTranslation('ms', msText); onUpdateTranslation('zh', zhText); 
      
      setShowLanguages(true); 
    } catch (error) {
      console.error("Translation failed", error);
      alert("Auto-translation failed. Check console for details.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-4">
      <div className="p-4 flex flex-col md:flex-row gap-4 items-start">
        
        {/* Left Side: Input area */}
        <div className="flex-1 w-full min-w-0">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
            🇬🇧 {label} <span className="text-gray-400 font-medium capitalize tracking-normal">(English base)</span>
          </label>
          {isTextArea ? (
            <textarea 
              rows={3} 
              value={baseValue.en || ''} 
              onChange={(e) => onUpdateTranslation('en', e.target.value)} 
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-colors resize-y min-w-0" 
            />
          ) : (
            <input 
              type="text" 
              value={baseValue.en || ''} 
              onChange={(e) => onUpdateTranslation('en', e.target.value)} 
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-colors min-w-0" 
            />
          )}
        </div>
        
        {/* Right Side: Stacked Buttons EXACTLY matching the screenshot */}
        <div className="w-full md:w-36 shrink-0 flex flex-col gap-1 md:pt-6">
          <Button 
            type="button" 
            onClick={handleAutoTranslate} 
            disabled={isTranslating} 
            className="w-full bg-[#76FF03] hover:bg-[#68e002] text-[#0a2e10] font-bold h-9 text-xs shadow-sm transition-colors"
          >
            {isTranslating ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} className="mr-1.5" />}
            Auto-Translate
          </Button>
          <button 
            type="button" 
            onClick={() => setShowLanguages(!showLanguages)} 
            className="w-full flex items-center justify-center gap-1.5 h-8 text-[11px] font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Languages size={14} /> {showLanguages ? 'Hide Languages' : 'Edit Languages'}
          </button>
        </div>

      </div>

      {showLanguages && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 grid grid-cols-1 gap-3">
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
              <span className="text-[10px] font-bold w-10 text-center bg-white border border-gray-200 py-1.5 rounded shrink-0 text-gray-600 uppercase tracking-wider">{lang.label}</span>
              {isTextArea ? (
                 <textarea rows={2} value={baseValue[lang.key] || ''} onChange={(e) => onUpdateTranslation(lang.key, e.target.value)} className="flex-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1B5E20] focus:border-[#1B5E20] min-w-0 bg-white" />
              ) : (
                 <input type="text" value={baseValue[lang.key] || ''} onChange={(e) => onUpdateTranslation(lang.key, e.target.value)} className="flex-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1B5E20] focus:border-[#1B5E20] min-w-0 bg-white" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}