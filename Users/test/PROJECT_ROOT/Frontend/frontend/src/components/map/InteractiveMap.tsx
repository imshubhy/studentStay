
"use client";

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { PropertyLocation } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface MapProperty {
  id: string;
  title: string;
  location: PropertyLocation;
  address?: string; // Optional: for info window consistency
}

interface InteractiveMapProps {
  properties: MapProperty[];
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  defaultCenter = { lat: 28.4733, lng: 77.4822 }, // Approx Sharda University
  defaultZoom = 14,
}) => {
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const [pinPrimaryColor, setPinPrimaryColor] = useState('hsl(var(--primary))');
  const [pinPrimaryFgColor, setPinPrimaryFgColor] = useState('hsl(var(--primary-foreground))');
  const [mapStyle, setMapStyle] = useState<google.maps.MapTypeStyle[]>([]);


  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

    if (typeof window !== 'undefined') {
      const computedStyle = getComputedStyle(document.documentElement);
      const primary = computedStyle.getPropertyValue('--primary').trim();
      const primaryForeground = computedStyle.getPropertyValue('--primary-foreground').trim();
      const background = computedStyle.getPropertyValue('--background').trim(); // For map theme
      const card = computedStyle.getPropertyValue('--card').trim();
      const foreground = computedStyle.getPropertyValue('--foreground').trim();
      const mutedForeground = computedStyle.getPropertyValue('--muted-foreground').trim();
      const accent = computedStyle.getPropertyValue('--accent').trim();
      const border = computedStyle.getPropertyValue('--border').trim();


      if (primary) setPinPrimaryColor(`hsl(${primary})`);
      if (primaryForeground) setPinPrimaryFgColor(`hsl(${primaryForeground})`);

      // Dynamic map styling based on theme (basic dark mode detection)
      // More sophisticated detection might be needed if using system theme preference widely
      const isDark = document.documentElement.classList.contains('dark');
      
      const waterColor = isDark ? `hsl(210, 30%, 15%)` : `hsl(200, 50%, 85%)`;
      const landColor = isDark ? `hsl(220, 15%, 12%)` : `hsl(0, 0%, 96%)`; // Using --background HSL
      const roadColor = isDark ? `hsl(220, 10%, 20%)` : `hsl(210, 20%, 88%)`;
      const textColor = isDark ? `hsl(${mutedForeground})` : `hsl(${foreground})`; // Muted for dark, fg for light
      const poiColor = isDark ? `hsl(${accent})` : `hsl(${accent})`; // Use accent for POIs


      setMapStyle([
        { elementType: "geometry", stylers: [{ color: landColor }] },
        { elementType: "labels.text.stroke", stylers: [{ color: landColor }] },
        { elementType: "labels.text.fill", stylers: [{ color: textColor }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: poiColor }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: poiColor }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: isDark ? `hsl(180, 20%, 18%)` : `hsl(120, 30%, 88%)` }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: isDark ? `hsl(120, 25%, 60%)` : `hsl(120, 40%, 40%)` }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: roadColor }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: isDark ? `hsl(220,10%,15%)` : `hsl(210,20%,80%)`}],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: textColor }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: isDark ? `hsl(${accent})` : `hsl(${accent})`  }], // Highways more prominent
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: isDark ? `hsl(220,15%,10%)` : `hsl(0,0%,90%)` }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: isDark ? `hsl(0,0%,100%)` : `hsl(0,0%,0%)`}],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: isDark ? `hsl(210, 20%, 20%)` : `hsl(210, 30%, 80%)` }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: poiColor }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: waterColor }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: isDark ? `hsl(200, 30%, 70%)` : `hsl(200, 60%, 30%)` }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: waterColor }],
        },
      ]);
    }
  }, []);

  if (typeof apiKey === 'undefined') {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-muted/30 rounded-lg p-4">
         <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey!}>
      <div style={{ height: '70vh', minHeight: '500px', width: '100%' }} className="rounded-lg overflow-hidden shadow-lg border border-border/50">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapId="studentstay-map-view"
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          styles={mapStyle.length > 0 ? mapStyle : undefined} // Apply styles only if they are loaded
        >
          {properties.map((prop) => (
            <AdvancedMarker
              key={prop.id}
              position={{ lat: prop.location.lat, lng: prop.location.lng }}
              onClick={() => setSelectedProperty(prop)}
              title={prop.title}
            >
              <Pin
                background={pinPrimaryColor}
                borderColor={pinPrimaryFgColor}
                glyphColor={pinPrimaryFgColor}
              />
            </AdvancedMarker>
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{ lat: selectedProperty.location.lat, lng: selectedProperty.location.lng }}
              onCloseClick={() => setSelectedProperty(null)}
              minWidth={250}
            >
              <Card className="border-0 shadow-none bg-card text-card-foreground !p-0">
                <CardHeader className="p-3 pb-1">
                   <CardTitle className="text-base font-semibold text-foreground">{selectedProperty.title}</CardTitle>
                </CardHeader>
                 <CardContent className="p-3 pt-1 text-sm">
                   <p className="text-muted-foreground mb-2 line-clamp-2">{selectedProperty.address || selectedProperty.location.address}</p>
                   <Button size="sm" asChild variant="link" className="p-0 h-auto text-accent hover:text-accent/90 font-semibold">
                     <Link href={`/property/${selectedProperty.id}`}>View Details</Link>
                   </Button>
                 </CardContent>
              </Card>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default InteractiveMap;
