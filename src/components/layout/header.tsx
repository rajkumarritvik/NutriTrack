
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, User, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";


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
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");

  useEffect(() => {
    // Simulate checking auth state. In a real app, this would be a call to a context or a hook.
    // We'll consider the user "logged in" if they are on a page other than the auth pages.
    const authPages = ["/signin", "/signup"];
    if (!authPages.includes(pathname) && pathname !== "/") {
        setIsLoggedIn(true);
        if (typeof window !== 'undefined') {
            const storedName = localStorage.getItem('userName');
            if (storedName) {
                setUserName(storedName);
            }
            const storedEmail = localStorage.getItem('userEmail');
            if (storedEmail) {
                setUserEmail(storedEmail);
            }
        }
    } else {
        setIsLoggedIn(false);
    }
  }, [pathname]);

  const handleSignOut = () => {
    // In a real app, you'd call your sign-out logic here.
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
    }
    router.push("/signin");
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              NutriTrack
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
        
        <div className="flex flex-1 items-center justify-end space-x-4">
            {isLoggedIn ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-auto flex items-center gap-2">
                     <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Hi, {userName}!</span>
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Button asChild className="hidden md:flex bg-accent hover:bg-accent/90">
                  <Link href="/signin">Get Started</Link>
                </Button>
            )}
           
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
                <span className="font-bold font-headline">NutriTrack</span>
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
