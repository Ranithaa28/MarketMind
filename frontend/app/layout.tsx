import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalChatWidget } from "@/components/ui/GlobalChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketMind — Validate. Analyze. Launch.",
  description: "Validate. Analyze. Launch. AI-powered market research, competitor analysis, and business strategy for your startup idea.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <GlobalChatWidget />
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
