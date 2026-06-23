import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, TrendingUp, Home, ArrowRight, Image as ImageIcon, Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";

// --- FIREBASE IMPORTS ---
import { collection, onSnapshot } from "firebase/firestore";
import { ref, listAll } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    solutions: 0,
    articles: 0,
    media: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for total Solutions (Services)
    const unsubscribeServices = onSnapshot(collection(db, "services"), (snapshot) => {
      setStats(prev => ({ ...prev, solutions: snapshot.size }));
    });

    // 2. Listen for total Articles
    const unsubscribeArticles = onSnapshot(collection(db, "articles"), (snapshot) => {
      setStats(prev => ({ ...prev, articles: snapshot.size }));
    });

    // 3. Count Media Files in Storage
    // We check the standard folders we created throughout the CMS
    const countMediaFiles = async () => {
      const foldersToScan = [
        'service-covers', 'service-heroes', 'service-blocks', 'solutions-page',
        'article-covers', 'article-images', 'articles-page',
        'home-slider', 'home-partners', 'about-page', 'contact-page',
        'case-studies', 'annual-reports', 'resources-page', 'misc'
      ];

      let totalFiles = 0;

      try {
        // Fetch all folder counts in parallel for speed
        const folderPromises = foldersToScan.map(async (folder) => {
          try {
            const folderRef = ref(storage, folder);
            const res = await listAll(folderRef);
            return res.items.length;
          } catch (error) {
            // Folder might not exist yet, which is fine
            return 0;
          }
        });

        const counts = await Promise.all(folderPromises);
        totalFiles = counts.reduce((acc, count) => acc + count, 0);

        setStats(prev => ({ ...prev, media: totalFiles }));
      } catch (error) {
        console.error("Error counting media:", error);
      } finally {
        setIsLoading(false);
      }
    };

    countMediaFiles();

    // Cleanup listeners on unmount
    return () => {
      unsubscribeServices();
      unsubscribeArticles();
    };
  }, []);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-[#1B5E20] rounded-2xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden mt-2">
        {/* Decorative background blur */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#76FF03]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Welcome to the RecyGlo CMS</h1>
            <p className="text-white/80 max-w-xl text-lg leading-relaxed">
              Manage your website content, update sustainability services, and oversee your platform settings from this central hub.
            </p>
          </div>
          <Link href="/">
            <button className="bg-[#76FF03] text-[#1B5E20] hover:bg-white px-6 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2 whitespace-nowrap shadow-md">
              View Live Website <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* CLICKABLE SOLUTIONS CARD */}
        <Link href="/admin/solutions">
          <div className="cursor-pointer block h-full">
            <Card className="border-gray-200 shadow-sm hover:shadow-lg hover:border-[#1B5E20] transition-all bg-white rounded-xl group h-full">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10 text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors">
                    <Briefcase size={22} />
                  </div>
                  <ArrowRight size={20} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[#1B5E20] -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : stats.solutions}
                  </h3>
                  <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Active Solutions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Link>

        {/* CLICKABLE ARTICLES CARD */}
        <Link href="/admin/articles">
          <div className="cursor-pointer block h-full">
            <Card className="border-gray-200 shadow-sm hover:shadow-lg hover:border-[#76FF03] transition-all bg-white rounded-xl group h-full">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-lg bg-[#76FF03]/20 text-[#1B5E20] group-hover:bg-[#76FF03] group-hover:text-[#1B5E20] transition-colors">
                    <FileText size={22} />
                  </div>
                  <ArrowRight size={20} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[#1B5E20] -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : stats.articles}
                  </h3>
                  <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Published Articles</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Link>

        {/* MEDIA CARD (Unlinked, static display) */}
        <div className="block h-full">
          <Card className="border-gray-200 shadow-sm transition-shadow bg-white rounded-xl h-full">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-lg bg-orange-500/10 text-[#E2552B]">
                  <ImageIcon size={22} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : stats.media}
                </h3>
                <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Media Files</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* STATUS CARD (Unlinked, static display) */}
        <div className="block h-full">
          <Card className="border-gray-200 shadow-sm transition-shadow bg-white rounded-xl h-full">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600">
                  <TrendingUp size={22} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Online</h3>
                <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Database Status</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/admin/pages/home">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-[#1B5E20] hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center mb-5 group-hover:bg-[#1B5E20]/10 transition-colors">
                <Home className="text-gray-400 group-hover:text-[#1B5E20]" size={28} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#1B5E20] transition-colors flex items-center justify-between">
                Edit Home Page
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">Update the main hero slider, trusted partners, and company values.</p>
            </div>
          </Link>

          <Link href="/admin/solutions">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-[#1B5E20] hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center mb-5 group-hover:bg-[#1B5E20]/10 transition-colors">
                <Briefcase className="text-gray-400 group-hover:text-[#1B5E20]" size={28} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#1B5E20] transition-colors flex items-center justify-between">
                Manage Solutions
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">Add a new service page or edit the content of existing services.</p>
            </div>
          </Link>

          <Link href="/admin/articles">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-[#1B5E20] hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center mb-5 group-hover:bg-[#1B5E20]/10 transition-colors">
                <FileText className="text-gray-400 group-hover:text-[#1B5E20]" size={28} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#1B5E20] transition-colors flex items-center justify-between">
                Write an Article
                <Plus size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">Publish a new blog post, case study, or sustainability report.</p>
            </div>
          </Link>

        </div>
      </div>
      
    </div>
  );
}