
"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn

const enquiryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit phone number." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500, { message: "Message cannot exceed 500 characters." }),
});

type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

interface EnquiryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyTitle: string;
  onSuccess: () => void; // Callback on successful submission
}

export default function EnquiryForm({
  isOpen,
  onOpenChange,
  propertyId,
  propertyTitle,
  onSuccess,
}: EnquiryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  async function onSubmit(data: EnquiryFormValues) {
    setIsSubmitting(true);
    console.log("Enquiry Form Submitted:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store enquiry details in localStorage for the chat page
    try {
      const enquiryDetails = {
        propertyId,
        propertyTitle,
        timestamp: Date.now(),
        senderName: data.name, // Include sender name if needed in chat
        initialMessage: data.message // Include the initial message
      };
      // Use a unique key format
      localStorage.setItem(`pendingEnquiry_${propertyId}_${enquiryDetails.timestamp}`, JSON.stringify(enquiryDetails));

      toast({
        title: "Enquiry Sent!",
        description: `Your enquiry about "${propertyTitle}" has been submitted. You will be redirected to the chat.`,
        duration: 5000, // Give user time to read before redirect
      });
      form.reset(); // Reset form fields
      onOpenChange(false); // Close the dialog
      onSuccess(); // Call the success callback (e.g., to navigate)
    } catch (error) {
      console.error("Error processing enquiry:", error);
       toast({
         title: "Error",
         description: "Failed to process your enquiry. Please try again.",
         variant: "destructive",
       });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
       {/* Apply theme styles to Dialog Content */}
      <DialogContent className="sm:max-w-[480px] bg-card border border-border/50 text-card-foreground">
        <DialogHeader>
           {/* Use theme colors for Title and Description */}
          <DialogTitle className={cn(
            "text-xl font-semibold", // Adjusted size
            "bg-gradient-to-r from-primary via-accent to-accent", 
            "text-transparent bg-clip-text"
           )}>
             Enquire about: {propertyTitle}
           </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill out the form below, and we'll connect you shortly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4"> {/* Adjusted spacing */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Full Name</FormLabel>
                  <FormControl>
                     {/* Use themed Input */}
                    <Input placeholder="Enter your name" {...field} className="bg-input border-border focus:border-ring focus:ring-ring" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email Address</FormLabel>
                  <FormControl>
                     {/* Use themed Input */}
                    <Input type="email" placeholder="you@example.com" {...field} className="bg-input border-border focus:border-ring focus:ring-ring" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Phone Number</FormLabel>
                  <FormControl>
                     {/* Use themed Input */}
                    <Input type="tel" placeholder="9876543210" {...field} className="bg-input border-border focus:border-ring focus:ring-ring" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Your Message</FormLabel>
                  <FormControl>
                     {/* Use themed Textarea */}
                    <Textarea
                      placeholder="Ask your questions here..."
                      className="resize-none bg-input border-border focus:border-ring focus:ring-ring"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {/* Use themed Buttons */}
            <DialogFooter className="gap-2 sm:gap-0"> {/* Add gap for mobile */}
               {/* Use DialogClose for better accessibility */}
               <DialogClose asChild>
                 <Button type="button" variant="outline" disabled={isSubmitting} className="border-muted-foreground/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                   Cancel
                 </Button>
               </DialogClose>
               {/* Accent color for submit */}
              <Button type="submit" disabled={isSubmitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
