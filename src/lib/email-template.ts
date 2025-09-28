export interface CompetitionFormData {
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
}

/**
 * Creates an HTML email template that works across all email clients
 * Following email design best practices:
 * - Table-based layout for compatibility
 * - Inline CSS for consistent rendering
 * - Simple, clean design
 * - Mobile responsive
 */
export function createEmailTemplate(data: CompetitionFormData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Wettbewerb - Neue Anmeldung";

  // Format birth date for display
  const formattedBirthDate = new Date(data.birthDate).toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // HTML version with table-based layout for email client compatibility
  const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(90deg, #06B6D4 0%, #3B82F6 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    StuID Wettbewerb
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">
                    Neue Anmeldung eingegangen
                  </p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                    <!-- Timestamp -->
                    <tr>
                      <td style="padding-bottom: 20px;">
                        <p style="margin: 0; color: #666666; font-size: 14px;">
                          <strong>Eingegangen am:</strong> ${new Date().toLocaleString('de-CH', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </p>
                      </td>
                    </tr>

                    <!-- Personal Information Section -->
                    <tr>
                      <td style="padding-bottom: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 20px; border-bottom: 2px solid #06B6D4; padding-bottom: 10px;">
                          Persönliche Informationen
                        </h2>
                        <table role="presentation" width="100%" cellpadding="5" cellspacing="0" border="0">
                          <tr>
                            <td width="35%" style="color: #666666; font-size: 14px; padding: 8px 0;">
                              <strong>Name:</strong>
                            </td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              ${data.firstName} ${data.lastName}
                            </td>
                          </tr>
                          <tr style="background-color: #f9f9f9;">
                            <td width="35%" style="color: #666666; font-size: 14px; padding: 8px 0;">
                              <strong>E-Mail:</strong>
                            </td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              <a href="mailto:${data.email}" style="color: #06B6D4; text-decoration: none;">
                                ${data.email}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td width="35%" style="color: #666666; font-size: 14px; padding: 8px 0;">
                              <strong>Telefon:</strong>
                            </td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              ${data.phoneNumber}
                            </td>
                          </tr>
                          <tr style="background-color: #f9f9f9;">
                            <td width="35%" style="color: #666666; font-size: 14px; padding: 8px 0;">
                              <strong>Geburtsdatum:</strong>
                            </td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              ${formattedBirthDate}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Address Section -->
                    <tr>
                      <td style="padding-bottom: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 20px; border-bottom: 2px solid #06B6D4; padding-bottom: 10px;">
                          Adresse
                        </h2>
                        <table role="presentation" width="100%" cellpadding="5" cellspacing="0" border="0">
                          <tr>
                            <td width="35%" style="color: #666666; font-size: 14px; padding: 8px 0;">
                              <strong>Strasse:</strong>
                            </td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              ${data.address1}
                            </td>
                          </tr>
                          ${data.address2 ? `
                          <tr style="background-color: #f9f9f9;">
                            <td width="35%" style="color: #666666; font-size: 14px; padding: 8px 0;">
                              <strong>Zusatz:</strong>
                            </td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              ${data.address2}
                            </td>
                          </tr>
                          ` : ''}
                          <tr ${!data.address2 ? 'style="background-color: #f9f9f9;"' : ''}>
                            <td width="35%" style="color: #666666; font-size: 14px; padding: 8px 0;">
                              <strong>PLZ / Ort:</strong>
                            </td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              ${data.postalCode} ${data.city}
                            </td>
                          </tr>
                          <tr ${data.address2 ? 'style="background-color: #f9f9f9;"' : ''}>
                            <td width="35%" style="color: #666666; font-size: 14px; padding: 8px 0;">
                              <strong>Kanton:</strong>
                            </td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              ${data.state}
                            </td>
                          </tr>
                          <tr ${!data.address2 ? 'style="background-color: #f9f9f9;"' : ''}>
                            <td width="35%" style="color: #666666; font-size: 14px; padding: 8px 0;">
                              <strong>Land:</strong>
                            </td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              ${data.country}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="margin: 0 0 10px 0; color: #666666; font-size: 12px;">
                    Diese E-Mail wurde automatisch generiert vom StuID Wettbewerb-Formular.
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 11px;">
                    © ${new Date().getFullYear()} StuID - Die digitale Studentenkarte für die Schweiz
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Plain text version for email clients that don't support HTML
  const text = `
${subject}
${'='.repeat(50)}

Neue Anmeldung eingegangen am: ${new Date().toLocaleString('de-CH')}

PERSÖNLICHE INFORMATIONEN
${'—'.repeat(25)}
Name: ${data.firstName} ${data.lastName}
E-Mail: ${data.email}
Telefon: ${data.phoneNumber}
Geburtsdatum: ${formattedBirthDate}

ADRESSE
${'—'.repeat(25)}
Strasse: ${data.address1}
${data.address2 ? `Zusatz: ${data.address2}\n` : ''}PLZ / Ort: ${data.postalCode} ${data.city}
Kanton: ${data.state}
Land: ${data.country}

${'='.repeat(50)}
Diese E-Mail wurde automatisch generiert vom StuID Wettbewerb-Formular.
© ${new Date().getFullYear()} StuID - Die digitale Studentenkarte für die Schweiz
  `.trim();

  return { subject, html, text };
}