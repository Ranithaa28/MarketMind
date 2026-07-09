import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalChatWidget } from "@/components/ui/GlobalChatWidget";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "MarketMind — Validate. Analyze. Launch.",
  description: "Validate. Analyze. Launch. AI-powered market research, competitor analysis, and business strategy for your startup idea.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#00E5FF", colorBackground: "#1E2433", colorInputBackground: "#252C3D" },
        elements: { card: "shadow-none" }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen antialiased bg-background text-foreground`}>
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
