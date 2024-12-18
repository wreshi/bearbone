import { env } from "@/env";
import DodoPayments from "dodopayments";

export const dodo = new DodoPayments({
  bearerToken: env.DODO_API_KEY, // This is the default and can be omitted
  environment: "test_mode", // defaults to 'live_mode'
});

type Subscription = DodoPayments.Subscription;
type SubscriptionCreateParams = DodoPayments.SubscriptionCreateParams;
type SubscriptionCreateResponse = DodoPayments.SubscriptionCreateResponse;

export {
  type Subscription,
  type SubscriptionCreateParams,
  type SubscriptionCreateResponse,
};
