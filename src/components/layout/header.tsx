"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/meal-counter", label: "Meal Counter" },
  { href: "/diet-plans", label: "Diet Plans" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              NutriTrackGo
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground font-semibold" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild className="hidden md:flex bg-accent hover:bg-accent/90">
              <Link href="/meal-counter">Get Started</Link>
            </Button>
            <Sheet>
            <SheetTrigger asChild>
                <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <Link href="/" className="flex items-center space-x-2 mb-6">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">NutriTrackGo</span>
                </Link>
                <div className="flex flex-col space-y-4 pl-2">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "text-lg transition-colors hover:text-foreground",
                        pathname === link.href ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                    >
                    {link.label}
                    </Link>
                ))}
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
