import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { auth } from '@/lib/firebase'; // Adjust path if needed
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  LayoutDashboard, Briefcase, FileText, Image as ImageIcon, Settings, 
  LogOut, Menu, X, User, Globe, Home, Info, PhoneCall, FolderOpen, Users, Mail
} from 'lucide-react';
import logo from '@/assets/images/logo.png'; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // NEW: Desktop Sidebar State
  
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setLocation('/login');
      }
    });
    return () => unsubscribe();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLocation('/login'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0d2e10] text-gray-300 font-medium w-72">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8">
        <img src={logo} alt="RecyGlo" className="h-13" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        
        {/* Core Section */}
        <div className="space-y-2">
          <p className="px-4 text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">Overview</p>
          <Link href="/admin/dashboard">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location === '/admin/dashboard' ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </div>
          </Link>
          
          {/* --- NEW INQUIRIES TAB --- */}
          <Link href="/admin/inquiries">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location === '/admin/inquiries' ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <Mail size={18} /> Inquiries Inbox
            </div>
          </Link>

          {/* --- NEW SUBSCRIBERS TAB --- */}
          <Link href="/admin/subscribers">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location === '/admin/subscribers' ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <Users size={18} /> Subscribers List
            </div>
          </Link>

          <Link href="/admin/media">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location === '/admin/media' ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <ImageIcon size={18} /> Media Library
            </div>
          </Link>
        </div>

        {/* Static Pages Section */}
        <div className="space-y-2">
          <p className="px-4 text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">Website Pages</p>
          <Link href="/admin/pages/home">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location === '/admin/pages/home' ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <Home size={18} /> Home Page
            </div>
          </Link>
          <Link href="/admin/pages/about">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location === '/admin/pages/about' ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <Info size={18} /> About Us
            </div>
          </Link>
          <Link href="/admin/pages/contact">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location === '/admin/pages/contact' ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <PhoneCall size={18} /> Contact Us
            </div>
          </Link>
          <Link href="/admin/pages/resources">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location === '/admin/pages/resources' ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <FolderOpen size={18} /> Resources
            </div>
          </Link>
        </div>

        {/* Dynamic Content Section */}
        <div className="space-y-2">
          <p className="px-4 text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">Dynamic Content</p>
          <Link href="/admin/solutions">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location.includes('/admin/solutions') ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <Briefcase size={18} /> Our Solutions
            </div>
          </Link>
          <Link href="/admin/articles">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location.includes('/admin/articles') ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <FileText size={18} /> Articles / Blog
            </div>
          </Link>
        </div>

        {/* System & Team Section */}
        <div className="space-y-2 mt-8">
          <p className="px-4 text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">System & Team</p>
          <Link href="/admin/users">
            <div onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${location === '/admin/users' ? 'bg-[#76FF03]/10 text-[#76FF03]' : 'hover:bg-white/5 hover:text-white'}`}>
              <Users size={18} /> Admin Users
            </div>
          </Link>
        </div>

      </nav>

      {/* Bottom Settings & Logout */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link href="/admin/settings">
          <div onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-white/5 hover:text-white">
            <Settings size={18} /> Global Settings
          </div>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  if (!currentUser) return <div className="h-screen w-screen bg-[#F4F7F4]"></div>;

  return (
    <div className="flex h-screen bg-[#F4F7F4] overflow-hidden font-sans">
      
      {/* Collapsible Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col z-20 shadow-2xl transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-[#0d2e10]/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-72 max-w-sm flex-1 shadow-2xl">
            <SidebarContent />
            <button onClick={() => setIsMobileOpen(false)} className="absolute top-6 right-4 p-2 text-gray-400 hover:text-white rounded-full">
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10 sticky top-0 transition-all">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            {/* Desktop Hamburger */}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">Admin</p>
              <p className="text-xs text-[#1B5E20] font-semibold">{currentUser.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <User size={20} className="text-[#1B5E20]" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}