"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Lightbulb, CreditCard, Rocket, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/ideas", label: "My Ideas", icon: Lightbulb },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card/40 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2 font-semibold">
        <Rocket className="h-5 w-5 text-primary" /> MarketMind
      </Link>

      <Link href="/dashboard/ideas/new">
        <Button className="mb-6 w-full justify-start gap-2">
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                active && "bg-muted text-foreground"
              )}
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">Account</span>
      </div>
    </aside>
  );
}
