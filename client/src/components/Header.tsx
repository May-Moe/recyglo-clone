import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter'; 
import { Menu, X, Globe, ChevronDown, Lock } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/images/logo.png';

// --- i18n TRANSLATION IMPORT ---
import { useTranslation } from 'react-i18next';

// --- FIREBASE IMPORTS ---
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en'; // Track active language
  
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation(); 

  // --- RAW DATABASE STATE ---
  const [rawServices, setRawServices] = useState<any[]>([]);

  // --- FETCH SERVICES FROM FIREBASE ---
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "services"), (snapshot) => {
      const fetchedServices = snapshot.docs.map(doc => doc.data());
      
      // ✅ FIX: Sort by the custom `orderIndex` set in the Admin CMS!
      fetchedServices.sort((a, b) => {
        // If they have an orderIndex, use that
        if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
           return a.orderIndex - b.orderIndex;
        }
        // Fallback to alphabetical if orderIndex is missing
        return (a.title_en || a.title || '').localeCompare(b.title_en || b.title || '');
      });

      setRawServices(fetchedServices);
    });
    return () => unsubscribe();
  }, []);

  // --- DYNAMIC SERVICES GENERATION ---
  const dynamicServices = [
    { 
      title: t('nav.allServices', 'All Services'), 
      href: '/solutions', 
      desc: t('nav.allServicesDesc', 'View all our comprehensive sustainability solutions.') 
    },
    ...rawServices.map(data => ({
      title: data[`title_${currentLang}`] || data.title_en || data.title || '',
      href: `/solutions/${data.slug}`,
      desc: data[`desc_${currentLang}`] || data.desc_en || data.desc || t('nav.learnMore', 'Learn more about this service.')
    }))
  ];

  // --- NAVIGATION ITEMS WITH TRANSLATION KEYS ---
  const navItems = [
    { label: t('nav.home', 'Home'), href: '/' },
    { 
      label: t('nav.services', 'Services'), 
      href: '/solutions',
      items: dynamicServices 
    },
    {
      label: t('nav.softwarePlatforms', 'Software Platforms'),
      href: '#',
      items: [
        { 
          title: t('nav.wastePlatform', 'Waste Management Software'), 
          href: 'https://app.recyglo.net', 
          desc: t('nav.wasteDesc', 'Track waste streams and manage collection operations.'), 
          external: true 
        },
        { 
          title: t('nav.eprPlatform', 'EPR & Waste Management Platform'), 
          href: 'https://waste-reporting-platform.web.app', 
          desc: t('nav.eprDesc', 'Advanced EPR tracking and waste management solutions.'), 
          external: true 
        },
        { 
          title: t('nav.carbonAccounting', 'Carbon Accounting Software'), 
          href: 'https://sanaterra.co', 
          desc: t('nav.carbonDesc', 'Measure and manage your enterprise carbon footprint.'), 
          external: true 
        },
        { 
          title: t('nav.esgReporting', 'ESG Reporting Software'), 
          href: 'https://recyglo-esg-platform.web.app/', 
          desc: t('nav.esgDesc', 'Centralize ESG data and automate sustainability reporting.'), 
          external: true 
        },
      ],
    },
    {
      label: t('nav.ourImpactTop', 'Our Impact'),
      href: '/impact',
      items: [
        { title: t('nav.ourImpact', 'Our Impact'), href: '/impact', desc: t('nav.impactDesc', 'Read our verified impact report and sustainability milestones.') },
        // ✅ CHANGED to link directly to the new /events page
        { title: t('nav.events', 'Events & Webinars'), href: '/events', desc: t('nav.eventsDesc', 'Join our upcoming sustainability events and educational webinars.') },
        { title: t('nav.blog', 'Blogs'), href: '/articles', desc: t('nav.blogDesc', 'Latest news, insights, and industry updates.') },
        { title: t('nav.research', 'Resources'), href: '/resources', desc: t('nav.researchDesc', 'Explore our case studies and in-depth academic research.') },
        // { title: t('nav.faqs', 'FAQs'), href: '/impact#faqs', desc: t('nav.faqsDesc', 'Frequently asked questions about our solutions and operations.') },
      ]
    },
    {
      label: t('nav.about', 'About Us'),
      href: '/about',
      items: [
        { title: t('nav.aboutRecyglo', 'About RecyGlo'), href: '/about#introducing', desc: t('nav.aboutDesc', 'Learn about our mission, history, and team.') },
        { title: t('nav.ourTeam', 'Our Team'), href: '/about#team', desc: t('nav.teamDesc', 'Meet the people driving sustainability at RecyGlo.') },
        { title: t('nav.awards', 'Awards & Recognition'), href: '/about#awards', desc: t('nav.awardsDesc', 'Award-Winning Excellence & Global Recognition.') },
        { title: t('nav.partnerships', 'Strategic Partnerships'), href: '/about#partnerships', desc: t('nav.partnershipsDesc', 'Strategic Partnerships & Industry Memberships.') },
      ],
    },
  ];

  const handleHashScroll = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (window.location.pathname === path || (path === '' && window.location.pathname === '/')) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <nav className="container flex items-center justify-between py-4">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <img src={logo} alt="RecyGlo Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-accent/30 text-foreground hover:text-primary transition-colors text-sm font-medium h-10 px-4">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              {(subItem as { external?: boolean }).external ? (
                                <a href={subItem.href} target="_blank" rel="noopener noreferrer">
                                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary w-full h-full cursor-pointer">
                                    <div className="text-sm font-bold leading-none text-foreground">{subItem.title}</div>
                                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground mt-2">
                                      {subItem.desc}
                                    </p>
                                  </NavigationMenuLink>
                                </a>
                              ) : (
                                <Link href={subItem.href}>
                                  <NavigationMenuLink 
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary w-full h-full cursor-pointer"
                                    onClick={() => handleHashScroll(subItem.href)}
                                  >
                                    <div className="text-sm font-bold leading-none text-foreground">{subItem.title}</div>
                                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground mt-2">
                                      {subItem.desc}
                                    </p>
                                  </NavigationMenuLink>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href}>
                      <NavigationMenuLink 
                        className="bg-transparent hover:bg-accent/30 text-foreground hover:text-primary transition-colors text-sm font-medium px-4 py-2 rounded-md inline-flex items-center justify-center h-10 cursor-pointer"
                        onClick={() => handleHashScroll(item.href)}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors outline-none px-2 py-1.5 rounded-md hover:bg-accent/30">
                  <Globe size={16} />
                  <span className="uppercase">{currentLang}</span>
                  <ChevronDown size={14} className="opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white min-w-[150px] shadow-md border-border">
                <DropdownMenuItem onClick={() => changeLanguage('en')} className={`cursor-pointer ${currentLang === 'en' ? 'font-bold text-primary bg-primary/5' : 'focus:bg-primary/5'}`}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('th')} className={`cursor-pointer ${currentLang === 'th' ? 'font-bold text-primary bg-primary/5' : 'focus:bg-primary/5'}`}>Thai (ภาษาไทย)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('my')} className={`cursor-pointer ${currentLang === 'my' ? 'font-bold text-primary bg-primary/5' : 'focus:bg-primary/5'}`}>Myanmar (မြန်မာ)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('vi')} className={`cursor-pointer ${currentLang === 'vi' ? 'font-bold text-primary bg-primary/5' : 'focus:bg-primary/5'}`}>Vietnamese (Tiếng Việt)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Admin Login Button */}
          {/* <Button
            variant="outline"
            className="hidden lg:inline-flex border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20]/10 font-semibold gap-2"
            onClick={() => {
              setLocation('/login');
              window.scrollTo(0, 0);
            }}
          >
            <Lock size={16} />
            {t('nav.adminLogin', 'Login')}
          </Button> */}

          {/* Book a Consultation Button */}
          <Button
            className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white font-semibold"
            onClick={() => window.location.href = '/contact'}
          >
            {t('nav.bookConsultation', 'Book a Consultation')}
          </Button>

          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-white absolute w-full max-h-[85vh] overflow-y-auto shadow-lg pb-6">
          <div className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <div key={item.label} className="flex flex-col">
                {item.items ? (
                  <div className="flex flex-col gap-2 py-3 border-b border-border/50">
                    <span className="font-bold text-foreground px-2">{item.label}</span>
                    <div className="flex flex-col pl-4 border-l-2 border-primary/20 ml-2 gap-4 mt-2">
                      {item.items.map((subItem) => (
                        (subItem as { external?: boolean }).external ? (
                          <a
                            key={subItem.title}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.title}
                          </a>
                        ) : (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => {
                              setIsOpen(false);
                              handleHashScroll(subItem.href);
                            }}
                          >
                            {subItem.title}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors font-bold px-2 py-3 border-b border-border/50"
                    onClick={() => {
                      setIsOpen(false);
                      handleHashScroll(item.href);
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* MOBILE LANGUAGE SWITCHER */}
            <div className="py-3 border-b border-border/50">
               <span className="font-bold text-foreground px-2 mb-2 block">{t('nav.language', 'Language')}</span>
               <div className="flex gap-2 px-2 flex-wrap">
                  <Badge className="cursor-pointer" variant={currentLang === 'en' ? 'default' : 'outline'} onClick={() => changeLanguage('en')}>ENG</Badge>
                  <Badge className="cursor-pointer" variant={currentLang === 'th' ? 'default' : 'outline'} onClick={() => changeLanguage('th')}>TH</Badge>
                  <Badge className="cursor-pointer" variant={currentLang === 'my' ? 'default' : 'outline'} onClick={() => changeLanguage('my')}>MY</Badge>
                  <Badge className="cursor-pointer" variant={currentLang === 'vi' ? 'default' : 'outline'} onClick={() => changeLanguage('vi')}>VN</Badge>
               </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Button
                variant="outline"
                className="w-full border-[#1B5E20] text-[#1B5E20] font-semibold h-12 flex items-center justify-center gap-2"
                onClick={() => {
                  setLocation('/login');
                  setIsOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                <Lock size={16} />
                {t('nav.adminLogin', 'Login')}
              </Button>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12"
                onClick={() => {
                  window.location.href = '/contact';
                  setIsOpen(false);
                }}
              >
                {t('nav.bookConsultation', 'Book a Consultation')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}