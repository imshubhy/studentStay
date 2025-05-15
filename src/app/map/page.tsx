"use client"; // This page uses client-side components for map

import InteractiveMap from '@/components/map/InteractiveMap';
import { mockProperties } from '@/lib/mock-data';
import type { Property } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn

const mapProperties = mockProperties.map(p => ({
  id: p.id,
  title: p.title,
  location: p.location,
  propertyTitle: p.title // Added for potential use in map markers/info windows
}));

export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const shardaUniversityLocation = { lat: 28.4733, lng: 77.4822 }; // More precise Sharda Coords

  return (
    <div className="container mx-auto px-4 py-8">
       {/* Card with updated styling */}
      <Card className="shadow-lg bg-card border border-border/50">
        <CardHeader>
           {/* Apply gradient to title: primary (slate blue) to accent (orange) */}
          <CardTitle className={cn(
            "text-3xl font-bold text-center",
             "bg-gradient-to-r from-primary via-accent to-accent", 
             "text-transparent bg-clip-text pb-1" 
           )}>
            Explore Accommodations on Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!apiKey && (
             // Updated Alert styling
             <Alert variant="destructive" className="max-w-2xl mx-auto bg-destructive/10 border-destructive/50 text-destructive-foreground dark:text-destructive">
               <AlertTriangle className="h-6 w-6" /> {/* Adjusted icon size */}
               <AlertTitle className="font-semibold">Map Configuration Incomplete</AlertTitle>
               <AlertDescription>
                 The Google Maps API Key is not configured. Please set the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable to display the interactive map.
               </AlertDescription>
             </Alert>
          )}
          {apiKey && (
            <InteractiveMap
              properties={mapProperties}
              defaultCenter={shardaUniversityLocation}
              defaultZoom={15}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
