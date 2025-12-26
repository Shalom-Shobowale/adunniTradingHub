import express from "express";
import { Resend } from "resend";
import dotenv from "dotenv";
import process from "process";

dotenv.config();
const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { company_name, email, phone, estimated_quantity, message } = req.body;

  console.log("📩 New wholesale request received:", req.body);

  try {
    // Send email to ADMIN
    await resend.emails.send({
      from: "no-reply@resend.dev", // user cannot reply
      to: "shalomshobowale65@gmail.com",
      subject: `New Wholesale Quote from ${company_name}`,
      text: `
New Wholesale Quote Received:

Company: ${company_name}
Email: ${email}
Phone: ${phone}
Quantity: ${estimated_quantity}
Message: ${message}
      `,
    });

    // Send confirmation to USER
    await resend.emails.send({
      from: "no-reply@resend.dev", // still no-reply
      to: email,
      subject: "Your Quote Request Was Received",
      text: `Hi ${company_name}, your request has been received. Our team will contact you soon.`,
    });

    console.log("✅ Emails sent successfully!");
    res.json({ message: "Emails sent successfully" });
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
