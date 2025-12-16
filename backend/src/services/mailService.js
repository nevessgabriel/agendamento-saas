// backend/src/services/mailService.js
const nodemailer = require("nodemailer");

/**
 * Sends a booking confirmation email to the business owner.
 * Uses Ethereal Mail for testing purposes (no real emails are sent).
 * * @param {string} toEmail - The recipient's email address (Business Owner)
 * @param {string} clientName - Name of the client who booked
 * @param {string} serviceName - Name of the service booked
 * @param {string} date - Formatted date string
 * @param {string} time - Formatted time string
 * @param {string} companyName - Name of the company
 */
exports.sendBookingConfirmation = async (
  toEmail,
  clientName,
  serviceName,
  date,
  time,
  companyName
) => {
  try {
    // 1. Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    // 2. Create a reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // 3. Define the email content
    const info = await transporter.sendMail({
      from: '"SaaS Scheduler" <no-reply@scheduler.com>', // Sender address
      to: toEmail, // List of receivers
      subject: `Novo Agendamento: ${clientName} - ${serviceName}`, // Subject line
      text: `Olá! Você tem um novo agendamento.\nClient: ${clientName}\nService: ${serviceName}\nWhen: ${date} at ${time}`, // Plain text body
      html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px;">
                    <h2 style="color: #9b59b6;">Novo Agendamento em ${companyName}</h2>
                    <p><strong>Cliente:</strong> ${clientName}</p>
                    <p><strong>Serviço:</strong> ${serviceName}</p>
                    <p><strong>Data/Hora:</strong> ${date} às ${time}</p>
                    <hr>
                    <p style="font-size: 0.8rem; color: #666;">Olhe sua dashboard para mais detalhes!</p>
                </div>
            `,
    });

    console.log("📨 Message sent: %s", info.messageId);

    // 4. Preview only available when sending through an Ethereal account
    console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
