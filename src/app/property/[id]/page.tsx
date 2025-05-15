
// src/app/property/[id]/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation'; // Import useRouter
import { useState } from 'react'; // Import useState
import { mockProperties } from '@/lib/mock-data';
import type { Property } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, MapPin, Wifi, Utensils, BedDouble, Bath, Sparkles, Tv, ParkingCircle, ChevronLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import EnquiryForm from '@/components/enquiry/EnquiryForm'; // Import the EnquiryForm
import { cn } from '@/lib/utils'; // Import cn

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


export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter(); // Initialize router
  const propertyId = params.id as string;
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false); // State for dialog

  // In a real app, you'd fetch this data from an API
  const property = mockProperties.find(p => p.id === propertyId);

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center"> {/* Increased padding */}
        <h1 className="text-3xl font-semibold mb-4 text-destructive">Property not found</h1>
        <p className="text-muted-foreground mb-6">The property you are looking for does not exist or has been removed.</p>
        {/* Updated Button Style */}
        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const handleEnquiryClick = () => {
    setIsEnquiryFormOpen(true); // Open the dialog
  };

  const handleEnquirySuccess = () => {
    setIsEnquiryFormOpen(false); // Close dialog handled by EnquiryForm
    router.push('/chat'); // Navigate after successful submission
  };

  // Determine image hint for data-ai-hint
  let imageHintForAi = undefined;
  if (property.photos[0].startsWith('https://picsum.photos')) {
    imageHintForAi = `${property.type.toLowerCase()} ${property.type === 'Room' || property.type === 'PG' ? 'accommodation' : 'building'}`;
  }


  return (
    <div className="container mx-auto px-4 py-8">
       {/* Updated Button Style */}
      <Button asChild variant="outline" className="mb-6 border-muted-foreground/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Listings
        </Link>
      </Button>
      <Card className="shadow-xl overflow-hidden bg-card border border-border/50">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative">
             {/* Ensure AspectRatio maintains image dimensions */}
            <AspectRatio ratio={16 / 10} className="bg-muted">
              <Image
                src={property.photos[0]} // Assuming at least one photo
                alt={property.title}
                fill // Use fill
                style={{objectFit: 'cover'}} // Use objectFit style
                className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                data-ai-hint={imageHintForAi}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority // Prioritize loading the main image
              />
            </AspectRatio>
          </div>

          <div className="flex flex-col">
            <CardHeader className="p-6">
               {/* Apply gradient to title: primary (slate blue) to accent (orange) */}
              <CardTitle className={cn(
                "text-3xl font-bold",
                "bg-gradient-to-r from-primary via-accent to-accent", 
                "text-transparent bg-clip-text"
               )}>
                 {property.title}
               </CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-1">
                {property.type} in {property.location.address}
              </CardDescription>
            </CardHeader>

             {/* Use ScrollArea for content overflow */}
            <ScrollArea className="h-[calc(100%-240px)] md:h-auto md:flex-grow">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                <Separator className="bg-border/50" />

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">Amenities</h3>
                  <div className="flex flex-wrap gap-2"> {/* Reduced gap */}
                    {property.amenities.map((amenity) => {
                      const IconComponent = amenityIcons[amenity.toLowerCase()] || Sparkles;
                      return (
                         // Use themed badge style
                        <Badge key={amenity} variant="outline" className="text-sm capitalize py-1 px-3 bg-primary/10 text-primary border-primary/20">
                          <IconComponent className="h-4 w-4 mr-2" />
                          {amenity}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <Separator className="bg-border/50" />

                <div>
                    <h3 className="text-xl font-semibold mb-2 text-primary">Location</h3>
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-accent" /> {/* Accent color for map pin */}
                        <span>{property.location.address}</span>
                    </div>
                    {/* Basic map placeholder */}
                    <div className="mt-3 h-48 bg-muted/50 rounded-lg flex items-center justify-center text-sm text-muted-foreground border border-border/30">
                        Map Placeholder
                        {/* TODO: Integrate a small static map image or interactive map snippet */}
                    </div>
                </div>

              </CardContent>
            </ScrollArea>

            <CardFooter className="p-6 border-t border-border/50 bg-card/50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <div className="text-3xl font-bold text-primary flex items-center">
                <IndianRupee className="h-7 w-7 mr-1" />
                {property.price.toLocaleString('en-IN')}
                <span className="text-sm text-muted-foreground ml-1 mt-2">/ month</span>
              </div>
               {/* Updated Enquiry Button Style (Accent Color) */}
              <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleEnquiryClick}>
                <MessageSquare className="mr-2 h-5 w-5" /> Send Enquiry
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

       {/* Enquiry Form Dialog */}
      <EnquiryForm
        isOpen={isEnquiryFormOpen}
        onOpenChange={setIsEnquiryFormOpen}
        propertyId={property.id}
        propertyTitle={property.title}
        onSuccess={handleEnquirySuccess} // Pass success handler
      />
    </div>
  );
}
