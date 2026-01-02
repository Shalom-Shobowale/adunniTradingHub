import express from "express";
import { Resend } from "resend";
import dotenv from "dotenv";
import process from "process";

dotenv.config();
const router = express.Router();

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

router.get("/", (req, res) => {
  res.send("Send Wholesale Email route is working!");
});

router.post("/", async (req, res) => {
  const { company_name, email, phone, estimated_quantity, message } = req.body;

  console.log("📩 New wholesale request received:", req.body);

  // HTML template for admin email
  const adminEmailHTML = `
    <h2>New Wholesale Quote Received</h2>
    <p>A new quote request has been submitted on your website:</p>
    <ul>
      <li><strong>Company:</strong> ${company_name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>Estimated Quantity:</strong> ${estimated_quantity}</li>
      <li><strong>Message:</strong> ${message || "N/A"}</li>
    </ul>
    <p>Check your admin panel for more details.</p>
  `;

  // HTML template for user confirmation email
  const userEmailHTML = `
    <h2>Thank You for Your Quote Request!</h2>
    <p>Hi ${company_name},</p>
    <p>We have received your quote request with the following details:</p>
    <ul>
      <li><strong>Estimated Quantity:</strong> ${estimated_quantity}</li>
      <li><strong>Message:</strong> ${message || "N/A"}</li>
    </ul>
    <p>Our team will contact you shortly to confirm your order and pricing.</p>
    <p>Best regards,<br/><strong>Adunni Trading Hub</strong></p>
  `;

  try {
    // Send email to ADMIN
    await resend.emails.send({
      from: "Adunni Trading Hub <no-reply@adunnitradinghub.com>",
      to: "shalomshobowale65@gmail.com",
      subject: `New Wholesale Quote from ${company_name}`,
      text: `New Wholesale Quote Received:\nCompany: ${company_name}\nEmail: ${email}\nPhone: ${phone}\nQuantity: ${estimated_quantity}\nMessage: ${message || "N/A"}`,
      html: adminEmailHTML,
    });

    // Send confirmation email to USER
    await resend.emails.send({
      from: "Adunni Trading Hub <no-reply@adunnitradinghub.com>",
      to: email,
      subject: "Your Quote Request Was Received",
      text: `Hi ${company_name}, your request has been received. Our team will contact you soon.`,
      html: userEmailHTML,
    });

    console.log("✅ Emails sent successfully!");
    res.json({ message: "Emails sent successfully" });
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
