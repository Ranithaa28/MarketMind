"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Rocket className="h-5 w-5 text-primary" />
          <span>MarketMind</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#testimonials" className="hover:text-foreground">Testimonials</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SignedOut>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
