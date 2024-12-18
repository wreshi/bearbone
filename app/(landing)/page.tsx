"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MountainIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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

export default function LandingPage() {
  const router = useRouter();
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [isLoadingLearnMore, setIsLoadingLearnMore] = useState(false);

  const handleNavigation = (
    path: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ): void => {
    setLoading(true);
    router.push(path);
  };

  return (
    <div className="flex min-h-screen flex-col justify-between">
      <motion.header
        className="flex h-14 items-center border-b px-4 lg:px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="flex cursor-pointer items-center justify-center"
          onClick={() => router.push("#")}
        >
          <MountainIcon className="mr-2 size-5" />
          <span className="font-bold">Bearbone</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <button
            className="text-sm font-medium underline-offset-4 hover:underline"
            onClick={() => router.push("/pricing")}
          >
            Pricing
          </button>
        </nav>
      </motion.header>

      <section className="my-auto flex h-full w-full items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
        <motion.div
          className="container px-4 md:px-6"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div className="space-y-2" variants={fadeIn}>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Launch Your SaaS in Minutes
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Get started with our powerful, scalable, and easy-to-use SaaS
                starter kit. Build your next big idea faster than ever.
              </p>
            </motion.div>
            <motion.div className="space-x-4" variants={fadeIn}>
              <Button
                onClick={() => handleNavigation("/signup", setIsLoadingSignup)}
                disabled={isLoadingSignup}
                className="!h-11 !min-w-8"
              >
                {isLoadingSignup ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Get Started"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  handleNavigation(
                    "https://github.com/wreshi/bearbone",
                    setIsLoadingLearnMore,
                  )
                }
                disabled={isLoadingLearnMore}
                className="!h-11 !min-w-8"
              >
                {isLoadingLearnMore ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Learn More"
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <motion.footer
        className="mt-auto flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Bearbone. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <button
            className="text-xs underline-offset-4 hover:underline"
            onClick={() => router.push("#")}
          >
            Terms of Service
          </button>
          <button
            className="text-xs underline-offset-4 hover:underline"
            onClick={() => router.push("#")}
          >
            Privacy
          </button>
        </nav>
      </motion.footer>
    </div>
  );
}
