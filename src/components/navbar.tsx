"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Expertise', href: '#expertise' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Technical Notes', href: '#documentation' },
  { label: 'Alfred AI', href: '#ai-agent' },
  { label: 'Resume', href: '/resume' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount guard for SSR hydration
    setMounted(true);
    // Explicitly force dark mode on every load/reload
    setTheme('dark');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (pathname === '/') {
        const sections = ['hero', ...navItems.map(item => (item.href.startsWith('#') ? item.href.substring(1) : ''))].filter(Boolean);
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const offsetTop = element.offsetTop;
            const offsetHeight = element.offsetHeight;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      } else {
        // On non-home pages, determine active section from pathname
        const currentItem = navItems.find(item => item.href === pathname);
        if (currentItem) {
          setActiveSection(currentItem.href.startsWith('/') ? currentItem.href.substring(1) : '');
        } else if (pathname === '/resume') {
          setActiveSection('resume');
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavClick = (href: string) => {
    // If it's an internal route (like /resume), navigate to it
    if (href.startsWith('/')) {
      router.push(href);
      setIsOpen(false);
      return;
    }

    // If we're not on the home page, redirect to home + anchor
    if (pathname !== '/') {
      router.push('/' + href);
      return;
    }

    // If it's an anchor on the current page, scroll to it
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleHireMe = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        router.push('/#contact');
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3'
            : 'py-6'
        }`}
      >
        <nav
          className={`container mx-auto px-6 max-w-7xl transition-all duration-300 ${
            isScrolled
              ? 'bg-background/40 backdrop-blur-2xl shadow-lg rounded-2xl border border-border/50'
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#hero')}
              className="relative text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors tracking-tight group"
            >
              Geofray Paul J
              <span
                className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-500 transition-all duration-300 ${
                  activeSection === 'hero'
                    ? 'opacity-100 scale-x-100'
                    : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`}
              />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 transition-all duration-300 ${
                      activeSection === item.href.substring(1)
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-10 h-10 rounded-full hover:bg-tertiary hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}

              <Button
                onClick={handleHireMe}
                className="ml-2 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground px-6 py-2 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Contact
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 text-foreground hover:text-primary hover:bg-tertiary rounded-full"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-background border-l border-border shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-border">
                  <span className="text-xl font-bold text-foreground">Menu</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 text-foreground hover:text-primary hover:bg-tertiary rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-8">
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => handleNavClick(item.href)}
                        className={`w-full text-left px-6 py-4 text-base font-medium rounded-xl transition-all duration-300 ${
                          activeSection === item.href.substring(1)
                            ? 'bg-tertiary text-primary'
                            : 'text-foreground hover:bg-tertiary hover:text-primary'
                        }`}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </div>
                </nav>

                {/* Footer Actions */}
                <div className="p-8 border-t border-border space-y-4">
                  <div className="flex gap-3">
                    {mounted && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex-1 h-12 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl"
                      >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </Button>
                    )}

                  </div>
                  <Button
                    onClick={() => {
                      handleHireMe();
                      setIsOpen(false);
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground h-12 rounded-xl shadow-lg"
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
