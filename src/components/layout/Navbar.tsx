
"use client";

import Link from 'next/link';
import { Menu, Home, MapPin, MessageSquare, LogIn, Building2, Heart, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Added SheetClose
import { ThemeToggle } from './ThemeToggle';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth hook
// Use the potentially mocked auth functions and User type
import { signOutUser, type User } from '@/lib/firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator'; // Import Separator
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state


const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Map', icon: MapPin },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/favorites', label: 'Favorites', icon: Heart },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isInitialized } = useAuth(); // Use the auth hook
  const { toast } = useToast();

  const handleLogout = async () => {
    // Explicitly close dropdown/sheet first if needed
    // (DropdownMenu closes automatically, Sheet needs manual handling if open)

    const { error } = await signOutUser(); // Use mocked signOutUser
    if (error) {
      toast({
        title: "Logout Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login'); // Redirect to login page after logout
      router.refresh(); // Force refresh to update Navbar state potentially
    }
  };

  // Helper to generate avatar fallback based on User type
  const UserAvatarFallback = ({ userName }: { userName?: string | null }) => {
    if (userName) {
      const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      if (initials) return <>{initials}</>;
    }
    return <UserCircle className="h-5 w-5" />;
  };

  // Mobile Auth Button Component - simplified closing logic
  const AuthButtonMobile = () => {
    if (!isInitialized || loading) { // Show skeleton during initial load/check
      return (
         <div className="flex items-center gap-4 px-2.5 py-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
         </div>
      );
    }
    if (user) {
      return (
        <>
          {/* Wrap each button/link in SheetClose */}
          <SheetClose asChild>
             <Link
                 href="#" // Replace with profile page if available
                 className={cn(
                   "flex items-center gap-4 px-2.5 transition-colors hover:text-primary rounded-md py-2 text-muted-foreground hover:bg-foreground/5"
                 )}
                 onClick={() => {
                   toast({ title: "Profile page not yet implemented."});
                 }}
               >
                 <Avatar className="h-6 w-6">
                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "User"} data-ai-hint="profile picture"/>
                    <AvatarFallback><UserAvatarFallback userName={user.displayName} /></AvatarFallback>
                 </Avatar>
                 {user.displayName || "Profile"}
               </Link>
           </SheetClose>
           <SheetClose asChild>
             <button
               onClick={handleLogout} // Logout will close the sheet via navigation/refresh
               className={cn(
                 "flex items-center gap-4 px-2.5 transition-colors hover:text-destructive rounded-md py-2 w-full text-left",
                 "text-muted-foreground hover:bg-destructive/10"
               )}
             >
               <LogOut className="h-5 w-5" />
               Logout
             </button>
           </SheetClose>
        </>
      );
    }
    // If not loading and no user, show Login
    return (
      <SheetClose asChild>
        <Link
          href="/login"
          className={cn(
              "flex items-center gap-4 px-2.5 transition-colors hover:text-primary rounded-md py-2",
              pathname === "/login"
                ? "text-primary bg-primary/10 font-semibold"
                : "text-muted-foreground hover:bg-foreground/5"
            )}
        >
          <LogIn className="h-5 w-5" />
          Login
        </Link>
      </SheetClose>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-90 transition-opacity">
          <Building2 className="h-7 w-7 text-accent" />
          StudentStay
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary pb-1 border-b-2",
                pathname === item.href
                  ? "text-primary border-primary font-semibold"
                  : "text-muted-foreground border-transparent"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {/* Desktop Auth State */}
          <div className="hidden md:inline-flex">
            { (!isInitialized || loading) && <Skeleton className="h-9 w-24 rounded-md" /> }
            { isInitialized && !loading && !user && (
              <Link href="/login">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
            )}
            { isInitialized && !loading && user && (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                      <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "User"} data-ai-hint="user avatar"/>
                      <AvatarFallback className="bg-primary/20 text-primary"><UserAvatarFallback userName={user.displayName} /></AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

           {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-primary/10 hover:text-primary">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-l border-border/50 w-[250px]">
              <nav className="grid gap-2 text-lg font-medium mt-8"> {/* Reduced gap and margin */}
                 <SheetClose asChild>
                     <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary mb-4 px-2.5">
                       <Building2 className="h-7 w-7 text-accent" />
                       StudentStay
                     </Link>
                 </SheetClose>
                {navItems.map((item) => (
                   <SheetClose asChild key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 px-2.5 transition-colors hover:text-primary rounded-md py-2",
                          pathname === item.href
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-muted-foreground hover:bg-foreground/5"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                   </SheetClose>
                ))}
                 <Separator className="my-2 bg-border/50"/>
                 {/* Render mobile auth buttons */}
                 <SheetClose asChild>
                    <Link
                      href="/profile"
                      className={cn(
                        "flex items-center gap-4 px-2.5 transition-colors hover:text-primary rounded-md py-2",
                        pathname === "/profile"
                          ? "text-primary bg-primary/10 font-semibold"
                          : "text-muted-foreground hover:bg-foreground/5"
                      )}
                    >
                      <UserCircle className="h-5 w-5" />
                      Profile
                    </Link>
                 </SheetClose>
                 <Separator className="my-2 bg-border/50"/>
                 {/* Render mobile auth buttons */}
                 <AuthButtonMobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
