"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import { Send, Check, X, Shield, CheckCircle, Home, RefreshCw, AlertTriangle, Trophy, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import "react-phone-input-2/lib/style.css";

// Dynamic import to avoid SSR issues
const PhoneInput = dynamic(
  () => import("react-phone-input-2").then((mod) => mod.default),
  {
    ssr: false,
  }
);

// Comprehensive validation schema
const competitionFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "Vorname ist erforderlich")
    .min(2, "Vorname muss mindestens 2 Zeichen lang sein")
    .max(50, "Vorname darf maximal 50 Zeichen lang sein")
    .regex(/^[a-zA-ZäöüßÄÖÜ\s-']+$/, "Vorname darf nur Buchstaben, Bindestriche und Apostrophe enthalten"),

  lastName: z
    .string()
    .min(1, "Nachname ist erforderlich")
    .min(2, "Nachname muss mindestens 2 Zeichen lang sein")
    .max(50, "Nachname darf maximal 50 Zeichen lang sein")
    .regex(/^[a-zA-ZäöüßÄÖÜ\s-']+$/, "Nachname darf nur Buchstaben, Bindestriche und Apostrophe enthalten"),

  email: z
    .string()
    .min(1, "E-Mail-Adresse ist erforderlich")
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein")
    .max(100, "E-Mail-Adresse darf maximal 100 Zeichen lang sein"),

  phoneNumber: z
    .string()
    .min(1, "Telefonnummer ist erforderlich")
    .min(10, "Telefonnummer muss mindestens 10 Zeichen lang sein")
    .max(20, "Telefonnummer darf maximal 20 Zeichen lang sein"),

  birthDate: z
    .string()
    .min(1, "Geburtsdatum ist erforderlich")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 99;
    }, "Sie müssen zwischen 13 und 99 Jahre alt sein"),

  address1: z
    .string()
    .min(1, "Adresse ist erforderlich")
    .min(5, "Adresse muss mindestens 5 Zeichen lang sein")
    .max(100, "Adresse darf maximal 100 Zeichen lang sein"),

  address2: z
    .string()
    .max(100, "Zusätzliche Adressinformationen dürfen maximal 100 Zeichen lang sein")
    .optional(),

  city: z
    .string()
    .min(1, "Stadt ist erforderlich")
    .min(2, "Stadt muss mindestens 2 Zeichen lang sein")
    .max(50, "Stadt darf maximal 50 Zeichen lang sein")
    .regex(/^[a-zA-ZäöüßÄÖÜàâéèêëïîôùûçÀÂÉÈÊËÏÎÔÙÛÇŒœ\s-']+$/, "Stadt darf nur Buchstaben, Bindestriche und Apostrophe enthalten"),

  state: z
    .string()
    .min(1, "Bundesland/Kanton ist erforderlich")
    .min(2, "Bundesland/Kanton muss mindestens 2 Zeichen lang sein")
    .max(50, "Bundesland/Kanton darf maximal 50 Zeichen lang sein")
    .regex(/^[a-zA-ZäöüßÄÖÜàâéèêëïîôùûçÀÂÉÈÊËÏÎÔÙÛÇŒœ\s-']+$/, "Bundesland/Kanton darf nur Buchstaben, Bindestriche und Apostrophe enthalten"),

  postalCode: z
    .string()
    .min(1, "Postleitzahl ist erforderlich")
    .regex(/^\d{4,5}$/, "Postleitzahl muss 4-5 Ziffern enthalten"),

  country: z
    .string()
    .min(1, "Land ist erforderlich"),

  termsAccepted: z
    .enum(["agree", "disagree", ""], {
      errorMap: () => ({ message: "Sie müssen den Geschäftsbedingungen zustimmen" })
    })
    .refine((value) => value === "agree", {
      message: "Sie müssen den Geschäftsbedingungen zustimmen"
    })
});

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  termsAccepted: "agree" | "disagree" | "";
};

export default function WettbewerbPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set());
  const termsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Schweiz",
    termsAccepted: "",
  });

  // Validation helper functions
  const validateField = (fieldName: keyof FormData, value: string) => {
    try {
      const fieldSchema = competitionFormSchema.shape[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(prev => ({
          ...prev,
          [fieldName]: error.errors[0]?.message ?? `${fieldName} ist ungültig`
        }));
      }
    }
  };

  const validateAllFields = (): boolean => {
    try {
      competitionFormSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setValidationErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof FormData;

    // Update form data
    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when user selects an option
      if (name === "termsAccepted") {
        setShowTermsError(false);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(fieldName));

    // Real-time validation for touched fields
    if (touchedFields.has(fieldName) || value !== "") {
      validateField(fieldName, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    // Mark field as touched on blur
    setTouchedFields(prev => new Set(prev).add(fieldName));

    // Validate on blur
    validateField(fieldName, value);
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));

    // Mark phone field as touched and validate
    setTouchedFields(prev => new Set(prev).add('phoneNumber'));
    if (value !== "") {
      validateField('phoneNumber', value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched to show all validation errors
    const allFields = Object.keys(formData) as (keyof FormData)[];
    setTouchedFields(new Set(allFields));

    // Validate all fields
    const isValid = validateAllFields();

    if (!isValid) {
      // Find first field with error and scroll to it
      const firstErrorField = Object.keys(validationErrors)[0] as keyof FormData;
      if (firstErrorField) {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (errorElement as HTMLElement).focus();
        }
      }

      // Special handling for terms error
      if (validationErrors.termsAccepted) {
        setShowTermsError(true);
        if (termsRef.current) {
          termsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Auto-hide error after 5 seconds
        setTimeout(() => {
          setShowTermsError(false);
        }, 5000);
      }
      return;
    }

    // Set loading state
    setIsSubmitting(true);

    // Send form data to API
    try {
      const response = await fetch('/landing/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          birthDate: formData.birthDate,
          address1: formData.address1,
          address2: formData.address2 ?? undefined,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        }),
      });

      const result = await response.json() as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? 'Fehler beim Senden des Formulars');
      }

      // Show success state
      setIsSubmitted(true);

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Form submission error:", error);
      // You could add an error state here to show user feedback
      alert(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setShowTermsError(false);
    setValidationErrors({});
    setTouchedFields(new Set());
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      birthDate: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Schweiz",
      termsAccepted: "",
    });
  };

  // Error message component
  const ErrorMessage = ({ fieldName }: { fieldName: keyof FormData }) => {
    const error = validationErrors[fieldName];
    const isFieldTouched = touchedFields.has(fieldName);

    return (
      <AnimatePresence>
        {error && isFieldTouched && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const countries = [
    // DACH Region
    "Schweiz",
    "Deutschland",
    "Österreich",
    "Liechtenstein",
    // Western Europe
    "Frankreich",
    "Belgien",
    "Niederlande",
    "Luxemburg",
    "Monaco",
    // Southern Europe
    "Italien",
    "Spanien",
    "Portugal",
    "Andorra",
    "San Marino",
    "Malta",
    "Griechenland",
    "Zypern",
    // Northern Europe
    "Vereinigtes Königreich",
    "Irland",
    "Dänemark",
    "Schweden",
    "Norwegen",
    "Finnland",
    "Island",
    // Eastern Europe
    "Polen",
    "Tschechien",
    "Slowakei",
    "Ungarn",
    "Slowenien",
    "Kroatien",
    "Rumänien",
    "Bulgarien",
    "Serbien",
    "Albanien",
    // Baltic States
    "Estland",
    "Lettland",
    "Litauen"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements - Client Only */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, 80, 0],
              y: [0, -60, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, -60, 0],
              y: [0, 80, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-15"
            animate={{
              x: [0, 40, -40, 0],
              y: [0, -40, 40, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />


        </div>
      )}

      {/* Header */}
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 py-8 relative">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10" strokeWidth={2} />
            Wettbewerb
          </h1>
          <p className="text-lg opacity-90">Gewinnen Sie tolle Preise!</p>
        </div>
      </div>

      {/* Competition Form Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Form Card */}
                  <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">
                  Teilnahmeformular für Wettbewerbe
                </h2>
                <p className="text-white/90 mt-2">
                  Füllen Sie alle Felder aus, um am Wettbewerb teilzunehmen
                </p>
              </div>

              {/* Form Body */}
              <div className="p-8 space-y-8">

                {/* Question 1: Name */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Name
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        Vorname *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                          validationErrors.firstName && touchedFields.has('firstName')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-cyan-500'
                        }`}
                        placeholder="Max"
                      />
                      <ErrorMessage fieldName="firstName" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nachname *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                          validationErrors.lastName && touchedFields.has('lastName')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-cyan-500'
                        }`}
                        placeholder="Mustermann"
                      />
                      <ErrorMessage fieldName="lastName" />
                    </div>
                  </div>
                </div>

                {/* Question 2: Email */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    E-Mail
                  </h3>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                        validationErrors.email && touchedFields.has('email')
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-cyan-500'
                      }`}
                      placeholder="max.mustermann@example.com"
                    />
                    <ErrorMessage fieldName="email" />
                  </div>
                </div>

                {/* Question 3: Telefonnummer */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Telefonnummer
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefonnummer mit Ländercode *
                    </label>
                    <div className="phone-input-wrapper">
                      <PhoneInput
                        country={"ch"}
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        inputProps={{
                          name: "phoneNumber",
                          required: true,
                          className: `w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                            validationErrors.phoneNumber && touchedFields.has('phoneNumber')
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-cyan-500'
                          }`,
                        }}
                        containerClass="phone-input-container"
                        buttonClass="phone-input-button"
                        dropdownClass="phone-input-dropdown"
                        searchClass="phone-input-search"
                        enableSearch={true}
                        searchPlaceholder="Land suchen..."
                        preferredCountries={["ch", "de", "at", "li", "fr", "it", "be", "nl", "lu", "dk", "se", "no", "fi", "gb", "ie", "es", "pt", "pl", "cz", "hu", "gr"]}
                        onlyCountries={[
                          "ch", "de", "at", "li", "fr", "be", "nl", "lu", "mc",
                          "it", "es", "pt", "ad", "sm", "mt", "gr", "cy",
                          "gb", "ie", "dk", "se", "no", "fi", "is",
                          "pl", "cz", "sk", "hu", "si", "hr", "ro", "bg", "rs", "al",
                          "ee", "lv", "lt", "ba", "mk", "me", "ua", "md", "by"
                        ]}
                        localization={{
                          de: "Deutschland",
                          ch: "Schweiz",
                          at: "Österreich",
                          fr: "Frankreich",
                          it: "Italien",
                          es: "Spanien",
                          pt: "Portugal",
                          nl: "Niederlande",
                          be: "Belgien",
                          gb: "Vereinigtes Königreich",
                          ie: "Irland",
                          dk: "Dänemark",
                          se: "Schweden",
                          no: "Norwegen",
                          fi: "Finnland",
                          pl: "Polen",
                          cz: "Tschechien",
                          hu: "Ungarn",
                          gr: "Griechenland"
                        }}
                      />
                      <ErrorMessage fieldName="phoneNumber" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Wählen Sie Ihr Land aus der Liste, um den richtigen Ländercode zu erhalten
                    </p>
                  </div>
                </div>

                {/* Question 4: Geburtstag */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                    Geburtstag
                  </h3>
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Geburtsdatum * <span className="text-xs text-gray-500 font-normal">(TT.MM.JJJJ)</span>
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      required
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                        validationErrors.birthDate && touchedFields.has('birthDate')
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-cyan-500'
                      }`}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    <ErrorMessage fieldName="birthDate" />
                  </div>
                </div>

                {/* Question 5: Adresse */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                    Adresse
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-2">
                        Anschrift *
                      </label>
                      <input
                        type="text"
                        id="address1"
                        name="address1"
                        required
                        value={formData.address1}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                          validationErrors.address1 && touchedFields.has('address1')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-cyan-500'
                        }`}
                        placeholder="Strasse und Hausnummer"
                      />
                      <ErrorMessage fieldName="address1" />
                    </div>

                    <div>
                      <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-2">
                        Anschrift 2 (Optional)
                      </label>
                      <input
                        type="text"
                        id="address2"
                        name="address2"
                        value={formData.address2}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                          validationErrors.address2 && touchedFields.has('address2')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-cyan-500'
                        }`}
                        placeholder="Wohnung, Suite, etc."
                      />
                      <ErrorMessage fieldName="address2" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          Ort *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                            validationErrors.city && touchedFields.has('city')
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-cyan-500'
                          }`}
                          placeholder="Zürich"
                        />
                        <ErrorMessage fieldName="city" />
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                          Postleitzahl *
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                            validationErrors.postalCode && touchedFields.has('postalCode')
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-cyan-500'
                          }`}
                          placeholder="8000"
                        />
                        <ErrorMessage fieldName="postalCode" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          Bundesland/Kanton *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                            validationErrors.state && touchedFields.has('state')
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-cyan-500'
                          }`}
                          placeholder="Zürich"
                        />
                        <ErrorMessage fieldName="state" />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                          Land *
                        </label>
                        <select
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                            validationErrors.country && touchedFields.has('country')
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-cyan-500'
                          }`}
                        >
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <ErrorMessage fieldName="country" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question 6: Zustimmung zu den Bedingungen */}
                <motion.div
                  ref={termsRef}
                  className={`bg-gradient-to-r ${showTermsError ? 'from-red-500 to-rose-600' : 'from-cyan-500 to-blue-600'} rounded-xl p-1 transition-all duration-500`}
                  animate={showTermsError ? {
                    x: [0, -10, 10, -10, 10, 0],
                    transition: { duration: 0.5, ease: "easeInOut" }
                  } : {}}
                >
                  <div className="bg-white rounded-xl p-6">
                    {/* Error Message */}
                    <AnimatePresence>
                      {showTermsError && (
                        <motion.div
                          initial={{ opacity: 0, y: -20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="mb-6"
                        >
                          <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-xl p-4 shadow-xl">
                            <div className="flex items-center gap-3">
                              <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex-shrink-0"
                              >
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <AlertTriangle className="w-7 h-7 text-white" strokeWidth={2.5} />
                                </div>
                              </motion.div>
                              <div className="flex-grow">
                                <motion.h4
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                  className="text-white font-bold text-lg mb-1"
                                >
                                  Zustimmung erforderlich
                                </motion.h4>
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="text-white/90 text-sm"
                                >
                                  Bitte stimmen Sie den Bedingungen zu, um fortzufahren.
                                </motion.p>
                              </div>
                              <motion.button
                                onClick={() => setShowTermsError(false)}
                                whileHover={{ rotate: 90, opacity: 0.8 }}
                                whileTap={{ rotate: 0 }}
                                className="flex-shrink-0 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                              >
                                <X className="w-5 h-5 text-white" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-3">
                      <span className={`bg-gradient-to-r ${showTermsError ? 'from-red-500 to-rose-600' : 'from-cyan-500 to-blue-600'} text-white w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-lg transition-all duration-500`}>
                        6
                      </span>
                      <span>Zustimmung zu den Bedingungen</span>
                      <Shield className={`w-5 h-5 ${showTermsError ? 'text-red-400' : 'text-gray-400'} ml-auto transition-colors duration-500`} />
                    </h3>

                    <div className="space-y-4">
                      {/* Agree Option */}
                      <div
                        className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                          formData.termsAccepted === "agree"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          const event = { target: { name: "termsAccepted", value: "agree", type: "radio" } } as React.ChangeEvent<HTMLInputElement>;
                          handleInputChange(event);
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-0.5">
                            <input
                              type="radio"
                              name="termsAccepted"
                              value="agree"
                              id="terms-agree"
                              aria-label="Ja, ich stimme zu"
                              required
                              checked={formData.termsAccepted === "agree"}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-green-600 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 cursor-pointer"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <Check className={`w-5 h-5 ${formData.termsAccepted === "agree" ? "text-green-600" : "text-gray-400"}`} />
                              <span className={`font-semibold ${formData.termsAccepted === "agree" ? "text-green-700" : "text-gray-700"}`}>
                                Ja, ich stimme zu
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              Ich stimme den{" "}
                              <Link href="/agb" className="text-cyan-600 hover:text-cyan-700 underline font-medium">
                                Teilnahmebedingungen
                              </Link>{" "}
                              zu und bestätige, dass meine Daten gemäss der{" "}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowPrivacyModal(true);
                                }}
                                className="text-cyan-600 hover:text-cyan-700 underline font-medium"
                              >
                                Datenschutzerklärung
                              </button>{" "}
                              verarbeitet werden.
                            </p>
                          </div>
                        </div>
                        {formData.termsAccepted === "agree" && (
                          <div className="absolute top-3 right-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Disagree Option */}
                      <div
                        className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                          formData.termsAccepted === "disagree"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          const event = { target: { name: "termsAccepted", value: "disagree", type: "radio" } } as React.ChangeEvent<HTMLInputElement>;
                          handleInputChange(event);
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-0.5">
                            <input
                              type="radio"
                              name="termsAccepted"
                              value="disagree"
                              id="terms-disagree"
                              aria-label="Nein, ich stimme nicht zu"
                              checked={formData.termsAccepted === "disagree"}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-red-600 border-2 border-gray-300 focus:ring-2 focus:ring-red-500 cursor-pointer"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <X className={`w-5 h-5 ${formData.termsAccepted === "disagree" ? "text-red-600" : "text-gray-400"}`} />
                              <span className={`font-semibold ${formData.termsAccepted === "disagree" ? "text-red-700" : "text-gray-700"}`}>
                                Nein, ich stimme nicht zu
                              </span>
                            </div>
                          </div>
                        </div>
                        {formData.termsAccepted === "disagree" && (
                          <div className="absolute top-3 right-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <X className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <ErrorMessage fieldName="termsAccepted" />

                    {/* Info Notice */}
                    <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-cyan-200">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            <span className="font-semibold">Datenschutz garantiert:</span> Ihre Daten werden ausschliesslich für die
                            Durchführung des Wettbewerbs verwendet und nach Abschluss sicher gelöscht.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <div className="pt-6">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full relative overflow-hidden ${
                      isSubmitting
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-700 cursor-wait'
                        : showTermsError
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                        : Object.keys(validationErrors).length > 0 && touchedFields.size > 0
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 opacity-75 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 cursor-pointer'
                    } text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                    animate={showTermsError ? {
                      scale: [1, 1.02, 1],
                      transition: { duration: 1, repeat: Infinity }
                    } : isSubmitting ? {
                      scale: [1, 0.98, 1],
                      transition: { duration: 1.5, repeat: Infinity }
                    } : {}}
                    whileHover={!isSubmitting && !showTermsError ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && !showTermsError ? { scale: 0.98 } : {}}
                  >
                    {/* Loading overlay */}
                    {isSubmitting && (
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}

                    {/* Button content */}
                    <div className="relative flex items-center gap-3">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Wird gesendet...</span>
                        </>
                      ) : showTermsError ? (
                        <>
                          <AlertTriangle className="w-5 h-5" />
                          <span>Bitte Bedingungen akzeptieren</span>
                        </>
                      ) : Object.keys(validationErrors).length > 0 && touchedFields.size > 0 ? (
                        <>
                          <X className="w-5 h-5" />
                          <span>Bitte Fehler korrigieren</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Formular absenden</span>
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Status message below button */}
                  <AnimatePresence>
                    {isSubmitting && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center text-sm text-cyan-600 mt-3"
                      >
                        Ihre Daten werden sicher übertragen...
                      </motion.p>
                    )}
                    {!isSubmitting && Object.keys(validationErrors).length === 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm text-gray-500 mt-3"
                      >
                        * Alle mit Stern markierten Felder sind Pflichtfelder
                      </motion.p>
                    )}
                    {!isSubmitting && Object.keys(validationErrors).length > 0 && touchedFields.size > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-sm text-red-600 mt-3 flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {Object.keys(validationErrors).length} {Object.keys(validationErrors).length === 1 ? 'Feld muss' : 'Felder müssen'} korrigiert werden
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </form>

            {/* Additional Information Card */}
            <div className="mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Informationen zum Wettbewerb
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-0.5">✓</span>
                    <span>Die Teilnahme ist kostenlos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-0.5">✓</span>
                    <span>Teilnahmeberechtigt sind alle Studierenden</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-0.5">✓</span>
                    <span>Die Gewinner werden per E-Mail benachrichtigt</span>
                  </li>
                </ul>
              </div>
            </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-white rounded-xl shadow-xl overflow-hidden"
                >
                  {/* Success Header */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                    <h2 className="text-2xl font-bold text-white text-center">
                      Erfolgreich übermittelt!
                    </h2>
                  </div>

                  {/* Success Body */}
                  <div className="p-12 text-center">
                    {/* Animated Success Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                        damping: 10
                      }}
                      className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-xl"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.4,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
                      </motion.div>
                    </motion.div>

                    {/* Success Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Vielen Dank für Ihre Teilnahme!
                      </h3>
                      <p className="text-lg text-gray-600 mb-2">
                        Ihre Daten wurden erfolgreich übermittelt.
                      </p>
                      <p className="text-gray-500 mb-8">
                        Wir werden uns in Kürze bei Ihnen melden.
                      </p>
                    </motion.div>

                    {/* Confirmation Details */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-8 max-w-md mx-auto"
                    >
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold">Name:</span> {formData.firstName} {formData.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold">E-Mail:</span> {formData.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold">Datum:</span> {new Date().toLocaleDateString('de-CH', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors duration-200"
                      >
                        <Home className="w-5 h-5" />
                        Zur Startseite
                      </Link>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Weitere Teilnahme
                      </button>
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 1 }}
                        className="absolute -top-24 -left-24 w-48 h-48 bg-green-200 rounded-full blur-3xl"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 1.2 }}
                        className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-200 rounded-full blur-3xl"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowPrivacyModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-4xl md:w-full md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">Datenschutzerklärung</h2>
                </div>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    Diese Datenschutzerklärung erläutert, wie und zu welchem Zweck Ihre personenbezogenen Daten bei der Nutzung der Angebote der BVS Buchverlag und Service AG verarbeitet werden.
                  </p>

                  {/* Section 1 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
                      Verantwortliche Stelle
                    </h3>
                    <div className="pl-9 space-y-1 text-gray-600 text-sm">
                      <p>• BVS Buchverlag und Service AG</p>
                      <p>• Bösch 106, 6331 Hünenberg ZG, Schweiz</p>
                      <p>• E-Mail: <a href="mailto:info@bvsbservices.ch" className="text-cyan-600 hover:text-cyan-700 underline">info@bvsbservices.ch</a></p>
                      <p>• Für StuID-spezifische Anfragen</p>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
                      Erhebung und Verarbeitung von Personendaten
                    </h3>
                    <p className="pl-9 text-gray-600 text-sm mb-2">Wir erheben folgende Daten:</p>
                    <ul className="pl-9 space-y-1 text-gray-600 text-sm">
                      <li>• Anrede, Vor- und Nachname</li>
                      <li>• Geburtsdatum</li>
                      <li>• Strasse, Postleitzahl, Ort</li>
                      <li>• E-Mail-Adresse</li>
                      <li>• Telefon- und Mobilnummer</li>
                      <li>• Voraussichtlicher Studiengang</li>
                    </ul>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">3</span>
                      Zwecke und Rechtsgrundlagen
                    </h3>
                    <p className="pl-9 text-gray-600 text-sm">
                      Die Verarbeitung erfolgt zur Erfüllung vertraglicher Pflichten und zur Bereitstellung der StuID-Services.
                    </p>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">4</span>
                      Cookies und Tracking
                    </h3>
                    <ul className="pl-9 space-y-1 text-gray-600 text-sm">
                      <li>• Session-Cookies (automatisch gelöscht)</li>
                      <li>• Permanente Cookies (längerfristig gespeichert)</li>
                    </ul>
                  </div>

                  {/* Section 5 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">5</span>
                      Weitergabe von Daten
                    </h3>
                    <p className="pl-9 text-gray-600 text-sm">
                      Die BVS Buchverlag und Service AG behandelt Ihre Personendaten stets vertraulich.
                    </p>
                  </div>

                  {/* Section 6 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">6</span>
                      Aufbewahrungsdauer
                    </h3>
                    <p className="pl-9 text-gray-600 text-sm">
                      Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck erforderlich ist.
                    </p>
                  </div>

                  {/* Section 7 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">7</span>
                      Datensicherheit
                    </h3>
                    <p className="pl-9 text-gray-600 text-sm">
                      Schutz durch angemessene technische und organisatorische Vorkehrungen.
                    </p>
                  </div>

                  {/* Section 8 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">8</span>
                      Profiling
                    </h3>
                    <p className="pl-9 text-gray-600 text-sm">
                      Automatisierte Auswertung um relevante StuID-Angebote zukommen zu lassen.
                    </p>
                  </div>

                  {/* Section 9 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">9</span>
                      Ihre Rechte
                    </h3>
                    <ul className="pl-9 space-y-1 text-gray-600 text-sm">
                      <li>• <strong>Auskunftsrecht:</strong> Bestätigung welche Daten gespeichert sind</li>
                      <li>• <strong>Berichtigungsrecht:</strong> Korrektur unzutreffender Daten</li>
                      <li>• <strong>Löschungsrecht:</strong> Entfernung Ihrer Daten</li>
                      <li>• Einschränkung der Verarbeitung</li>
                      <li>• Widerspruchsrecht</li>
                      <li>• Datenübertragbarkeit</li>
                    </ul>
                  </div>

                  {/* Section 10 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">10</span>
                      StuID-spezifisch
                    </h3>
                    <p className="pl-9 text-gray-600 text-sm">
                      Für Löschung: Zunächst StuID-Mitgliedschaft bei der zuständigen Schulinstitution aufheben.
                    </p>
                  </div>

                  {/* Section 11 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">11</span>
                      Beschwerderecht
                    </h3>
                    <ul className="pl-9 space-y-1 text-gray-600 text-sm">
                      <li>• Schweizer Datenschutzbehörde: <a href="http://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">http://www.edoeb.admin.ch</a></li>
                      <li>• EU-Datenschutzbehörden: <a href="https://edpb.europa.eu" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">edpb.europa.eu</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t p-4 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Schliessen
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />

      {/* Custom styles for phone input */}
      <style jsx global>{`
        .phone-input-container {
          width: 100%;
        }

        .phone-input-container .form-control {
          width: 100% !important;
          padding-left: 58px !important;
          padding-top: 0.625rem !important;
          padding-bottom: 0.625rem !important;
          padding-right: 1rem !important;
          border: 1px solid rgb(209 213 219) !important;
          border-radius: 0.5rem !important;
          font-size: 1rem !important;
        }

        .phone-input-container .form-control:focus {
          outline: none !important;
          border-color: transparent !important;
          box-shadow: 0 0 0 2px rgb(6 182 212) !important;
        }

        .phone-input-container .flag-dropdown {
          background-color: transparent !important;
          border: 1px solid rgb(209 213 219) !important;
          border-right: none !important;
          border-radius: 0.5rem 0 0 0.5rem !important;
        }

        .phone-input-container .flag-dropdown:hover {
          background-color: rgb(249 250 251) !important;
        }

        .phone-input-container .selected-flag {
          padding: 0 8px !important;
        }

        .phone-input-container .country-list {
          border-radius: 0.5rem !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
        }

        .phone-input-container .country-list .search {
          padding: 10px !important;
          margin: 10px !important;
          border-radius: 0.375rem !important;
        }

        .phone-input-container .country-list .country:hover {
          background-color: rgb(243 244 246) !important;
        }

        .phone-input-container .country-list .country.highlight {
          background-color: rgb(6 182 212) !important;
        }
      `}</style>
    </div>
  );
}