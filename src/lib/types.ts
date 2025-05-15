export interface PropertyLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  photos: string[]; // URLs to images for mock data
  amenities: string[];
  price: number; // per night
  location: PropertyLocation;
  type: 'Apartment' | 'House' | 'Room' | 'PG';
}

// Data structure expected by PropertyCard component
export interface PropertyCardData {
  id: string;
  title: string;
  description: string;
  amenities: string[];
  price: number;
  locationText: string;
  imageUrl: string; // Can be a URL or a Base64 Data URI
  imageHint?: string; // For placeholder images
  matchScore?: number; // New: AI match score (0-100)
  aiHighlights?: string[]; // New: AI-generated highlights
  isAiPowered?: boolean; // New: Flag for AI recommended/powered listings
}
```