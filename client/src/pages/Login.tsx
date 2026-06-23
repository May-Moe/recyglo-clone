import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import { Button } from '@/components/ui/button';
import { Lock, Mail, AlertCircle, Eye, EyeOff, ArrowLeft, ShieldCheck, Activity, Database, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import logo from '@/assets/images/logo.png';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLocation('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8F9F7] overflow-hidden">
      
      {/* =========================================
          LEFT PANEL - ENTERPRISE BRANDING (55%)
          ========================================= */}
      <div className="hidden lg:flex w-[55%] bg-[#0A140E] relative flex-col justify-between overflow-hidden">
        
        {/* Advanced Background Grid & Lighting */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#1B5E20] rounded-full blur-[150px] opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-[#76FF03] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

        {/* Top Header */}
        <div className="relative z-10 p-12 flex justify-between items-start">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
            <img src={logo} alt="RecyGlo Logo" className="h-10 w-auto brightness-0 invert" />
          </div>
          
          <div className="flex items-center gap-2 bg-[#1B5E20]/20 border border-[#1B5E20]/40 text-[#76FF03] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
            <div className="w-2 h-2 rounded-full bg-[#76FF03] animate-pulse"></div>
            System Online
          </div>
        </div>

        {/* Center Typography */}
        <div className="relative z-10 px-12 max-w-2xl">
          <h1 className="text-5xl xl:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Manage your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#76FF03] to-[#1B5E20]">sustainability impact.</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-lg">
            Welcome to the RecyGlo CMS portal. Oversee ESG data, publish insights, and control your digital ecosystem from one secure command center.
          </p>
        </div>

        {/* Bottom "Glassmorphism" Widget */}
        <div className="relative z-10 p-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl max-w-md shadow-2xl transform hover:-translate-y-1 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1B5E20] flex items-center justify-center">
                <Database size={18} className="text-[#76FF03]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Database Sync</h3>
                <p className="text-gray-400 text-xs font-medium">Real-time connection active</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Secure Connection</span>
                <span className="text-[#76FF03] flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-[#1B5E20] to-[#76FF03]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL - LOGIN FORM (45%)
          ========================================= */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center bg-white border-l border-gray-200 relative shadow-[-20px_0_40px_rgba(0,0,0,0.05)] z-20">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden absolute top-0 left-0 w-full p-6 flex justify-between items-center bg-white border-b border-gray-100 z-50">
          <img src={logo} alt="RecyGlo Logo" className="h-8 w-auto" />
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1B5E20]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] animate-pulse"></div>
            Online
          </div>
        </div>

        <div className="w-full max-w-[440px] mx-auto p-8 sm:p-12 pt-24 lg:pt-12">
          
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#1B5E20] transition-colors text-sm font-bold mb-12 group"
          >
            <div className="p-1.5 rounded-md bg-gray-50 border border-gray-200 group-hover:border-[#1B5E20]/30 transition-colors">
              <ArrowLeft size={14} />
            </div>
            Return to Website
          </button>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Admin Sign In</h2>
            <p className="text-gray-500 font-medium">Enter your credentials to access the dashboard.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2 shadow-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <p className="leading-relaxed font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#1B5E20] transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all shadow-sm"
                  placeholder="admin@recyglo.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#1B5E20] transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1B5E20] focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Security Badge & Submit */}
            <div className="pt-6 space-y-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1B5E20] hover:bg-[#123e15] text-white py-7 rounded-xl font-bold text-base shadow-xl shadow-[#1B5E20]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In Securely <ArrowRight size={18} />
                  </>
                )}
              </Button>

              <div className="flex justify-center items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-gray-400" />
                End-to-End Encrypted
              </div>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
}