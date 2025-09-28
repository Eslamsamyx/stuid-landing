"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Smartphone, TrendingUp, Award } from "lucide-react";

const partnersRow1 = [
  { name: "Nike", discount: "20", category: "Sport" },
  { name: "Adidas", discount: "15", category: "Sport" },
  { name: "Apple", discount: "10", category: "Tech" },
  { name: "Samsung", discount: "25", category: "Tech" },
  { name: "H&M", discount: "30", category: "Mode" },
  { name: "Zara", discount: "20", category: "Mode" },
  { name: "McDonald's", discount: "15", category: "Food" },
  { name: "Starbucks", discount: "10", category: "Food" },
];

const partnersRow2 = [
  { name: "Spotify", discount: "50", category: "Entertainment" },
  { name: "Netflix", discount: "30", category: "Entertainment" },
  { name: "Adobe", discount: "60", category: "Software" },
  { name: "Microsoft", discount: "40", category: "Software" },
  { name: "Uber", discount: "25", category: "Transport" },
  { name: "Booking.com", discount: "20", category: "Travel" },
  { name: "Amazon", discount: "15", category: "Shopping" },
  { name: "IKEA", discount: "20", category: "Möbel" },
];

const partnersRow3 = [
  { name: "Lufthansa", discount: "25", category: "Travel" },
  { name: "Swiss", discount: "20", category: "Travel" },
  { name: "Coop", discount: "10", category: "Shopping" },
  { name: "Migros", discount: "12", category: "Shopping" },
  { name: "SBB", discount: "50", category: "Transport" },
  { name: "Swisscom", discount: "30", category: "Telekom" },
  { name: "Sunrise", discount: "25", category: "Telekom" },
  { name: "UPC", discount: "20", category: "Internet" },
];

export default function PartnersSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-cyan-200/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Enhanced Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          {/* Stats Row */}
          <div className="flex justify-center gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-5 h-5 text-blue-600" />
                <p className="text-3xl font-bold text-gray-800">120+</p>
              </div>
              <p className="text-sm text-gray-600">Partner</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <p className="text-3xl font-bold text-gray-800">€500+</p>
              </div>
              <p className="text-sm text-gray-600">Ersparnis/Jahr</p>
            </motion.div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
            Spare bei{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              Top-Marken
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Exklusive Studentenrabatte bei deinen Lieblings-Brands
          </p>
        </motion.div>

        {/* Scrolling Partner Rows */}
        <div className="space-y-6 mb-16">
          {/* Row 1 - Left to Right */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: [0, -1920] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
            >
              {[...partnersRow1, ...partnersRow1, ...partnersRow1].map((partner, index) => (
                <div
                  key={`row1-${index}`}
                  className="group flex-shrink-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-8 py-6 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 min-w-[200px]"
                >
                  <div className="text-center">
                    <h3 className="font-bold text-gray-800 mb-1">{partner.name}</h3>
                    <p className="text-sm text-cyan-600 font-semibold">
                      bis <span className="blur-[3px] select-none">{partner.discount}</span>%
                    </p>
                    <p className="text-xs text-gray-500">{partner.category}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2 - Right to Left */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex gap-6 w-max"
              initial={{ x: -1920 }}
              animate={{ x: 0 }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 45,
                  ease: "linear",
                },
              }}
            >
              {[...partnersRow2, ...partnersRow2, ...partnersRow2].map((partner, index) => (
                <div
                  key={`row2-${index}`}
                  className="group flex-shrink-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-8 py-6 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 min-w-[200px]"
                >
                  <div className="text-center">
                    <h3 className="font-bold text-gray-800 mb-1">{partner.name}</h3>
                    <p className="text-sm text-cyan-600 font-semibold">
                      bis <span className="blur-[3px] select-none">{partner.discount}</span>%
                    </p>
                    <p className="text-xs text-gray-500">{partner.category}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 3 - Left to Right (Slower) */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: [0, -1920] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 50,
                  ease: "linear",
                },
              }}
            >
              {[...partnersRow3, ...partnersRow3, ...partnersRow3].map((partner, index) => (
                <div
                  key={`row3-${index}`}
                  className="group flex-shrink-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-8 py-6 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 min-w-[200px]"
                >
                  <div className="text-center">
                    <h3 className="font-bold text-gray-800 mb-1">{partner.name}</h3>
                    <p className="text-sm text-cyan-600 font-semibold">
                      bis <span className="blur-[3px] select-none">{partner.discount}</span>%
                    </p>
                    <p className="text-xs text-gray-500">{partner.category}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Enhanced CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-2">Jeden Monat neue Partner!</p>
          <Link
            href="https://apps.apple.com/app/stuid/id6743324722"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:from-cyan-600 hover:to-blue-700 transition-colors text-lg"
          >
            <Smartphone className="w-6 h-6" />
            Jetzt App herunterladen & sparen
          </Link>
          <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
            Alle Rabatte und exklusive Angebote sind in der StuID App verfügbar.
            Lade die App herunter, um die vollständigen Rabattcodes zu sehen und einzulösen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}