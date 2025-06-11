import Stripe from "stripe";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY_LIVE || "", {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: "Deepobe",
    version: "0.1.0",
  },
});
