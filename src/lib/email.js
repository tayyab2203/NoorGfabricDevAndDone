import logger from "@/lib/logger";

/**
 * Send order confirmation email. Plug in Resend, Nodemailer, or your provider.
 * Set env RESEND_API_KEY (or similar) and implement send via your provider.
 */
export async function sendOrderConfirmationEmail(order, customerEmail) {
  if (!customerEmail) return;
  try {
    if (process.env.RESEND_API_KEY) {
      // Example: await Resend.emails.send({ from: "...", to: customerEmail, subject: `Order ${order.orderNumber}`, html: `...` });
      logger.info(`Order confirmation would send to ${customerEmail} for order ${order.orderNumber}`);
      return;
    }
    logger.info(`Order ${order.orderNumber} placed. Confirmation email to ${customerEmail} (configure RESEND_API_KEY to send).`);
  } catch (e) {
    logger.error("sendOrderConfirmationEmail: " + e.message);
  }
}
