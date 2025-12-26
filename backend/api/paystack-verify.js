// import fetch from "node-fetch";
// import { supabase } from "../supabase";
// import process from "process";

// export default async function handler(req, res) {
//   const { reference, orderId } = req.body;

//   const response = await fetch(
//     `https://api.paystack.co/transaction/verify/${reference}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//     }
//   );

//   const result = await response.json();

//   if (result.data.status !== "success") {
//     return res.status(400).json({ success: false });
//   }

//   await supabase
//     .from("orders")
//     .update({
//       payment_status: "paid",
//       status: "processing",
//     })
//     .eq("id", orderId);

//   res.json({ success: true });
// }
