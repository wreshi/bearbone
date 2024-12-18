"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MountainIcon, Check } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const PricingTier = ({
  name,
  price,
  features,
  buttonText,
}: {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
}) => (
  <motion.div
    className="flex flex-col rounded-lg bg-white p-6 shadow-lg"
    variants={fadeIn}
  >
    <h3 className="text-2xl font-bold">{name}</h3>
    <p className="mt-4 text-4xl font-bold">
      ${price}
      <span className="text-xl font-normal">/mo</span>
    </p>
    <ul className="mt-6 flex-grow space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="mr-2 h-5 w-5 text-green-500" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button className="mt-8">{buttonText}</Button>
  </motion.div>
);

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <motion.header
        className="flex h-14 items-center border-b px-4 lg:px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link className="flex items-center justify-center" href="/">
          <MountainIcon className="mr-2 size-5" />
          <span className="font-bold">Bearbone</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <button
            className="text-sm font-medium underline-offset-4 hover:underline"
            onClick={() => scrollToSection("pricing")}
          >
            Pricing
          </button>
          <button
            className="text-sm font-medium underline-offset-4 hover:underline"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </button>
        </nav>
      </motion.header>
      <main className="flex-grow">
        <section id="pricing" className="py-12 md:py-24 lg:py-32">
          <motion.div
            className="container px-4 md:px-6"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div className="mb-12 text-center" variants={fadeIn}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
                Choose the plan that's right for you and start building your
                SaaS today.
              </p>
            </motion.div>
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              variants={stagger}
            >
              <PricingTier
                name="Starter"
                price="29"
                features={[
                  "Up to 1,000 users",
                  "Basic analytics",
                  "24/7 support",
                  "1 team member",
                ]}
                buttonText="Get Started"
              />
              <PricingTier
                name="Pro"
                price="99"
                features={[
                  "Up to 10,000 users",
                  "Advanced analytics",
                  "Priority support",
                  "5 team members",
                  "Custom integrations",
                ]}
                buttonText="Upgrade to Pro"
              />
              <PricingTier
                name="Enterprise"
                price="299"
                features={[
                  "Unlimited users",
                  "Enterprise-grade analytics",
                  "Dedicated support",
                  "Unlimited team members",
                  "Custom development",
                  "SLA guarantee",
                ]}
                buttonText="Contact Sales"
              />
            </motion.div>
          </motion.div>
        </section>
      </main>
      <motion.footer
        className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Bearbone. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </motion.footer>
    </div>
  );
}
