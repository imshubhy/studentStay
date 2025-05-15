// src/app/actions.ts
"use server";

import { semanticSearch } from '@/ai/flows/semantic-search';
import type { SemanticSearchInput, SemanticSearchOutput } from '@/ai/flows/semantic-search';
import { getRecommendations } from '@/ai/flows/recommend-properties';
import type { RecommendationOutput } from '@/ai/flows/recommend-properties';

export async function performAiSearch(input: SemanticSearchInput): Promise<{ results: SemanticSearchOutput | null; error: string | null }> {
  if (!input.query || input.query.trim() === "") {
    // If query is empty but other filters might exist (e.g. price range),
    // the AI might still be able to process.
    // However, for a pure empty query without other context, returning empty results is reasonable.
    // If query is empty but specific filters are set, we might still proceed.
    // Let's assume for now an empty query means an empty search.
    if (!input.priceRange && !input.amenities && !input.propertyType) {
       return { results: [], error: null }; 
    }
  }
  try {
    // The input object (which includes query, campus, smartSearchActive, and now structured filters) is passed directly
    const results = await semanticSearch(input);
    return { results, error: null };
  } catch (e) {
    console.error("AI Search Error:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during AI search.";
    return { results: null, error: errorMessage };
  }
}

export async function getAiRecommendations(): Promise<{ recommendations: RecommendationOutput | null; error: string | null }> {
  try {
    const recommendations = await getRecommendations({});
    return { recommendations, error: null };
  } catch (e) {
    console.error("AI Recommendation Error:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while fetching recommendations.";
    return { recommendations: null, error: errorMessage };
  }
}
