"use client";

import { motion } from "framer-motion";
import {
  Utensils,
  GraduationCap,
  Briefcase,
  Leaf,
  ShoppingBag,
  Shield,
  ShoppingCart,
} from "lucide-react";

const categories = [
  { name: "Food", color: "from-teal-400 to-teal-600", icon: Utensils, delay: 0.1 },
  { name: "Education", color: "from-sky-400 to-blue-600", icon: GraduationCap, delay: 0.15 },
  { name: "Find your dream job", color: "from-cyan-400 to-blue-500", icon: Briefcase, delay: 0.2 },
  { name: "Lifestyle", color: "from-yellow-400 to-orange-500", icon: Leaf, delay: 0.25 },
  { name: "Shopping", color: "from-orange-400 to-red-500", icon: ShoppingBag, delay: 0.3 },
  { name: "Insurances", color: "from-cyan-500 to-teal-600", icon: Shield, delay: 0.35 },
  { name: "Online Shopping", color: "from-blue-500 to-cyan-600", icon: ShoppingCart, delay: 0.4 },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-4 text-gray-800"
      >
        Kategorien
      </motion.h2>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto"
      >
        Entdecke Rabatte in verschiedenen Bereichen
      </motion.p>

      {/* First Row - 3 Cards Moving Left to Right */}
      <div className="mb-8 relative w-full overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{
            x: ["0%", "-33.33%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 80,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {/* Duplicate the first 3 categories multiple times for seamless loop */}
          {[...categories.slice(0, 3), ...categories.slice(0, 3), ...categories.slice(0, 3)].map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={`row1-${index}`}
                whileHover={{
                  scale: 1.02,
                }}
                className="relative group cursor-pointer inline-block"
                style={{ width: "280px" }}
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 h-full transition-all duration-500 group-hover:brightness-110`}>
                  <div className="relative z-10">
                    <div className="mb-4 flex justify-center">
                      <Icon className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="font-bold text-center text-white text-lg drop-shadow-md whitespace-normal">
                      {category.name}
                    </h3>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-white rounded-3xl"
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileHover={{ opacity: 0.2 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Second Row - 4 Cards Moving Right to Left */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{
            x: ["-33.33%", "0%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 70,
              ease: "linear",
            },
          }}
          initial={{ x: "-33.33%" }}
          style={{ width: "fit-content" }}
        >
          {/* Duplicate the last 4 categories multiple times for seamless loop */}
          {[...categories.slice(3, 7), ...categories.slice(3, 7), ...categories.slice(3, 7)].map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={`row2-${index}`}
                whileHover={{
                  scale: 1.02,
                }}
                className="relative group cursor-pointer inline-block"
                style={{ width: "280px" }}
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 h-full transition-all duration-500 group-hover:brightness-110`}>
                  <div className="relative z-10">
                    <div className="mb-4 flex justify-center">
                      <Icon className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="font-bold text-center text-white text-lg drop-shadow-md whitespace-normal">
                      {category.name}
                    </h3>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-white rounded-3xl"
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileHover={{ opacity: 0.2 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}