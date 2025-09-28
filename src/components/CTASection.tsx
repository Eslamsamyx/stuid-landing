"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-teal-600" />

      {/* Animated background patterns */}
      <div className="absolute inset-0">
        {[
          { left: "10%", top: "20%", x: 30, y: -40, duration: 15 },
          { left: "80%", top: "10%", x: -40, y: 30, duration: 18 },
          { left: "25%", top: "70%", x: 45, y: 20, duration: 20 },
          { left: "60%", top: "60%", x: -35, y: -45, duration: 16 },
          { left: "45%", top: "30%", x: 25, y: 35, duration: 14 },
        ].map((config, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-white/10 rounded-full"
            style={{
              left: config.left,
              top: config.top,
            }}
            animate={{
              x: [0, config.x],
              y: [0, config.y],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bereit für deine digitale Studentenkarte?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Lade jetzt die StuID App herunter und profitiere von exklusiven Studentenrabatten
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            <a
              href="https://apps.apple.com/app/stuid/id6743324722"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block opacity-100 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/apple-store.svg"
                alt="Download on App Store"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </a>
            <div className="inline-block relative">
              <Image
                src="/google-play-store.webp"
                alt="Demnächst auf Google Play"
                width={150}
                height={50}
                className="h-12 w-auto opacity-75 hover:opacity-65 transition-opacity duration-300"
              />
              {/* Minimalist premium indicator */}
              <div className="absolute -top-2.5 -right-8">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Soft glow backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-xl" />

                  {/* Main pill badge */}
                  <div className="relative flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg border border-white/50">
                    {/* Animated dot indicator */}
                    <motion.div
                      className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="text-[9px] font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider">
                      Demnächst
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}