// src/components/properties/PropertyCard.tsx
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, Utensils, BedDouble, IndianRupee, MapPin, Bath, Sparkles, Tv, ParkingCircle, Eye, MessageCircle, Heart, Brain, BarChart3, ExternalLink } from 'lucide-react';
import type { PropertyCardData } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import EnquiryForm from '@/components/enquiry/EnquiryForm';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress'; // Import Progress for visual match score

const amenityIcons: { [key: string]: React.ElementType } = {
  wifi: Wifi,
  kitchen: Utensils,
  'study desk': Sparkles,
  ac: Sparkles,
  laundry: Sparkles,
  'power backup': Sparkles,
  food: Utensils,
  cctv: Sparkles,
  wardrobe: BedDouble,
  'hot water': Bath,
  security: Sparkles,
  kitchenette: Utensils,
  'attached bathroom': Bath,
  parking: ParkingCircle,
  fan: Sparkles,
  'shared kitchen': Utensils,
  'shared bathroom': Bath,
  gym: Sparkles,
  tv: Tv,
  'study lounge': Sparkles,
  balcony: Sparkles,
};

export default function PropertyCard({
  id,
  title,
  description,
  amenities,
  price,
  locationText,
  imageUrl,
  imageHint = "property image",
  matchScore,
  aiHighlights,
  isAiPowered,
}: PropertyCardData) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getFavoriteIds = (): string[] => {
    if (typeof window !== 'undefined') {
      const favorites = localStorage.getItem('favoriteProperties');
      return favorites ? JSON.parse(favorites) : [];
    }
    return [];
  };

  useEffect(() => {
    const favoriteIds = getFavoriteIds();
    setIsFavorite(favoriteIds.includes(id));
  }, [id]);

  const handleEnquiryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEnquiryFormOpen(true);
  };

  const handleEnquirySuccess = () => {
    setIsEnquiryFormOpen(false);
    router.push('/chat');
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const favoriteIds = getFavoriteIds();
    let updatedFavorites: string[];

    if (isFavorite) {
      updatedFavorites = favoriteIds.filter(favId => favId !== id);
       toast({ title: "Removed from Favorites", description: `"${title}" removed from your favorites.` });
    } else {
      updatedFavorites = [...favoriteIds, id];
       toast({ title: "Added to Favorites", description: `"${title}" added to your favorites.` });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'favoriteProperties',
        newValue: JSON.stringify(updatedFavorites),
        oldValue: JSON.stringify(favoriteIds),
        storageArea: localStorage,
      }));
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <Card className={cn(
          "w-full overflow-hidden flex flex-col group bg-card border border-border/40 hover:border-primary/60 relative transition-all duration-300 ease-out",
          "hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.03]" 
        )}>
        <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 z-10 rounded-full h-9 w-9 p-1.5", // Adjusted padding
              "bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors",
              isFavorite ? "text-red-500 hover:text-red-400" : "text-white/80 hover:text-white" 
            )}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("h-full w-full", isFavorite ? "fill-red-500 stroke-red-500" : "fill-transparent stroke-current")} />
        </Button>

        {isAiPowered && (
             <Badge variant="default" className={cn(
                "absolute top-3 left-3 z-10 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs py-1 px-2.5 shadow-lg",
                "glow-primary" // Added glow effect
              )}>
                <Brain className="h-3.5 w-3.5 mr-1.5" /> AI Powered
            </Badge>
        )}


        <Link href={`/property/${id}`} className="block">
          <div className="relative w-full h-52 sm:h-56 overflow-hidden"> {/* Adjusted height for smaller screens */}
            <Image
              src={imageUrl}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 group-hover:scale-105" // Subtle zoom
              data-ai-hint={imageUrl.startsWith('https://picsum.photos') ? imageHint : undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Adjusted sizes
              priority={false}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>
        <CardHeader className="pb-2 pt-4 px-4">
          <Link href={`/property/${id}`} className="block">
            <CardTitle className="text-lg font-semibold truncate text-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
          </Link>
          <div className="flex items-center text-sm text-muted-foreground pt-1">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-primary/80" />
            <span className="truncate">{locationText}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow pb-3 px-4 space-y-3">
          <CardDescription className="text-sm h-10 overflow-hidden text-ellipsis text-muted-foreground line-clamp-2">
            {description}
          </CardDescription>

          {matchScore && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sm">
                  <BarChart3 className="h-4 w-4 text-accent"/>
                  <span className="font-medium text-foreground">Match Score:</span>
                  <span className="font-bold text-accent">{matchScore}%</span>
              </div>
              {/* Visual progress bar for match score */}
              <Progress value={matchScore} className="h-1.5 w-full bg-muted/70 [&>div]:bg-accent" />
            </div>
          )}

          {aiHighlights && aiHighlights.length > 0 && (
            <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">AI Highlights:</h4>
                <div className="flex flex-wrap gap-1.5">
                    {aiHighlights.slice(0,2).map(highlight => (
                        <Badge key={highlight} variant="accentTransparent" className="text-xs capitalize">
                            <Sparkles className="h-3 w-3 mr-1"/>{highlight}
                        </Badge>
                    ))}
                </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Top Amenities:</h4>
            <div className="flex flex-wrap gap-1.5">
              {amenities.slice(0, 3).map((amenity) => {
                const IconComponent = amenityIcons[amenity.toLowerCase()] || Sparkles;
                return (
                  <Badge key={amenity} variant="primaryTransparent" className="text-xs capitalize py-0.5 px-2 whitespace-nowrap">
                    <IconComponent className="h-3 w-3 mr-1" />
                    {amenity}
                  </Badge>
                );
              })}
              {amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs py-0.5 px-1.5 bg-muted/70 text-muted-foreground border-muted/90">+{amenities.length - 3} more</Badge>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-3 pb-4 px-4 flex-col items-start space-y-3 border-t border-border/30 mt-auto bg-card/50">
          <div className="w-full flex justify-between items-center">
            <div className="text-xl font-bold text-primary flex items-center">
                <IndianRupee className="h-5 w-5 mr-0.5" />
                {price.toLocaleString('en-IN')} <span className="text-xs font-normal text-muted-foreground ml-1 mt-1">/ month</span>
            </div>
            <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs text-accent/80 hover:text-accent font-medium">
                <Link href={`/property/${id}#similar`}> {/* Hypothetical link to similar section */}
                    <ExternalLink className="h-3 w-3 mr-1"/> Similar Stays
                </Link>
            </Button>
          </div>
          <div className="w-full flex gap-2">
             <Button
               size="sm"
               className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg"
               onClick={() => router.push(`/property/${id}`)}
             >
               <Eye className="mr-2 h-4 w-4" /> View Details
             </Button>
            <Button size="sm" variant="outline" className="flex-1 border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-sm hover:shadow-md" onClick={handleEnquiryClick}>
              <MessageCircle className="mr-2 h-4 w-4" /> Enquiry
            </Button>
          </div>
        </CardFooter>
      </Card>

      <EnquiryForm
        isOpen={isEnquiryFormOpen}
        onOpenChange={setIsEnquiryFormOpen}
        propertyId={id}
        propertyTitle={title}
        onSuccess={handleEnquirySuccess}
      />
    </>
  );
}
