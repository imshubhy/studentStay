// THIS IS THE FRONTEND-ONLY VERSION - NO AI FLOW IMPORTS SHOULD BE HERE - VERSION 9
"use server";

import type { PropertyCardData } from "@/lib/types";
import { mockProperties, mockPropertiesWithAiFeatures } from "@/lib/mock-data";

// Define SemanticSearchInput here for frontend-only context
export interface SemanticSearchInput {
  query: string;
  campus?: string;
  smartSearchActive?: boolean;
  priceRange?: [number, number];
  amenities?: string[];
  propertyType?: string;
  naturalLanguageQuery?: string;
}

// Helper to map mock Property to PropertyCardData
// This ensures consistency if mockProperties don't exactly match PropertyCardData
const mapPropertyToCardData = (
  property: (typeof mockProperties)[0] & { matchScore?: number; aiHighlights?: string[]; isAiPowered?: boolean }
): PropertyCardData => {
  let hint = "property photo";
  if (property.type === "PG") hint = "hostel building";
  else if (property.type === "Apartment") {
     if (property.title.toLowerCase().includes('studio')) hint = "studio apartment";
      else if (property.title.toLowerCase().includes('flat') || property.title.toLowerCase().includes('bhk')) hint = "apartment exterior";
      else hint = "apartment building";
  }
  else if (property.type === "Room") {
    if (property.title.toLowerCase().includes('premium') || property.title.toLowerCase().includes('single')) hint = "bedroom interior";
      else hint = "room interior";
  }
  else if (property.type === "House") hint = "house exterior";


  return {
    id: property.id,
    title: property.title,
    description: property.description.substring(0, 100) + "...",
    amenities: property.amenities,
    price: property.price,
    locationText: property.location.address,
    imageUrl: property.photos[0],
    imageHint: hint,
    matchScore: property.matchScore || Math.floor(70 + Math.random() * 30),
    aiHighlights: property.aiHighlights || ["Verified", "Near Campus"],
    isAiPowered: property.isAiPowered === undefined ? Math.random() > 0.5 : property.isAiPowered,
  };
};

export async function performAiSearch(
  input: SemanticSearchInput
): Promise<{ results: PropertyCardData[] | null; error: string | null }> {
  console.log("MOCK AiSearch: Input received:", input);
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredProperties = [...mockPropertiesWithAiFeatures]; // Use a copy

  if (input.query && input.query.trim() !== "") {
    const queryLower = input.query.toLowerCase();
    filteredProperties = filteredProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(queryLower) ||
        p.description.toLowerCase().includes(queryLower)
    );
  }
  
  if (input.naturalLanguageQuery && input.naturalLanguageQuery.trim() !== "") {
    const nlQueryLower = input.naturalLanguageQuery.toLowerCase();
     filteredProperties = filteredProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(nlQueryLower) ||
        p.description.toLowerCase().includes(nlQueryLower) ||
        p.amenities.some(a => a.toLowerCase().includes(nlQueryLower))
    );
  }

  if (input.propertyType && input.propertyType !== "Any") {
    filteredProperties = filteredProperties.filter(
      (p) => p.type === input.propertyType
    );
  }

  if (input.priceRange) {
    filteredProperties = filteredProperties.filter(
      (p) => p.price >= input.priceRange![0] && p.price <= input.priceRange![1]
    );
  }

  if (input.amenities && input.amenities.length > 0) {
    filteredProperties = filteredProperties.filter((p) =>
      input.amenities!.every((a) => p.amenities.includes(a))
    );
  }

  // Ensure results are in PropertyCardData format
  const resultsAsCardData = filteredProperties.map(prop => mapPropertyToCardData(prop as any));
  
  return { results: resultsAsCardData, error: null };
}

export async function getAiRecommendations(): Promise<{
  recommendations: PropertyCardData[] | null;
  error: string | null;
}> {
  console.log("MOCK getAiRecommendations called");
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Take first 4, ensuring they are PropertyCardData
  const recommended = mockPropertiesWithAiFeatures
    .slice(0, 4)
    .map(prop => mapPropertyToCardData(prop as any));
    
  return { recommendations: recommended, error: null };
}
