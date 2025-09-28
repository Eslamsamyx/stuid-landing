"use client";

import { motion } from "framer-motion";
import { School, Smartphone, Percent, Shield, ChevronRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: School,
    title: "Hochschulen registrieren sich",
    description: "Bildungseinrichtungen werden Partner und stellen ihre Studierendendaten zur Verfügung",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    delay: 0
  },
  {
    step: "02",
    icon: Smartphone,
    title: "App herunterladen & verifizieren",
    description: "Studierende laden die kostenlose App herunter und bestätigen ihren Studentenstatus",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    delay: 0.2
  },
  {
    step: "03",
    icon: Percent,
    title: "Exklusive Rabatte nutzen",
    description: "Sofortiger Zugang zu Rabatten bei über 100 Partnern in der ganzen Schweiz",
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50",
    delay: 0.4
  }
];

export default function HowItWorksSection() {
  return (
    <section
      id="info-section"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            So funktioniert{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              StuID
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            In drei einfachen Schritten zu exklusiven Studentenrabatten
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Connection Line - Desktop Only */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-200 via-blue-300 to-teal-200 transform -translate-y-1/2 z-0"></div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-4 relative z-10 lg:items-stretch">
              {steps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay, duration: 0.6 }}
                    className="relative flex"
                  >
                    {/* Card */}
                    <motion.div
                      className="bg-white rounded-3xl shadow-xl transition-all duration-300 p-8 relative overflow-hidden group flex flex-col w-full"
                    >
                      {/* Background Pattern */}
                      <div className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                      {/* Step Number */}
                      <div className="relative mb-6 flex justify-center">
                        <motion.div
                          className="inline-block"
                        >
                          <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg relative cursor-pointer`}>
                            <Icon className="w-10 h-10 text-white z-10" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                              <span className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                                {item.step}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="relative text-center flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">
                          {item.description}
                        </p>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full opacity-20 blur-2xl" />
                    </motion.div>

                    {/* Arrow Connector - Desktop Only */}
                    {index < 2 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                        <ChevronRight className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-1">
            <div className="bg-white rounded-2xl p-6 relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 text-lg">
                    Datenschutz & Sicherheit
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Rabatte sind nur für verifizierte Studierende sichtbar. Deine Daten werden sicher
                    verschlüsselt und ausschließlich zur Verifizierung deines Studentenstatus verwendet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}