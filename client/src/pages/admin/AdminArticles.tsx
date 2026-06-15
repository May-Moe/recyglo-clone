import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Layout, FileText, Plus, Trash2, Edit, X, Loader2, UploadCloud, Image as ImageIcon, GripVertical, List, Type, Video } from "lucide-react";
import { doc, getDoc, setDoc, collection, onSnapshot, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase"; 

// --- ASSET IMPORTS FROM ORIGINAL PAGE ---
import aboutHero from '@/assets/images/about-hero.jpg'; 
import blog1 from '@/assets/images/blog1.png';
import blog2 from '@/assets/images/blog2.png';
import blog3 from '@/assets/images/blog3.png';

export default function AdminArticles() {
  const [activeTab, setActiveTab] = useState('articles');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. STATE FOR THE MAIN LANDING PAGE ---
  const [pageData, setPageData] = useState({
    heroData: { 
      subtitle: "Insights on Sustainability and ESG Reporting", 
      title: "RecyGlo Blogs", 
      description: "Stay updated with the latest insights, trends, and tips on sustainability and ESG reporting from RecyGlo's experts. Read our latest blog posts.", 
      imagePreview: aboutHero 
    }
  });

  // --- 2. STATE FOR DYNAMIC ARTICLES ---
  const [articles, setArticles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "website_content", "articles_page");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          setPageData(prev => ({ heroData: docSnap.data().heroData || prev.heroData }));
        }

        const unsubscribe = onSnapshot(collection(db, "articles"), (snapshot) => {
          const loadedArticles: any[] = [];
          snapshot.forEach((doc) => loadedArticles.push({ id: doc.id, ...doc.data() }));
          // Sort by newest first based on a simple string sort or date parsing
          setArticles(loadedArticles.reverse());
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching articles data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSavePageData = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "website_content", "articles_page"), pageData, { merge: true });
      alert("Articles Landing Page updated successfully!");
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- MAGIC MIGRATION FOR YOUR 3 BLOGS ---
  const migrateDefaultArticles = async () => {
    setIsSaving(true);
    const defaultArticles = [
      { 
        title: "RecyGlo Publishes Report on Thailand's Battle With Climate Change", 
        slug: "thailand-climate-change-report",
        imagePreview: blog1, 
        tags: "Sustainability",
        date: "11 October 2024",
        excerpt: "In July 2024, RecyGlo published a report on Thailand's battle with climate change that highlights about the significant challenges driven by the aftermath of climate change in Thailand.", 
        contentBlocks: [
          { id: 'b1', type: 'text', title: '', text: "In July 2024, RecyGlo published a report on Thailand's battle with climate change that highlights about the significant challenges driven by the aftermath of climate change in Thailand. This report delves into how extreme levels of greenhouse gas emissions in Thailand have been a result of the growing population in Thailand with its rapid economic expansion. The report further highlights the urgent need for comprehensive mitigation and adaptation strategies." },
          { id: 'b2', type: 'text', title: 'Climate Change Impacts on Thailand', text: "Climate change presents significant challenges globally and Thailand is no exception as it faces escalating risks from climate hazards such as heavy rainfall, floods, droughts, and sea level rise. Given these challenges, it is essential to assess Thailand's environmental impact, and implement proper strategies for mitigation and adaptation to combat the effects of climate change.\n\nThailand's tropical climate has seen an increasing temperature and fluctuating precipitation patterns over recent decades. The report highlights some of the factors Thailand has been facing:" },
          { id: 'b3', type: 'list', title: '', text: "1. Rising Temperatures: From 2011 to 2021, Thailand experienced significant temperature increases, with the highest temperature recorded in April 2016 at 44.6°C in Mae Hong Son. The heatwaves lead to serious health risks such as heat stress and respiratory diseases, impacting public health significantly in Thailand.\n2. Sea Level Rise: Rising sea level has posed a major threat to coastal areas, especially in the Bangkok region which is built on a low-lying plain and hence faces serious risks of being submerged by 2050 if proper action is not taken.\n3. Air Quality Degradation: The degradation of air quality is a result of climate change since rising temperatures increase the level of particulate matter and ground-level ozone." },
          { id: 'b4', type: 'text', title: 'Socioeconomic Impacts', text: "The report covers the impacts of climate change in Thailand which is profound, affecting myriad sectors:" },
          { id: 'b5', type: 'list', title: '', text: "1. Agriculture: Altered precipitation and unstable temperature patterns have been threatening crop yields and food security, impacting the livelihoods of farmers and rural communities in Thailand.\n2. Public Health: Increased heatwaves and deteriorating air quality are leading to respiratory and heat-related illnesses, posing significant health risks.\n3. Infrastructure: Floods and rising sea levels have damaged infrastructure, leading to economic losses and displacement of communities in Thailand." },
        ] 
      },
      { 
        title: "Thailand's Sustainable Future: The Significance of Renewable Energy", 
        slug: "thailand-renewable-energy",
        imagePreview: blog2, 
        tags: "Circular Economy, News, Sustainability",
        date: "11 October 2024",
        excerpt: "Thailand's road to sustainability requires a robust strategy to reach its goal by 2030 and plan for a greener future ahead.", 
        contentBlocks: [
          { id: 'b1', type: 'text', title: '', text: "Thailand's road to sustainability requires a robust strategy to reach its goal by 2030 and plan for a greener future ahead. The use of renewable energy hence is crucial in lowering carbon emissions, strengthing energy security, and ensuring a smooth transition to a circular economy with greener alternatives. The Thai government has a solid framework called the Power Development Plan (PDP) scheduled to be implemented for the period 2024 to 2037. According to this plan, the ideal target set covers that 30% of the total power generated in Thailand must be renewable energy by 2030." },
          { id: 'b2', type: 'text', title: 'Making the Switch to Renewable Energy', text: "The main renewable energy sources that are now under development include hydropower, biomass, solar, and wind. Thailand's abundant solar resources tradition it as a nation with significant potential for solar energy development, and the government has incentivized the use of solar power through tax incentives and financial support of projects.\n\nThailand's geography is abundant with alternative resources for energy production, albeit at a lower capacity. Wind power projects are possible in coastal and highland regions and small and micro-hydropower system projects are possible at rural locations too." },
          { id: 'b3', type: 'list', title: 'Thailand\'s shift to renewable energy will result in:', text: "1. Expand job market opportunities\n2. Create a positive environmental impact\n3. Social Development" },
        ] 
      },
      { 
        title: "Understanding the importance of circular economy in Thailand", 
        slug: "understanding-circular-economy-thailand",
        imagePreview: blog3, 
        tags: "Circular Economy",
        date: "11 October 2024",
        excerpt: "The 'Take-Make-Waste' system normally endorsed by Thailand's linear economy has been reprimanded recently due to its role in promoting climatic hazards.", 
        contentBlocks: [
          { id: 'b1', type: 'text', title: '', text: "The \"Take-Make-Waste\" system normally endorsed by Thailand's linear economy has been reprimanded recently due to its role in promoting climatic hazards. Under this production process, resources that are not utilized during the manufacturing period are discarded as waste and even after the product is manufactured, waste is produced from the packaging and eventually, the end of a product's usable life signals its call to further become a waste.\n\nThe Take-Make-Waste model has shown to be unsustainable as it has been exacerbating environmental and climate issues in today's expanding economy of over-consumption." },
          { id: 'b2', type: 'text', title: 'The Circular Economy: A Sustainable Solution', text: "The circular economy model presents a sustainable alternative to the linear model. It is a closed-loop system where materials and resources are maintained in the economy for as long as possible, while substantially reducing emissions.\n\nThe importance of a circular economy extends beyond environmental benefits. It unlocks a multitude of innovative opportunities that can boost profits for businesses. In Thailand, industries have taken an ambitious goal of integrating a circular economy as part of their business core strategies to adopt a circular economy." },
          { id: 'b3', type: 'text', title: 'Thailand\'s Circular Economy Initiatives 2024', text: "Currently, the initiatives related to CE are mainly handled by private and public sectors through voluntary engagements. While the government of Thailand has shown a growing interest and dedication in resolving the linear economic model and transitioning towards a circular one, the agenda for the longer term generally relies on the Sufficiency Economy Philosophy (SEP).\n\nThe Thai government's current stance on adopting CE is accelerated through its Bio-Circular-Green (BCG) economic model where it introduces initiatives on the level of:" },
          { id: 'b4', type: 'list', title: '', text: "1. Plastic Waste Management: Encouraging the use of biodegradable plastics and the promotion of recycling.\n2. Food Waste Reduction: Promoting food waste management through better packaging and awareness campaigns.\n3. Legislation and Policies: Creating a legal framework to promote a circular economy." },
        ] 
      }
    ];

    try {
      for (const article of defaultArticles) {
        await addDoc(collection(db, "articles"), article);
      }
      alert("Original 3 Articles migrated successfully!");
    } catch (error) {
      console.error("Error migrating articles:", error);
      alert("Failed to migrate articles.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const slug = editingArticle.slug || editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const articleDataToSave = { ...editingArticle, slug };

      if (editingArticle.id) {
        await updateDoc(doc(db, "articles", editingArticle.id), articleDataToSave);
      } else {
        await addDoc(collection(db, "articles"), articleDataToSave);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving article: ", error);
      alert("Failed to save article.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      await deleteDoc(doc(db, "articles", id));
    }
  };

  // Content Block Handlers
  const addContentBlock = (type: 'text' | 'image' | 'video' | 'list') => {
    const newBlock = { id: `block-${Date.now()}`, type, title: "", text: "", imagePreview: "", videoUrl: "" };
    setEditingArticle((prev: any) => ({ ...prev, contentBlocks: [...(prev.contentBlocks || []), newBlock] }));
  };
  const removeContentBlock = (blockId: string) => {
    setEditingArticle((prev: any) => ({ ...prev, contentBlocks: prev.contentBlocks.filter((b: any) => b.id !== blockId) }));
  };
  const updateContentBlock = (blockId: string, field: string, value: string) => {
    setEditingArticle((prev: any) => ({ ...prev, contentBlocks: prev.contentBlocks.map((b: any) => b.id === blockId ? { ...b, [field]: value } : b) }));
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Articles / Blog</h1>
          <p className="text-gray-500 text-sm">Write new blog posts and update the main Articles landing page.</p>
        </div>
        <Button onClick={handleSavePageData} disabled={isSaving} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2 px-6">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />} Save Landing Page
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <TabButton id="articles" label="All Articles" icon={<FileText size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="hero" label="Main Hero Banner" icon={<Layout size={18} />} activeTab={activeTab} onClick={setActiveTab} />
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[500px]">
          
          {/* TAB 1: DYNAMIC ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Manage Articles</h2>
                  <p className="text-sm text-gray-500 mt-1">Publish news and insights.</p>
                </div>
                <Button onClick={() => { 
                    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                    setEditingArticle({ title: "", tags: "", date: today, excerpt: "", imagePreview: "", contentBlocks: [] }); 
                    setIsModalOpen(true); 
                  }} 
                  className="bg-[#E2552B] hover:bg-[#E2552B]/90 text-white"
                >
                  <Plus size={16} className="mr-2" /> Write New Article
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {articles.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed rounded-xl border-gray-200 bg-gray-50">
                    <p className="text-gray-500 mb-4">No articles found in the database.</p>
                    <Button onClick={migrateDefaultArticles} disabled={isSaving} className="bg-[#1B5E20] text-white hover:bg-[#2A4B38]">
                      {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <FileText size={16} className="mr-2" />} Migrate Original 3 Articles
                    </Button>
                  </div>
                )}
                
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        {article.imagePreview ? <img src={article.imagePreview} className="w-full h-full object-cover" /> : <FileText className="w-full h-full p-4 text-gray-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{article.title}</h3>
                        <p className="text-sm text-gray-500">{article.date} • {article.tags}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => { setEditingArticle(article); setIsModalOpen(true); }} variant="outline" size="sm" className="text-[#1B5E20]"><Edit size={16} /></Button>
                      <Button onClick={() => handleDeleteArticle(article.id)} variant="outline" size="sm" className="text-red-500 hover:bg-red-50"><Trash2 size={16} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HERO BANNER */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Main Landing Hero Banner</h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Background Image</label>
                  <ImageUploader folder="articles-page" preview={pageData.heroData?.imagePreview} onUploadSuccess={(url: string) => setPageData({...pageData, heroData: {...pageData.heroData, imagePreview: url}})} />
                </div>
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Small Subtitle</label>
                    <input type="text" value={pageData.heroData?.subtitle} onChange={(e) => setPageData({...pageData, heroData: {...pageData.heroData, subtitle: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={pageData.heroData?.title} onChange={(e) => setPageData({...pageData, heroData: {...pageData.heroData, title: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea rows={4} value={pageData.heroData?.description} onChange={(e) => setPageData({...pageData, heroData: {...pageData.heroData, description: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* --- ARTICLE EDITOR MODAL --- */}
      {isModalOpen && editingArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-gray-900">{editingArticle.id ? 'Edit Article' : 'Write New Article'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8 flex-1 bg-gray-50/50 custom-scrollbar">
              
              {/* ARTICLE IDENTITY */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3"><h3 className="font-bold text-lg text-[#1B5E20] border-b pb-2">Article Details</h3></div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Thumbnail Image</label>
                  <ImageUploader folder="article-covers" preview={editingArticle.imagePreview} onUploadSuccess={(url: string) => setEditingArticle({...editingArticle, imagePreview: url})} />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Article Title</label>
                    <input type="text" value={editingArticle.title} onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] font-bold text-lg" placeholder="e.g. The Future of Recycling" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Tags (Comma Separated)</label>
                      <input type="text" value={editingArticle.tags} onChange={(e) => setEditingArticle({...editingArticle, tags: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="e.g. News, Sustainability" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                      <input type="text" value={editingArticle.date} onChange={(e) => setEditingArticle({...editingArticle, date: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="11 October 2024" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Short Excerpt</label>
                    <textarea rows={2} value={editingArticle.excerpt} onChange={(e) => setEditingArticle({...editingArticle, excerpt: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="A brief summary for the blog card." />
                  </div>
                </div>
              </div>

              {/* ARTICLE BODY BUILDER */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-[#1B5E20]">Article Body</h3>
                    <p className="text-xs text-gray-500">Build your article structure here using text, images, and lists.</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => addContentBlock('text')} size="sm" variant="outline"><Type size={14} className="mr-1"/> Text</Button>
                    <Button onClick={() => addContentBlock('image')} size="sm" variant="outline"><ImageIcon size={14} className="mr-1"/> Image</Button>
                    <Button onClick={() => addContentBlock('video')} size="sm" variant="outline"><Video size={14} className="mr-1"/> Video</Button>
                    <Button onClick={() => addContentBlock('list')} size="sm" variant="outline"><List size={14} className="mr-1"/> List</Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {(!editingArticle.contentBlocks || editingArticle.contentBlocks.length === 0) && (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-xl">Article is empty. Click a button above to add a paragraph or image.</div>
                  )}

                  {editingArticle.contentBlocks?.map((block: any, index: number) => (
                    <div key={block.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                        <span className="font-bold text-gray-500 flex items-center gap-2 uppercase text-xs tracking-wider"><GripVertical size={14}/> {block.type} Block</span>
                        <button type="button" onClick={() => removeContentBlock(block.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                      
                      {block.type === 'text' && (
                        <div className="space-y-3">
                          <input type="text" value={block.title} onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold focus:outline-none" placeholder="Optional Heading..." />
                          <textarea rows={6} value={block.text} onChange={(e) => updateContentBlock(block.id, 'text', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none" placeholder="Write paragraph text here..." />
                        </div>
                      )}
                      {block.type === 'image' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-1"><ImageUploader folder="article-images" preview={block.imagePreview} small onUploadSuccess={(url: string) => updateContentBlock(block.id, 'imagePreview', url)} /></div>
                          <div className="md:col-span-3 space-y-3">
                            <input type="text" value={block.title} onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold focus:outline-none" placeholder="Image Title (Optional)..." />
                            <textarea rows={2} value={block.text} onChange={(e) => updateContentBlock(block.id, 'text', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none" placeholder="Image Caption/Description..." />
                          </div>
                        </div>
                      )}
                      {block.type === 'video' && (
                        <div className="space-y-3">
                          <input type="text" value={block.title} onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold focus:outline-none" placeholder="Video Title..." />
                          <input type="text" value={block.videoUrl} onChange={(e) => updateContentBlock(block.id, 'videoUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none text-[#E2552B]" placeholder="YouTube Embed URL (https://youtube.com/embed/...)" />
                        </div>
                      )}
                      {block.type === 'list' && (
                        <div className="space-y-3">
                          <input type="text" value={block.title} onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold focus:outline-none" placeholder="List Title..." />
                          <textarea rows={5} value={block.text} onChange={(e) => updateContentBlock(block.id, 'text', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none" placeholder="Type bullet points here. Put each point on a new line." />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-white rounded-b-2xl">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveArticle} disabled={isSaving || !editingArticle.title} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white">
                {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                {editingArticle.id ? 'Save Changes' : 'Publish Article'}
              </Button>
            </div>
          </div>
        </div>
      )}
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

function ImageUploader({ preview, small, onUploadSuccess, folder = "misc" }: any) {
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors rounded-xl h-full w-full ${small ? 'min-h-[100px]' : 'min-h-[160px]'}`}>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      {isUploading ? <Loader2 className="animate-spin text-[#1B5E20]" size={24} /> : preview ? (
        <><img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" /><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity"><UploadCloud className="text-[#1B5E20]" size={24} /></div></>
      ) : <UploadCloud className="text-gray-400" size={small ? 24 : 32} />}
    </div>
  );
}