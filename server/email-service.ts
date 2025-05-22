import nodemailer from 'nodemailer';

// Email for sending - will also be used as FROM email and primary recipient
const FROM_EMAIL = "alnwickcommunityc@gmail.com";

// Primary recipient email is the same as FROM_EMAIL (forms go to the main center email)
const PRIMARY_EMAIL = FROM_EMAIL;

// Create reusable transporter object using Gmail SMTP
// Detailed debugging for email configuration
console.log("📧 Setting up email service with the following configuration:");
console.log(`📧 - FROM_EMAIL: ${FROM_EMAIL}`);
console.log(`📧 - PRIMARY_EMAIL: ${PRIMARY_EMAIL}`);
console.log(`📧 - EMAIL_PASSWORD set: ${!!process.env.EMAIL_PASSWORD}`);

// ======================================================
// IMPORTANT: Email Sending Configuration 
// ======================================================
// We're in storage-only mode - emails will be stored in the database but not sent
// This is because we need to set up a proper email provider later
// Options for future implementation include:
// 1. SendGrid (most popular, easy API)
// 2. Mailchimp (good for newsletters)
// 3. AWS SES (cost-effective for high volume)
// 4. Postmark (excellent deliverability)
// ======================================================

const EMAIL_SENDING_ENABLED = false; // Set to true when email provider is configured

// Create nodemailer transporter just for development purposes
// This won't be used in storage-only mode
let transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Will be replaced with actual provider
  port: 587,
  secure: false,
  auth: {
    user: FROM_EMAIL,
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
  debug: true,
  logger: true
});

interface EmailData {
  subject: string;
  text: string;
  html?: string;
  to?: string; // Optional recipient email
}

interface NewsletterEmailData {
  subject: string;
  content: string;
  testMode?: boolean;
  testEmail?: string;
}

/**
 * Sends an email notification
 * @param emailData The email data to send
 * @returns Promise resolving to a boolean indicating success
 */
export async function sendEmailNotification(emailData: EmailData): Promise<boolean> {
  // Determine recipient - use provided 'to' or default to PRIMARY_EMAIL
  const recipient = emailData.to || PRIMARY_EMAIL;
  
  // Log the email details for tracking
  console.log("📧 Email notification received:");
  console.log(`📧 * Subject: ${emailData.subject}`);
  console.log(`📧 * Recipient: ${recipient}`);
  
  // Check if email sending is enabled
  if (!EMAIL_SENDING_ENABLED) {
    // In storage-only mode, we just log the email content
    console.log("📧 EMAIL SENDING IS DISABLED - Running in storage-only mode");
    console.log("📧 Email content has been stored in the database");
    console.log("📧 To enable actual email sending, update the email provider configuration");
    console.log("📧 and set EMAIL_SENDING_ENABLED = true in email-service.ts");
    
    // Return true so the application continues normally
    return true;
  }
  
  // Only try to send if email sending is enabled
  try {
    // Check if email password is set
    if (!process.env.EMAIL_PASSWORD) {
      console.error("📧 EMAIL_PASSWORD environment variable is not set");
      console.log("📧 Cannot send email without valid credentials");
      return false;
    }
    
    // Create email data
    const mailOptions = {
      from: `"Alnwick Community Center" <${FROM_EMAIL}>`,
      to: recipient,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html || emailData.text
    };
    
    // Attempt to send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully: ${info.messageId}`);
    
    return true;
  } catch (error) {
    // Log the error but don't crash the application
    console.error("📧 Error sending email:", error);
    console.log("📧 Email data has been stored in the database but not sent.");
    
    // Return false to indicate email sending failed
    return false;
  }
}

/**
 * Sends newsletter emails to subscribers
 * @param newsletterData The newsletter data to send
 * @param subscribers List of subscriber emails (or single test email)
 * @returns Promise resolving to a boolean indicating success
 */
export async function sendNewsletter(newsletterData: NewsletterEmailData, subscribers: string[]): Promise<boolean> {
  try {
    // If in test mode, just send to the test email
    if (newsletterData.testMode && newsletterData.testEmail) {
      const testHtml = createNewsletterHtml(newsletterData.subject, newsletterData.content);
      
      // Send test email
      console.log(`📧 Test newsletter sending to: ${newsletterData.testEmail}`);
      console.log(`📧 Subject: ${newsletterData.subject}`);
      
      await sendEmailNotification({
        subject: newsletterData.subject,
        text: "This is the text version of the newsletter. Please view in HTML for the best experience.",
        html: testHtml,
        to: newsletterData.testEmail
      });
      
      return true;
    }
    
    // Not in test mode, send to all subscribers
    if (subscribers.length === 0) {
      console.log("📧 No subscribers to send newsletter to.");
      return false;
    }
    
    // Send to all subscribers
    console.log(`📧 Newsletter sending to ${subscribers.length} subscribers`);
    console.log(`📧 Subject: ${newsletterData.subject}`);
    
    // Create newsletter HTML
    const newsletterHtml = createNewsletterHtml(newsletterData.subject, newsletterData.content);
    
    // In a production environment, we would likely use BCC for all subscribers
    // Here we'll send a single email with individual subscribers as a demonstration
    for (const subscriber of subscribers) {
      try {
        await sendEmailNotification({
          subject: newsletterData.subject,
          text: "This is the text version of the newsletter. Please view in HTML for the best experience.",
          html: newsletterHtml,
          to: subscriber
        });
        console.log(`📧 Newsletter sent to: ${subscriber}`);
      } catch (subscriberError) {
        console.error(`📧 Error sending to ${subscriber}:`, subscriberError);
        // Continue with other subscribers even if one fails
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return false;
  }
}

/**
 * Creates HTML for the newsletter
 * @param subject Newsletter subject
 * @param content Newsletter content
 * @returns HTML string
 */
export function createNewsletterHtml(subject: string, content: string): string {
  // Replace newlines with HTML breaks
  const htmlContent = content.replace(/\n/g, '<br>');
  
  // Complete HTML email template
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #1d4ed8;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9fafb;
        }
        .footer {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${subject}</h1>
      </div>
      <div class="content">
        ${htmlContent}
      </div>
      <div class="footer">
        <p>Alnwick Community Center</p>
        <p>2146 Big Springs Road, Maryville, TN 37801</p>
        <p>This email was sent to you because you subscribed to our newsletter.</p>
      </div>
    </body>
    </html>
  `;
}

export function createHtmlEmailBody(formData: Record<string, any>): string {
  // Convert form data to HTML
  let htmlRows = '';
  
  Object.entries(formData).forEach(([key, value]) => {
    // Format the key for better readability
    const formattedKey = key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
    
    // Format boolean values for better readability
    let formattedValue = value;
    if (typeof value === 'boolean') {
      formattedValue = value ? 'Yes' : 'No';
    }
    
    htmlRows += `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${formattedKey}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${formattedValue}</td>
      </tr>
    `;
  });
  
  // Complete HTML email template
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #3a5a78; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { text-align: left; padding: 8px; border: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .footer { font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Form Submission</h1>
          <p>A new form submission has been received from the Alnwick Community Center website:</p>
          
          <table>
            <tbody>
              ${htmlRows}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This is an automated message from the Alnwick Community Center website.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}