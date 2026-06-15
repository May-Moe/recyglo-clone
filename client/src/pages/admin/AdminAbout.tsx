import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, Layout, Users, BookOpen, Trophy, Plus, Trash2, UploadCloud, GripVertical, Loader2, Target } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase"; // Adjust path if needed

// --- EXISTING WEBSITE ASSET IMPORTS ---
import aboutHero from '@/assets/images/about-hero.jpg';
import teamGroup from '@/assets/images/gallery2.jpg';
import ceoPhoto from '@/assets/images/ceo.png';
import team1 from '@/assets/images/ceo.png';
import team2 from '@/assets/images/team2.png';
import team3 from '@/assets/images/team3.png';
import team4 from '@/assets/images/team4.png';
import team5 from '@/assets/images/team5.png';
import team6 from '@/assets/images/team6.png';

export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- DEFAULT STATE: PRE-LOADED WITH YOUR EXISTING WEBSITE DATA ---
  
  const [heroData, setHeroData] = useState({
    subtitle: "Empowering businesses in Myanmar, Vietnam, Thailand, Malaysia, Singapore, and Korea with circular economy strategies and ISO-compliant reporting.",
    title: "Welcome to RecyGlo",
    description: "At RecyGlo, our mission is to foster a more sustainable future through innovative waste, energy, and carbon management and ESG data analytics solutions. We are dedicated to assisting businesses in minimizing their environmental footprint and reaching their sustainability objectives.",
    imagePreview: aboutHero
  });

  const [introData, setIntroData] = useState({
    title: "Introducing To Best Waste Management.",
    description: "RecyGlo is a pioneering sustainability solutions provider dedicated to helping businesses across Asia-Pacific achieve their environmental and ESG goals. With a team of passionate experts and a commitment to innovation, we deliver comprehensive waste management, circular economy, and ESG data analytics solutions.",
    address: "190 Middle Road #19-05 Fortune Centre Singapore 188979",
    email: "Contact@recyglo.com",
    phone: "(+66) 81 412 6842",
    lineId: "@RecyGlo",
    imagePreview: teamGroup
  });

  const [storyData, setStoryData] = useState({
    title: "Our Story: From a Local Problem to a Global Vision",
    paragraph1: "RecyGlo was born out of a stark realization. Witnessing the mounting environmental challenges and inefficient waste management systems in our local communities, we knew a systemic change was urgently needed. What started as a focused effort to tackle localized waste issues quickly revealed a much larger, systemic gap across the Asia-Pacific region.",
    paragraph2: "We saw businesses struggling to balance operational growth with environmental responsibility. The lack of transparent data, reliable recycling infrastructure, and clear compliance pathways meant that even well-intentioned companies couldn't execute effective sustainability strategies.",
    paragraph3: "Today, RecyGlo has evolved into a comprehensive ESG and waste management platform. We bridge the gap between intent and impact, empowering organizations not just to manage their waste, but to completely transform their environmental footprint through data-driven, circular economy solutions.",
    ceoName: "Ms. Shwe Yamin Oo",
    ceoTitle: "CEO & Co-founder",
    ceoImagePreview: ceoPhoto
  });

  const [teamMembers, setTeamMembers] = useState([
    { id: 'team-1', name: "Ms. Shwe Yamin Oo", title: "CEO & Co-founder", imagePreview: team1 },
    { id: 'team-2', name: "Mr. Okka Phyo Maung", title: "CMO & Co-founder", imagePreview: team2 },
    { id: 'team-3', name: "Mr. Leon", title: "Chief Technology Officer", imagePreview: team3 },
    { id: 'team-4', name: "Mr. John Doe", title: "Senior Project Manager", imagePreview: team4 },
    { id: 'team-5', name: "Ms. Jane Smith", title: "Lead ESG Analyst", imagePreview: team5 },
    { id: 'team-6', name: "Ms. Sarah Lee", title: "Marketing Director", imagePreview: team6 },
  ]);

  const [awards, setAwards] = useState([
    { id: 'award-1', title: "Sustainability Excellence", year: "2024", imagePreview: "" },
    { id: 'award-2', title: "Green Tech Innovator", year: "2023", imagePreview: "" },
    { id: 'award-3', title: "Best ESG Platform", year: "2023", imagePreview: "" },
    { id: 'award-4', title: "Circular Economy Leader", year: "2022", imagePreview: "" },
  ]);

  // --- 1. FETCH INITIAL DATA FROM FIREBASE ON LOAD ---
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
          if (data.teamMembers && data.teamMembers.length > 0) setTeamMembers(data.teamMembers);
          if (data.awards && data.awards.length > 0) setAwards(data.awards);
        }
      } catch (error) {
        console.error("Error fetching about page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // --- 2. SAVE EVERYTHING TO FIREBASE ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "website_content", "about_page");
      await setDoc(docRef, {
        heroData,
        introData,
        storyData,
        teamMembers,
        awards,
        lastUpdated: new Date()
      }, { merge: true });

      alert("About Us Page successfully updated in the database!");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save changes. Check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- HANDLERS FOR LISTS ---
  const addTeamMember = () => setTeamMembers([...teamMembers, { id: `team-${Date.now()}`, name: "", title: "", imagePreview: "" }]);
  const removeTeamMember = (id: string) => setTeamMembers(teamMembers.filter(m => m.id !== id));
  const updateTeamMember = (id: string, field: string, value: string) => setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, [field]: value } : m));

  const addAward = () => setAwards([...awards, { id: `award-${Date.now()}`, title: "", year: "", imagePreview: "" }]);
  const removeAward = (id: string) => setAwards(awards.filter(a => a.id !== id));
  const updateAward = (id: string, field: string, value: string) => setAwards(awards.map(a => a.id === id ? { ...a, [field]: value } : a));

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit About Us Page</h1>
          <p className="text-gray-500 text-sm">Update company history, leadership profiles, and contact info.</p>
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
          <TabButton id="intro" label="Who We Are" icon={<Target size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="story" label="Our Story" icon={<BookOpen size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="team" label="Our Team" icon={<Users size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="awards" label="Awards" icon={<Trophy size={18} />} activeTab={activeTab} onClick={setActiveTab} />
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

          {/* TAB 2: WHO WE ARE (Intro & Contact) */}
          {activeTab === 'intro' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Who We Are</h2>
                <p className="text-sm text-gray-500">Edit the company introduction and contact information.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Side Image</label>
                  <ImageUploader preview={introData.imagePreview} onUploadSuccess={(url: string) => setIntroData({...introData, imagePreview: url})} />
                </div>
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Heading</label>
                    <input type="text" value={introData.title} onChange={(e) => setIntroData({...introData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white font-bold" placeholder="e.g. Introducing To Best Waste Management." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Company Description</label>
                    <textarea rows={4} value={introData.description} onChange={(e) => setIntroData({...introData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] bg-white" />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div className="col-span-2"><h3 className="font-bold text-sm">Contact Info Box</h3></div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
                      <input type="text" value={introData.address} onChange={(e) => setIntroData({...introData, address: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                      <input type="email" value={introData.email} onChange={(e) => setIntroData({...introData, email: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                      <input type="text" value={introData.phone} onChange={(e) => setIntroData({...introData, phone: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Line Official</label>
                      <input type="text" value={introData.lineId} onChange={(e) => setIntroData({...introData, lineId: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OUR STORY (CEO) */}
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
                    <ImageUploader circle preview={storyData.ceoImagePreview} onUploadSuccess={(url: string) => setStoryData({...storyData, ceoImagePreview: url})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
                    <input type="text" value={storyData.ceoName} onChange={(e) => setStoryData({...storyData, ceoName: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                    <input type="text" value={storyData.ceoTitle} onChange={(e) => setStoryData({...storyData, ceoTitle: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Story Heading</label>
                    <input type="text" value={storyData.title} onChange={(e) => setStoryData({...storyData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Paragraph 1</label>
                    <textarea rows={3} value={storyData.paragraph1} onChange={(e) => setStoryData({...storyData, paragraph1: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Paragraph 2</label>
                    <textarea rows={3} value={storyData.paragraph2} onChange={(e) => setStoryData({...storyData, paragraph2: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Paragraph 3</label>
                    <textarea rows={3} value={storyData.paragraph3} onChange={(e) => setStoryData({...storyData, paragraph3: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OUR TEAM */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.length === 0 && <p className="text-gray-400 py-8 col-span-2 text-center">No team members added yet.</p>}
                
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative group flex gap-4 items-center">
                    <button onClick={() => removeTeamMember(member.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <div className="w-24 h-24 flex-shrink-0">
                      <ImageUploader preview={member.imagePreview} circle small onUploadSuccess={(url: string) => updateTeamMember(member.id, 'imagePreview', url)} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
                        <input type="text" value={member.name} onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Job Title</label>
                        <input type="text" value={member.title} onChange={(e) => updateTeamMember(member.id, 'title', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B5E20]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AWARDS */}
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

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {awards.length === 0 && <p className="text-gray-400 py-8 col-span-4 text-center">No awards added yet.</p>}
                
                {awards.map((award) => (
                  <div key={award.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative group flex flex-col gap-3">
                    <button onClick={() => removeAward(award.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors z-10">
                      <Trash2 size={16} />
                    </button>
                    <div className="w-full aspect-video">
                      <ImageUploader preview={award.imagePreview} small onUploadSuccess={(url: string) => updateAward(award.id, 'imagePreview', url)} />
                    </div>
                    <input type="text" value={award.title} onChange={(e) => updateAward(award.id, 'title', e.target.value)} className="w-full px-2 py-1 text-center border border-gray-200 rounded focus:outline-none text-sm font-bold bg-white" placeholder="Award Name" />
                    <input type="text" value={award.year} onChange={(e) => updateAward(award.id, 'year', e.target.value)} className="w-full px-2 py-1 text-center border border-gray-200 rounded focus:outline-none text-xs bg-white" placeholder="Year (e.g. 2024)" />
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
      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed! Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors ${circle ? 'rounded-full aspect-square' : 'rounded-xl h-full w-full min-h-[80px]'}`}>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center p-2 text-[#1B5E20]">
          <Loader2 className="animate-spin mb-1" size={small ? 16 : 24} />
        </div>
      ) : preview ? (
        <>
          <img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" alt="Preview" />
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