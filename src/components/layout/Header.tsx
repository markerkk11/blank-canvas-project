import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logoDark from '@/assets/logo-dark.svg';

const mainNavItems = [
  { label: 'Våra produkter', href: '/produkter' },
  { label: 'Värmepellets', href: '/varmepellets' },
  { 
    label: 'Ströprodukter', 
    href: '/stroprodukter',
    submenu: [
      { label: 'Ströpellets', href: '/produkt/stropellets' },
      { label: 'Kutterspån', href: '/produkt/laxa-kutterspan' },
      { label: 'Finspån', href: '/produkt/laxa-finspan' },
    ]
  },
  { label: 'Återförsäljare', href: '/aterforsaljare' },
  { label: 'Om Laxå Pellets', href: '/om-oss' },
];

const topNavItems = [
  { label: 'Kundtjänst', href: '/kundtjanst' },
  { label: 'Offert företag/föreningar', href: '/offert' },
  { label: 'Aktuellt från Laxå Pellets', href: '/aktuellt' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <nav className="flex justify-end py-2">
            <ul className="flex items-center gap-6 text-sm">
              {topNavItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href} 
                    className="hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={logoDark} 
              alt="Laxå Pellets" 
              className="h-12 md:h-14"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {mainNavItems.map((item) => (
                <li key={item.href} className="relative group">
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 py-2 font-medium transition-colors ${
                      isActive(item.href) 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-foreground hover:text-primary'
                    }`}
                    onMouseEnter={() => item.submenu && setOpenSubmenu(item.label)}
                    onMouseLeave={() => setOpenSubmenu(null)}
                  >
                    {item.label}
                    {item.submenu && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Submenu */}
                  {item.submenu && (
                    <div 
                      className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                        openSubmenu === item.label ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                      onMouseEnter={() => setOpenSubmenu(item.label)}
                      onMouseLeave={() => setOpenSubmenu(null)}
                    >
                      <ul className="bg-white rounded-lg shadow-lg py-2 min-w-48">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              to={subItem.href}
                              className="block px-4 py-2 text-foreground hover:bg-secondary hover:text-primary transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`block py-2 font-medium ${
                      isActive(item.href) ? 'text-primary' : 'text-foreground'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.submenu && (
                    <ul className="pl-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            to={subItem.href}
                            className="block py-1 text-muted-foreground hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="border-t pt-2 mt-4">
                {topNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block py-2 text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
