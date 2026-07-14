"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Lightbulb, CreditCard, Rocket, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/ideas", label: "My Ideas", icon: Lightbulb },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/5 bg-[#1E2433]/80 backdrop-blur-xl p-4 shadow-[5px_0_30px_0_rgba(0,0,0,0.3)]">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2 font-bold tracking-tight text-white hover:text-primary transition-colors">
        <Image src="/logo.png" alt="MarketMind Logo" width={28} height={28} className="rounded-sm" /> MarketMind
      </Link>

      <Link href="/dashboard/ideas/new">
        <Button className="mb-6 w-full justify-start gap-2 rounded-full bg-primary text-black hover:bg-[#00d4ff] shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all">
          <Plus className="h-4 w-4" /> New validation
        </Button>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition-all hover:bg-primary/20 hover:text-primary hover:shadow-[0_0_10px_rgba(0,229,255,0.1)]",
                active ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,229,255,0.1)]" : "text-muted-foreground"
              )}
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm text-muted-foreground">Account</span>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}
