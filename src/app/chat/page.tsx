import ChatInterface from '@/components/chat/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Import cn

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       {/* Card with updated styling from globals.css */}
      <Card className="shadow-lg bg-card border border-border/50">
        <CardHeader>
           {/* Apply gradient to title: primary (slate blue) to accent (orange) */}
          <CardTitle className={cn(
            "text-3xl font-bold text-center",
             "bg-gradient-to-r from-primary via-accent to-accent", 
             "text-transparent bg-clip-text pb-1" 
          )}>
            In-App Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChatInterface />
        </CardContent>
      </Card>
    </div>
  );
}
