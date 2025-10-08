"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  CheckCircle,
  Star,
  Smartphone,
  ChevronRight,
  Trophy,
  Sparkles,
  Gift
} from "lucide-react";
import Image from "next/image";
import Logo from "./Logo";
import { QRCodeSVG } from 'qrcode.react';

export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>


      {/* Hero Section */}
      <section className="relative min-h-screen md:min-h-[80vh] flex items-center overflow-hidden py-12 md:py-20">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-teal-500/10" />
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { size: "w-96 h-96", color: "bg-cyan-300", top: "-10%", left: "-5%", delay: 0 },
            { size: "w-80 h-80", color: "bg-blue-300", bottom: "-10%", right: "-5%", delay: 2 },
            { size: "w-72 h-72", color: "bg-teal-300", top: "50%", right: "10%", delay: 4 },
          ].map((bubble, i) => (
            <motion.div
              key={i}
              className={`absolute ${bubble.size} ${bubble.color} rounded-full mix-blend-multiply filter blur-2xl opacity-10`}
              style={{
                top: bubble.top,
                bottom: bubble.bottom,
                left: bubble.left,
                right: bubble.right,
                willChange: "transform",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                delay: bubble.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Logo */}
              <div className="mb-8 inline-block lg:block">
                <Logo
                  textClassName="text-6xl md:text-7xl lg:text-8xl font-bold"
                  imageClassName="h-20 md:h-24 lg:h-32 w-auto"
                  showAnimation={false}
                />
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800"
              >
                Die digitale Studentenkarte für die{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  Schweiz
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Kostenlose Vorteilskarte für alle Studierenden.
                Spare bei über 100 Partnern in der ganzen Schweiz.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">100% Kostenlos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Exklusive Rabatte</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Sofort nutzbar</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <motion.a
                  href="https://apps.apple.com/app/stuid/id6743324722"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-colors"
                >
                  <Smartphone className="w-5 h-5" />
                  App herunterladen
                </motion.a>
                <motion.button
                  onClick={() => {
                    const infoSection = document.getElementById('info-section');
                    if (infoSection) {
                      infoSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-6 py-3 bg-white text-gray-800 rounded-2xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  Mehr erfahren
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Wettbewerb Button - Highlighted */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start"
              >
                <a
                  href="/landing/wettbewerb"
                  className="relative inline-flex items-center gap-3 px-8 py-4 group"
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ backgroundSize: '200% 200%' }}
                  />

                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl blur-lg opacity-50"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />

                  {/* Content */}
                  <div className="relative flex items-center gap-3 text-white font-bold text-lg">
                    <Sparkles className="w-5 h-5" />
                    <span>Wettbewerb</span>
                    <Trophy className="w-5 h-5" />
                  </div>

                  {/* Badge */}
                  <motion.div
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    NEU!
                  </motion.div>
                </a>

                {/* Text beside button */}
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-orange-500" />
                  <p className="text-sm text-gray-600">
                    Gewinne iPhone, Red Bull & mehr in unserem Studentenwettbewerb!
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Animated Student Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative lg:flex lg:justify-center"
            >
              <div className="relative max-w-sm mx-auto lg:max-w-md">
                <motion.div
                  animate={{
                    rotateY: [0, 5, 0, -5, 0],
                    y: [0, -15, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    rotateY: {
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    scale: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  }}
                  className="bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-600 rounded-3xl p-6 lg:p-8 shadow-2xl relative"
                  style={{
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden flex-shrink-0 relative">
                        <Image
                          src="/landing/id-student-image.webp"
                          alt="Student ID"
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 56px, 64px"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Victoria Müller</h3>
                        <p className="text-sm text-gray-600">HSO Wirtschaftsschule</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gültig bis</span>
                        <span className="font-medium">30.9.2029</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Geburtsdatum</span>
                        <span className="font-medium">15.7.2007</span>
                      </div>
                      <div className="pt-3">
                        <div className="bg-white rounded-lg p-3 text-center flex items-center justify-center">
                          <QRCodeSVG
                            value="https://apps.apple.com/app/stuid/id6743324722"
                            size={80}
                            level="M"
                            bgColor="#ffffff"
                            fgColor="#1f2937"
                            className="rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-lg flex items-center gap-2"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                  Verifiziert
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-lg flex items-center gap-2"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  <Star className="w-3 h-3 lg:w-4 lg:h-4" />
                  Exklusive Rabatte
                </motion.div>

                {/* Decorative sparkles */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: i % 2 ? "-20%" : "110%",
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}