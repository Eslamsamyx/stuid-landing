"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-md shadow-lg z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Logo imageClassName="h-20 w-auto" textClassName="text-5xl font-bold" />
            </Link>
          </div>

          {/* Navigation - Home button */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="relative px-6 py-2.5 overflow-hidden group flex items-center gap-2"
            >
              <Home className="w-5 h-5 text-white relative z-10" />
              <span className="relative z-10 text-white font-medium">
                Startseite
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}