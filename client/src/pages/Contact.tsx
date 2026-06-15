import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, ChevronRight, Facebook, Linkedin, Instagram, ChevronDown, ChevronUp, Play, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- FIREBASE IMPORTS ---
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Contact() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    customSubject: '', 
    message: '',
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pageData, setPageData] = useState({
    heroData: { subtitle: "", title: "", description: "", imagePreview: "" },
    contactInfo: { locations: "", email: "", lineId: "", facebook: "", linkedin: "", instagram: "" },
    faqs: [] as any[]
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "website_content", "contact_page");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPageData({
          heroData: data.heroData || { subtitle: "", title: "", description: "", imagePreview: "" },
          contactInfo: data.contactInfo || { locations: "", email: "", lineId: "", facebook: "", linkedin: "", instagram: "" },
          faqs: data.faqs || []
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalSubject = formData.subject === 'Other' ? formData.customSubject : formData.subject;
    
    try {
      // 1. Save the message to Firebase Database
      await addDoc(collection(db, "inquiries"), {
        name: formData.name,
        email: formData.email,
        subject: finalSubject, 
        message: formData.message,
        createdAt: serverTimestamp(),
        status: "unread" 
      });

      const templateParams = {
        user_name: formData.name,
        user_email: formData.email,
        subject: finalSubject, 
        message: formData.message,
      };

      // 2. Email to USER (Using Account 1)
      await emailjs.send(
        'service_1tw0b8s',        // User Account Service ID
        'template_5e7ht0i',       // User Account Contact Template ID
        templateParams,
        'ni4KN7ecyorm5ah49'       // User Account Public Key
      );

      // 3. Email to ADMIN (Using Account 2)
      await emailjs.send(
        'service_k0mx018',        // Admin Account Service ID
        'template_a004yvy',       // Admin Account Contact Template ID
        templateParams,
        'fq_6mOEQTgoWyhYMp'       // Admin Account Public Key
      );
      
      alert('Thank you for your message. We will get back to you soon!');
      setFormData({ name: '', email: '', subject: '', customSubject: '', message: '' });
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8F9F7]"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;
  }

  const locationList = pageData.contactInfo.locations.split(',').map(loc => loc.trim()).filter(loc => loc.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-80 bg-black/30"
          style={pageData.heroData.imagePreview ? {
            backgroundImage: `url(${pageData.heroData.imagePreview})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             <h2 className="text-sm md:text-base font-bold mb-2 text-gray-800 uppercase tracking-wide">
                {pageData.heroData.subtitle}
             </h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">
                {pageData.heroData.title}
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed font-medium">
                {pageData.heroData.description}
             </p>

             <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => {
                    setLocation('/carbon-calculator');
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-6 py-6 rounded-md shadow-sm flex items-center gap-2 transition-all"
                >
                  <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span>
                  Calculate Carbon Footprint
                </Button>
                <Button 
                  className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-8 py-6 rounded-md shadow-md"
                  onClick={() => setLocation('/solutions')}
                >
                  Our Solutions
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION */}
      <section className="py-12 md:py-20">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-6xl">
          
          <div className="mb-8 text-sm font-medium text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-bold">Contact Us</span>
          </div>

          <div className="mb-12">
             <h2 className="text-4xl font-bold text-[#1B5E20] mb-4">Get in Touch</h2>
             <p className="text-gray-600 text-lg">
               We'd love to hear from you! Contact us for more information about our services and solutions.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
             
             {/* LEFT: Contact Form */}
             <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Please fill in your details.</h3>
                <p className="text-red-500 text-sm mb-8 font-medium">* * Indicates Required Fields</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-colors" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-colors" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 appearance-none bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-colors cursor-pointer">
                        <option value="" disabled>Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Waste Management Solutions">Waste Management Solutions</option>
                        <option value="ESG Data Analytics">ESG Data Analytics</option>
                        <option value="Circular Economy Consulting">Circular Economy Consulting</option>
                        <option value="Reporting and Compliance">Reporting and Compliance</option>
                        <option value="Waste Auditing">Waste Auditing</option>
                        <option value="Consulting and Training">Consulting and Training</option>
                        <option value="Other">Other (Please specify)</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {formData.subject === 'Other' && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <input 
                          type="text" 
                          name="customSubject" 
                          value={formData.customSubject} 
                          onChange={handleChange} 
                          placeholder="Please specify your topic" 
                          required 
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-colors" 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Type message" required rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-colors resize-none" />
                  </div>
                  
                  <div className="pt-2">
                    <Button type="submit" disabled={isSubmitting} className="bg-[#E2552B] hover:bg-[#E2552B]/90 text-white font-bold px-10 py-6 rounded-md shadow-md transition-all w-full sm:w-auto">
                      {isSubmitting ? <><Loader2 className="animate-spin mr-2" size={18} /> Submitting...</> : 'Submit'}
                    </Button>
                  </div>
                </form>
             </div>

             {/* RIGHT: Contact Information */}
             <div className="lg:col-span-5 bg-[#1C3B2B] p-8 md:p-10 rounded-2xl text-white shadow-xl flex flex-col gap-10">
                <div>
                   <h3 className="text-[#A3E635] font-bold text-xl mb-6">Location</h3>
                   <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm text-white/90 font-medium">
                     {locationList.length > 0 ? locationList.map((loc, i) => (
                       <span key={i}>{loc}</span>
                     )) : (
                       <span>No locations set</span>
                     )}
                   </div>
                </div>

                <div>
                   <h3 className="text-[#A3E635] font-bold text-xl mb-6">Contact Info</h3>
                   <ul className="space-y-5 text-sm text-white/90 font-medium">
                     <li className="flex items-center gap-3">
                       <Mail size={18} />
                       <a href={`mailto:${pageData.contactInfo.email}`} className="hover:text-[#A3E635] transition-colors">
                         {pageData.contactInfo.email || 'Email not set'}
                       </a>
                     </li>
                     <li className="flex items-center gap-3">
                       <div className="w-[18px] h-[18px] bg-[#00B900] text-white rounded-full flex items-center justify-center font-bold text-[9px]">LINE</div>
                       <a href="https://line.me" target="_blank" rel="noopener noreferrer" className="hover:text-[#A3E635] transition-colors">
                         {pageData.contactInfo.lineId || 'Line ID not set'}
                       </a>
                     </li>
                   </ul>
                </div>

                <div className="mt-auto">
                   <h3 className="text-[#A3E635] font-bold text-xl mb-6">Follow us on Social Media</h3>
                   <div className="flex gap-4">
                     <a href={pageData.contactInfo.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white text-[#1C3B2B] flex items-center justify-center hover:bg-[#A3E635] transition-colors shadow-sm">
                       <Facebook size={20} fill="currentColor" className="stroke-none" />
                     </a>
                     <a href={pageData.contactInfo.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white text-[#1C3B2B] flex items-center justify-center hover:bg-[#A3E635] transition-colors shadow-sm">
                       <Linkedin size={20} fill="currentColor" className="stroke-none" />
                     </a>
                     <a href={pageData.contactInfo.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white text-[#1C3B2B] flex items-center justify-center hover:bg-[#A3E635] transition-colors shadow-sm">
                       <Instagram size={20} />
                     </a>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. FAQs SECTION */}
      {pageData.faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-[#F8F9F7]">
          <div className="container px-4 sm:px-8 lg:px-12 max-w-4xl">
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-10">FAQs</h2>
             
             <div className="flex flex-col gap-2">
               {pageData.faqs.map((faq: any, index: number) => (
                  <div key={faq.id || index} className="border-b border-gray-200 last:border-0">
                    <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between py-5 text-left focus:outline-none group">
                      <span className="font-semibold text-gray-800 group-hover:text-[#1B5E20] transition-colors text-[15px]">
                        {faq.q}
                      </span>
                      {openFaq === index ? <ChevronUp size={20} className="text-gray-500 shrink-0 ml-4" /> : <ChevronDown size={20} className="text-gray-500 shrink-0 ml-4" />}
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                      <p className="text-gray-600 text-[15px] leading-relaxed pl-2 border-l-2 border-[#1B5E20]/20 whitespace-pre-line">
                        {faq.a}
                      </p>
                    </div>
                  </div>
               ))}
             </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}