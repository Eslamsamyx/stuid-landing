import { z } from 'zod';

// Copy the validation schema from the main file
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
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Geburtsdatum muss im Format YYYY-MM-DD eingegeben werden")
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
    .regex(/^[a-zA-ZäöüßÄÖÜ\s-']+$/, "Stadt darf nur Buchstaben, Bindestriche und Apostrophe enthalten"),

  state: z
    .string()
    .min(1, "Bundesland/Kanton ist erforderlich")
    .min(2, "Bundesland/Kanton muss mindestens 2 Zeichen lang sein")
    .max(50, "Bundesland/Kanton darf maximal 50 Zeichen lang sein"),

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

describe('Competition Form Validation Schema', () => {
  describe('First Name Validation', () => {
    it('should reject empty first name', () => {
      const result = competitionFormSchema.shape.firstName.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Vorname ist erforderlich');
      }
    });

    it('should reject first name shorter than 2 characters', () => {
      const result = competitionFormSchema.shape.firstName.safeParse('A');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Vorname muss mindestens 2 Zeichen lang sein');
      }
    });

    it('should reject first name longer than 50 characters', () => {
      const longName = 'A'.repeat(51);
      const result = competitionFormSchema.shape.firstName.safeParse(longName);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Vorname darf maximal 50 Zeichen lang sein');
      }
    });

    it('should reject first name with numbers', () => {
      const result = competitionFormSchema.shape.firstName.safeParse('John123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Buchstaben, Bindestriche und Apostrophe');
      }
    });

    it('should accept valid first names', () => {
      const validNames = ['Max', 'Anna-Marie', "O'Connor", 'Müller'];
      validNames.forEach(name => {
        const result = competitionFormSchema.shape.firstName.safeParse(name);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Email Validation', () => {
    it('should reject empty email', () => {
      const result = competitionFormSchema.shape.email.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('E-Mail-Adresse ist erforderlich');
      }
    });

    it('should reject invalid email format', () => {
      const invalidEmails = ['notanemail', '@example.com', 'user@', 'user@.com', 'user@domain'];
      invalidEmails.forEach(email => {
        const result = competitionFormSchema.shape.email.safeParse(email);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Bitte geben Sie eine gültige E-Mail-Adresse ein');
        }
      });
    });

    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'firstname.lastname@company.ch',
        'user+tag@domain.org',
        'test_email@sub.domain.com'
      ];
      validEmails.forEach(email => {
        const result = competitionFormSchema.shape.email.safeParse(email);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Phone Number Validation', () => {
    it('should reject empty phone number', () => {
      const result = competitionFormSchema.shape.phoneNumber.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Telefonnummer ist erforderlich');
      }
    });

    it('should reject phone number shorter than 10 characters', () => {
      const result = competitionFormSchema.shape.phoneNumber.safeParse('123456789');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Telefonnummer muss mindestens 10 Zeichen lang sein');
      }
    });

    it('should accept valid phone numbers', () => {
      const validPhones = ['0791234567', '+41791234567', '00417912345678'];
      validPhones.forEach(phone => {
        const result = competitionFormSchema.shape.phoneNumber.safeParse(phone);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Birth Date Validation', () => {
    it('should reject invalid date format', () => {
      const invalidDates = ['01-01-1990', '1990/01/01', '01.01.1990', 'not-a-date'];
      invalidDates.forEach(date => {
        const result = competitionFormSchema.shape.birthDate.safeParse(date);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toContain('YYYY-MM-DD');
        }
      });
    });

    it('should reject age under 13', () => {
      const today = new Date();
      const tooYoung = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
      const dateString = tooYoung.toISOString().split('T')[0];

      const result = competitionFormSchema.shape.birthDate.safeParse(dateString);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Sie müssen zwischen 13 und 99 Jahre alt sein');
      }
    });

    it('should reject age over 99', () => {
      const result = competitionFormSchema.shape.birthDate.safeParse('1920-01-01');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Sie müssen zwischen 13 und 99 Jahre alt sein');
      }
    });

    it('should accept valid birth dates', () => {
      const validAge = new Date();
      validAge.setFullYear(validAge.getFullYear() - 25);
      const dateString = validAge.toISOString().split('T')[0];

      const result = competitionFormSchema.shape.birthDate.safeParse(dateString);
      expect(result.success).toBe(true);
    });
  });

  describe('Postal Code Validation', () => {
    it('should reject empty postal code', () => {
      const result = competitionFormSchema.shape.postalCode.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Postleitzahl ist erforderlich');
      }
    });

    it('should reject invalid postal code format', () => {
      const invalidCodes = ['123', '123456', 'ABCD', '12AB'];
      invalidCodes.forEach(code => {
        const result = competitionFormSchema.shape.postalCode.safeParse(code);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Postleitzahl muss 4-5 Ziffern enthalten');
        }
      });
    });

    it('should accept valid postal codes', () => {
      const validCodes = ['8000', '3000', '12345', '9999'];
      validCodes.forEach(code => {
        const result = competitionFormSchema.shape.postalCode.safeParse(code);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('City Validation', () => {
    it('should reject city with numbers', () => {
      const result = competitionFormSchema.shape.city.safeParse('City123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Buchstaben, Bindestriche und Apostrophe');
      }
    });

    it('should accept valid city names', () => {
      const validCities = ['Zürich', 'Bern', 'La-Chaux-de-Fonds', "Val-d'Isère"];
      validCities.forEach(city => {
        const result = competitionFormSchema.shape.city.safeParse(city);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Terms Acceptance Validation', () => {
    it('should reject empty terms', () => {
      const result = competitionFormSchema.shape.termsAccepted.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Sie müssen den Geschäftsbedingungen zustimmen');
      }
    });

    it('should reject disagree option', () => {
      const result = competitionFormSchema.shape.termsAccepted.safeParse('disagree');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Sie müssen den Geschäftsbedingungen zustimmen');
      }
    });

    it('should accept agree option', () => {
      const result = competitionFormSchema.shape.termsAccepted.safeParse('agree');
      expect(result.success).toBe(true);
    });
  });

  describe('Optional Fields', () => {
    it('should accept empty address2 field', () => {
      const result = competitionFormSchema.shape.address2?.safeParse('');
      expect(result?.success).toBe(true);
    });

    it('should accept undefined address2 field', () => {
      const result = competitionFormSchema.shape.address2?.safeParse(undefined);
      expect(result?.success).toBe(true);
    });

    it('should reject address2 longer than 100 characters', () => {
      const longAddress = 'A'.repeat(101);
      const result = competitionFormSchema.shape.address2?.safeParse(longAddress);
      expect(result?.success).toBe(false);
      if (result && !result.success) {
        expect(result.error.errors[0].message).toBe('Zusätzliche Adressinformationen dürfen maximal 100 Zeichen lang sein');
      }
    });
  });

  describe('Complete Form Validation', () => {
    it('should validate a complete valid form', () => {
      const validForm = {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@example.com',
        phoneNumber: '+41791234567',
        birthDate: '1990-01-01',
        address1: 'Hauptstrasse 123',
        address2: 'Apartment 4B',
        city: 'Zürich',
        state: 'Zürich',
        postalCode: '8000',
        country: 'Schweiz',
        termsAccepted: 'agree'
      };

      const result = competitionFormSchema.safeParse(validForm);
      expect(result.success).toBe(true);
    });

    it('should reject incomplete form', () => {
      const incompleteForm = {
        firstName: 'Max',
        email: 'max@example.com',
        // Missing required fields
      };

      const result = competitionFormSchema.safeParse(incompleteForm);
      expect(result.success).toBe(false);
    });
  });
});