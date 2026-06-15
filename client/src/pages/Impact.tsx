import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { Heart, Globe, Users, MapPin, TrendingUp, CheckCircle, Target } from 'lucide-react';
import { useLocation } from 'wouter';

// --- ASSET IMPORTS ---
import impactHero from '@/assets/images/about-hero.jpg';
import impactFacility from '@/assets/images/wa2.png';
import impactOcean from '@/assets/images/wa3.png';

// --- NEW WOMEN & YOUTH IMAGES ---
import impactHtet from '@/assets/images/ceo.png';
import impactWoman1 from '@/assets/images/team5.png';
import impactWoman2 from '@/assets/images/team6.png';
import impactWoman3 from '@/assets/images/team4.png';

export default function Impact() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-30 bg-black"
          style={{
            backgroundImage: `url(${impactHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10 text-center max-w-4xl mx-auto">
          <h2 className="text-sm md:text-base font-bold mb-4 text-[#76FF03] tracking-widest uppercase">
            {t('impact.subtitle', 'Where waste ends and life begins')}
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            {t('impact.title', 'Impact Report')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light tracking-wide">
            {t('impact.desc', 'Ocean Bound Plastic • Informal Worker Uplift • Women Empowerment Training')}
          </p>
        </div>
      </section>

      {/* 2. THE BIG NUMBERS & REGIONAL SCALE (Corporate Bar Layout) */}
      <section className="relative -mt-12 z-20 pb-16">
        <div className="container px-4 sm:px-8 lg:px-12">
          
          <div className="bg-white shadow-xl border border-gray-100 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 mb-12">
            <div className="p-10 flex-1 text-center group hover:bg-gray-50 transition-colors">
              <Users size={32} className="mx-auto mb-4 text-[#1B5E20]" />
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">1M+</h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Lives Impacted</p>
            </div>
            <div className="p-10 flex-1 text-center group hover:bg-gray-50 transition-colors">
              <Globe size={32} className="mx-auto mb-4 text-[#1B5E20]" />
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">100K+</h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tonnes Recycled</p>
            </div>
            <div className="p-10 flex-1 text-center group hover:bg-gray-50 transition-colors">
              <Heart size={32} className="mx-auto mb-4 text-[#E2552B]" />
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">$2M+</h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Invested in Communities</p>
            </div>
          </div>

          <div className="bg-white p-10 md:p-12 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-[#1B5E20] mb-4">ESG Operations in 8 Countries</h3>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-4xl">
              With our headquarters in Singapore, our regional scale spans across the APAC region, allowing us to replicate our verified impact model alongside 400+ partners.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Singapore (HQ)', 'Thailand', 'Myanmar', 'Vietnam', 'Malaysia', 'Indonesia', 'South Korea', 'Australia'].map((country) => (
                <div key={country} className="flex items-center gap-2 border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700">
                  <MapPin size={16} className="text-[#E2552B]"/> {country}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE GLOBAL CRISIS */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl mb-16">
            <div className="w-12 h-1 bg-[#E2552B] mb-6"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">The Broken System</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              The cost of current waste systems is borne by those least able to afford it: coastal communities facing destroyed tourism, informal waste pickers with no social stability, and displaced youth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-4 border-[#E2552B] pl-6 py-2">
              <h3 className="text-5xl font-bold text-gray-900 mb-3">27M</h3>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Tonnes of plastic waste</p>
              <p className="text-gray-500 text-sm">Generated across Southeast Asia every year.</p>
            </div>
            <div className="border-l-4 border-[#E2552B] pl-6 py-2">
              <h3 className="text-5xl font-bold text-gray-900 mb-3">79%</h3>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Never properly recycled</p>
              <p className="text-gray-500 text-sm">Entering rivers, coastlines, and oceans.</p>
            </div>
            <div className="border-l-4 border-[#E2552B] pl-6 py-2">
              <h3 className="text-5xl font-bold text-gray-900 mb-3">15-20M</h3>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Informal waste pickers</p>
              <p className="text-gray-500 text-sm">Across ASEAN, earning just $0-$2/day doing 60% of the recycling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LEVER 2: INFORMAL WORKERS */}
      <section className="py-24 bg-white">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#E2552B] font-bold tracking-wider uppercase text-sm mb-4 block">Lever 2: Economic Access</span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1B5E20] mb-6">Informal Worker Formalization</h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                In Thailand, 1.5 million informal collectors contribute to ~60% of collection, generating over 500M THB in economic value, yet have zero recognition in current systems. We are changing that.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="text-[#E2552B] font-serif text-4xl font-bold shrink-0">01</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">A digital identity is created</h4>
                    <p className="text-gray-600">KYC mapped to collections logged by weight, date, and material—a verifiable income record.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-[#E2552B] font-serif text-4xl font-bold shrink-0">02</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">EPR value flows directly to them</h4>
                    <p className="text-gray-600">Brands paying for compliance generate payments traceable directly to the specific collector.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-[#E2552B] font-serif text-4xl font-bold shrink-0">03</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Financial access unlocks</h4>
                    <p className="text-gray-600">Income records act as a precondition for micro-credit and bank account eligibility.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-[#F8F9F7] border-l-4 border-[#1B5E20] flex items-center gap-4">
                <TrendingUp className="text-[#1B5E20] shrink-0" size={24} />
                <p className="text-gray-800 font-medium">Through our Wongpanit partnership (2000+ outlets), verified collectors see a <strong>20% income uplift</strong>.</p>
              </div>
            </div>
            
            <div className="aspect-[4/3] bg-gray-200 relative">
               {/* Corporate photo framing */}
               <div className="absolute inset-0 bg-[#1B5E20] translate-x-4 translate-y-4 z-0"></div>
               <img src={impactFacility} alt="Waste Sorting Facility" className="w-full h-full object-cover relative z-10 border border-gray-100" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEVER 3: OCEAN PROTECTION */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1 aspect-[4/3] bg-gray-200 relative">
               <div className="absolute inset-0 bg-[#1B5E20] -translate-x-4 translate-y-4 z-0"></div>
               <img src={impactOcean} alt="Coastal Cleanup" className="w-full h-full object-cover relative z-10 border border-gray-100" />
            </div>
            
            <div className="order-1 lg:order-2">
              <span className="text-[#E2552B] font-bold tracking-wider uppercase text-sm mb-4 block">Lever 3: Market Access</span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1B5E20] mb-6">Ocean Bound Plastic</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                When Maya Bay closed for 3.5 years, the local tourism economy lost 555M THB per season. Meanwhile, local Moken collectors earned just ~200 THB selling plastic for scraps.
              </p>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                Today, RecyGlo x Second Life operate an Ocean Bound Plastic (OBP) interception network across 50km of Thailand's coastline.
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div className="border-t-2 border-[#1B5E20] pt-4">
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">1,436</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Collectors</p>
                </div>
                <div className="border-t-2 border-[#1B5E20] pt-4">
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">52%</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Are Women</p>
                </div>
                <div className="border-t-2 border-[#1B5E20] pt-4">
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">~30%</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Income Uplift</p>
                </div>
                <div className="border-t-2 border-[#1B5E20] pt-4">
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">11K+</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">People Impacted</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 italic mt-8 border-l-2 border-gray-300 pl-4">
                *5% of program revenue is committed directly back to community development and training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LEVER 1: SHEWORKS (Corporate Editorial Layout) */}
      <section className="py-24 bg-white">
        <div className="container px-4 sm:px-8 lg:px-12">
          
          <div className="max-w-3xl mb-16">
            <span className="text-[#E2552B] font-bold tracking-wider uppercase text-sm mb-4 block">Lever 1: Skill Access</span>
            <div className="w-12 h-1 bg-[#E2552B] mb-6"></div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1B5E20]">Women & Youth Empowerment</h2>
          </div>

          {/* Htet Htet Feature Box */}
          <div className="bg-[#F8F9F7] border border-gray-200 p-8 md:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <h3 className="text-3xl font-bold mb-6 text-gray-900 leading-tight">Her name is Htet Htet Hlwan Moe.</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  She was 15 when conflict closed her school in Myanmar. No credentials. No income pathway. No way forward. Through <strong className="text-[#1B5E20]">SheWorks</strong>, she graduated and was placed. Her classmates are now training others.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-[#E2552B]" size={20}/> 
                    <span className="text-gray-800 font-bold">240+ Women & Youth Placed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-[#E2552B]" size={20}/> 
                    <span className="text-gray-800 font-bold">964 Trained & Tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-[#E2552B]" size={20}/> 
                    <span className="text-gray-800 font-bold">UNESCO TVET Certified Pathway</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-5 aspect-[4/3] relative">
                <img src={impactHtet} alt="Htet Htet Hlwan Moe" className="w-full h-full object-cover border border-gray-200 shadow-sm" />
              </div>
            </div>
          </div>

          {/* 3 Women Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-16">
            <div className="text-center group">
              <img src={impactWoman1} alt="Ma Thin Htet Htet San" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 border border-gray-200" />
              <h4 className="font-bold text-xl text-gray-900 mb-2">Ma Thin Htet Htet San</h4>
              <p className="text-xs font-bold text-[#E2552B] uppercase tracking-wider mb-4">Myanmar Jewelry</p>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">Now training war-affected civilians in four cities—one graduate who became a trainer.</p>
            </div>
            
            <div className="text-center group border-t border-gray-200 pt-8 md:pt-0 md:border-t-0 md:border-l border-gray-200">
              <img src={impactWoman2} alt="Ma Mi Zin Tun" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 border border-gray-200" />
              <h4 className="font-bold text-xl text-gray-900 mb-2">Ma Mi Zin Tun</h4>
              <p className="text-xs font-bold text-[#E2552B] uppercase tracking-wider mb-4">Mushroom Cultivation</p>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">Built a micro-farm at home; supporting her family through a self-sustaining income stream.</p>
            </div>
            
            <div className="text-center group border-t border-gray-200 pt-8 md:pt-0 md:border-t-0 md:border-l border-gray-200">
              <img src={impactWoman3} alt="Ms. Klinthoop Arunchokthaworn" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 border border-gray-200" />
              <h4 className="font-bold text-xl text-gray-900 mb-2">Ms. Klinthoop Arunchokthaworn</h4>
              <p className="text-xs font-bold text-[#E2552B] uppercase tracking-wider mb-4">Chiang Mai Green Roots</p>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">Transforming her guesthouse into a sustainable tourism operation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXPANSION GOALS */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container px-4 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">Our Goals for Future Expansion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col items-center">
              <Target className="text-[#1B5E20] mb-6" size={32} />
              <h4 className="font-bold text-2xl text-gray-900 mb-3">10,000 Tonnes</h4>
              <p className="text-gray-600 text-sm">Of Ocean Bound Plastic intercepted via coastal corridor expansion.</p>
            </div>
            <div className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col items-center">
              <Target className="text-[#1B5E20] mb-6" size={32} />
              <h4 className="font-bold text-2xl text-gray-900 mb-3">10,000 Collectors</h4>
              <p className="text-gray-600 text-sm">Formalized into digital income and EPR systems.</p>
            </div>
            <div className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col items-center">
              <Target className="text-[#1B5E20] mb-6" size={32} />
              <h4 className="font-bold text-2xl text-gray-900 mb-3">3,500 Graduates</h4>
              <p className="text-gray-600 text-sm">Certified and empowered through SheWorks cohorts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SDG ALIGNMENT */}
      <section className="py-24 bg-[#1B5E20] text-white">
        <div className="container px-4 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-16">Aligned with UN Sustainable Development Goals</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {[
              { num: '8', name: 'Decent Work' },
              { num: '12', name: 'Responsible Production' },
              { num: '13', name: 'Climate Action' },
              { num: '14', name: 'Life Below Water' },
              { num: '5', name: 'Gender Equality' },
              { num: '11', name: 'Sustainable Cities' }
            ].map((sdg) => (
              <div key={sdg.num} className="border border-white/30 p-6 flex flex-col items-center justify-center hover:bg-white hover:text-[#1B5E20] transition-colors group">
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#1B5E20]">SDG {sdg.num}</h3>
                <p className="text-xs uppercase tracking-wider group-hover:text-gray-600 text-white/80">{sdg.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}