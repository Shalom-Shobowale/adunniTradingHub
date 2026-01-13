// backend/sendPaymentEmail.js
import { Resend } from "resend";
import { supabaseAdmin } from "./lib/supabaseAdmin.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPaymentEmail = async (req, res) => {
  console.log("🔥 sendPaymentEmail endpoint HIT", req.body);

  try {
    const { orderId } = req.body;

    if (!orderId) {
      console.error("❌ No orderId in request body");
      return res.status(400).json({ success: false, error: "Missing orderId" });
    }

    // 1️⃣ Fetch order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("order_number, total, user_id")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("❌ Order not found or error:", orderError);
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // 2️⃣ Fetch user email
    const { data: user, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", order.user_id)
      .single();

    if (userError || !user) {
      console.error("❌ User not found or error:", userError);
      return res.status(404).json({ success: false, error: "User not found" });
    }

    console.log(`📧 Sending email to: ${user.email}`);

    // 3️⃣ Send email via Resend
    try {
      await resend.emails.send({
        from: "Adunni Trading Hub <no-reply@adunnitradinghub.com>",
        to: user.email,
        subject: "Payment Confirmed – Order Processing",
        html: `
          <h2>Payment Confirmed</h2>
          <p>Your payment for order <strong>${
            order.order_number
          }</strong> has been confirmed.</p>
          <p>Total Paid: ₦${order.total.toLocaleString()}</p>
          <p>Your order is now being processed.</p>
        `,
      });
      console.log("✅ Email sent successfully!");
    } catch (resendError) {
      console.error("❌ Resend email error:", resendError);
      return res
        .status(500)
        .json({ success: false, error: resendError.message });
    }

    // 4️⃣ Return success
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Unexpected server error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export default sendPaymentEmail;
