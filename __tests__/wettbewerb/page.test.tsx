import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import WettbewerbPage from '../../src/app/wettbewerb/page';

// Mock components
jest.mock('~/components/Navbar', () => {
  return function Navbar() {
    return <nav>Navbar</nav>;
  };
});

jest.mock('~/components/Footer', () => {
  return function Footer() {
    return <footer>Footer</footer>;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/dynamic for PhoneInput
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    const DynamicComponent = ({
      onChange,
      value,
      inputProps,
      country,
      containerClass,
      buttonClass,
      dropdownClass,
      searchClass,
      enableSearch,
      searchPlaceholder,
      preferredCountries,
      onlyCountries,
      ...props
    }: any) => (
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="phone-input"
        {...inputProps}
      />
    );
    return DynamicComponent;
  },
}));

// Framer-motion is mocked globally in jest.setup.ts

// Mock console.log to avoid test output pollution
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('WettbewerbPage - Competition Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(<WettbewerbPage />);

      // Name fields
      expect(screen.getByLabelText(/Vorname \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nachname \*/i)).toBeInTheDocument();

      // Email field
      expect(screen.getByLabelText(/E-Mail-Adresse \*/i)).toBeInTheDocument();

      // Phone field
      expect(screen.getByTestId('phone-input')).toBeInTheDocument();

      // Birth date field
      expect(screen.getByLabelText(/Geburtsdatum \*/i)).toBeInTheDocument();

      // Address fields
      expect(screen.getByLabelText(/Anschrift \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Anschrift 2 \(Optional\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Ort \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Postleitzahl \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Bundesland\/Kanton \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Land \*/i)).toBeInTheDocument();

      // Terms acceptance
      expect(screen.getByText(/Ja, ich stimme zu/i)).toBeInTheDocument();
      expect(screen.getByText(/Nein, ich stimme nicht zu/i)).toBeInTheDocument();

      // Submit button
      expect(screen.getByRole('button', { name: /Formular absenden/i })).toBeInTheDocument();
    });

    it('should have correct initial values', () => {
      render(<WettbewerbPage />);

      // Check empty text fields
      expect(screen.getByLabelText(/Vorname \*/i)).toHaveValue('');
      expect(screen.getByLabelText(/Nachname \*/i)).toHaveValue('');
      expect(screen.getByLabelText(/E-Mail-Adresse \*/i)).toHaveValue('');

      // Check default country selection
      const countrySelect = screen.getByLabelText(/Land \*/i) as HTMLSelectElement;
      expect(countrySelect.value).toBe('Schweiz');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors when submitting empty form', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      await user.click(submitButton);

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText(/Vorname ist erforderlich/i)).toBeInTheDocument();
      });

      // Check for other validation errors
      expect(screen.getByText(/Nachname ist erforderlich/i)).toBeInTheDocument();
      expect(screen.getByText(/E-Mail-Adresse ist erforderlich/i)).toBeInTheDocument();
      expect(screen.getByText(/Telefonnummer ist erforderlich/i)).toBeInTheDocument();
      expect(screen.getByText(/Geburtsdatum ist erforderlich/i)).toBeInTheDocument();
      expect(screen.getByText(/Adresse ist erforderlich/i)).toBeInTheDocument();
      expect(screen.getByText(/Stadt ist erforderlich/i)).toBeInTheDocument();
      expect(screen.getByText(/Postleitzahl ist erforderlich/i)).toBeInTheDocument();
      expect(screen.getByText(/Bundesland\/Kanton ist erforderlich/i)).toBeInTheDocument();
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      const emailInput = screen.getByLabelText(/E-Mail-Adresse \*/i);

      // Type invalid email
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(screen.getByText(/Bitte geben Sie eine gültige E-Mail-Adresse ein/i)).toBeInTheDocument();
      });

      // Clear and type valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/Bitte geben Sie eine gültige E-Mail-Adresse ein/i)).not.toBeInTheDocument();
      });
    });

    it('should validate postal code format', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      const postalCodeInput = screen.getByLabelText(/Postleitzahl \*/i);

      // Type invalid postal code
      await user.type(postalCodeInput, 'ABC');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/Postleitzahl muss 4-5 Ziffern enthalten/i)).toBeInTheDocument();
      });

      // Clear and type valid postal code
      await user.clear(postalCodeInput);
      await user.type(postalCodeInput, '8000');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/Postleitzahl muss 4-5 Ziffern enthalten/i)).not.toBeInTheDocument();
      });
    });

    it('should validate birth date age restrictions', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      const birthDateInput = screen.getByLabelText(/Geburtsdatum \*/i);

      // Set date for someone too young (10 years old)
      const tooYoungDate = new Date();
      tooYoungDate.setFullYear(tooYoungDate.getFullYear() - 10);
      const dateString = tooYoungDate.toISOString().split('T')[0];

      await user.type(birthDateInput, dateString);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/Sie müssen zwischen 13 und 99 Jahre alt sein/i)).toBeInTheDocument();
      });
    });

    it('should validate first name contains only valid characters', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      const firstNameInput = screen.getByLabelText(/Vorname \*/i);

      // Type invalid characters
      await user.type(firstNameInput, 'Test123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/Vorname darf nur Buchstaben, Bindestriche und Apostrophe enthalten/i)).toBeInTheDocument();
      });

      // Clear and type valid name
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Anna-Marie');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/Vorname darf nur Buchstaben, Bindestriche und Apostrophe enthalten/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Interaction', () => {
    it('should update field values when typing', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      const firstNameInput = screen.getByLabelText(/Vorname \*/i) as HTMLInputElement;
      const lastNameInput = screen.getByLabelText(/Nachname \*/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/E-Mail-Adresse \*/i) as HTMLInputElement;

      await user.type(firstNameInput, 'Max');
      await user.type(lastNameInput, 'Mustermann');
      await user.type(emailInput, 'max@example.com');

      expect(firstNameInput.value).toBe('Max');
      expect(lastNameInput.value).toBe('Mustermann');
      expect(emailInput.value).toBe('max@example.com');
    });

    it('should handle terms acceptance radio buttons', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      const agreeOption = screen.getByRole('radio', { name: /agree/i });
      const disagreeOption = screen.getByRole('radio', { name: /disagree/i });

      // Initially neither should be checked
      expect(agreeOption).not.toBeChecked();
      expect(disagreeOption).not.toBeChecked();

      // Click agree
      await user.click(screen.getByText(/Ja, ich stimme zu/i).closest('div')!);
      expect(agreeOption).toBeChecked();
      expect(disagreeOption).not.toBeChecked();

      // Click disagree
      await user.click(screen.getByText(/Nein, ich stimme nicht zu/i).closest('div')!);
      expect(agreeOption).not.toBeChecked();
      expect(disagreeOption).toBeChecked();
    });

    it('should show error when terms not accepted', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Fill required fields with minimal valid data
      await user.type(screen.getByLabelText(/Vorname \*/i), 'Max');
      await user.type(screen.getByLabelText(/Nachname \*/i), 'Mustermann');
      await user.type(screen.getByLabelText(/E-Mail-Adresse \*/i), 'max@example.com');
      await user.type(screen.getByTestId('phone-input'), '41791234567');
      await user.type(screen.getByLabelText(/Geburtsdatum \*/i), '1990-01-01');
      await user.type(screen.getByLabelText(/Anschrift \*/i), 'Teststrasse 123');
      await user.type(screen.getByLabelText(/Ort \*/i), 'Zürich');
      await user.type(screen.getByLabelText(/Postleitzahl \*/i), '8000');
      await user.type(screen.getByLabelText(/Bundesland\/Kanton \*/i), 'Zürich');

      // Submit without accepting terms
      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Sie müssen den Geschäftsbedingungen zustimmen/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should successfully submit form with valid data', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Fill all required fields
      await user.type(screen.getByLabelText(/Vorname \*/i), 'Max');
      await user.type(screen.getByLabelText(/Nachname \*/i), 'Mustermann');
      await user.type(screen.getByLabelText(/E-Mail-Adresse \*/i), 'max@example.com');
      await user.type(screen.getByTestId('phone-input'), '41791234567');
      await user.type(screen.getByLabelText(/Geburtsdatum \*/i), '1990-01-01');
      await user.type(screen.getByLabelText(/Anschrift \*/i), 'Teststrasse 123');
      await user.type(screen.getByLabelText(/Ort \*/i), 'Zürich');
      await user.type(screen.getByLabelText(/Postleitzahl \*/i), '8000');
      await user.type(screen.getByLabelText(/Bundesland\/Kanton \*/i), 'Zürich');

      // Accept terms
      await user.click(screen.getByText(/Ja, ich stimme zu/i).closest('div')!);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      await user.click(submitButton);

      // Check for success message
      await waitFor(() => {
        expect(screen.getByText(/Vielen Dank für Ihre Teilnahme!/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Ihre Daten wurden erfolgreich übermittelt/i)).toBeInTheDocument();
    });

    it('should show submitted data in success message', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Fill all required fields
      const testData = {
        firstName: 'Anna',
        lastName: 'Schmidt',
        email: 'anna.schmidt@example.com'
      };

      await user.type(screen.getByLabelText(/Vorname \*/i), testData.firstName);
      await user.type(screen.getByLabelText(/Nachname \*/i), testData.lastName);
      await user.type(screen.getByLabelText(/E-Mail-Adresse \*/i), testData.email);
      await user.type(screen.getByTestId('phone-input'), '41791234567');
      await user.type(screen.getByLabelText(/Geburtsdatum \*/i), '1995-05-15');
      await user.type(screen.getByLabelText(/Anschrift \*/i), 'Hauptstrasse 45');
      await user.type(screen.getByLabelText(/Ort \*/i), 'Bern');
      await user.type(screen.getByLabelText(/Postleitzahl \*/i), '3000');
      await user.type(screen.getByLabelText(/Bundesland\/Kanton \*/i), 'Bern');

      // Accept terms and submit
      await user.click(screen.getByText(/Ja, ich stimme zu/i).closest('div')!);
      await user.click(screen.getByRole('button', { name: /Formular absenden/i }));

      // Check success message contains submitted data
      await waitFor(() => {
        expect(screen.getByText(new RegExp(`${testData.firstName} ${testData.lastName}`))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(testData.email))).toBeInTheDocument();
      });
    });

    it('should allow resetting form after submission', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Quick valid submission
      await user.type(screen.getByLabelText(/Vorname \*/i), 'Test');
      await user.type(screen.getByLabelText(/Nachname \*/i), 'User');
      await user.type(screen.getByLabelText(/E-Mail-Adresse \*/i), 'test@test.com');
      await user.type(screen.getByTestId('phone-input'), '41791234567');
      await user.type(screen.getByLabelText(/Geburtsdatum \*/i), '2000-01-01');
      await user.type(screen.getByLabelText(/Anschrift \*/i), 'Test 1');
      await user.type(screen.getByLabelText(/Ort \*/i), 'Test');
      await user.type(screen.getByLabelText(/Postleitzahl \*/i), '1234');
      await user.type(screen.getByLabelText(/Bundesland\/Kanton \*/i), 'Test');
      await user.click(screen.getByText(/Ja, ich stimme zu/i).closest('div')!);
      await user.click(screen.getByRole('button', { name: /Formular absenden/i }));

      // Wait for success screen
      await waitFor(() => {
        expect(screen.getByText(/Vielen Dank für Ihre Teilnahme!/i)).toBeInTheDocument();
      });

      // Click reset button
      const resetButton = screen.getByRole('button', { name: /Weitere Teilnahme/i });
      await user.click(resetButton);

      // Form should be visible again and empty
      await waitFor(() => {
        expect(screen.getByLabelText(/Vorname \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Vorname \*/i)).toHaveValue('');
      });
    });
  });

  describe('Privacy Modal', () => {
    it('should open and close privacy modal', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Initially modal should not be visible
      expect(screen.queryByText(/Datenschutzerklärung/i)).toBeInTheDocument(); // Link text
      expect(screen.queryByText(/Verantwortliche Stelle/i)).not.toBeInTheDocument(); // Modal content

      // Open modal
      const privacyLink = screen.getByRole('button', { name: /Datenschutzerklärung/i });
      await user.click(privacyLink);

      // Modal content should be visible
      await waitFor(() => {
        expect(screen.getByText(/Verantwortliche Stelle/i)).toBeInTheDocument();
        expect(screen.getByText(/BVS Buchverlag und Service AG/i)).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByRole('button', { name: /Schliessen/i });
      await user.click(closeButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText(/Verantwortliche Stelle/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(<WettbewerbPage />);

      // Check that all required fields have labels
      const requiredFields = [
        /Vorname \*/i,
        /Nachname \*/i,
        /E-Mail-Adresse \*/i,
        /Geburtsdatum \*/i,
        /Anschrift \*/i,
        /Ort \*/i,
        /Postleitzahl \*/i,
        /Bundesland\/Kanton \*/i,
        /Land \*/i
      ];

      requiredFields.forEach(fieldLabel => {
        expect(screen.getByLabelText(fieldLabel)).toBeInTheDocument();
      });
    });

    it('should have required attribute on mandatory fields', () => {
      render(<WettbewerbPage />);

      expect(screen.getByLabelText(/Vorname \*/i)).toBeRequired();
      expect(screen.getByLabelText(/Nachname \*/i)).toBeRequired();
      expect(screen.getByLabelText(/E-Mail-Adresse \*/i)).toBeRequired();
      expect(screen.getByLabelText(/Geburtsdatum \*/i)).toBeRequired();
      expect(screen.getByLabelText(/Anschrift \*/i)).toBeRequired();
      expect(screen.getByLabelText(/Ort \*/i)).toBeRequired();
      expect(screen.getByLabelText(/Postleitzahl \*/i)).toBeRequired();
      expect(screen.getByLabelText(/Bundesland\/Kanton \*/i)).toBeRequired();
      expect(screen.getByLabelText(/Land \*/i)).toBeRequired();
    });

    it('should indicate optional fields', () => {
      render(<WettbewerbPage />);

      // Address 2 should be marked as optional
      expect(screen.getByLabelText(/Anschrift 2 \(Optional\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Anschrift 2 \(Optional\)/i)).not.toBeRequired();
    });
  });
});