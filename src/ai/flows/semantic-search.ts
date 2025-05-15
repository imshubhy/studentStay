
// Use server directive to ensure this file is only run on the server.
'use server';

/**
 * @fileOverview Implements semantic search for accommodations using natural language queries and structured filters.
 *
 * - semanticSearch - A function that accepts a natural language query and structured filters, returning relevant accommodation details.
 * - SemanticSearchInput - The input type for the semanticSearch function.
 * - SemanticSearchOutput - The output type for the SemanticSearchOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Define the input schema for the semantic search query.
const SemanticSearchInputSchema = z.object({
  query: z
    .string()
    .describe(
      'A natural language query describing the desired accommodation features.'
    ),
  campus: z
    .string()
    .optional()
    .describe('The campus or area to search near.'),
  smartSearchActive: z
    .boolean()
    .optional()
    .describe('Whether to use AI-enhanced smart search features. If true, the AI will use more contextual understanding. Defaults to true if not provided.'),
  priceRange: z
    .array(z.number())
    .optional()
    .describe('Optional price range [min, max] for the accommodation per month.'),
  amenities: z
    .array(z.string())
    .optional()
    .describe('Optional list of required amenities.'),
  propertyType: z
    .string()
    .optional()
    .describe('Optional type of property (e.g., Apartment, PG, Room).'),
});
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

// Define the output schema for accommodation search results.
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

const SemanticSearchOutputSchema = z.array(AccommodationDetailsSchema);
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;

// Exported function to perform semantic search.
export async function semanticSearch(input: SemanticSearchInput): Promise<SemanticSearchOutput> {
  // Ensure defaults are set if optional fields are not provided
  const flowInput: SemanticSearchInput = {
    query: input.query,
    campus: input.campus || 'Sharda University', // Default campus
    smartSearchActive: input.smartSearchActive === undefined ? true : input.smartSearchActive, // Default to true
    priceRange: input.priceRange,
    amenities: input.amenities,
    propertyType: input.propertyType,
  };
  return semanticSearchFlow(flowInput);
}

// Removed HOSTEL_PLACEHOLDER_IMAGE_URL

// Define the prompt to process the natural language query and return relevant accommodation details.
const semanticSearchPrompt = ai.definePrompt({
  name: 'semanticSearchPrompt',
  input: {schema: SemanticSearchInputSchema},
  output: {schema: SemanticSearchOutputSchema},
  prompt: `You are an AI assistant designed to find suitable accommodations based on user queries and filters.

  {{#if smartSearchActive}}
  You are in SMART SEARCH MODE. Prioritize contextual understanding, user intent, and provide nuanced results. Consider implicit needs and interpret the query broadly to find the best matches, even if not all keywords are explicitly present.
  {{else}}
  You are in BASIC SEARCH MODE. Focus on explicit keywords and direct matches. Return properties that strictly adhere to the stated query terms and filters.
  {{/if}}

  Given the following query, campus, and optional filters, please extract the requirements and return a list of accommodations matching those requirements in JSON format.

  Query: {{{query}}}
  Campus: {{{campus}}}
  {{#if propertyType}}Property Type: {{{propertyType}}}{{/if}}
  {{#if priceRange}}Price Range: ₹{{{priceRange.[0]}}} - ₹{{{priceRange.[1]}}} per month{{/if}}
  {{#if amenities.length}}Required Amenities: {{#each amenities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

  Each accommodation object in the list should contain the following fields:
  - id: Unique identifier for the accommodation.
  - title: Title of the accommodation listing.
  - description: Detailed description of the accommodation.
  - amenities: List of amenities offered.
  - price: Price per night or month.
  - location: General location of the accommodation (e.g., near Sharda University or the specified campus).
  - photoDataUri: Photo of the accommodation.

  Ensure that the accommodations you return closely match ALL specified requirements (query, campus, and any provided filters like price range, amenities, and property type), according to the search mode (SMART or BASIC).
  If no relevant accommodations are found, return an empty array.
  
  For photoDataUri:
  - When a placeholder image is needed, use "https://picsum.photos/seed/propertyY/600/400" (where Y is a unique number or identifier for each property to ensure variety).
  - If a specific, relevant photo is available for the listing, prioritize using that actual photo URL or data URI.
  `,
});

// Define the Genkit flow for semantic search.
const semanticSearchFlow = ai.defineFlow(
  {
    name: 'semanticSearchFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async input => {
    const {output} = await semanticSearchPrompt(input);
    return output!;
  }
);

