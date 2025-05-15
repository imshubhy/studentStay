
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"; // Import Form components
import { Mail, Lock, Building2, Loader2 } from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";
// Use the mocked auth functions
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";

// Placeholder icons for Google
const GoogleIcon = () => (
   <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5.03 16.42 5.03 12.5C5.03 8.58 8.36 5.73 12.19 5.73C14.02 5.73 15.64 6.34 16.9 7.38L19.37 5.05C17.33 3.07 14.86 2 12.19 2C6.42 2 2.03 6.8 2.03 12.5C2.03 18.2 6.42 23 12.19 23C17.6 23 21.5 18.88 21.5 12.91C21.5 12.19 21.45 11.63 21.35 11.1Z"/></svg>
);


const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<null | 'google'>(null);


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Call the mock signInWithEmail function
    const { user, error } = await signInWithEmail(data.email, data.password);
    setIsLoading(false);

    if (error) {
      // Display the error message directly from the mock function result
      toast({
        title: "Login Failed",
        description: error, // Use the error message from the mock auth function
        variant: "destructive",
      });
    } else if (user) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.displayName || user.email}!`,
      });
      router.push("/"); // Redirect to homepage or dashboard
      router.refresh(); // Force refresh to update potentially cached Navbar state
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
            title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Failed`,
            description: result.error,
            variant: "destructive",
        });
    } else if (result?.user) {
       toast({
        title: "Login Successful",
        description: `Welcome, ${result.user.displayName || result.user.email}!`,
      });
      router.push("/");
      router.refresh(); // Force refresh to update potentially cached Navbar state
    }
  };


  return (
    <Card className="w-full shadow-xl bg-card border border-border/50">
      <CardHeader className="text-center pt-8 pb-4 bg-secondary/20">
        <div className="inline-block mx-auto mb-4 p-3 bg-primary/10 rounded-full border border-primary/20">
            <Building2 className="h-10 w-10 text-accent" />
        </div>
        <CardTitle className={cn(
          "text-3xl font-bold text-foreground",
          "bg-gradient-to-r from-primary via-accent to-accent",
          "text-transparent bg-clip-text"
         )}>
           Welcome Back!
         </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">Sign in to access your StudentStay account.</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email-login" className="text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email-login" type="email" placeholder="test@example.com" {...field} className="pl-10 bg-input border-border focus:border-ring focus:ring-ring" />
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
                  <Label htmlFor="password-login">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="password-login" type="password" placeholder="password" {...field} className="pl-10 bg-input border-border focus:border-ring focus:ring-ring" />
                  </div>
                  <FormMessage />
                   <div className="text-right">
                    <Link href="#" className="text-sm text-accent hover:text-accent/80 transition-colors">Forgot password?</Link>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-base py-3 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign in with
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full text-base py-3 border-border/70 text-foreground hover:bg-muted/50 hover:border-border" onClick={() => handleSocialLogin('google')} disabled={isSocialLoading === 'google' || isLoading}>
            {isSocialLoading === 'google' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon />}
            Sign in with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center pb-8 pt-4">
        <p className="text-sm text-muted-foreground">
           Don&apos;t have an account? <Link href="/signup" className="font-semibold text-accent hover:text-accent/80 transition-colors">Sign up</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
