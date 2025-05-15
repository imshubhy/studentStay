'use server';
/**
 * @fileOverview Provides AI-powered property recommendations.
 *
 * - getRecommendations - A function that returns a list of recommended accommodation details.
 * - RecommendationInput - The input type (currently empty, placeholder for future personalization).
 * - RecommendationOutput - The output type, listing recommended accommodations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { mockProperties } from '@/lib/mock-data'; // Import mock data
import type { Property } from '@/lib/types'; // Import Property type

// Define the input schema (currently empty, can be expanded later for personalization)
const RecommendationInputSchema = z.object({});
export type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

// Reuse the AccommodationDetails schema from semantic-search for consistency
const AccommodationDetailsSchema = z.object({
  id: z.string().describe('Unique identifier for the accommodation.'),
  title: z.string().describe('Title of the accommodation listing.'),
  description: z.string().describe('Detailed description of the accommodation.'),
  amenities: z.array(z.string()).describe('List of amenities offered.'),
  price: z.number().describe('Price per night or month.'),
  location: z
    .string()
    .describe('General location of the accommodation (e.g., near Sharda University).'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the accommodation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

// Define the output schema for recommendations
const RecommendationOutputSchema = z.array(AccommodationDetailsSchema);
export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

// Exported function to get recommendations.
export async function getRecommendations(input?: RecommendationInput): Promise<RecommendationOutput> {
  // Currently, this flow returns a fixed subset of mock data.
  // In a real application, this could involve LLM calls, user history, etc.
  return recommendPropertiesFlow(input || {});
}

// Define the Genkit flow for recommendations.
// This version directly uses mock data instead of a complex prompt.
const recommendPropertiesFlow = ai.defineFlow(
  {
    name: 'recommendPropertiesFlow',
    inputSchema: RecommendationInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async (input) => {
    // Simulate recommendation logic: Return the first 4 mock properties as recommendations
    const recommendedMockProperties = mockProperties.slice(0, 4);

    // Format the mock data to match the output schema
    const recommendations: RecommendationOutput = recommendedMockProperties.map((prop: Property) => ({
      id: prop.id,
      title: prop.title,
      description: prop.description,
      amenities: prop.amenities,
      price: prop.price,
      location: prop.location.address, // Use address string for location
      // Assuming photos[0] exists and is a URL. In a real scenario, you might need to convert URLs to data URIs if the schema strictly requires it.
      // For simplicity here, we'll keep the picsum URL. If the schema *must* be a data URI, conversion logic would be needed.
      photoDataUri: prop.photos[0],
    }));

    return recommendations;
  }
);
