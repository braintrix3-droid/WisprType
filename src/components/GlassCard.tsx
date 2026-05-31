"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './GlassCard.module.css';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glowColor?: 'blue' | 'purple' | 'pink' | 'none';
}

export function GlassCard({ className, children, glowColor = 'blue', ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn("glass-card", styles.card, styles[glowColor], className)}
      whileHover={glowColor !== 'none' ? { y: -5 } : undefined}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
