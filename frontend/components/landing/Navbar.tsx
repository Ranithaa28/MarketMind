"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Rocket } from "lucide-react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="MarketMind Logo" width={28} height={28} className="rounded-sm" />
          <span>MarketMind</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SignedOut>
            <Link href="/sign-in" className={buttonVariants({ variant: "ghost", size: "sm", className: "hover:text-primary" })}>
              Login
            </Link>
            <Link href="/sign-up" className={buttonVariants({ size: "sm", className: "bg-primary text-black hover:bg-[#00d4ff] shadow-[0_0_15px_rgba(0,229,255,0.4)]" })}>
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
