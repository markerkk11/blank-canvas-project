import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import nordLogo from '@/assets/logo-nord-pellets.png';

const footerLinks = {
  products: [
    { label: 'Värmepellets', href: '/varmepellets' },
    { label: 'Ströprodukter', href: '/stroprodukter' },
    { label: 'Återförsäljare', href: '/aterforsaljare' },
    { label: 'Om Nord Pellets', href: '/om-oss' },
    { label: 'Kundtjänst', href: '/kundtjanst' },
    { label: 'Aktuellt från Nord Pellets', href: '/aktuellt' },
    { label: 'Jobba hos oss', href: '/jobb' },
  ],
  legal: [
    { label: 'Leveransvillkor / Köpvillkor', href: '/leveransvillkor' },
    { label: 'Behandling av personuppgifter', href: '/personuppgifter' },
    { label: 'Reklamation', href: '/reklamation' },
  ],
};

export function Footer() {
  return (
    <footer className="gradient-footer text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img src={nordLogo} alt="Nord Pellets" className="h-28" />
            </Link>
            <div className="space-y-2 text-white/80">
              <p className="font-semibold text-white">Nord Pellets AB</p>
              <p>Org.nr: 556647-9969</p>
            </div>
            <a 
              href="mailto:order@nordpellets.se" 
              className="inline-flex items-center gap-2 mt-4 text-white hover:text-accent transition-colors"
            >
              <Mail className="w-4 h-4" />
              order@nordpellets.se
            </a>
            <div className="flex gap-4 mt-6">
              <a 
                href="https://facebook.com/nordpellets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/nordpellets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/nord-pellets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products Links */}
          <div>
            <nav>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <nav>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span>Parkeringsskylt för pellets</span>
            </div>
          </div>

          {/* Customer Service Card */}
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Kundtjänst</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <a href="tel:0584-444160" className="hover:text-accent transition-colors">
                  0584 - 444 160
                </a>
              </div>
              <a 
                href="mailto:order@nordpellets.se"
                className="text-accent hover:underline"
              >
                order@nordpellets.se
              </a>
              <div className="pt-4 border-t border-white/20 space-y-2 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Mån - Tor</span>
                  <span>07:30 - 15:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Fredagar</span>
                  <span>07:30 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Lunchstängt</span>
                  <span>12:00 - 13:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-white/60">
            © Nord Pellets {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
