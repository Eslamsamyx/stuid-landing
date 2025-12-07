"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import {
  Utensils,
  GraduationCap,
  Briefcase,
  Leaf,
  ShoppingBag,
  Shield,
  ShoppingCart,
} from "lucide-react";

const categoriesRow1 = [
  { name: "Food", color: "from-teal-400 to-teal-600", icon: Utensils },
  { name: "Education", color: "from-sky-400 to-blue-600", icon: GraduationCap },
  { name: "Find your dream job", color: "from-cyan-400 to-blue-500", icon: Briefcase },
  { name: "Lifestyle", color: "from-yellow-400 to-orange-500", icon: Leaf },
];

const categoriesRow2 = [
  { name: "Shopping", color: "from-orange-400 to-red-500", icon: ShoppingBag },
  { name: "Insurances", color: "from-cyan-500 to-teal-600", icon: Shield },
  { name: "Online Shopping", color: "from-blue-500 to-cyan-600", icon: ShoppingCart },
  { name: "Lifestyle", color: "from-yellow-400 to-orange-500", icon: Leaf },
];

export default function CategoriesSection() {
  const controlsRow1 = useAnimation();
  const controlsRow2 = useAnimation();

  useEffect(() => {
    // Start the animations
    void controlsRow1.start({
      x: ["0%", "-33.33%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear",
        },
      },
    });

    void controlsRow2.start({
      x: ["-33.33%", "0%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 45,
          ease: "linear",
        },
      },
    });
  }, [controlsRow1, controlsRow2]);

  const handleDragEnd = (controls: ReturnType<typeof useAnimation>) => {
    // Resume animation after drag
    if (controls === controlsRow1) {
      void controls.start({
        x: ["0%", "-33.33%"],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 50,
            ease: "linear",
          },
        },
      });
    } else {
      void controls.start({
        x: ["-33.33%", "0%"],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 45,
            ease: "linear",
          },
        },
      });
    }
  };

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

      {/* First Row - 4 Cards Moving Left to Right */}
      <div className="mb-6 sm:mb-8 relative w-full overflow-hidden touch-pan-x cursor-grab active:cursor-grabbing">
        <motion.div
          className="flex gap-3 sm:gap-6 md:gap-8 whitespace-nowrap select-none"
          animate={controlsRow1}
          style={{
            width: "fit-content",
            willChange: "transform",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)"
          }}
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          dragElastic={0.2}
          onDragEnd={() => handleDragEnd(controlsRow1)}
        >
          {/* Duplicate the first row categories multiple times for seamless loop */}
          {[...categoriesRow1, ...categoriesRow1, ...categoriesRow1].map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={`row1-${index}`}
                whileHover={{
                  scale: 1.02,
                }}
                className="relative group inline-block w-[140px] sm:w-[200px] md:w-[250px] lg:w-[280px]"
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-5 md:p-6 lg:p-8 h-full transition-all duration-500 group-hover:brightness-110`}>
                  <div className="relative z-10">
                    <div className="mb-2 sm:mb-3 md:mb-4 flex justify-center">
                      <Icon className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="font-bold text-center text-white text-xs sm:text-sm md:text-base lg:text-lg drop-shadow-md whitespace-normal">
                      {category.name}
                    </h3>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl"
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
      <div className="relative w-full overflow-hidden touch-pan-x cursor-grab active:cursor-grabbing">
        <motion.div
          className="flex gap-3 sm:gap-6 md:gap-8 whitespace-nowrap select-none"
          animate={controlsRow2}
          initial={{ x: "-33.33%" }}
          style={{
            width: "fit-content",
            willChange: "transform",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)"
          }}
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          dragElastic={0.2}
          onDragEnd={() => handleDragEnd(controlsRow2)}
        >
          {/* Duplicate the second row categories multiple times for seamless loop */}
          {[...categoriesRow2, ...categoriesRow2, ...categoriesRow2].map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={`row2-${index}`}
                whileHover={{
                  scale: 1.02,
                }}
                className="relative group inline-block w-[140px] sm:w-[200px] md:w-[250px] lg:w-[280px]"
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-5 md:p-6 lg:p-8 h-full transition-all duration-500 group-hover:brightness-110`}>
                  <div className="relative z-10">
                    <div className="mb-2 sm:mb-3 md:mb-4 flex justify-center">
                      <Icon className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="font-bold text-center text-white text-xs sm:text-sm md:text-base lg:text-lg drop-shadow-md whitespace-normal">
                      {category.name}
                    </h3>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl"
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