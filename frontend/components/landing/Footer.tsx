import Link from "next/link";
import { Rocket } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex flex-col items-center gap-0.5 font-medium text-foreground md:items-start">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="MarketMind Logo" width={20} height={20} className="rounded-sm" /> MarketMind
          </div>
          <span className="text-xs font-normal text-muted-foreground">Validate. Analyze. Launch.</span>
        </div>
        <p>© {new Date().getFullYear()} MarketMind, Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-foreground">Privacy</Link>
          <Link href="#" className="hover:text-foreground">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
