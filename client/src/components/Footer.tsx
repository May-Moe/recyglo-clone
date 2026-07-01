import { Link } from 'wouter';
import { Mail, Phone, Facebook, Linkedin, Instagram, Youtube, MapPin, ChevronRight } from 'lucide-react';
import logo from '@/assets/images/logo.png';
import { useTranslation } from 'react-i18next'; // ✅ IMPORT TRANSLATION

export default function Footer() {
  // --- TRANSLATION SETUP ---
  const { t } = useTranslation();

  return (
    <footer className="bg-[#113B1C] text-white pt-20 pb-8 relative overflow-hidden print:hidden">
      {/* Subtle Top Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1B5E20] via-[#76FF03] to-[#E2552B]"></div>

      <div className="container px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* 1. Logo & Short Description */}
          <div className="lg:col-span-3 flex flex-col items-start">
            <Link href="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3 mb-6 cursor-pointer">
              {/* The 'brightness-0 invert' classes turn a black/colored logo pure white */}
              <img src={logo} alt="RecyGlo Logo" className="h-12 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              {t('footer.tagline', 'Fostering a more sustainable future through innovative waste, energy, and carbon management solutions across the Asia-Pacific region.')}
            </p>
            
            {/* Social Media Icons Moved Here for Better Flow */}
            <div className="flex gap-3 flex-wrap">
              <a href="https://web.facebook.com/recyglo.th?_rdc=1&_rdr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#76FF03] hover:text-[#113B1C] transition-all shadow-sm">
                <Facebook size={18} fill="currentColor" className="stroke-none" />
              </a>
              <a href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQEmchdZCe1BRgAAAZ7VInYQOl8gvu8YSG9OPkNIfKpStv686hpPAmTtos24W-UtoHczw1U5FlQ19LiJfB1OKJg05wWs3uTmXlcq2MCVFc3-rCTo2nrpUXH29INy0rQuTzxnbRM=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Frecyglo-thailand%2F" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#76FF03] hover:text-[#113B1C] transition-all shadow-sm">
                <Linkedin size={18} fill="currentColor" className="stroke-none" />
              </a>
              <a href="https://www.instagram.com/recyglo_thailand/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#76FF03] hover:text-[#113B1C] transition-all shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="https://www.youtube.com/@RecyGloThailand" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#76FF03] hover:text-[#113B1C] transition-all shadow-sm">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* 2. Information */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg text-[#76FF03] mb-6 tracking-wide uppercase">{t('footer.information', 'Information')}</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li>
                <Link href="/about" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span>{t('nav.about', 'About Us')}</span>
                </Link>
              </li>
              <li>
                <Link href="/solutions" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span>{t('nav.solutions', 'Our Solutions')}</span>
                </Link>
              </li>
              <li>
                <Link href="/resources" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span>{t('nav.resources', 'Resources')}</span>
                </Link>
              </li>
              <li>
                <Link href="/articles" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span>{t('nav.articles', 'Articles')}</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span>{t('nav.contact', 'Contact Us')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Services */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-lg text-[#76FF03] mb-6 tracking-wide uppercase">{t('footer.services', 'Services')}</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li>
                <Link href="/solutions" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span className="truncate">{t('nav.allServices', 'All Services')}</span>
                </Link>
              </li>
              <li>
                <Link href="/services/circular-economy" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span className="truncate">{t('services.circularEconomy', 'Circular Economy')}</span>
                </Link>
              </li>
              <li>
                <Link href="/services/esg-data-analytics" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span className="truncate">{t('services.esgData', 'ESG Data Analytics')}</span>
                </Link>
              </li>
              <li>
                <Link href="/services/reporting" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span className="truncate">{t('services.reporting', 'Reporting and Compliance')}</span>
                </Link>
              </li>
              <li>
                <Link href="/services/consulting" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span className="truncate">{t('services.consulting', 'Consulting and Training')}</span>
                </Link>
              </li>
              <li>
                <Link href="/services/waste-management" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span className="truncate">{t('services.wasteMgmt', 'Waste Management Solutions')}</span>
                </Link>
              </li>
              <li>
                <Link href="/services/waste-auditing" onClick={() => window.scrollTo(0, 0)} className="group flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76FF03] transition-all duration-300" />
                  <span className="truncate">{t('services.wasteAuditing', 'Waste Auditing')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Location & Contact */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-lg text-[#76FF03] mb-6 tracking-wide uppercase">{t('footer.location', 'Location')}</h4>
              {/* Beautifully styled country grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-white/80 mb-8">
                <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MapPin size={14} className="text-[#E2552B]" /> {t('countries.thailand', 'Thailand')}</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MapPin size={14} className="text-[#E2552B]" /> {t('countries.vietnam', 'Vietnam')}</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MapPin size={14} className="text-[#E2552B]" /> {t('countries.myanmar', 'Myanmar')}</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MapPin size={14} className="text-[#E2552B]" /> {t('countries.indonesia', 'Indonesia')}</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MapPin size={14} className="text-[#E2552B]" /> {t('countries.southKorea', 'South Korea')}</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MapPin size={14} className="text-[#E2552B]" /> {t('countries.singapore', 'Singapore')}</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MapPin size={14} className="text-[#E2552B]" /> {t('countries.malaysia', 'Malaysia')}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg text-[#76FF03] mb-6 tracking-wide uppercase">{t('footer.quickContact', 'Quick Contact')}</h4>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-[#76FF03]" />
                  <a href="mailto:Contact@recyglo.com" className="hover:text-white transition-colors">
                    Contact@recyglo.com
                  </a>
                </li>
                
                <li className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-[#76FF03]" />
                  <div className="flex flex-col gap-2">
                    <a href="tel:+66814126842" className="hover:text-white transition-colors flex gap-2 items-center">
                      <span className="font-bold text-white/50 w-6">TH:</span> (+66) 81 412 6842
                    </a>
                    <a href="tel:+6531071377" className="hover:text-white transition-colors flex gap-2 items-center">
                      <span className="font-bold text-white/50 w-6">SG:</span> (+65) 310 713 77
                    </a>
                    <a href="tel:+17206594381" className="hover:text-white transition-colors flex gap-2 items-center">
                      <span className="font-bold text-white/50 w-6">US:</span> (+1) 720 659 4381
                    </a>
                  </div>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-[18px] h-[18px] bg-[#00B900] text-white rounded-full flex items-center justify-center font-bold text-[9px] shrink-0">LINE</div>
                  <a href="https://line.me/R/ti/p/@recyglo.th" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    @RecyGlo
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>{t('footer.rights', '© Copyright 2026 by RecyGlo Company Pte. Ltd. All rights reserved.')}</p>
          <div className="flex gap-6 font-medium">
            <Link href="/terms" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors cursor-pointer">
              {t('footer.terms', 'Terms & Conditions')}
            </Link>
            <Link href="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors cursor-pointer">
              {t('footer.privacy', 'Privacy Policy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}