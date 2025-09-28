"use client";

import HeroSection from "~/components/HeroSection";
import Footer from "~/components/Footer";
import PartnersSection from "~/components/PartnersSection";
import CTASection from "~/components/CTASection";
import CategoriesSection from "~/components/CategoriesSection";
import HowItWorksSection from "~/components/HowItWorksSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 overflow-hidden">
      {/* Hero Section with integrated navbar */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}