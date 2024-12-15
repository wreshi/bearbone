import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@/styles/globals.css";
import type { Metadata } from "next";

import { ViewTransitions } from "next-view-transitions";
import React from "react";
import { AppPostHogProvider } from "@/providers/third-party/posthog-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { CustomToaster } from "@/components/custom-toaster";

export const metadata: Metadata = {
  title: {
    default: `Barebone${process.env.NODE_ENV === "development" ? " | Dev" : ""}`,
    template: `%s | Barebone${process.env.NODE_ENV === "development" ? " | Dev" : ""}`,
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
        <AppPostHogProvider>
          <body>
            <NuqsAdapter>
              <ThemeProvider
                attribute={"class"}
                defaultTheme="system"
                enableSystem={true}
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
              <CustomToaster position="bottom-right" richColors />
            </NuqsAdapter>
          </body>
        </AppPostHogProvider>
      </html>
    </ViewTransitions>
  );
}
