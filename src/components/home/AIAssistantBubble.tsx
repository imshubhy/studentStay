// src/components/home/AIAssistantBubble.tsx
"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIAssistantBubble() {
  const handleClick = () => {
    // TODO: Implement AI Assistant functionality (e.g., open chat modal)
    alert("AI Assistant clicked! (Functionality to be implemented)");
  };

  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-xl z-50", // Increased size
        "bg-gradient-to-br from-primary to-accent text-primary-foreground",
        "hover:scale-110 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 ease-out",
        "focus:outline-none focus:ring-4 focus:ring-ring/50 focus:ring-offset-2 focus:ring-offset-background",
        "animate-pulse-slow" // Added pulse animation
      )}
      onClick={handleClick}
      aria-label="Open AI Assistant"
    >
      <MessageSquare className="h-8 w-8" /> {/* Increased icon size */}
    </Button>
  );
}
