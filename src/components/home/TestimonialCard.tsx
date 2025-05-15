// src/components/home/TestimonialCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  quote: string;
  author: string;
  detail: string;
  avatarSeed?: string; // For generating consistent placeholder images
  className?: string;
}

export default function TestimonialCard({ quote, author, detail, avatarSeed, className }: TestimonialCardProps) {
  const authorInitials = author.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  
  return (
    <Card className={cn(
        "bg-card/80 border-border/50 shadow-lg flex flex-col h-full backdrop-blur-sm hover:shadow-primary/15 transition-shadow",
        className
    )}>
      <CardHeader className="pb-3">
        <Quote className="h-8 w-8 text-primary/70 mb-2" />
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-base italic text-foreground/90 leading-relaxed">"{quote}"</p>
      </CardContent>
      <CardFooter className="pt-4 mt-auto border-t border-border/30">
        <div className="flex items-center gap-3 w-full">
          <Avatar className="h-11 w-11 border-2 border-primary/50">
            <AvatarImage 
              src={avatarSeed ? `https://picsum.photos/seed/${avatarSeed}/80/80` : undefined} 
              alt={author} 
              data-ai-hint="person portrait" 
            />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">{authorInitials}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold text-foreground">{author}</p>
            <p className="text-muted-foreground">{detail}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
