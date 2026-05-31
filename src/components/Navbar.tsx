"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Mic } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <div className={cn("container", styles.navContainer)}>
        <Link href="/" className={styles.logo}>
          <Mic size={20} className={styles.logoIcon} />
          <span className="text-gradient font-heading">WhisperType</span>
        </Link>

        <nav className={styles.desktopNav}>
          <button onClick={() => scrollToSection('features')} className={styles.navLink}>Features</button>
          <button onClick={() => scrollToSection('playground')} className={styles.navLink}>Live Playground</button>
          <button onClick={() => scrollToSection('how-it-works')} className={styles.navLink}>How it Works</button>
          <button onClick={() => scrollToSection('faq')} className={styles.navLink}>FAQ</button>
        </nav>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => scrollToSection('download')}>
            <span>Download Desktop</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
