// import dodo from the appropriate path
import { dodo } from "@/lib/dodo";
import DodoPayments from "dodopayments";

// define the two plans using the assumed dodo structure
const plan: DodoPayments.SubscriptionCreateParams = {
  billing: {
    city: "New York",
    country: "US",
    state: "NY",
    zipcode: 10001,
    street: "123 Main St",
  },
  customer: {
    email: "warisareshi@gmail.com",
    name: "Waris Reshi",
  },
  payment_link: true,
  return_url: "http://localhost:3000/app/home",
  product_id: "pdt_abSF31n0dPOAFgMFvei8S",
  quantity: 1,
};
// mock function to create the subscription plans
async function createSubscriptionPlans() {
  const res: DodoPayments.SubscriptionCreateResponse =
    await dodo.subscriptions.create(plan);
  console.log(res);

  console.log(res);
}

// execute the function
createSubscriptionPlans();
