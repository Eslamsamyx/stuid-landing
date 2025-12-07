"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, Download, X } from "lucide-react";

interface APKDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function APKDownloadModal({ isOpen, onClose }: APKDownloadModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle mounting for SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Lock body scroll and prevent layout shift
  useEffect(() => {
    if (!isOpen || !mounted) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Focus the modal for accessibility
    setTimeout(() => {
      modalRef.current?.focus();
    }, 100);

    return () => {
      // Restore scroll
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;

      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, mounted]);

  // Download handler
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/landing/stuid-1.1.403-release.apk';
    link.download = 'stuid-1.1.403-release.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Don't render until mounted (SSR safety)
  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-white" aria-hidden="true" />
                <h2 id="modal-title" className="text-xl font-bold text-white">
                  Android App Herunterladen
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                aria-label="Modal schliessen"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Compact */}
            <div className="p-5">
              <div className="space-y-4">
                {/* Security Notice */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3">
                  <div className="flex gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h3 className="font-bold text-yellow-800 mb-1 text-sm">
                        Wichtiger Hinweis
                      </h3>
                      <p className="text-yellow-800 text-sm leading-snug">
                        StuID Android App ist absolut sicher, aber sie ist noch nicht im Google Play Store gelistet.
                        Deswegen bieten wir euch hier den direkten Download an. Falls ihr beim Installieren eine
                        Sicherheitsmeldung seht, liegt das nur daran, dass die App nicht aus dem Store kommt.
                        Ihr könnt sie trotzdem bedenkenlos installieren.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Installation & Download Info - Side by Side */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Installation Steps */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 text-base flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        1
                      </span>
                      Installation
                    </h3>
                    <ul className="pl-8 space-y-1 text-gray-600 text-sm">
                      <li>• APK herunterladen</li>
                      <li>• Auf Android-Gerät öffnen</li>
                      <li>• Installation erlauben</li>
                      <li>• Anweisungen folgen</li>
                    </ul>
                  </div>

                  {/* Download Information */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 text-base flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        2
                      </span>
                      Details
                    </h3>
                    <dl className="pl-8 space-y-1 text-gray-600 text-sm">
                      <div>
                        <dt className="inline font-bold">Version:</dt>
                        <dd className="inline ml-1">1.1.403</dd>
                      </div>
                      <div>
                        <dt className="inline font-bold">Grösse:</dt>
                        <dd className="inline ml-1">57 MB</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Download Button */}
                <div className="pt-2">
                  <motion.button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold text-base shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    <Download className="w-5 h-5" aria-hidden="true" />
                    APK jetzt herunterladen
                  </motion.button>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Bald auch im Google Play Store verfügbar
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
