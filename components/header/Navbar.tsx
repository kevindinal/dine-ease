
"use client";

import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', href: '/home-main' },
    // { title: 'Features', href: '#features' },
    // { title: 'Restaurants', href: '#restaurants' },
    { title: 'Reservations', href: '#reservations' },
    { title: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-accent py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            href="/home-main"
            className="text-2xl font-bold text-white transition-all duration-300"
          >
            DineEase
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-white hover:text-primary-light transition-colors duration-200"
              >
                {link.title}
              </Link>
            ))}
            <Button
              className="bg-primary hover:bg-primary-hover text-white transition-all duration-200"
            >
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-accent-dark rounded-lg p-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="block py-2 text-white hover:text-primary-light"
              >
                {link.title}
              </Link>
            ))}
            <Button
              className="w-full mt-4 bg-primary hover:bg-primary-hover text-white"
            >
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
