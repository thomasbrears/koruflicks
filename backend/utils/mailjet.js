import mailjet from 'node-mailjet';
import 'dotenv/config';

// Initialise Mailjet API connection
const initializeMailjet = () => {
  try {
    if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
      console.error("WARNING: Mailjet API keys are not properly set in environment variables!");
    }
    
    return mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE
    );
  } catch (error) {
    console.error("Failed to initialize Mailjet client:", error);
    throw new Error(`Mailjet initialization error: ${error.message}`);
  }
};

const MailJetConnection = initializeMailjet();

// Helper function for generating the default email template
export const generateDefaultEmailTemplate = (bodyContent, { 
  logoUrl = 'https://koruflicks.vercel.app/images/KF-WhiteText-GreenKoru-BlackBG.png',
  logoAlt = 'KoruFlicks Support',
  backgroundColor = '#0a0a0a',
  containerBackgroundColor = '#121212',
  headerBackgroundColor = '#000000',
  textColor = '#e5e5e5',
  accentColor = '#4ADE80'
} = {}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: ${backgroundColor};
          color: ${textColor};
        }
        .email-container {
          background-color: ${containerBackgroundColor};
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid #333;
          border-radius: 10px;
          overflow: hidden;
        }
        .email-header {
          background-color: ${headerBackgroundColor};
          padding: 20px;
          text-align: center;
          border-bottom: 2px solid ${accentColor};
        }
        .email-header img {
          max-width: 200px;
        }
        .email-body {
          padding: 30px;
          color: ${textColor};
        }
        h1 {
          font-size: 24px;
          color: ${textColor};
          margin-top: 0;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 15px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          margin: 20px 0;
          color: #000;
          background-color: ${accentColor};
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
        }
        hr {
          border: none;
          border-top: 1px solid #333;
          margin: 25px 0;
        }
        .footer {
          background-color: ${headerBackgroundColor};
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
        strong {
          color: ${accentColor};
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <img src="${logoUrl}" alt="${logoAlt}">
        </div>
        <div class="email-body">
          ${bodyContent}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} KoruFlicks. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send email
export const sendEmail = async (toEmail, subject, bodyContent, replyToEmail = null, ccEmails = [], options = {}) => {
  console.log(`Sending email to: ${toEmail}`);
  
  try {
    if (!toEmail) {
      throw new Error('Recipient email address is required');
    }
    
    // Use the default email template for the content with optional customization
    const htmlContent = generateDefaultEmailTemplate(bodyContent, options);
    
    const messageData = {
      From: {
        Email: 'koruflicks@pricehound.tech',
        Name: 'Koru Flicks',
      },
      To: [
        {
          Email: toEmail,
        },
      ],
      Subject: subject,
      HTMLPart: htmlContent,
      TextPart: bodyContent.replace(/<[^>]*>/g, ''), // Strip HTML for text part
    };

    // Add Reply-To if provided
    if (replyToEmail) {
      messageData.ReplyTo = {
        Email: replyToEmail,
      };
    }

    // Add CC emails if provided
    if (ccEmails && ccEmails.length > 0) {
      messageData.Cc = ccEmails.map(email => ({ Email: email }));
    }
    
    const requestPayload = {
      Messages: [messageData],
    };

    try {
      const request = await MailJetConnection.post('send', { version: 'v3.1' }).request(requestPayload);
        
      // Check if response contains errors
      if (request.body && request.body.Messages && request.body.Messages[0]) {
        const messageStatus = request.body.Messages[0].Status;
        if (messageStatus !== 'success') {
          console.error('Message was not successful:', messageStatus);
          throw new Error(`Mailjet message status: ${messageStatus}`);
        }
      }
      
      return request.body;
    } catch (apiError) {
      console.error('Mailjet API error:', apiError);
      console.error('Error details:', apiError.response?.body || 'No response body');
      
      // Try to extract useful error information
      const errorMessage = apiError.response?.body?.ErrorMessage || 
                          apiError.response?.body?.ErrorInfo || 
                          apiError.message || 
                          'Unknown Mailjet API error';
      
      throw new Error(`Mailjet API error: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error in sendEmail function:', error);
    throw error; // Re-throw to allow caller to handle the error
  }
};