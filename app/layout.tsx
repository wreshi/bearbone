import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@/styles/globals.css";
import type { Metadata } from "next";

import { ViewTransitions } from "next-view-transitions";
import React from "react";
import { PostHogProvider } from "@/providers/posthog-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { CustomToaster } from "@/components/custom-toaster";

export const metadata: Metadata = {
  title: {
    default: `Bearbone${process.env.NODE_ENV === "development" ? " | Dev" : ""}`,
    template: `%s | Bearbone${process.env.NODE_ENV === "development" ? " | Dev" : ""}`,
  },
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <PostHogProvider>
          <body>
            <NuqsAdapter>
              <ThemeProvider
                attribute={"class"}
                defaultTheme="system"
                enableSystem={true}
                disableTransitionOnChange
              >
                {children}
                <CustomToaster position="bottom-right" richColors />
              </ThemeProvider>
            </NuqsAdapter>
          </body>
        </PostHogProvider>
      </html>
    </ViewTransitions>
  );
}
