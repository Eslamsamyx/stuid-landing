"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto mb-12">
          {/* Logo and Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-block mb-4"
              whileHover={{ opacity: 0.8 }}
            >
              <Logo
                textClassName="text-5xl font-bold"
                imageClassName="h-14 w-auto"
                showAnimation={false}
                className="[&_span:first-child]:!text-transparent [&_span:first-child]:!bg-clip-text [&_span:first-child]:!bg-gradient-to-r [&_span:first-child]:!from-cyan-400 [&_span:first-child]:!to-blue-500 [&_span:last-child]:!text-white"
              />
            </motion.div>
            <p className="text-gray-400 text-lg">
              Die digitale Studentenkarte für die Schweiz
            </p>
          </motion.div>

          {/* Contact and Company Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {/* Contact Info */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">E-Mail</h3>
              <a href="mailto:info@bvsbservices.ch" className="text-gray-400 hover:text-cyan-400 transition">
                info@bvsbservices.ch
              </a>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Telefon</h3>
              <a href="tel:+41586801350" className="text-gray-400 hover:text-cyan-400 transition">
                058 680 13 50
              </a>
            </div>

            {/* Address */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Adresse</h3>
              <p className="text-gray-400">
                Bösch 106<br />
                6331 Hünenberg ZG<br />
                Switzerland
              </p>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4 mb-12"
          >
            <motion.a
              href="#"
              className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </motion.a>
            <motion.a
              href="#"
              className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </motion.a>
            <motion.a
              href="#"
              className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </motion.a>
          </motion.div>

          {/* Company Registration Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <div className="inline-flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div>
                <span className="text-gray-600">Parent Company:</span>{" "}
                <span className="text-gray-400">BVS Buchverlag und Service AG</span>
              </div>
              <div className="hidden md:block text-gray-700">•</div>
              <div>
                <span className="text-gray-600">Handelsregister:</span>{" "}
                <span className="text-gray-400 font-mono">CH-320-3038745-9</span>
              </div>
              <div className="hidden md:block text-gray-700">•</div>
              <div>
                <span className="text-gray-600">MwSt-Nr.:</span>{" "}
                <span className="text-gray-400 font-mono">CHE-108.280.996</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800/50 pt-8"
        >
          <div className="flex justify-center">
            <p className="text-gray-500 text-sm text-center">
              © 2024 StuID by BVS Buchverlag und Service AG. Alle Rechte vorbehalten.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}