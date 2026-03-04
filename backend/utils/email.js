const nodemailer = require("nodemailer");

// Initialize Nodemailer with SendGrid SMTP
const mailTransporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true,
  auth: {
    user: 'apikey', // SendGrid user is always 'apikey'
    pass: process.env.SENDGRID_API_KEY,
  }
});

/**
 * Transporter object for backward compatibility
 * Now uses Brevo SMTP
 */
const transporter = {
  /**
   * Send email with logging (legacy interface)
   * @param {Object} mailOptions - Email options
   * @param {string} mailOptions.to - Recipient email
   * @param {string} mailOptions.subject - Email subject
   * @param {string} [mailOptions.html] - HTML content
   * @param {string} [mailOptions.text] - Plain text content
   * @param {string} [mailOptions.from] - Sender email (optional)
   * @param {Array} [mailOptions.attachments] - Email attachments (optional)
   */
  sendMailWithLog: async (mailOptions) => {
    console.log("📧 Email send via Brevo SMTP:");
    console.log("   To:", mailOptions.to);
    console.log("   Subject:", mailOptions.subject);

    try {
      const msg = {
        to: mailOptions.to,
        from: mailOptions.from || process.env.SENDGRID_FROM_EMAIL || "samyakhospital5678@gmail.com",
        subject: mailOptions.subject,
        html: mailOptions.html,
      };

      // Add optional text content
      if (mailOptions.text) {
        msg.text = mailOptions.text;
      }

      // Add optional attachments
      if (mailOptions.attachments && mailOptions.attachments.length > 0) {
        msg.attachments = mailOptions.attachments.map(att => ({
          content: att.content, // Nodemailer supports Buffers/Strings directly
          filename: att.filename,
          contentType: att.type || 'application/octet-stream' // optional contentType mappings
        }));
      }

      // Add optional headers
      if (mailOptions.replyTo) {
        msg.replyTo = mailOptions.replyTo;
      }

      const info = await mailTransporter.sendMail(msg);

      console.log("✅ Email sent successfully via SendGrid SMTP");
      console.log("   To:", msg.to);
      console.log("   Subject:", msg.subject);

      return info;
    } catch (error) {
      console.error("❌ Email send FAILED:");
      console.error("   To:", mailOptions.to);
      console.error("   Subject:", mailOptions.subject);
      console.error("   Error:", error.message);
      throw error;
    }
  },

  /**
   * Send email (legacy interface)
   * Alias for sendMailWithLog
   */
  sendMail: async (mailOptions) => {
    return transporter.sendMailWithLog(mailOptions);
  },

  /**
   * Verify transporter
   */
  verify: (callback) => {
    return mailTransporter.verify(callback);
  }
};

module.exports = transporter;
