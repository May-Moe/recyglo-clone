import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, User, Play, X, Clock, ExternalLink } from 'lucide-react';
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

  // --- COMPUTE UPCOMING VS PAST ---
  const now = new Date().getTime();
  // Find the closest future event
  const upcomingEvent = events.filter(e => new Date(e.date).getTime() > now).reverse()[0];
  const pastEvents = events.filter(e => new Date(e.date).getTime() <= now);

  // Derive unique categories from past events
  const categories = ['All Categories', ...Array.from(new Set(pastEvents.map(e => e.category).filter(Boolean)))];

  // --- COUNTDOWN LOGIC ---
  useEffect(() => {
    if (!upcomingEvent) return;

    const targetDate = new Date(upcomingEvent.date).getTime();

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
  }, [upcomingEvent]);

  // --- FILTER LOGIC ---
  const filteredEvents = pastEvents.filter(event => {
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

      {/* 1. CLEAN, MODERN LIGHT HERO SECTION */}
      <section className="pt-16 pb-20 lg:pt-24 lg:pb-32 bg-[#F8F9F7] relative">
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
             <h1 className="text-sm font-bold text-[#E2552B] tracking-widest uppercase mb-3">Live Sessions</h1>
             <h2 className="text-4xl md:text-5xl font-bold text-[#1B5E20] leading-tight">
               Upcoming Events & Webinars
             </h2>
          </div>

          {upcomingEvent ? (
            // --- HAS UPCOMING EVENT (Modern Clean Card) ---
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 max-w-6xl mx-auto transition-transform hover:-translate-y-1 duration-300">
              
              {/* Left Column: Image */}
              <div className="lg:w-5/12 relative min-h-[300px] lg:min-h-[500px] bg-gray-100 shrink-0">
                <img 
                  src={upcomingEvent.imagePreview || 'https://placehold.co/800x600/e2e8f0/64748b?text=Event'} 
                  alt={upcomingEvent.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Clean white badge overlay */}
                <div className="absolute top-6 left-6 bg-white text-[#1B5E20] px-4 py-1.5 rounded-md text-xs font-extrabold tracking-widest uppercase shadow-md border border-gray-100">
                  Featured Event
                </div>
              </div>

              {/* Right Column: Content & Minimalist Countdown */}
              <div className="lg:w-7/12 p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-white">
                
                {/* Title & Description */}
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {upcomingEvent.title}
                </h3>
                <p className="text-gray-600 text-lg mb-10 leading-relaxed font-light line-clamp-3">
                  {upcomingEvent.description}
                </p>

                {/* Minimalist Typographic Countdown */}
                <div className="mb-10 pb-10 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock size={14} className="text-[#E2552B]" /> Starts In
                  </p>
                  <div className="flex items-center gap-6 sm:gap-10">
                    <div className="flex flex-col">
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#1B5E20] leading-none tracking-tight">{timeLeft.days}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Days</span>
                    </div>
                    <span className="text-3xl text-gray-300 font-light -mt-6">:</span>
                    <div className="flex flex-col">
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#1B5E20] leading-none tracking-tight">{timeLeft.hours}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Hours</span>
                    </div>
                    <span className="text-3xl text-gray-300 font-light -mt-6">:</span>
                    <div className="flex flex-col">
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#1B5E20] leading-none tracking-tight">{timeLeft.minutes}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Mins</span>
                    </div>
                    <span className="text-3xl text-gray-300 font-light -mt-6 hidden sm:block">:</span>
                    <div className="flex flex-col hidden sm:flex">
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#E2552B] leading-none tracking-tight">{timeLeft.seconds}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-[#E2552B]/70 uppercase tracking-widest mt-2">Secs</span>
                    </div>
                  </div>
                </div>

                {/* Action & Info Area */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar size={16} className="text-[#E2552B]" />
                      <span className="font-semibold">{new Date(upcomingEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {upcomingEvent.speakers && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <User size={16} className="text-[#E2552B]" />
                        <span>{upcomingEvent.speakers}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="shrink-0 mt-4 sm:mt-0">
                    {upcomingEvent.link ? (
                      <Button 
                        onClick={() => window.open(upcomingEvent.link, '_blank')}
                        className="w-full sm:w-auto bg-[#E2552B] hover:bg-[#c94b26] text-white font-bold py-6 px-8 text-md rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        Register Now <ExternalLink size={16} />
                      </Button>
                    ) : (
                      <Button disabled className="w-full sm:w-auto bg-gray-100 text-gray-400 font-bold py-6 px-8 text-md rounded-xl">
                        Opening Soon
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            // --- NO UPCOMING EVENT - CLEAN CORPORATE STATE ---
            <div className="bg-white rounded-3xl p-16 md:p-24 text-center shadow-lg border border-gray-100 max-w-4xl mx-auto">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                 <Calendar size={36} className="text-gray-400" />
               </div>
               <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
                 New Events Coming Soon
               </h3>
               <p className="text-lg text-gray-500 leading-relaxed font-light max-w-xl mx-auto">
                 Our team is currently preparing the next series of industry-leading sustainability webinars. Browse our library of past recordings below to catch up on what you missed.
               </p>
            </div>
          )}
        </div>
      </section>

      {/* 2. ALL WEBINARS / PAST EVENTS SECTION */}
      {pastEvents.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-100" id="all-webinars">
          <div className="container px-4 sm:px-8 lg:px-12">
            
            {/* Header & Filters */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1B5E20] mb-4">Library of Past Webinars</h2>
              <p className="text-gray-600 mb-8 text-lg">Watch recordings of our most popular sessions on sustainability, innovation, and ESG compliance.</p>
              
              <div className="flex flex-col md:flex-row gap-4 bg-[#F8F9F7] p-4 rounded-xl border border-gray-100 max-w-4xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition-all font-medium text-gray-700 shadow-sm"
                    placeholder="Search webinars by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="md:w-72 shrink-0">
                  <select 
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] cursor-pointer font-medium text-gray-700 appearance-none shadow-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Grid of Cards - Cleaned up borders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col bg-white rounded-xl">
                  <div className="aspect-[16/10] relative overflow-hidden bg-gray-100 border-b border-gray-100">
                    <img src={event.imagePreview || 'https://placehold.co/600x400/e2e8f0/64748b?text=Event'} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    {event.category && (
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold tracking-wider uppercase text-[#1B5E20] shadow-sm">
                        {event.category}
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

            {filteredEvents.length === 0 && (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium text-lg">No webinars found matching your criteria.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); }} className="text-[#E2552B] mt-2 font-bold text-md">Clear Filters</Button>
              </div>
            )}

            {filteredEvents.length > 3 && (
              <div className="text-center mt-12">
                <Button 
                  onClick={() => setShowAll(!showAll)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 font-bold text-md rounded-xl transition-all shadow-md"
                >
                  {showAll ? 'Collapse List' : 'Load More Webinars'}
                </Button>
              </div>
            )}

          </div>
        </section>
      )}

      {/* 3. EVENT DETAILS MODAL (INCREASED SIZE & FULLY CONTAINED IMAGE) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
            
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto custom-scrollbar">
              {/* Left: Image (Now 50% width, soft background, and object-contain so NO CROPPING) */}
              <div className="md:w-1/2 bg-[#F8F9F7] shrink-0 min-h-[300px] flex items-center justify-center p-6 md:p-10 relative border-r border-gray-100">
                <img 
                  src={selectedEvent.imagePreview || 'https://placehold.co/600x800/e2e8f0/64748b?text=Event'} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-contain drop-shadow-xl rounded-lg" 
                />
              </div>
              
              {/* Right: Info */}
              <div className="md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col bg-white">
                <div className="mb-4">
                  {selectedEvent.category && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border border-gray-200">
                      {selectedEvent.category}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">{selectedEvent.title}</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-100 shrink-0">
                      <Clock className="text-[#E2552B]" size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
                      <p className="font-semibold text-sm">{new Date(selectedEvent.date).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  {selectedEvent.speakers && (
                    <div className="flex items-center gap-4 text-gray-700 pt-4 border-t border-gray-50">
                      <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-100 shrink-0">
                        <User className="text-[#E2552B]" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Speaker(s)</p>
                        <p className="font-semibold text-sm">{selectedEvent.speakers}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-10">
                  <h4 className="font-bold text-gray-900 mb-3 text-md border-b pb-2">About This Session</h4>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{selectedEvent.description}</p>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                  {selectedEvent.youtubeLink ? (
                    <Button onClick={() => window.open(selectedEvent.youtubeLink, '_blank')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-6 rounded-xl flex items-center gap-2 text-sm shadow-md">
                      <Play size={16} fill="white" /> Watch Recording
                    </Button>
                  ) : selectedEvent.link ? (
                    <Button onClick={() => window.open(selectedEvent.link, '_blank')} className="flex-1 bg-[#E2552B] hover:bg-[#c94b26] text-white font-bold py-6 rounded-xl flex items-center gap-2 text-sm shadow-md">
                      Register Link <ExternalLink size={16} />
                    </Button>
                  ) : (
                    <Button disabled className="flex-1 bg-gray-100 text-gray-400 font-bold py-6 rounded-xl text-sm border border-gray-200">Recording Unavailable</Button>
                  )}
                  <Button variant="outline" className="py-6 px-6 rounded-xl font-bold text-gray-600 border-gray-300 hover:bg-gray-100 text-sm" onClick={() => setSelectedEvent(null)}>Close</Button>
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