import { type NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { z } from 'zod';
import { env } from '~/env';
import { createEmailTemplate, type CompetitionFormData } from '~/lib/email-template';

// Initialize SendGrid with API key
sgMail.setApiKey(env.SENDGRID_API_KEY);

// Validation schema for the request body
const requestSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  birthDate: z.string(),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json() as unknown;
    const validatedData = requestSchema.parse(body);

    // Create the email template
    const { subject, html, text } = createEmailTemplate(validatedData as CompetitionFormData);

    // Prepare the email message
    const msg = {
      to: env.SENDGRID_RECIPIENT_EMAIL,
      from: env.SENDGRID_SENDER_EMAIL,
      subject,
      text,
      html,
    };

    // Send the email
    await sgMail.send(msg);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Formular wurde erfolgreich gesendet'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültige Formulardaten',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    // Handle SendGrid errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Fehler beim Senden der E-Mail',
          error: error.message
        },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        message: 'Ein unerwarteter Fehler ist aufgetreten'
      },
      { status: 500 }
    );
  }
}