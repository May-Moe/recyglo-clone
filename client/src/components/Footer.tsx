import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Information */}
          <div>
            <h4 className="font-bold text-lg mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-accent transition-colors">
                  Our Solutions
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-accent transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-accent transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  All Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Circular Economy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  ESG Data Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Reporting & Compliance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Consulting & Training
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Waste Management
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-bold text-lg mb-4">Location</h4>
            <ul className="space-y-1 text-sm">
              <li>Thailand</li>
              <li>Vietnam</li>
              <li>Myanmar</li>
              <li>Indonesia</li>
              <li>South Korea</li>
              <li>Singapore</li>
              <li>Malaysia</li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-bold text-lg mb-4">Opening Hours</h4>
            <p className="text-sm">Monday to Friday</p>
            <p className="text-sm">8:30 - 17:30</p>
          </div>

          {/* Quick Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:Contact@recyglo.com" className="hover:text-accent transition-colors">
                  Contact@recyglo.com
                </a>
              </li>
              <li>
                <a href="tel:+66814126842" className="hover:text-accent transition-colors">
                  (+66) 81 412 6842
                </a>
              </li>
              <li>
                <a href="https://instagram.com/recyglo" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  @RecyGlo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2024 RecyGlo. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
