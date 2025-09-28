"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  showAnimation?: boolean;
}

export default function Logo({
  className = "",
  imageClassName = "h-10 w-auto",
  textClassName = "text-3xl font-bold",
  showAnimation = true
}: LogoProps) {
  const [hasLogo, setHasLogo] = useState<boolean | null>(null);
  const [checkAttempted, setCheckAttempted] = useState(false);

  useEffect(() => {
    // Only check once per session to avoid repeated 404 errors
    if (checkAttempted) return;

    // Check if we already know from sessionStorage (client-side only)
    try {
      if (typeof window !== 'undefined') {
        const cachedLogoStatus = sessionStorage.getItem('hasLogoWebp');
        if (cachedLogoStatus !== null) {
          setHasLogo(cachedLogoStatus === 'true');
          setCheckAttempted(true);
          return;
        }
      }
    } catch {
      // Ignore sessionStorage errors
    }

    // Check if logo.webp exists
    const checkLogo = async () => {
      try {
        const response = await fetch('/logo.webp', { method: 'HEAD' });
        const logoExists = response.ok;
        setHasLogo(logoExists);
        // Cache the result in sessionStorage
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('hasLogoWebp', logoExists.toString());
          }
        } catch {
          // Ignore sessionStorage errors
        }
      } catch {
        setHasLogo(false);
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('hasLogoWebp', 'false');
          }
        } catch {
          // Ignore sessionStorage errors
        }
      } finally {
        setCheckAttempted(true);
      }
    };
    void checkLogo();
  }, [checkAttempted]);

  if (hasLogo) {
    return (
      <div className={className}>
        <Image
          src="/logo.webp"
          alt="STUID Logo"
          width={120}
          height={40}
          className={imageClassName}
          priority
        />
      </div>
    );
  }

  // Default text logo
  return (
    <div className={`${textClassName} ${className} relative`}>
      <motion.span
        className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600"
        animate={showAnimation ? {
          backgroundPosition: ["0%", "100%", "0%"],
        } : undefined}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ backgroundSize: "200%" }}
      >
        STU
      </motion.span>
      <span className="text-gray-700">ID</span>
      {showAnimation && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
      )}
    </div>
  );
}