import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import paypal from "paypal-rest-sdk";

@Injectable()
export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

  constructor() {
    paypal.configure({
      mode: process.env.PAYPAL_MODE || "sandbox",
      client_id: process.env.PAYPAL_CLIENT_ID || "",
      client_secret: process.env.PAYPAL_CLIENT_SECRET || "",
    });
  }

  async createCheckout(input: { amount: number; currency: string; provider: "stripe" | "paypal" }) {
    if (input.provider === "stripe") {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(input.amount * 100),
        currency: input.currency,
        automatic_payment_methods: { enabled: true },
      });
      return { provider: "stripe", clientSecret: paymentIntent.client_secret };
    }

    if (input.provider === "paypal") {
      return new Promise((resolve, reject) => {
        paypal.payment.create(
          {
            intent: "sale",
            payer: { payment_method: "paypal" },
            transactions: [{ amount: { total: String(input.amount), currency: input.currency } }],
            redirect_urls: { return_url: "https://example.com/success", cancel_url: "https://example.com/cancel" },
          },
          (error: unknown, payment: any) => {
            if (error) return reject(error);
            resolve({ provider: "paypal", id: payment?.id });
          }
        );
      });
    }

    return { ok: false };
  }
}