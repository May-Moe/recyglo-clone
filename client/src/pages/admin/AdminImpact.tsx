import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, Layout, Target, Globe, Briefcase, Loader2, UploadCloud, Users, CheckSquare, Languages, Wand2, Trash2, Plus } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminImpact() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- DEFAULT STATE SCHEMA WITH TRANSLATION KEYS ---
  const defaultData = {
    hero: {
      subtitle_en: "Where waste ends and life begins",
      title_en: "Impact Report",
      desc_en: "Ocean Bound Plastic • Informal Worker Uplift • Women Empowerment Training",
      imagePreview: ""
    },
    bigNumbers: [
      { value: "1M+", label_en: "Lives Impacted" },
      { value: "100K+", label_en: "Tonnes Recycled" },
      { value: "$2M+", label_en: "Invested in Communities" }
    ],
    regional: {
      title_en: "ESG Operations in 8 Countries",
      desc_en: "With our headquarters in Singapore, our regional scale spans across the APAC region, allowing us to replicate our verified impact model alongside 400+ partners.",
      countries_en: "Singapore (HQ), Thailand, Myanmar, Vietnam, Malaysia, Indonesia, South Korea, Australia"
    },
    lever2: {
      label_en: "Lever 2: Economic Access",
      title_en: "Informal Worker Formalization",
      desc_en: "In Thailand, 1.5 million informal collectors contribute to ~60% of collection, generating over 500M THB in economic value, yet have zero recognition in current systems. We are changing that.",
      highlight_en: "Through our Wongpanit partnership (2000+ outlets), verified collectors see a 20% income uplift.",
      imagePreview: "",
      steps: [
        { num: "01", title_en: "A digital identity is created", desc_en: "KYC mapped to collections logged by weight, date, and material—a verifiable income record." },
        { num: "02", title_en: "EPR value flows directly to them", desc_en: "Brands paying for compliance generate payments traceable directly to the specific collector." },
        { num: "03", title_en: "Financial access unlocks", desc_en: "Income records act as a precondition for micro-credit and bank account eligibility." }
      ]
    },
    lever3: {
      label_en: "Lever 3: Market Access",
      title_en: "Ocean Bound Plastic",
      desc1_en: "When Maya Bay closed for 3.5 years, the local tourism economy lost 555M THB per season. Meanwhile, local Moken collectors earned just ~200 THB selling plastic for scraps.",
      desc2_en: "Today, RecyGlo x Second Life operate an Ocean Bound Plastic (OBP) interception network across 50km of Thailand's coastline.",
      note_en: "*5% of program revenue is committed directly back to community development and training.",
      imagePreview: "",
      stats: [
        { value_en: "1,436", label_en: "Active Collectors" },
        { value_en: "52%", label_en: "Are Women" },
        { value_en: "~30%", label_en: "Income Uplift" },
        { value_en: "11K+", label_en: "People Impacted" }
      ]
    },
    lever1: {
      label_en: "Lever 1: Skill Access",
      title_en: "Women & Youth Empowerment",
      featureTitle_en: "Her name is Htet Htet Hlwan Moe.",
      featureDesc_en: "She was 15 when conflict closed her school in Myanmar. No credentials. No income pathway. No way forward. Through SheWorks, she graduated and was placed. Her classmates are now training others.",
      featureImage: "",
      checklist: [
        { text_en: "240+ Women & Youth Placed" }, 
        { text_en: "964 Trained & Tracking" }, 
        { text_en: "UNESCO TVET Certified Pathway" }
      ],
      women: [
        { name_en: "Ma Thin Htet Htet San", role_en: "Myanmar Jewelry", desc_en: "Now training war-affected civilians in four cities—one graduate who became a trainer.", imagePreview: "" },
        { name_en: "Ma Mi Zin Tun", role_en: "Mushroom Cultivation", desc_en: "Built a micro-farm at home; supporting her family through a self-sustaining income stream.", imagePreview: "" },
        { name_en: "Ms. Klinthoop Arunchokthaworn", role_en: "Chiang Mai Green Roots", desc_en: "Transforming her guesthouse into a sustainable tourism operation.", imagePreview: "" }
      ]
    },
    goals: {
      title_en: "Our Goals for Future Expansion",
      items: [
        { value_en: "10,000 Tonnes", desc_en: "Of Ocean Bound Plastic intercepted via coastal corridor expansion." },
        { value_en: "10,000 Collectors", desc_en: "Formalized into digital income and EPR systems." },
        { value_en: "3,500 Graduates", desc_en: "Certified and empowered through SheWorks cohorts." }
      ]
    },
    sdgs: {
      title_en: "Aligned with UN Sustainable Development Goals",
      items: [
        { num: "8", name_en: "Decent Work" },
        { num: "12", name_en: "Responsible Production" },
        { num: "13", name_en: "Climate Action" },
        { num: "14", name_en: "Life Below Water" },
        { num: "5", name_en: "Gender Equality" },
        { num: "11", name_en: "Sustainable Cities" }
      ]
    }
  };

  const [data, setData] = useState<any>(defaultData);

  // --- 1. FETCH INITIAL DATA FROM FIREBASE ON LOAD ---
  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const docRef = doc(db, "website_content", "impact_page");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const dbData = docSnap.data();
          
          // Data Migration to ensure arrays are valid objects
          if (dbData.lever1 && Array.isArray(dbData.lever1.checklist) && typeof dbData.lever1.checklist[0] === 'string') {
            dbData.lever1.checklist = dbData.lever1.checklist.map((item: string) => ({ text_en: item }));
          }

          setData({ ...defaultData, ...dbData }); 
        }
      } catch (error) {
        console.error("Error fetching impact page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  // --- 2. SAVE EVERYTHING TO FIREBASE ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "website_content", "impact_page");
      await setDoc(docRef, { ...data, lastUpdated: new Date() }, { merge: true });
      alert("Impact Page successfully updated in the database!");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save changes. Check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- STATE HANDLERS ---
  const handleSectionChange = (section: string, field: string, value: string) => {
    setData((prev: any) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleArrayChange = (section: string, arrayField: string, index: number, field: string, value: string) => {
    setData((prev: any) => {
      const newArray = [...prev[section][arrayField]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: { ...prev[section], [arrayField]: newArray } };
    });
  };

  const handleRootArrayChange = (arrayField: string, index: number, field: string, value: string) => {
    setData((prev: any) => {
      const newArray = [...prev[arrayField]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayField]: newArray };
    });
  };

  const addChecklistItem = () => {
    setData((prev: any) => ({ ...prev, lever1: { ...prev.lever1, checklist: [...prev.lever1.checklist, { text_en: "" }] } }));
  };

  const removeChecklistItem = (idx: number) => {
    setData((prev: any) => {
      const arr = [...prev.lever1.checklist];
      arr.splice(idx, 1);
      return { ...prev, lever1: { ...prev.lever1, checklist: arr } };
    });
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Impact Page</h1>
          <p className="text-gray-500 text-sm">Update the statistics, stories, and regional data on your impact report.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2 px-6">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />} Save All Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE: Tab Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <TabButton id="hero" label="Hero & Regional Scale" icon={<Layout size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="lever2" label="Lever 2: Workers" icon={<Briefcase size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="lever3" label="Lever 3: Ocean" icon={<Globe size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="lever1" label="Lever 1: SheWorks" icon={<Users size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="goals" label="Goals & SDGs" icon={<Target size={18} />} activeTab={activeTab} onClick={setActiveTab} />
        </div>

        {/* RIGHT SIDE: Editor Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[500px]">
          
          {/* TAB 1: HERO & REGIONAL */}
          {activeTab === 'hero' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4 space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Hero Background</label>
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden shadow-sm">
                      <ImageUploader preview={data.hero.imagePreview} onUploadSuccess={(url: string) => handleSectionChange('hero', 'imagePreview', url)} />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-4 pt-1">
                    <TranslatableField 
                      label="Small Subtitle"
                      baseValue={{ en: data.hero.subtitle_en || data.hero.subtitle, th: data.hero.subtitle_th, my: data.hero.subtitle_my, vi: data.hero.subtitle_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('hero', `subtitle_${lang}`, val)}
                    />
                    <TranslatableField 
                      label="Main Title"
                      baseValue={{ en: data.hero.title_en || data.hero.title, th: data.hero.title_th, my: data.hero.title_my, vi: data.hero.title_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('hero', `title_${lang}`, val)}
                    />
                    <TranslatableField 
                      label="Description (Bullets)"
                      baseValue={{ en: data.hero.desc_en || data.hero.desc, th: data.hero.desc_th, my: data.hero.desc_my, vi: data.hero.desc_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('hero', `desc_${lang}`, val)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">The Big 3 Numbers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.bigNumbers.map((stat: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                        <input type="text" value={stat.value} onChange={(e) => handleRootArrayChange('bigNumbers', idx, 'value', e.target.value)} className="w-full px-3 py-2 text-xl font-bold border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <TranslatableField 
                        label="Label"
                        baseValue={{ en: stat.label_en || stat.label, th: stat.label_th, my: stat.label_my, vi: stat.label_vi }}
                        onUpdateTranslation={(lang: string, val: string) => handleRootArrayChange('bigNumbers', idx, `label_${lang}`, val)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Regional Scale Box</h3>
                <div className="space-y-4">
                  <TranslatableField 
                    label="Box Title"
                    baseValue={{ en: data.regional.title_en || data.regional.title, th: data.regional.title_th, my: data.regional.title_my, vi: data.regional.title_vi }}
                    onUpdateTranslation={(lang: string, val: string) => handleSectionChange('regional', `title_${lang}`, val)}
                  />
                  <TranslatableField 
                    label="Description"
                    isTextArea={true}
                    baseValue={{ en: data.regional.desc_en || data.regional.desc, th: data.regional.desc_th, my: data.regional.desc_my, vi: data.regional.desc_vi }}
                    onUpdateTranslation={(lang: string, val: string) => handleSectionChange('regional', `desc_${lang}`, val)}
                  />
                  <TranslatableField 
                    label="Countries (Comma separated tags)"
                    isTextArea={true}
                    baseValue={{ en: data.regional.countries_en || data.regional.countries, th: data.regional.countries_th, my: data.regional.countries_my, vi: data.regional.countries_vi }}
                    onUpdateTranslation={(lang: string, val: string) => handleSectionChange('regional', `countries_${lang}`, val)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEVER 2 (WORKERS) */}
          {activeTab === 'lever2' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Lever 2 Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4 space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Section Image</label>
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden shadow-sm">
                      <ImageUploader preview={data.lever2.imagePreview} onUploadSuccess={(url: string) => handleSectionChange('lever2', 'imagePreview', url)} />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <TranslatableField 
                      label="Small Top Label (Orange)"
                      baseValue={{ en: data.lever2.label_en || data.lever2.label, th: data.lever2.label_th, my: data.lever2.label_my, vi: data.lever2.label_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever2', `label_${lang}`, val)}
                    />
                    <TranslatableField 
                      label="Main Title"
                      baseValue={{ en: data.lever2.title_en || data.lever2.title, th: data.lever2.title_th, my: data.lever2.title_my, vi: data.lever2.title_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever2', `title_${lang}`, val)}
                    />
                    <TranslatableField 
                      label="Description Paragraph"
                      isTextArea={true}
                      baseValue={{ en: data.lever2.desc_en || data.lever2.desc, th: data.lever2.desc_th, my: data.lever2.desc_my, vi: data.lever2.desc_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever2', `desc_${lang}`, val)}
                    />
                    <TranslatableField 
                      label="Highlight Box Text (Bottom)"
                      baseValue={{ en: data.lever2.highlight_en || data.lever2.highlight, th: data.lever2.highlight_th, my: data.lever2.highlight_my, vi: data.lever2.highlight_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever2', `highlight_${lang}`, val)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">The 3 Steps</h3>
                <div className="space-y-4">
                  {data.lever2.steps.map((step: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="w-16">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Num</label>
                        <input type="text" value={step.num} onChange={(e) => handleArrayChange('lever2', 'steps', idx, 'num', e.target.value)} className="w-full px-3 py-2 font-bold text-center border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <TranslatableField 
                          label="Step Title"
                          baseValue={{ en: step.title_en || step.title, th: step.title_th, my: step.title_my, vi: step.title_vi }}
                          onUpdateTranslation={(lang: string, val: string) => handleArrayChange('lever2', 'steps', idx, `title_${lang}`, val)}
                        />
                        <TranslatableField 
                          label="Step Description"
                          isTextArea={true}
                          baseValue={{ en: step.desc_en || step.desc, th: step.desc_th, my: step.desc_my, vi: step.desc_vi }}
                          onUpdateTranslation={(lang: string, val: string) => handleArrayChange('lever2', 'steps', idx, `desc_${lang}`, val)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEVER 3 (OCEAN) */}
          {activeTab === 'lever3' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Lever 3 Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4 space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Section Image</label>
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden shadow-sm">
                      <ImageUploader preview={data.lever3.imagePreview} onUploadSuccess={(url: string) => handleSectionChange('lever3', 'imagePreview', url)} />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <TranslatableField 
                      label="Small Top Label (Orange)"
                      baseValue={{ en: data.lever3.label_en || data.lever3.label, th: data.lever3.label_th, my: data.lever3.label_my, vi: data.lever3.label_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever3', `label_${lang}`, val)}
                    />
                    <TranslatableField 
                      label="Main Title"
                      baseValue={{ en: data.lever3.title_en || data.lever3.title, th: data.lever3.title_th, my: data.lever3.title_my, vi: data.lever3.title_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever3', `title_${lang}`, val)}
                    />
                    <TranslatableField 
                      label="Paragraph 1"
                      isTextArea={true}
                      baseValue={{ en: data.lever3.desc1_en || data.lever3.desc1, th: data.lever3.desc1_th, my: data.lever3.desc1_my, vi: data.lever3.desc1_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever3', `desc1_${lang}`, val)}
                    />
                    <TranslatableField 
                      label="Paragraph 2"
                      isTextArea={true}
                      baseValue={{ en: data.lever3.desc2_en || data.lever3.desc2, th: data.lever3.desc2_th, my: data.lever3.desc2_my, vi: data.lever3.desc2_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever3', `desc2_${lang}`, val)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Small Statistics Grid & Note</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {data.lever3.stats.map((stat: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                      <TranslatableField 
                        label="Value (e.g. 11K+)"
                        baseValue={{ en: stat.value_en || stat.value, th: stat.value_th, my: stat.value_my, vi: stat.value_vi }}
                        onUpdateTranslation={(lang: string, val: string) => handleArrayChange('lever3', 'stats', idx, `value_${lang}`, val)}
                      />
                      <TranslatableField 
                        label="Label"
                        baseValue={{ en: stat.label_en || stat.label, th: stat.label_th, my: stat.label_my, vi: stat.label_vi }}
                        onUpdateTranslation={(lang: string, val: string) => handleArrayChange('lever3', 'stats', idx, `label_${lang}`, val)}
                      />
                    </div>
                  ))}
                </div>
                <TranslatableField 
                  label="Italic Footer Note"
                  baseValue={{ en: data.lever3.note_en || data.lever3.note, th: data.lever3.note_th, my: data.lever3.note_my, vi: data.lever3.note_vi }}
                  onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever3', `note_${lang}`, val)}
                />
              </div>
            </div>
          )}

          {/* TAB 5: LEVER 1 (SHEWORKS) */}
          {activeTab === 'lever1' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Lever 1 Title</h3>
                <div className="space-y-4">
                  <TranslatableField 
                    label="Small Top Label (Orange)"
                    baseValue={{ en: data.lever1.label_en || data.lever1.label, th: data.lever1.label_th, my: data.lever1.label_my, vi: data.lever1.label_vi }}
                    onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever1', `label_${lang}`, val)}
                  />
                  <TranslatableField 
                    label="Main Title"
                    baseValue={{ en: data.lever1.title_en || data.lever1.title, th: data.lever1.title_th, my: data.lever1.title_my, vi: data.lever1.title_vi }}
                    onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever1', `title_${lang}`, val)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Main Feature Box (Htet Htet)</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="md:col-span-4 space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Feature Image</label>
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden shadow-sm">
                      <ImageUploader preview={data.lever1.featureImage} onUploadSuccess={(url: string) => handleSectionChange('lever1', 'featureImage', url)} />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <TranslatableField 
                      label="Box Title"
                      baseValue={{ en: data.lever1.featureTitle_en || data.lever1.featureTitle, th: data.lever1.featureTitle_th, my: data.lever1.featureTitle_my, vi: data.lever1.featureTitle_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever1', `featureTitle_${lang}`, val)}
                    />
                    <TranslatableField 
                      label="Box Story"
                      isTextArea={true}
                      baseValue={{ en: data.lever1.featureDesc_en || data.lever1.featureDesc, th: data.lever1.featureDesc_th, my: data.lever1.featureDesc_my, vi: data.lever1.featureDesc_vi }}
                      onUpdateTranslation={(lang: string, val: string) => handleSectionChange('lever1', `featureDesc_${lang}`, val)}
                    />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-bold text-gray-700">Checklist Items</label>
                        <Button onClick={addChecklistItem} variant="outline" size="sm" className="h-7 text-xs"><Plus size={14} className="mr-1" /> Add</Button>
                      </div>
                      <div className="space-y-3">
                        {data.lever1.checklist.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <CheckSquare size={18} className="text-[#E2552B] shrink-0 mt-2" />
                            <div className="flex-1">
                              <TranslatableField 
                                label={`Checklist Item ${idx + 1}`}
                                baseValue={{ en: item.text_en || item.text, th: item.text_th, my: item.text_my, vi: item.text_vi }}
                                onUpdateTranslation={(lang: string, val: string) => handleArrayChange('lever1', 'checklist', idx, `text_${lang}`, val)}
                              />
                            </div>
                            <button onClick={() => removeChecklistItem(idx)} className="text-gray-400 hover:text-red-500 mt-2"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">The 3 Women Grid</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.lever1.women.map((woman: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-4">
                      <div className="w-24 h-24 mx-auto shrink-0 shadow-sm rounded-full overflow-hidden">
                        <ImageUploader circle small preview={woman.imagePreview} onUploadSuccess={(url: string) => handleArrayChange('lever1', 'women', idx, 'imagePreview', url)} />
                      </div>
                      <TranslatableField 
                        label="Name"
                        baseValue={{ en: woman.name_en || woman.name, th: woman.name_th, my: woman.name_my, vi: woman.name_vi }}
                        onUpdateTranslation={(lang: string, val: string) => handleArrayChange('lever1', 'women', idx, `name_${lang}`, val)}
                      />
                      <TranslatableField 
                        label="Orange Role/Project"
                        baseValue={{ en: woman.role_en || woman.role, th: woman.role_th, my: woman.role_my, vi: woman.role_vi }}
                        onUpdateTranslation={(lang: string, val: string) => handleArrayChange('lever1', 'women', idx, `role_${lang}`, val)}
                      />
                      <TranslatableField 
                        label="Short Bio"
                        isTextArea={true}
                        baseValue={{ en: woman.desc_en || woman.desc, th: woman.desc_th, my: woman.desc_my, vi: woman.desc_vi }}
                        onUpdateTranslation={(lang: string, val: string) => handleArrayChange('lever1', 'women', idx, `desc_${lang}`, val)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GOALS & SDGS */}
          {activeTab === 'goals' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Future Expansion Goals</h3>
                <div className="mb-6">
                  <TranslatableField 
                    label="Section Title"
                    baseValue={{ en: data.goals.title_en || data.goals.title, th: data.goals.title_th, my: data.goals.title_my, vi: data.goals.title_vi }}
                    onUpdateTranslation={(lang: string, val: string) => handleSectionChange('goals', `title_${lang}`, val)}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {data.goals.items.map((goal: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                      <TranslatableField 
                        label="Target Value"
                        baseValue={{ en: goal.value_en || goal.value, th: goal.value_th, my: goal.value_my, vi: goal.value_vi }}
                        onUpdateTranslation={(lang: string, val: string) => handleArrayChange('goals', 'items', idx, `value_${lang}`, val)}
                      />
                      <TranslatableField 
                        label="Detail Text"
                        isTextArea={true}
                        baseValue={{ en: goal.desc_en || goal.desc, th: goal.desc_th, my: goal.desc_my, vi: goal.desc_vi }}
                        onUpdateTranslation={(lang: string, val: string) => handleArrayChange('goals', 'items', idx, `desc_${lang}`, val)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">UN SDGs</h3>
                <div className="mb-6">
                  <TranslatableField 
                    label="Section Title"
                    baseValue={{ en: data.sdgs.title_en || data.sdgs.title, th: data.sdgs.title_th, my: data.sdgs.title_my, vi: data.sdgs.title_vi }}
                    onUpdateTranslation={(lang: string, val: string) => handleSectionChange('sdgs', `title_${lang}`, val)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.sdgs.items.map((sdg: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex gap-4">
                      <div className="w-16">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">SDG #</label>
                        <input type="text" value={sdg.num} onChange={(e) => handleArrayChange('sdgs', 'items', idx, 'num', e.target.value)} className="w-full px-2 py-2 text-center font-bold border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div className="flex-1">
                        <TranslatableField 
                          label="Name"
                          baseValue={{ en: sdg.name_en || sdg.name, th: sdg.name_th, my: sdg.name_my, vi: sdg.name_vi }}
                          onUpdateTranslation={(lang: string, val: string) => handleArrayChange('sdgs', 'items', idx, `name_${lang}`, val)}
                        />
                      </div>
                    </div>
                  ))}
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
      const fileRef = ref(storage, `impact-page/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      if (onUploadSuccess) onUploadSuccess(url);
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
      {isUploading ? <Loader2 className="animate-spin mb-2 text-[#1B5E20]" size={small ? 20 : 32} /> : preview ? (
        <><img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" /><div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity"><UploadCloud className="text-[#1B5E20] mb-1" size={small ? 16 : 24} /></div></>
      ) : <UploadCloud className="text-gray-400" size={small ? 20 : 32} />}
    </div>
  );
}

// --- REUSABLE AUTO-TRANSLATE FIELD ---
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

      const [thText, myText, viText] = await Promise.all([
        translateText(baseValue.en, 'th'),
        translateText(baseValue.en, 'my'),
        translateText(baseValue.en, 'vi')
      ]);
      
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
        <div className="p-3 grid grid-cols-1 gap-3 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-8 text-center bg-gray-100 p-1 rounded">TH</span>
            {isTextArea ? <textarea rows={2} value={baseValue.th || ''} onChange={(e) => onUpdateTranslation('th', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" /> : <input type="text" value={baseValue.th || ''} onChange={(e) => onUpdateTranslation('th', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" />}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-8 text-center bg-gray-100 p-1 rounded">MY</span>
            {isTextArea ? <textarea rows={2} value={baseValue.my || ''} onChange={(e) => onUpdateTranslation('my', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" /> : <input type="text" value={baseValue.my || ''} onChange={(e) => onUpdateTranslation('my', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" />}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-8 text-center bg-gray-100 p-1 rounded">VN</span>
            {isTextArea ? <textarea rows={2} value={baseValue.vi || ''} onChange={(e) => onUpdateTranslation('vi', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" /> : <input type="text" value={baseValue.vi || ''} onChange={(e) => onUpdateTranslation('vi', e.target.value)} className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1B5E20]" />}
          </div>
        </div>
      )}
    </div>
  );
}