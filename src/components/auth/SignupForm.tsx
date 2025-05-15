
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UserPlus, Mail, Lock, Loader2 } from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";
// Use the mocked auth functions
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";

// Placeholder icons for Google
const GoogleIcon = () => (
   <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5.03 16.42 5.03 12.5C5.03 8.58 8.36 5.73 12.19 5.73C14.02 5.73 15.64 6.34 16.9 7.38L19.37 5.05C17.33 3.07 14.86 2 12.19 2C6.42 2 2.03 6.8 2.03 12.5C2.03 18.2 6.42 23 12.19 23C17.6 23 21.5 18.88 21.5 12.91C21.5 12.19 21.45 11.63 21.35 11.1Z"/></svg>
);

const signupFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // path of error
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<null | 'google'>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    // Call the mock signUpWithEmail function
    const { user, error } = await signUpWithEmail(data.name, data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error, // Display error from mock auth function
        variant: "destructive",
      });
    } else if (user) {
      // Even though user data is returned, the mock doesn't log them in automatically
      toast({
        title: "Sign Up Successful",
        description: "Account created! Please log in with your new credentials.",
      });
      router.push("/login"); // Redirect to login page after successful signup
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setIsSocialLoading(provider);
    let result;
    // Call the potentially mocked functions
    if (provider === 'google') {
      result = await signInWithGoogle();
    }
    setIsSocialLoading(null);

    if (result?.error) {
        toast({
            title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign-Up Failed`,
            description: result.error,
            variant: "destructive",
        });
    } else if (result?.user) {
       toast({
        title: "Sign Up Successful",
        description: `Welcome, ${result.user.displayName || result.user.email}!`,
      });
      router.push("/"); // Redirect to homepage or dashboard after social signup/login
      router.refresh(); // Force refresh to update potentially cached Navbar state
    }
  };

  return (
    <Card className="w-full shadow-xl bg-card border border-border/50">
      <CardHeader className="text-center pt-8 pb-4 bg-secondary/20">
        <div className="inline-block mx-auto mb-4 p-3 bg-primary/10 rounded-full border border-primary/20">
            <UserPlus className="h-10 w-10 text-accent" />
        </div>
        <CardTitle className={cn(
          "text-3xl font-bold text-foreground",
          "bg-gradient-to-r from-primary via-accent to-accent",
          "text-transparent bg-clip-text"
         )}>
           Create Account
         </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">Join StudentStay to find your perfect accommodation.</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name-signup" className="text-foreground">Full Name</Label>
                  <Input id="name-signup" placeholder="Your Name" {...field} className="bg-input border-border focus:border-ring focus:ring-ring" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email-signup" className="text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email-signup" type="email" placeholder="you@example.com" {...field} className="pl-10 bg-input border-border focus:border-ring focus:ring-ring" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password-signup">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="password-signup" type="password" placeholder="••••••••" {...field} className="pl-10 bg-input border-border focus:border-ring focus:ring-ring" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirmPassword-signup">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="confirmPassword-signup" type="password" placeholder="••••••••" {...field} className="pl-10 bg-input border-border focus:border-ring focus:ring-ring" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-base py-3 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full text-base py-3 border-border/70 text-foreground hover:bg-muted/50 hover:border-border" onClick={() => handleSocialLogin('google')} disabled={isSocialLoading === 'google' || isLoading}>
             {isSocialLoading === 'google' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon />}
            Sign up with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center pb-8 pt-4">
        <p className="text-sm text-muted-foreground">
           Already have an account? <Link href="/login" className="font-semibold text-accent hover:text-accent/80 transition-colors">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
