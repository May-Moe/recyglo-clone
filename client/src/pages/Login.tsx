import { useState } from 'react';
import { useLocation } from 'wouter';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Use this if firebase.ts is directly inside the src/ folder
import { Button } from '@/components/ui/button';
import { Lock, Mail, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen w-full flex bg-white">
      
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B5E20] flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
           <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full border-[40px] border-white/20 blur-3xl"></div>
           <div className="absolute bottom-[10%] -right-[20%] w-[80%] h-[80%] rounded-full border-[60px] border-white/20 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium w-fit mb-12"
          >
            <ArrowLeft size={16} />
            Back to Website
          </button>
          
          <div className="bg-white p-4 rounded-xl inline-block shadow-lg mb-8">
            <img src={logo} alt="RecyGlo Logo" className="h-10 w-auto" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight max-w-lg">
            Secure Admin <br/>
            <span className="text-[#76FF03]">Control Portal.</span>
          </h1>
          <p className="text-[#F8F9F7]/80 text-lg leading-relaxed max-w-md">
            Manage your digital content, update sustainability articles, and oversee your platform settings all in one secure location.
          </p>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          &copy; {new Date().getFullYear()} RecyGlo. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        
        {/* Mobile back button (only shows on small screens) */}
        <button 
          onClick={() => setLocation('/')}
          className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-gray-500">Please enter your admin credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#1B5E20] transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all"
                  placeholder="admin@recyglo.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-gray-700">Password</label>
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
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1B5E20] hover:bg-[#2A4B38] text-white py-6 rounded-xl font-bold text-base mt-4 shadow-lg shadow-[#1B5E20]/20 transition-all hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>
          
        </div>
      </div>
    </div>
  );
}