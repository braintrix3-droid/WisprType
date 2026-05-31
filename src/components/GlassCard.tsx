"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './GlassCard.module.css';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glowColor?: 'teal' | 'lavender' | 'pink' | 'none';
  isDark?: boolean;
}

export function GlassCard({ className, children, glowColor = 'teal', isDark = false, ...props }: GlassCardProps) {
  const baseClass = isDark ? "dark-glass-card" : "glass-card";
  return (
    <motion.div
      className={cn(baseClass, styles.card, styles[glowColor], className)}
      whileHover={glowColor !== 'none' ? { y: -5 } : undefined}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
