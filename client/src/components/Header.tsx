import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/images/logo.png';
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
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    {
      label: 'About Us',
      href: '/about',
      items: [
        { title: 'About RecyGlo', href: '/about#introducing', desc: 'Learn about our mission, history, and team.' },
        { title: 'Our Team', href: '/about#team', desc: 'Meet the people driving sustainability at RecyGlo.' },
        { title: 'See Our Impact', href: '/about#impact', desc: 'Pioneering Sustainability in Action.' },
        { title: 'Awards & Recognition', href: '/about#awards', desc: 'Award-Winning Excellence & Global Recognition.' },
        { title: 'Strategic Partnerships', href: '/about#partnerships', desc: 'Strategic Partnerships & Industry Memberships.' },
      ],
    },
    { 
      label: 'Our Solutions', 
      href: '/solutions',
      items: [
        { title: 'All Services', href: '/solutions', desc: 'View all our comprehensive sustainability solutions.' },
        
        // =========================================================
        // CHANGED: This now links to the new dedicated Circular Economy page!
        // =========================================================
        { title: 'Circular Economy', href: '/solutions/circular-economy', desc: 'Impactful projects to implement closed-loop systems.' },
        
        { title: 'ESG Data Analytics', href: '/solutions/esg-data-analytics', desc: 'Advanced analytics to track and analyze emissions.' },
        { title: 'Reporting and Compliance', href: '/solutions/reporting', desc: 'Navigate environmental regulations with ease.' },
        { title: 'Consulting and Training', href: '/solutions/consulting', desc: 'Expert sustainability consulting and training services.' },
        { title: 'Waste Management', href: '/solutions/waste-management', desc: 'Comprehensive B2B collection and disposal solutions.' },
        { title: 'Waste Auditing', href: '/solutions/waste-auditing', desc: 'In-depth waste auditing to optimize practices.' },
      ]
    },
    { label: 'Resources', href: '/resources' },
    { label: 'Articles', href: '/articles' },
    {
      label: 'Platforms',
      href: '#',
      items: [
        { title: 'Carbon Accounting', href: 'https://sanaterra.co', desc: 'Enterprise carbon footprint tracking and accounting platform.', external: true },
        { title: 'Waste Management', href: 'https://app.recyglo.net', desc: 'Manage your waste operations and compliance workflows.', external: true },
      ],
    },
  ];

  // This function forces the page to scroll smoothly if you are already on the correct page
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
                  <span>ENG</span>
                  <ChevronDown size={14} className="opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white min-w-[150px] shadow-md border-border">
                <DropdownMenuItem className="cursor-pointer font-bold text-primary focus:bg-primary/5 focus:text-primary">English</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/5">Thai (ภาษาไทย)</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/5">Myanmar (မြန်မာ)</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/5">Vietnamese (Tiếng Việt)</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/5">Korean (한국어)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white font-semibold"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Us
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
            
            <div className="py-3 border-b border-border/50">
               <span className="font-bold text-foreground px-2 mb-2 block">Language</span>
               <div className="flex gap-2 px-2 flex-wrap">
                  <Badge variant="default">ENG</Badge>
                  <Badge variant="outline">TH</Badge>
                  <Badge variant="outline">MY</Badge>
                  <Badge variant="outline">VN</Badge>
               </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold mt-6 h-12"
              onClick={() => {
                window.location.href = '/contact';
                setIsOpen(false);
              }}
            >
              Contact Us
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}