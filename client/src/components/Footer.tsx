import { Link } from 'wouter';
import { Mail, Phone, MessageCircle, Facebook, Linkedin, Instagram } from 'lucide-react';
import logo from '@/assets/images/logo.png'; // Assuming you have the logo here

export default function Footer() {
  return (
    <footer className="bg-[#1B5E20] text-white py-16">
      <div className="container px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          
          {/* 1. Logo */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6 cursor-pointer">
              {/* Note: The 'brightness-0 invert' classes turn a black/colored logo pure white */}
              <img src={logo} alt="RecyGlo Logo" className="h-10 w-auto object-contain brightness-0 invert" />
            </Link>
          </div>

          {/* 2. Information */}
          <div>
            <h4 className="font-bold text-xl text-[#76FF03] mb-6">Information</h4>
            <ul className="space-y-3 text-[15px] text-white/90">
              <li>
                <Link href="/about" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  Our Solutions
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Services */}
          <div>
            <h4 className="font-bold text-xl text-[#76FF03] mb-6">Services</h4>
            <ul className="space-y-3 text-[15px] text-white/90">
              <li>
                <Link href="/solutions" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/solutions#circular-economy" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  Circular Economy
                </Link>
              </li>
              <li>
                <Link href="/solutions#esg-data-analytics" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  ESG Data Analytics
                </Link>
              </li>
              <li>
                <Link href="/solutions#reporting" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  Reporting and Compliance
                </Link>
              </li>
              <li>
                <Link href="/solutions#consulting" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  Consulting and Training
                </Link>
              </li>
              <li>
                <Link href="/solutions#waste-management" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  Waste Management Solutions
                </Link>
              </li>
              <li>
                <Link href="/solutions#waste-auditing" className="hover:text-[#76FF03] transition-colors cursor-pointer">
                  Waste Auditing
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Location & Opening Hours */}
          <div>
            <h4 className="font-bold text-xl text-[#76FF03] mb-6">Location</h4>
            {/* 2-column grid for countries */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[15px] text-white/90 mb-10">
              <span>Thailand</span>
              <span>Vietnam</span>
              <span>Myanmar</span>
              <span>Indonesia</span>
              <span>South Korea</span>
              <span>Singapore</span>
              <span>Malaysia</span>
            </div>

            <h4 className="font-bold text-xl text-[#76FF03] mb-4">Opening Hours</h4>
            <p className="text-[15px] text-white/90 mb-1">Monday to Friday</p>
            <p className="text-[15px] text-white/90">8:30 - 17:30</p>
          </div>

          {/* 5. Quick Contact */}
          <div>
            <h4 className="font-bold text-xl text-[#76FF03] mb-6">Quick Contact</h4>
            <ul className="space-y-4 text-[15px] text-white/90">
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <a href="mailto:Contact@recyglo.com" className="hover:text-[#76FF03] transition-colors">
                  Contact@recyglo.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} />
                <a href="tel:+66814126842" className="hover:text-[#76FF03] transition-colors">
                  (+66)81 412 6842
                </a>
              </li>
              <li className="flex items-center gap-3">
                {/* Using a chat bubble as a placeholder for the LINE app icon */}
                <div className="w-[18px] h-[18px] bg-[#00B900] text-white rounded-full flex items-center justify-center font-bold text-[9px]">
                  LINE
                </div>
                <a href="https://line.me" target="_blank" rel="noopener noreferrer" className="hover:text-[#76FF03] transition-colors">
                  @RecyGlo
                </a>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex gap-4 mt-8">
              <a href="#" className="w-10 h-10 rounded-full bg-white text-[#1B5E20] flex items-center justify-center hover:bg-[#76FF03] transition-colors shadow-sm">
                <Facebook size={20} fill="currentColor" className="stroke-none" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white text-[#1B5E20] flex items-center justify-center hover:bg-[#76FF03] transition-colors shadow-sm">
                <Linkedin size={20} fill="currentColor" className="stroke-none" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white text-[#1B5E20] flex items-center justify-center hover:bg-[#76FF03] transition-colors shadow-sm">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col items-center justify-center text-[14px] text-white/80">
          <p className="mb-4">© Copyright 2026 by RecyGlo Company Pte. Ltd. All rights reserved.</p>
          <div className="flex gap-6 font-medium">
            <Link href="/terms" className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}