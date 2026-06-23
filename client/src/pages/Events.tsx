import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, User, Play, X, Clock, ExternalLink, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// --- FIREBASE IMPORTS ---
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Events() {
  const [, setLocation] = useLocation();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAll, setShowAll] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // Tab state for the Webinars section ONLY
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('past');

  // --- FETCH DATA ---
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(loadedEvents);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- COMPUTE UPCOMING VS PAST WEBINARS ---
  const now = new Date().getTime();
  
  // All future events sorted so the closest date is first
  const allUpcoming = events
    .filter(e => new Date(e.date).getTime() > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  // All past events sorted newest first
  const pastEvents = events
    .filter(e => new Date(e.date).getTime() <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Hero gets the absolute closest upcoming event
  const heroEvent = allUpcoming.length > 0 ? allUpcoming[0] : null;
  // The rest of the future events go into the "Upcoming" grid
  const gridUpcoming = allUpcoming.slice(1);

  const categories = ['All Categories', ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

  // Smart Tab Selection: Default to upcoming if there are any
  useEffect(() => {
    if (!isLoading && gridUpcoming.length > 0) {
      setActiveTab('upcoming');
    }
  }, [isLoading, gridUpcoming.length]);

  // --- COUNTDOWN LOGIC ---
  useEffect(() => {
    if (!heroEvent) return;

    const targetDate = new Date(heroEvent.date).getTime();

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = targetDate - currentTime;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      setTimeLeft({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [heroEvent]);

  // --- FILTER LOGIC ---
  const activeEventsList = activeTab === 'upcoming' ? gridUpcoming : pastEvents;

  const filteredEvents = activeEventsList.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 3);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8F9F7]">Loading Events...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      {/* 1. BRAND NEW PREMIUM LIGHT HERO SECTION */}
      <section className="relative pt-20 pb-28 lg:pt-32 lg:pb-40 overflow-hidden bg-white border-b border-gray-100">
        
        {/* Soft Ambient Background Orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#1B5E20]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#E2552B]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          
          {heroEvent ? (
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              
              {/* Left Column: Typography & Boxed Countdown */}
              <div className="lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
                
                <span className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full text-xs font-extrabold tracking-widest uppercase mb-8 border border-gray-100 shadow-sm text-[#E2552B]">
                  <span className="w-2 h-2 rounded-full bg-[#E2552B] animate-pulse"></span>
                  Next Live Webinar
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.15] text-gray-900 tracking-tight">
                  {heroEvent.title}
                </h1>
                
                <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-xl">
                  {heroEvent.description}
                </p>

                {/* Modern Boxed Countdown Widget */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mb-12">
                  <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/40 rounded-2xl p-4 w-20 sm:w-24 text-center transform transition-transform hover:-translate-y-1">
                    <span className="block text-3xl sm:text-4xl font-black text-[#1B5E20]">{timeLeft.days}</span>
                    <span className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Days</span>
                  </div>
                  <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/40 rounded-2xl p-4 w-20 sm:w-24 text-center transform transition-transform hover:-translate-y-1">
                    <span className="block text-3xl sm:text-4xl font-black text-[#1B5E20]">{timeLeft.hours}</span>
                    <span className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Hours</span>
                  </div>
                  <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/40 rounded-2xl p-4 w-20 sm:w-24 text-center transform transition-transform hover:-translate-y-1">
                    <span className="block text-3xl sm:text-4xl font-black text-[#1B5E20]">{timeLeft.minutes}</span>
                    <span className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Mins</span>
                  </div>
                  <div className="bg-gradient-to-br from-[#E2552B] to-[#c94b26] shadow-xl shadow-[#E2552B]/30 rounded-2xl p-4 w-20 sm:w-24 text-center transform transition-transform hover:-translate-y-1">
                    <span className="block text-3xl sm:text-4xl font-black text-white">{timeLeft.seconds}</span>
                    <span className="block text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest mt-1">Secs</span>
                  </div>
                </div>

                {/* Action & Info Area */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {heroEvent.link ? (
                    <Button 
                      onClick={() => window.open(heroEvent.link, '_blank')}
                      className="w-full sm:w-auto bg-[#1B5E20] hover:bg-[#2A4B38] text-white font-bold py-7 px-10 text-lg rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all"
                    >
                      Reserve My Seat <ExternalLink size={18} />
                    </Button>
                  ) : (
                    <Button disabled className="w-full sm:w-auto bg-gray-100 text-gray-400 font-bold py-7 px-10 text-lg rounded-xl border border-gray-200">
                      Registration Coming Soon
                    </Button>
                  )}
                  
                  <div className="flex flex-col space-y-2 text-left">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <Calendar size={18} className="text-[#E2552B]" />
                      {new Date(heroEvent.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    {heroEvent.speakers && (
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <User size={18} className="text-[#E2552B]" />
                        <span className="line-clamp-1">{heroEvent.speakers}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Dot-Grid Framed Image */}
              <div className="lg:w-[45%] w-full flex justify-center mt-8 lg:mt-0 relative">
                {/* Decorative Dot Grid Backdrop */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:16px_16px] z-0"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:16px_16px] z-0"></div>
                
                {/* Image Container */}
                <div className="relative bg-white p-3 md:p-4 rounded-3xl shadow-2xl border border-gray-100 z-10 w-full max-w-[500px]">
                  <div className="bg-gray-50 rounded-2xl overflow-hidden relative flex items-center justify-center min-h-[300px]">
                    <img 
                      src={heroEvent.imagePreview || 'https://placehold.co/800x600/f8f9fa/a1a1aa?text=Webinar+Flyer'} 
                      alt={heroEvent.title}
                      className="w-full h-auto max-h-[550px] object-contain"
                    />
                    {/* Floating Category Tag */}
                    {heroEvent.category && (
                      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm text-[#1B5E20] border border-gray-100 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                        {heroEvent.category}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            // --- NO UPCOMING EVENT - PRETTY EMPTY STATE ---
            <div className="text-center max-w-3xl mx-auto py-20 relative z-10">
               <div className="inline-flex items-center justify-center p-6 bg-white rounded-3xl mb-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                 <Calendar size={56} className="text-[#1B5E20]" />
               </div>
               <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
                 Stay Tuned for <br/>Upcoming Sessions
               </h1>
               <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
                 Our team is currently preparing the next series of industry-leading sustainability webinars. In the meantime, explore our library of recorded sessions below.
               </p>
            </div>
          )}
        </div>
      </section>

      {/* 2. TABBED WEBINARS SECTION */}
      <section className="py-16 lg:py-24 bg-[#F8F9F7]" id="webinars-section">
        <div className="container px-4 sm:px-8 lg:px-12">
          
          {/* TABS (These ONLY affect the grid immediately below them) */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12 border-b border-gray-200">
            <button
              onClick={() => { setActiveTab('upcoming'); setShowAll(false); }}
              className={`pb-4 px-4 font-bold text-lg transition-colors border-b-2 ${
                activeTab === 'upcoming' 
                  ? 'border-[#1B5E20] text-[#1B5E20]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Upcoming Sessions <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{gridUpcoming.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('past'); setShowAll(false); }}
              className={`pb-4 px-4 font-bold text-lg transition-colors border-b-2 ${
                activeTab === 'past' 
                  ? 'border-[#1B5E20] text-[#1B5E20]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Past Webinars <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{pastEvents.length}</span>
            </button>
          </div>

          {/* Header & Filters */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#1B5E20] mb-4">
              {activeTab === 'upcoming' ? 'More Upcoming Events' : 'Library of Past Webinars'}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              {activeTab === 'upcoming' 
                ? 'Register for our upcoming sessions on sustainability, innovation, and ESG compliance.' 
                : 'Watch recordings of our most popular past sessions and workshops.'}
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition-all font-medium text-gray-700"
                  placeholder="Search webinars by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:w-72 shrink-0">
                <select 
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] cursor-pointer font-medium text-gray-700 appearance-none shadow-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Webinar Cards (No Grayscale!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col bg-white rounded-xl">
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-100 border-b border-gray-100 flex items-center justify-center p-4">
                  <img src={event.imagePreview || 'https://placehold.co/600x400/e2e8f0/64748b?text=Event'} alt={event.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md" />
                  
                  {/* Category Tag */}
                  {event.category && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold tracking-wider uppercase text-[#1B5E20] shadow-sm border border-gray-100">
                      {event.category}
                    </div>
                  )}

                  {/* Status Tag (if upcoming) */}
                  {activeTab === 'upcoming' && (
                    <div className="absolute top-4 left-4 bg-[#E2552B] text-white px-3 py-1 rounded text-xs font-bold tracking-wider uppercase shadow-sm">
                      Upcoming
                    </div>
                  )}
                </div>
                <CardContent className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-[#1B5E20] transition-colors leading-snug">{event.title}</h3>
                  
                  <div className="space-y-2 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-3"><Calendar size={16} className="text-[#E2552B]"/> <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                    {event.speakers && <div className="flex items-center gap-3"><User size={16} className="text-[#E2552B]"/> <span className="line-clamp-1">{event.speakers}</span></div>}
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-3 mb-8 flex-grow leading-relaxed">{event.description}</p>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedEvent(event)}
                    className="w-full border-2 border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white font-bold py-6 text-sm rounded-lg transition-colors"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium text-lg">No events found matching your criteria in this tab.</p>
              <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); }} className="text-[#E2552B] mt-2 font-bold text-md">Clear Filters</Button>
            </div>
          )}

          {/* Load More */}
          {filteredEvents.length > 3 && (
            <div className="text-center mt-12">
              <Button 
                onClick={() => setShowAll(!showAll)}
                className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 font-bold text-md rounded-xl transition-all shadow-md"
              >
                {showAll ? 'Collapse List' : `Load More ${activeTab === 'upcoming' ? 'Events' : 'Webinars'}`}
              </Button>
            </div>
          )}

        </div>
      </section>

      {/* 3. IN-PERSON EVENTS SECTION */}
      <section className="py-16 lg:py-24 bg-white border-t border-gray-200" id="in-person-events">
        <div className="container px-4 sm:px-8 lg:px-12">
          
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-[#1B5E20]/10 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-[#1B5E20]/20">
              <MapPin size={14} /> In-Person
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Industry Events & Conferences</h2>
            <p className="text-gray-600 text-lg max-w-3xl">
              Meet the RecyGlo team in person! We regularly host and attend sustainability conferences, workshops, and networking events across the Asia-Pacific region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#F8F9F7] border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center min-w-[70px] shadow-sm">
                  <span className="block text-xs font-bold text-[#E2552B] uppercase">Nov</span>
                  <span className="block text-2xl font-black text-gray-900 leading-none mt-1">15</span>
                </div>
                <span className="bg-white text-gray-600 border border-gray-200 text-xs font-bold px-3 py-1 rounded-full">Conference</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Asia-Pacific Sustainability Summit 2025</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">Join our CEO as a keynote speaker discussing circular economy adoption in emerging markets.</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium pt-4 border-t border-gray-200 mt-auto">
                <MapPin size={16} className="text-[#1B5E20]" /> BITEC Bangna, Bangkok
              </div>
            </div>

            <div className="bg-[#F8F9F7] border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center min-w-[70px] shadow-sm">
                  <span className="block text-xs font-bold text-[#E2552B] uppercase">Dec</span>
                  <span className="block text-2xl font-black text-gray-900 leading-none mt-1">02</span>
                </div>
                <span className="bg-white text-gray-600 border border-gray-200 text-xs font-bold px-3 py-1 rounded-full">Workshop</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Corporate ESG Reporting Masterclass</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">An interactive half-day workshop for sustainability officers learning to navigate new compliance standards.</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium pt-4 border-t border-gray-200 mt-auto">
                <MapPin size={16} className="text-[#1B5E20]" /> RecyGlo HQ, Singapore
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Calendar size={100} className="text-white" />
               </div>
               <h3 className="text-xl font-bold text-white mb-3 relative z-10">Host an Event with Us</h3>
               <p className="text-gray-400 text-sm mb-6 relative z-10">Interested in having RecyGlo experts speak at your next sustainability event?</p>
               <Button onClick={() => setLocation('/contact')} className="bg-[#E2552B] hover:bg-[#c94b26] text-white font-bold w-full relative z-10 border-none">
                 Contact Our Team
               </Button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. ENLARGED EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[1.5rem] w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative min-h-[500px]">
            
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-gray-200/80 hover:bg-gray-300 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto custom-scrollbar">
              <div className="md:w-1/2 bg-[#F2F5F3] flex items-center justify-center p-8 shrink-0 relative border-r border-gray-100">
                <img 
                  src={selectedEvent.imagePreview || 'https://placehold.co/600x800/e2e8f0/64748b?text=Event'} 
                  alt={selectedEvent.title} 
                  className="w-full h-auto max-h-[70vh] object-contain drop-shadow-xl" 
                />
              </div>
              
              <div className="md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col bg-white">
                <div className="flex gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-widest border border-gray-200">
                    {selectedEvent.category || 'WEBINAR'}
                  </span>
                  {new Date(selectedEvent.date).getTime() > now && (
                    <span className="bg-[#E2552B]/10 text-[#E2552B] px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-widest border border-[#E2552B]/20">
                      UPCOMING
                    </span>
                  )}
                </div>
                
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 leading-tight pr-8">
                  {selectedEvent.title}
                </h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4 text-gray-700">
                    <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full border border-gray-200 shrink-0 shadow-sm">
                      <Clock className="text-[#E2552B]" size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
                      <p className="font-bold text-gray-800 text-sm">
                        {new Date(selectedEvent.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(selectedEvent.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.speakers && (
                    <div className="flex items-start gap-4 text-gray-700 pt-6 border-t border-gray-100">
                      <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full border border-gray-200 shrink-0 shadow-sm">
                        <User className="text-[#E2552B]" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Speaker(s)</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedEvent.speakers}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-10">
                  <h4 className="font-bold text-gray-900 mb-4 text-md">About This Session</h4>
                  <p className="text-gray-500 leading-relaxed text-sm whitespace-pre-line">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  {selectedEvent.youtubeLink ? (
                    <Button onClick={() => window.open(selectedEvent.youtubeLink, '_blank')} className="flex-1 bg-[#E60000] hover:bg-[#cc0000] text-white font-bold py-6 rounded-xl flex items-center justify-center gap-2 text-md shadow-md">
                      <Play size={18} fill="white" /> Watch Recording
                    </Button>
                  ) : selectedEvent.link ? (
                    <Button onClick={() => window.open(selectedEvent.link, '_blank')} className="flex-1 bg-[#E2552B] hover:bg-[#c94b26] text-white font-bold py-6 rounded-xl flex items-center justify-center gap-2 text-md shadow-md">
                      Register Link <ExternalLink size={18} />
                    </Button>
                  ) : (
                    <Button disabled className="flex-1 bg-gray-100 text-gray-400 font-bold py-6 rounded-xl text-sm border border-gray-200">
                      Recording Unavailable
                    </Button>
                  )}
                  <Button variant="outline" className="py-6 px-8 rounded-xl font-bold text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-sm" onClick={() => setSelectedEvent(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}