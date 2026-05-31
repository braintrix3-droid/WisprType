import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={cn("container", styles.container)}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <Mic size={20} className={styles.logoIcon} />
            <span className="text-gradient font-heading">WhisperType</span>
          </Link>
          <p className={styles.description}>
            Privacy-first, 100% offline open-source AI Voice Operating System. Turning spoken thoughts directly into finished work natively on-device. Stop typing, start flowing.
          </p>
        </div>
        
        <div className={styles.links}>
          <div className={styles.column}>
            <h4>Features</h4>
            <a href="#features">Offline Engine</a>
            <a href="#features">Global Hotkey</a>
            <a href="#features">Smart Punctuation</a>
          </div>
          <div className={styles.column}>
            <h4>Resources</h4>
            <a href="https://github.com/karansinghgit/speaktype" target="_blank" rel="noopener noreferrer">GitHub Code</a>
            <a href="#faq">Hardware Requirements</a>
            <a href="#playground">Live Sandbox Demo</a>
          </div>
          <div className={styles.column}>
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">MIT License</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} WhisperType. Open source under the MIT License.</p>
        </div>
      </div>
    </footer>
  );
}
