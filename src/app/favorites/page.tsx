// src/app/favorites/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyList from '@/components/properties/PropertyList';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PropertyCardData } from '@/lib/types';
import { mockProperties } from '@/lib/mock-data'; // Import mock data to find details
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Helper function to map full property data to card data
const mapPropertyToCardData = (property: (typeof mockProperties)[0]): PropertyCardData => {
  let hint = "property photo";
  if (property.type === 'PG') hint = "hostel building";
  else if (property.type === 'Apartment') hint = "apartment building";
  else if (property.type === 'Room') hint = "room interior";
  else if (property.type === 'House') hint = "house exterior";

  return {
    id: property.id,
    title: property.title,
    description: property.description.substring(0, 100) + "...",
    amenities: property.amenities,
    price: property.price,
    locationText: property.location.address,
    imageUrl: property.photos[0],
    imageHint: hint
  };
};

// Skeleton for loading state
const PropertyListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col space-y-3 bg-card p-4 rounded-lg shadow-md border border-border">
        <Skeleton className="h-[180px] w-full rounded-lg" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4 mt-2" />
        </div>
      </div>
    ))}
  </div>
);


export default function FavoritesPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<PropertyCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Function to get favorite IDs from localStorage
  const getFavoriteIds = (): string[] => {
      if (typeof window !== 'undefined') {
        const favorites = localStorage.getItem('favoriteProperties');
        return favorites ? JSON.parse(favorites) : [];
      }
      return [];
  };

  useEffect(() => {
    // This effect runs only on the client side
    setIsLoading(true);
    const favoriteIds = getFavoriteIds();
    const favoriteDetails = mockProperties
      .filter(property => favoriteIds.includes(property.id))
      .map(mapPropertyToCardData); // Map to PropertyCardData

    setFavoriteProperties(favoriteDetails);
    setIsLoading(false);

    // Optional: Add event listener to update if localStorage changes elsewhere
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'favoriteProperties') {
        const updatedFavoriteIds = getFavoriteIds();
        const updatedFavoriteDetails = mockProperties
          .filter(property => updatedFavoriteIds.includes(property.id))
          .map(mapPropertyToCardData);
        setFavoriteProperties(updatedFavoriteDetails);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="shadow-lg bg-card border border-border/50">
        <CardHeader>
          <CardTitle className={cn(
            "text-3xl font-bold text-center flex items-center justify-center gap-2",
             "bg-gradient-to-r from-primary via-accent to-accent", 
             "text-transparent bg-clip-text pb-1"
          )}>
             <Heart className="h-7 w-7 inline-block text-primary" /> {/* Primary color for icon */}
            Your Favorite Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isLoading ? (
             <div className="pt-6"> {/* Add padding top for skeleton */}
                <PropertyListSkeleton count={favoriteProperties.length > 0 ? favoriteProperties.length : 4} />
             </div>
          ) : favoriteProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-10">
              <Heart className="h-16 w-16 mx-auto mb-4 text-primary/30" />
              <p className="text-lg font-semibold text-foreground mb-2">No favorites yet!</p>
              <p className="mb-4">Start exploring and add properties you like using the ♡ icon.</p>
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                 <Link href="/">Browse Properties</Link>
              </Button>
            </div>
          ) : (
             <div className="pt-6"> {/* Add padding top for list */}
               <PropertyList properties={favoriteProperties} />
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
