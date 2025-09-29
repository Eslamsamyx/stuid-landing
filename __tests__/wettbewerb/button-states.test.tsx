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

// Mock fetch API for email sending
global.fetch = jest.fn();

// Mock console.log to avoid test output pollution
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('WettbewerbPage - Submit Button States', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API response by default
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Success' }),
    });
  });

  describe('Button Initial State', () => {
    it('should show default submit text initially', () => {
      render(<WettbewerbPage />);

      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it('should display required fields message initially', () => {
      render(<WettbewerbPage />);

      expect(screen.getByText(/\* Alle mit Stern markierten Felder sind Pflichtfelder/i)).toBeInTheDocument();
    });
  });

  describe('Button Validation States', () => {
    it('should show error count when form has validation errors', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Type invalid email to trigger validation
      const emailInput = screen.getByLabelText(/E-Mail-Adresse \*/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur validation

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      await user.click(submitButton);

      // Should show error count message
      await waitFor(() => {
        const errorMessage = screen.getByText(/Felder müssen korrigiert werden/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('should show "Bitte Fehler korrigieren" text when there are errors', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Submit empty form to trigger errors
      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Bitte Fehler korrigieren/i)).toBeInTheDocument();
      });
    });

    it('should show terms acceptance error button state', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Fill all required fields except terms
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

      // Should show terms acceptance message
      await waitFor(() => {
        expect(screen.getByText(/Bitte Bedingungen akzeptieren/i)).toBeInTheDocument();
      });
    });
  });

  describe('Button Loading State', () => {
    it('should show loading state when form is submitted', async () => {
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

      // Check for loading state
      await waitFor(() => {
        expect(screen.getByText(/Wird gesendet\.\.\./i)).toBeInTheDocument();
      });

      // Check for loading message
      expect(screen.getByText(/Ihre Daten werden sicher übertragen\.\.\./i)).toBeInTheDocument();
    });

    it('should disable button during submission', async () => {
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
      await user.click(screen.getByText(/Ja, ich stimme zu/i).closest('div')!);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      await user.click(submitButton);

      // Button should be disabled during submission
      await waitFor(() => {
        const loadingButton = screen.getByRole('button', { name: /Wird gesendet/i });
        expect(loadingButton).toBeDisabled();
      });
    });

    it('should show success state after successful submission', async () => {
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
      await user.click(screen.getByText(/Ja, ich stimme zu/i).closest('div')!);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      await user.click(submitButton);

      // Wait for success state (after loading completes)
      await waitFor(() => {
        expect(screen.getByText(/Vielen Dank für Ihre Teilnahme!/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Button Visual States', () => {
    it('should have proper CSS classes for different states', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });

      // Initial state - should have blue gradient
      expect(submitButton).toHaveClass('from-cyan-500', 'to-blue-600');

      // Trigger validation errors
      await user.click(submitButton);

      // Error state - should have gray gradient
      await waitFor(() => {
        const errorButton = screen.getByRole('button', { name: /Bitte Fehler korrigieren/i });
        expect(errorButton).toHaveClass('from-gray-400', 'to-gray-500');
      });
    });

    it('should show different icons for different states', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Initial state - should have Send icon
      const sendIcon = document.querySelector('.lucide-send');
      expect(sendIcon).toBeInTheDocument();

      // Submit empty form to trigger errors
      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      await user.click(submitButton);

      // Error state - should have X icon
      await waitFor(() => {
        const xIcon = document.querySelector('.lucide-x');
        expect(xIcon).toBeInTheDocument();
      });
    });
  });

  describe('Button Interaction Feedback', () => {
    it('should update button text based on validation state', async () => {
      const user = userEvent.setup();
      render(<WettbewerbPage />);

      // Initial button text
      expect(screen.getByText(/Formular absenden/i)).toBeInTheDocument();

      // Type invalid data
      const emailInput = screen.getByLabelText(/E-Mail-Adresse \*/i);
      await user.type(emailInput, 'invalid');
      await user.tab();

      // Submit to show validation state
      const submitButton = screen.getByRole('button', { name: /Formular absenden/i });
      await user.click(submitButton);

      // Should update button text
      await waitFor(() => {
        expect(screen.getByText(/Bitte Fehler korrigieren/i)).toBeInTheDocument();
      });

      // Fix the email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');
      await user.tab();

      // Fill other required fields
      await user.type(screen.getByLabelText(/Vorname \*/i), 'Max');
      await user.type(screen.getByLabelText(/Nachname \*/i), 'Mustermann');
      await user.type(screen.getByTestId('phone-input'), '41791234567');
      await user.type(screen.getByLabelText(/Geburtsdatum \*/i), '1990-01-01');
      await user.type(screen.getByLabelText(/Anschrift \*/i), 'Test 123');
      await user.type(screen.getByLabelText(/Ort \*/i), 'Zürich');
      await user.type(screen.getByLabelText(/Postleitzahl \*/i), '8000');
      await user.type(screen.getByLabelText(/Bundesland\/Kanton \*/i), 'Zürich');
      await user.click(screen.getByText(/Ja, ich stimme zu/i).closest('div')!);

      // Button should revert to submit text
      await waitFor(() => {
        expect(screen.getByText(/Formular absenden/i)).toBeInTheDocument();
      });
    });
  });
});