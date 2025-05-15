
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
  price: number; // per night or month
  location: PropertyLocation;
  type: 'Apartment' | 'House' | 'Room' | 'PG';
  // Add fields that might have come from AI Features if needed for mock data consistency
  matchScore?: number;
  aiHighlights?: string[];
  isAiPowered?: boolean;
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
  matchScore?: number; // AI match score (0-100)
  aiHighlights?: string[]; // AI-generated highlights
  isAiPowered?: boolean; // Flag for AI recommended/powered listings
}
