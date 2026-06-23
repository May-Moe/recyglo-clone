import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, Layout, Target, Globe, AlertTriangle, Briefcase, Loader2, UploadCloud, Users, ListChecks, CheckSquare } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminImpact() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- DEFAULT STATE SCHEMA (Matches your Impact.tsx content exactly) ---
  const defaultData = {
    hero: {
      subtitle: "Where waste ends and life begins",
      title: "Impact Report",
      desc: "Ocean Bound Plastic • Informal Worker Uplift • Women Empowerment Training",
      imagePreview: ""
    },
    bigNumbers: [
      { value: "1M+", label: "Lives Impacted" },
      { value: "100K+", label: "Tonnes Recycled" },
      { value: "$2M+", label: "Invested in Communities" }
    ],
    regional: {
      title: "ESG Operations in 8 Countries",
      desc: "With our headquarters in Singapore, our regional scale spans across the APAC region, allowing us to replicate our verified impact model alongside 400+ partners.",
      countries: "Singapore (HQ), Thailand, Myanmar, Vietnam, Malaysia, Indonesia, South Korea, Australia"
    },
    crisis: {
      title: "The Broken System",
      desc: "The cost of current waste systems is borne by those least able to afford it: coastal communities facing destroyed tourism, informal waste pickers with no social stability, and displaced youth.",
      stats: [
        { value: "27M", label: "Tonnes of plastic waste", desc: "Generated across Southeast Asia every year." },
        { value: "79%", label: "Never properly recycled", desc: "Entering rivers, coastlines, and oceans." },
        { value: "15-20M", label: "Informal waste pickers", desc: "Across ASEAN, earning just $0-$2/day doing 60% of the recycling." }
      ]
    },
    lever2: {
      label: "Lever 2: Economic Access",
      title: "Informal Worker Formalization",
      desc: "In Thailand, 1.5 million informal collectors contribute to ~60% of collection, generating over 500M THB in economic value, yet have zero recognition in current systems. We are changing that.",
      highlight: "Through our Wongpanit partnership (2000+ outlets), verified collectors see a 20% income uplift.",
      imagePreview: "",
      steps: [
        { num: "01", title: "A digital identity is created", desc: "KYC mapped to collections logged by weight, date, and material—a verifiable income record." },
        { num: "02", title: "EPR value flows directly to them", desc: "Brands paying for compliance generate payments traceable directly to the specific collector." },
        { num: "03", title: "Financial access unlocks", desc: "Income records act as a precondition for micro-credit and bank account eligibility." }
      ]
    },
    lever3: {
      label: "Lever 3: Market Access",
      title: "Ocean Bound Plastic",
      desc1: "When Maya Bay closed for 3.5 years, the local tourism economy lost 555M THB per season. Meanwhile, local Moken collectors earned just ~200 THB selling plastic for scraps.",
      desc2: "Today, RecyGlo x Second Life operate an Ocean Bound Plastic (OBP) interception network across 50km of Thailand's coastline.",
      note: "*5% of program revenue is committed directly back to community development and training.",
      imagePreview: "",
      stats: [
        { value: "1,436", label: "Active Collectors" },
        { value: "52%", label: "Are Women" },
        { value: "~30%", label: "Income Uplift" },
        { value: "11K+", label: "People Impacted" }
      ]
    },
    lever1: {
      label: "Lever 1: Skill Access",
      title: "Women & Youth Empowerment",
      featureTitle: "Her name is Htet Htet Hlwan Moe.",
      featureDesc: "She was 15 when conflict closed her school in Myanmar. No credentials. No income pathway. No way forward. Through SheWorks, she graduated and was placed. Her classmates are now training others.",
      featureImage: "",
      checklist: ["240+ Women & Youth Placed", "964 Trained & Tracking", "UNESCO TVET Certified Pathway"],
      women: [
        { name: "Ma Thin Htet Htet San", role: "Myanmar Jewelry", desc: "Now training war-affected civilians in four cities—one graduate who became a trainer.", imagePreview: "" },
        { name: "Ma Mi Zin Tun", role: "Mushroom Cultivation", desc: "Built a micro-farm at home; supporting her family through a self-sustaining income stream.", imagePreview: "" },
        { name: "Ms. Klinthoop Arunchokthaworn", role: "Chiang Mai Green Roots", desc: "Transforming her guesthouse into a sustainable tourism operation.", imagePreview: "" }
      ]
    },
    goals: {
      title: "Our Goals for Future Expansion",
      items: [
        { value: "10,000 Tonnes", desc: "Of Ocean Bound Plastic intercepted via coastal corridor expansion." },
        { value: "10,000 Collectors", desc: "Formalized into digital income and EPR systems." },
        { value: "3,500 Graduates", desc: "Certified and empowered through SheWorks cohorts." }
      ]
    },
    sdgs: {
      title: "Aligned with UN Sustainable Development Goals",
      items: [
        { num: "8", name: "Decent Work" },
        { num: "12", name: "Responsible Production" },
        { num: "13", name: "Climate Action" },
        { num: "14", name: "Life Below Water" },
        { num: "5", name: "Gender Equality" },
        { num: "11", name: "Sustainable Cities" }
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
          setData({ ...defaultData, ...docSnap.data() }); // Merge DB data over defaults
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

  const handleStringArrayChange = (section: string, arrayField: string, index: number, value: string) => {
    setData((prev: any) => {
      const newArray = [...prev[section][arrayField]];
      newArray[index] = value;
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


  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Impact Page</h1>
          <p className="text-gray-500 text-sm">Update the statistics, stories, and regional data on your impact report.</p>
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
          <TabButton id="hero" label="Hero & Regional Scale" icon={<Layout size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          {/* <TabButton id="crisis" label="The Broken System" icon={<AlertTriangle size={18} />} activeTab={activeTab} onClick={setActiveTab} /> */}
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
                    <div className="aspect-[4/3] w-full">
                      <ImageUploader 
                        preview={data.hero.imagePreview} 
                        onUploadSuccess={(url: string) => handleSectionChange('hero', 'imagePreview', url)} 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-4 pt-1">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Small Subtitle</label>
                      <input type="text" value={data.hero.subtitle} onChange={(e) => handleSectionChange('hero', 'subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                      <input type="text" value={data.hero.title} onChange={(e) => handleSectionChange('hero', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Description (Bullets)</label>
                      <input type="text" value={data.hero.desc} onChange={(e) => handleSectionChange('hero', 'desc', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                    </div>
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
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Label</label>
                        <input type="text" value={stat.label} onChange={(e) => handleRootArrayChange('bigNumbers', idx, 'label', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Regional Scale Box</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Box Title</label>
                    <input type="text" value={data.regional.title} onChange={(e) => handleSectionChange('regional', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea rows={3} value={data.regional.desc} onChange={(e) => handleSectionChange('regional', 'desc', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Countries (Comma separated)</label>
                    <textarea rows={2} value={data.regional.countries} onChange={(e) => handleSectionChange('regional', 'countries', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white text-sm" placeholder="Singapore, Thailand, Vietnam..." />
                    <p className="text-xs text-gray-400 mt-1">These will automatically split into individual tags on the website.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THE BROKEN SYSTEM */}
          {/* {activeTab === 'crisis' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Section Intro</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                    <input type="text" value={data.crisis.title} onChange={(e) => handleSectionChange('crisis', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description Paragraph</label>
                    <textarea rows={3} value={data.crisis.desc} onChange={(e) => handleSectionChange('crisis', 'desc', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Crisis Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.crisis.stats.map((stat: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Big Number</label>
                        <input type="text" value={stat.value} onChange={(e) => handleArrayChange('crisis', 'stats', idx, 'value', e.target.value)} className="w-full px-3 py-2 text-xl font-bold border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bold Label</label>
                        <input type="text" value={stat.label} onChange={(e) => handleArrayChange('crisis', 'stats', idx, 'label', e.target.value)} className="w-full px-3 py-2 text-sm font-bold border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Detail Text</label>
                        <textarea rows={2} value={stat.desc} onChange={(e) => handleArrayChange('crisis', 'stats', idx, 'desc', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )} */}

          {/* TAB 3: LEVER 2 (WORKERS) */}
          {activeTab === 'lever2' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Lever 2 Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4 space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Section Image</label>
                    <div className="aspect-[4/3] w-full">
                      <ImageUploader 
                        preview={data.lever2.imagePreview} 
                        onUploadSuccess={(url: string) => handleSectionChange('lever2', 'imagePreview', url)} 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Small Top Label (Orange)</label>
                      <input type="text" value={data.lever2.label} onChange={(e) => handleSectionChange('lever2', 'label', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                      <input type="text" value={data.lever2.title} onChange={(e) => handleSectionChange('lever2', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Description Paragraph</label>
                      <textarea rows={3} value={data.lever2.desc} onChange={(e) => handleSectionChange('lever2', 'desc', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Highlight Box Text (Bottom)</label>
                      <input type="text" value={data.lever2.highlight} onChange={(e) => handleSectionChange('lever2', 'highlight', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                    </div>
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
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Step Title</label>
                        <input type="text" value={step.title} onChange={(e) => handleArrayChange('lever2', 'steps', idx, 'title', e.target.value)} className="w-full px-3 py-2 font-bold border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20] mb-2" />
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Step Description</label>
                        <textarea rows={2} value={step.desc} onChange={(e) => handleArrayChange('lever2', 'steps', idx, 'desc', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
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
                    <div className="aspect-[4/3] w-full">
                      <ImageUploader 
                        preview={data.lever3.imagePreview} 
                        onUploadSuccess={(url: string) => handleSectionChange('lever3', 'imagePreview', url)} 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Small Top Label (Orange)</label>
                      <input type="text" value={data.lever3.label} onChange={(e) => handleSectionChange('lever3', 'label', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                      <input type="text" value={data.lever3.title} onChange={(e) => handleSectionChange('lever3', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Paragraph 1</label>
                      <textarea rows={3} value={data.lever3.desc1} onChange={(e) => handleSectionChange('lever3', 'desc1', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Paragraph 2</label>
                      <textarea rows={2} value={data.lever3.desc2} onChange={(e) => handleSectionChange('lever3', 'desc2', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Small Statistics Grid & Note</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {data.lever3.stats.map((stat: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                        <input type="text" value={stat.value} onChange={(e) => handleArrayChange('lever3', 'stats', idx, 'value', e.target.value)} className="w-full px-2 py-1.5 font-bold border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Label</label>
                        <input type="text" value={stat.label} onChange={(e) => handleArrayChange('lever3', 'stats', idx, 'label', e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Italic Footer Note</label>
                  <input type="text" value={data.lever3.note} onChange={(e) => handleSectionChange('lever3', 'note', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white italic text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LEVER 1 (SHEWORKS) */}
          {activeTab === 'lever1' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Lever 1 Title</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Small Top Label (Orange)</label>
                    <input type="text" value={data.lever1.label} onChange={(e) => handleSectionChange('lever1', 'label', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={data.lever1.title} onChange={(e) => handleSectionChange('lever1', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Main Feature Box (Htet Htet)</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="md:col-span-4 space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Feature Image</label>
                    <div className="aspect-[4/3] w-full">
                      <ImageUploader 
                        preview={data.lever1.featureImage} 
                        onUploadSuccess={(url: string) => handleSectionChange('lever1', 'featureImage', url)} 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Box Title</label>
                      <input type="text" value={data.lever1.featureTitle} onChange={(e) => handleSectionChange('lever1', 'featureTitle', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Box Story</label>
                      <textarea rows={3} value={data.lever1.featureDesc} onChange={(e) => handleSectionChange('lever1', 'featureDesc', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Checklist Items</label>
                      <div className="space-y-2">
                        {data.lever1.checklist.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckSquare size={18} className="text-[#E2552B] shrink-0" />
                            <input type="text" value={item} onChange={(e) => handleStringArrayChange('lever1', 'checklist', idx, e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20] bg-white" />
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
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3">
                      <div className="w-24 h-24 mx-auto shrink-0">
                        <ImageUploader 
                          preview={woman.imagePreview} 
                          circle 
                          small
                          onUploadSuccess={(url: string) => handleArrayChange('lever1', 'women', idx, 'imagePreview', url)} 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                        <input type="text" value={woman.name} onChange={(e) => handleArrayChange('lever1', 'women', idx, 'name', e.target.value)} className="w-full px-3 py-1.5 font-bold text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Orange Role/Project</label>
                        <input type="text" value={woman.role} onChange={(e) => handleArrayChange('lever1', 'women', idx, 'role', e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Short Bio</label>
                        <textarea rows={3} value={woman.desc} onChange={(e) => handleArrayChange('lever1', 'women', idx, 'desc', e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
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
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                  <input type="text" value={data.goals.title} onChange={(e) => handleSectionChange('goals', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.goals.items.map((goal: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Value</label>
                        <input type="text" value={goal.value} onChange={(e) => handleArrayChange('goals', 'items', idx, 'value', e.target.value)} className="w-full px-3 py-2 text-lg font-bold border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Detail Text</label>
                        <textarea rows={2} value={goal.desc} onChange={(e) => handleArrayChange('goals', 'items', idx, 'desc', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">UN SDGs</h3>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                  <input type="text" value={data.sdgs.title} onChange={(e) => handleSectionChange('sdgs', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {data.sdgs.items.map((sdg: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-center">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">SDG #</label>
                        <input type="text" value={sdg.num} onChange={(e) => handleArrayChange('sdgs', 'items', idx, 'num', e.target.value)} className="w-full px-2 py-1 text-center font-bold border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Name</label>
                        <input type="text" value={sdg.name} onChange={(e) => handleArrayChange('sdgs', 'items', idx, 'name', e.target.value)} className="w-full px-2 py-1 text-xs text-center border border-gray-200 rounded focus:outline-none focus:border-[#1B5E20]" />
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