
// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import AISearchBar from '@/components/search/AISearchBar';
import PropertyList from '@/components/properties/PropertyList';
import type { PropertyCardData } from '@/lib/types';
import { mockPropertiesWithAiFeatures, mockProperties } from '@/lib/mock-data'; // Use augmented mock data, removed unsplashHostelImageUrl import
import type { SemanticSearchInput, SemanticSearchOutput } from '@/ai/flows/semantic-search';
import type { RecommendationOutput } from '@/ai/flows/recommend-properties';
import { getAiRecommendations, performAiSearch } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchX, ServerCrash, Star, Brain, Users, TrendingUp, Filter as FilterIcon, ChevronDown, ChevronUp, History, MapPin, Lightbulb, Sparkles, SlidersHorizontal } from "lucide-react";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AIAssistantBubble from '@/components/home/AIAssistantBubble';
import AdvancedFilters from '@/components/home/AdvancedFilters';
import TestimonialCard from '@/components/home/TestimonialCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';


const mapMockPropertiesToCardData = (properties: (typeof mockPropertiesWithAiFeatures | typeof mockProperties)): PropertyCardData[] => {
  return properties.map(prop => {
    let hint = "property photo";
    if (prop.type === 'PG') hint = "hostel building";
    else if (prop.type === 'Apartment') {
      if (prop.title.toLowerCase().includes('studio')) hint = "studio apartment";
      else if (prop.title.toLowerCase().includes('flat') || prop.title.toLowerCase().includes('bhk')) hint = "apartment exterior";
      else hint = "apartment building";
    }
    else if (prop.type === 'Room') {
      if (prop.title.toLowerCase().includes('premium') || prop.title.toLowerCase().includes('single')) hint = "bedroom interior";
      else hint = "room interior";
    }
    else if (prop.type === 'House') hint = "house exterior";

    return {
      id: prop.id,
      title: prop.title,
      description: prop.description.substring(0, 100) + "...",
      amenities: prop.amenities,
      price: prop.price,
      locationText: prop.location.address,
      imageUrl: prop.photos[0],
      imageHint: hint,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      matchScore: (prop as any).matchScore,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      aiHighlights: (prop as any).aiHighlights,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isAiPowered: (prop as any).isAiPowered,
    };
  });
};

const mapAiResultsToCardData = (results: SemanticSearchOutput | RecommendationOutput): PropertyCardData[] => {
  return results.map(result => {
    let hint = "property photo";
    // Removed specific check for unsplashHostelImageUrl
    // The AI flow is now instructed to use picsum.photos for all placeholders.
    // The imageHint will be determined by title/type.
    if (result.photoDataUri.startsWith('https://picsum.photos')) {
        if (result.title.toLowerCase().includes('pg') || result.title.toLowerCase().includes('hostel')) {
            hint = "hostel building"; // Or "hostel room"
        } else if (result.title.toLowerCase().includes('apartment')) {
            if (result.title.toLowerCase().includes('studio')) hint = "studio apartment";
            else hint = "apartment building";
        } else if (result.title.toLowerCase().includes('room')) {
            hint = "room interior";
        }
    } else { // If it's not a picsum URL, assume it's a specific image from the AI or a data URI
         if (result.title.toLowerCase().includes('pg') || result.title.toLowerCase().includes('hostel')) {
            hint = "hostel room";
        } else if (result.title.toLowerCase().includes('apartment')) {
            if (result.title.toLowerCase().includes('studio')) hint = "studio apartment";
            else hint = "apartment building";
        } else if (result.title.toLowerCase().includes('room')) {
            hint = "room interior";
        }
    }


    return {
      id: result.id,
      title: result.title,
      description: result.description.substring(0, 100) + "...",
      amenities: result.amenities,
      price: result.price,
      locationText: result.location,
      imageUrl: result.photoDataUri.startsWith('data:') ? result.photoDataUri : result.photoDataUri,
      imageHint: hint,
      matchScore: Math.floor(80 + Math.random() * 20), 
      aiHighlights: ["Verified Listing", "Popular Choice", "Near Campus"], // Example AI Highlights
      isAiPowered: true, // Mark as AI powered
    };
  });
};

const PropertyListSkeleton = ({ count = 4 }: { count?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 bg-card/80 p-4 rounded-lg shadow-md border border-border/30">
          <Skeleton className="h-[180px] w-full rounded-lg bg-muted/50" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-3/4 bg-muted/50" />
            <Skeleton className="h-4 w-1/2 bg-muted/50" />
            <Skeleton className="h-4 w-1/4 mt-2 bg-muted/50" />
            <Skeleton className="h-6 w-full mt-3 bg-muted/40" />
          </div>
        </div>
      ))}
    </div>
  );

const smartFilters = [
  { label: "Below ₹8k", query: "Properties below 8000 per month", icon: <TrendingUp className="mr-1.5 h-4 w-4" /> },
  { label: "Near Campus", query: "Properties near main campus", icon: <MapPin className="mr-1.5 h-4 w-4" /> },
  { label: "AC Rooms", query: "Rooms with AC", icon: <Sparkles className="mr-1.5 h-4 w-4" /> }, 
  { label: "Parking", query: "Properties with parking", icon: <TrendingUp className="mr-1.5 h-4 w-4" /> }, // Placeholder, consider a Parking icon
  { label: "For Girls", query: "PG for girls", icon: <Users className="mr-1.5 h-4 w-4" /> }, 
];


interface Filters {
  priceRange: [number, number];
  amenities: string[];
  propertyType: string;
  smartSearchActive: boolean;
  naturalLanguageQuery?: string;
}

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recommendedProperties, setRecommendedProperties] = useState<PropertyCardData[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [isAiFiltersActive, setIsAiFiltersActive] = useState(false); // For badge on accordion trigger
  const [currentSelectedCampus, setCurrentSelectedCampus] = useState<string>("sharda_university"); // To store selected campus

  // To store initial match scores and prevent re-randomizing on re-renders
  const [matchScores, setMatchScores] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const initialScores: {[key: string]: number} = {};
    // Initialize scores for properties from mockPropertiesWithAiFeatures
    mockPropertiesWithAiFeatures.forEach(prop => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialScores[prop.id] = (prop as any).matchScore || Math.floor(70 + Math.random() * 30);
    });
    // Initialize scores for any properties from mockProperties not in mockPropertiesWithAiFeatures (if any)
    mockProperties.forEach(prop => {
      if (!initialScores[prop.id]) {
        initialScores[prop.id] = Math.floor(70 + Math.random() * 30);
      }
    });
    setMatchScores(initialScores);
  }, []); // Empty dependency array ensures this runs once on mount


  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setIsRecommendationsLoading(true);

      const { recommendations, error: recError } = await getAiRecommendations();
      if (recError) {
        setRecommendationError(recError);
        setRecommendedProperties([]);
      } else if (recommendations) {
         const aiMappedRecommendations = mapAiResultsToCardData(recommendations).map(p => ({
          ...p,
          matchScore: matchScores[p.id] || p.matchScore // Use stored or new random score
        }));
        setRecommendedProperties(aiMappedRecommendations);
      } else {
        setRecommendedProperties([]);
      }
      setIsRecommendationsLoading(false);
      
      if (!isSearching && properties.length === 0) {
         // Apply stored match scores to initial mock properties
         const initialMockData = mapMockPropertiesToCardData(mockPropertiesWithAiFeatures.slice(0,8)).map(p => ({
          ...p,
          matchScore: matchScores[p.id] || p.matchScore 
        }));
        setProperties(initialMockData);
      }
      setIsLoading(false); 
    };

    // Only fetch if matchScores are populated to ensure they are available for mapping
    if (Object.keys(matchScores).length > 0) {
       fetchInitialData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchScores]); // Depend on matchScores to run after they are set


  const handleSearch = async (searchQuery: string, campus: string, appliedFilters?: Filters) => {
    setIsLoading(true);
    setIsSearching(true);
    setError(null);
    setProperties([]); 
    setCurrentSelectedCampus(campus);

    const queryToUse = appliedFilters?.naturalLanguageQuery && appliedFilters.naturalLanguageQuery.trim() !== "" 
                       ? appliedFilters.naturalLanguageQuery 
                       : searchQuery;
    
    const searchInput: SemanticSearchInput = {
      query: queryToUse,
      campus: campus,
      smartSearchActive: appliedFilters ? appliedFilters.smartSearchActive : true, 
      ...(appliedFilters && { 
        priceRange: appliedFilters.priceRange,
        amenities: appliedFilters.amenities,
        propertyType: appliedFilters.propertyType === "Any" ? undefined : appliedFilters.propertyType,
      }),
    };

    // Basic client-side filtering
    if (!searchInput.smartSearchActive || (searchInput.query.trim() === "" && (!searchInput.priceRange && !searchInput.amenities && !searchInput.propertyType))) {
      let filteredMock = [...mockProperties]; // Use a copy for filtering

      if (appliedFilters) {
        // Price Range Filter
        if (appliedFilters.priceRange) {
          filteredMock = filteredMock.filter(
            (p) => p.price >= appliedFilters.priceRange[0] && p.price <= appliedFilters.priceRange[1]
          );
        }
        // Amenities Filter
        if (appliedFilters.amenities && appliedFilters.amenities.length > 0) {
          filteredMock = filteredMock.filter((p) =>
            appliedFilters.amenities.every((a) => p.amenities.includes(a))
          );
        }
        // Property Type Filter
        if (appliedFilters.propertyType && appliedFilters.propertyType !== "Any") {
          filteredMock = filteredMock.filter((p) => p.type === appliedFilters.propertyType);
        }
      }
      
      // Keyword search on title/description if query exists
      if (queryToUse.trim() !== "") {
        const lowerQuery = queryToUse.toLowerCase();
        filteredMock = filteredMock.filter(p => 
            p.title.toLowerCase().includes(lowerQuery) || 
            p.description.toLowerCase().includes(lowerQuery)
        );
      }
      
      const clientFilteredProperties = mapMockPropertiesToCardData(filteredMock).map(p => ({
        ...p,
        matchScore: matchScores[p.id] || Math.floor(70 + Math.random() * 30) // Apply stored match score
      }));
      setProperties(clientFilteredProperties);

      setIsLoading(false);
      setIsSearching(false);
      if (clientFilteredProperties.length === 0) { // Check based on the final mapped and scored list
        setError("No properties found matching your criteria.");
      }
      return;
    }


    // Perform AI Search if smart search is active and there's a query or filters
    const { results, error: searchError } = await performAiSearch(searchInput);
    
    setIsLoading(false);
    setIsSearching(false);

    if (searchError) {
      setError(searchError);
      setProperties([]);
    } else if (results && results.length > 0) {
       const aiFilteredProperties = mapAiResultsToCardData(results).map(p => ({
         ...p,
         matchScore: matchScores[p.id] || p.matchScore // Apply stored match score or new random for AI results
       }));
       setProperties(aiFilteredProperties);
       setError(null);
    } else {
       setProperties([]); 
       setError(null); 
    }
  };

  const handleSearchFromAISearchBar = (query: string, campus: string) => {
    const defaultFilters: Filters = {
      priceRange: [1000, 50000], 
      amenities: [],
      propertyType: "Any",
      smartSearchActive: true, 
      naturalLanguageQuery: query 
    };
    handleSearch(query, campus, defaultFilters);
  };
  

  const handleSearchStart = () => {
    setIsLoading(true);
    setIsSearching(true); 
    setError(null);
    setProperties([]); 
  };
  
  const handleSmartFilterClick = (smartFilterQuery: string) => {
    const searchBar = document.querySelector('input[aria-label="Search for properties"]') as HTMLInputElement | null;
    if (searchBar) {
        searchBar.value = smartFilterQuery; 
    }
    handleSearch(smartFilterQuery, currentSelectedCampus, {
      priceRange: [1000, 50000], 
      amenities: [],
      propertyType: "Any",
      smartSearchActive: true, 
      naturalLanguageQuery: smartFilterQuery 
    });
  };

  const handleApplyFilters = (filters: Filters) => {
    let count = 0;
    if (filters.priceRange[0] !== 5000 || filters.priceRange[1] !== 20000) count++; 
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.propertyType !== "Any") count++;
    if (filters.naturalLanguageQuery && filters.naturalLanguageQuery.trim() !== "") count++;
    setActiveFilterCount(count);
    setIsAiFiltersActive(filters.smartSearchActive || (filters.naturalLanguageQuery && filters.naturalLanguageQuery.trim() !== ""));
    
    const searchBarQueryInput = document.querySelector('input[aria-label="Search for properties"]') as HTMLInputElement;
    const queryToUse = filters.naturalLanguageQuery && filters.naturalLanguageQuery.trim() !== "" 
                       ? filters.naturalLanguageQuery
                       : (searchBarQueryInput ? searchBarQueryInput.value : "");

    handleSearch(queryToUse, currentSelectedCampus, filters);
  };


  return (
    <div className="container mx-auto px-4 py-12 md:py-16 relative">
      {/* Header Section */}
      <header className="mb-12 md:mb-16 text-center">
        <h1 className={cn(
          "text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight",
          "bg-gradient-to-r from-[#E78FB3] to-[#F9A826]", 
          "text-transparent bg-clip-text pb-2"
        )}>
          Find Your Perfect Student Housing
        </h1>
        <p className="text-lg sm:text-xl text-foreground max-w-3xl mx-auto section-subheader">
          Discover ideal accommodations with our AI-powered platform.
          Personalized recommendations and smart filters make your search easy.
        </p>
      </header>

      {/* AI Search Bar and Advanced Filters Section */}
      <div className="mb-10 md:mb-16 max-w-4xl mx-auto p-3 md:p-4 bg-card/50 border border-border/20 rounded-xl shadow-2xl focus-glow-accent">
          <AISearchBar 
            onSearchStart={handleSearchStart} 
            onSearch={handleSearchFromAISearchBar} 
            initialCampus={currentSelectedCampus}
            onCampusChange={setCurrentSelectedCampus}
          />
          <Accordion type="single" collapsible className="mt-3">
            <AccordionItem value="advanced-filters" className="border-none">
              <AccordionTrigger className="px-3 py-2.5 text-sm font-medium hover:no-underline hover:bg-primary/10 transition-colors rounded-md [&[data-state=open]]:bg-primary/15 [&[data-state=open]]:text-primary group">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4.5 w-4.5 text-primary group-hover:text-primary/80 group-data-[state=open]:text-primary" /> 
                         <span className="group-data-[state=open]:font-semibold">Advanced AI Filters</span>
                    </div>
                    {activeFilterCount > 0 && (
                        <Badge variant={isAiFiltersActive ? "default" : "secondary"} className={cn("ml-2 h-6 transition-all", isAiFiltersActive && "bg-gradient-to-r from-primary to-accent text-primary-foreground")}>
                           {isAiFiltersActive && <Sparkles className="h-3 w-3 mr-1"/>}
                           {activeFilterCount} {activeFilterCount === 1 ? "Filter" : "Filters"} Active
                        </Badge>
                    )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0 mt-1 border-t border-border/20 bg-transparent rounded-b-md data-[state=open]:animate-accordion-down-fast">
                 <AdvancedFilters onApplyFilters={handleApplyFilters} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      </div>


      {/* AI Recommendations Section */}
       <section className="mb-16 md:mb-20">
           <div className="flex items-center gap-3 mb-2">
             <Brain className="section-header-icon" /> 
             <h2 className="section-header">
               AI Curated Stays For You
             </h2>
           </div>
           <p className="section-subheader mb-6">
             Our AI analyzes your preferences and millions of data points to find accommodations that best suit your needs. The more you interact, the smarter it gets!
           </p>
            <Card className="mb-8 bg-primary/5 border-primary/20 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 shadow-lg">
                <Lightbulb className="h-10 w-10 md:h-12 md:w-12 text-primary flex-shrink-0" />
                <div>
                    <CardTitle className="text-lg text-primary mb-1">How Our AI Works</CardTitle>
                    <CardDescription className="text-sm text-foreground">
                        StudentStay's AI considers your search queries, liked properties, and common student needs (like proximity to campus features, study-friendly environments, and budget) to suggest the most relevant options. It learns from community trends and your interactions to refine recommendations over time.
                    </CardDescription>
                </div>
            </Card>
           {isRecommendationsLoading && <PropertyListSkeleton count={4} />}
           {!isRecommendationsLoading && recommendationError && (
             <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive-foreground">
               <ServerCrash className="h-5 w-5" />
               <AlertTitle className="font-semibold">Recommendation Error</AlertTitle>
               <AlertDescription>{recommendationError}</AlertDescription>
             </Alert>
           )}
           {!isRecommendationsLoading && !recommendationError && recommendedProperties.length === 0 && (
             <Alert className="bg-card border-border/50 text-card-foreground">
                <SearchX className="h-5 w-5 text-primary" /> 
                <AlertTitle className="font-semibold">No AI Recommendations Yet</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Try searching or interacting more for personalized suggestions. In the meantime, check out our general listings below.
                </AlertDescription>
            </Alert>
           )}
           {!isRecommendationsLoading && !recommendationError && recommendedProperties.length > 0 && (
             <PropertyList properties={recommendedProperties} />
           )}
       </section>

       <Separator className="my-16 md:my-20 bg-border/30"/>

       {/* Search Results Section */}
       <section className="mb-16 md:my-20">
           <div className="flex items-center gap-3 mb-2">
             <SearchX className="section-header-icon text-accent" />
             <h2 className="section-header !from-accent !via-primary !to-primary">
               {isLoading ? "Searching Listings..." : error ? "Search Update" : properties.length > 0 ? "Your Search Results" : "No Matches Found"}
             </h2>
           </div>
           <p className="section-subheader mb-6">
             {isLoading
               ? "Our AI is looking for the best matches based on your query."
               : error
               ? "There was an issue with your search."
               : properties.length > 0
               ? `Showing properties matching your criteria near ${currentSelectedCampus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}.`
               : "No properties found matching your current search and filter criteria. Try adjusting your search or filters, or explore our featured listings."}
           </p>

           {isLoading && <PropertyListSkeleton count={8} />}
           {!isLoading && error && (
             <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive-foreground">
               <ServerCrash className="h-5 w-5" />
               <AlertTitle className="font-semibold">Search Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
           )}
           {!isLoading && !error && properties.length === 0 && ( 
             <Alert className="bg-card border-border/50 text-card-foreground">
               <SearchX className="h-5 w-5 text-primary" />
               <AlertTitle className="font-semibold">No Matches Found</AlertTitle>
               <AlertDescription className="text-muted-foreground">
                 Try adjusting your search terms or filters. You can also explore our featured listings below.
               </AlertDescription>
             </Alert>
           )}
           {!isLoading && !error && properties.length > 0 && (
             <PropertyList properties={properties} />
           )}
         </section>
       
       {/* Fallback to Featured Listings if no active search AND no results/error */}
       {!isSearching && properties.length === 0 && !isLoading && !error && recommendedProperties.length === 0 && (
        <section className="mb-16 md:my-20">
             <div className="flex items-center gap-3 mb-2">
                <Star className="section-header-icon text-primary" />
                <h2 className="section-header">Featured Listings</h2>
            </div>
             <p className="section-subheader mb-6">
                Explore some of our top-rated and popular student accommodations.
            </p>
            <PropertyList properties={mapMockPropertiesToCardData(mockPropertiesWithAiFeatures.slice(0,8)).map(p => ({...p, matchScore: matchScores[p.id] || p.matchScore}))} />
         </section>
       )}


       <Separator className="my-16 md:my-20 bg-border/30"/>

       {/* Smart Filters / Trending Searches Section */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-7 w-7 text-accent section-header-icon" /> 
            <h2 className="section-header !from-accent !via-primary !to-primary">Smart Filters & Popular Searches</h2>
          </div>
          <p className="section-subheader mb-6">
             Quickly find what you're looking for with our popular AI-powered search presets.
           </p>
          <div className="flex flex-wrap gap-3">
            {smartFilters.map(filter => (
              <Button
                key={filter.label}
                variant="outline"
                className="bg-card/80 hover:bg-primary/10 hover:border-primary/60 border-border/50 text-foreground hover:text-primary py-2.5 px-4 text-sm rounded-lg shadow-sm focus-glow-primary"
                onClick={() => handleSmartFilterClick(filter.query)}
              >
                {filter.icon}
                {filter.label}
              </Button>
            ))}
             <Button
                variant="outline"
                className="bg-card/80 hover:bg-primary/10 hover:border-primary/60 border-border/50 text-foreground hover:text-primary py-2.5 px-4 text-sm rounded-lg shadow-sm focus-glow-primary"
                onClick={() => {
                  const trigger = document.querySelector('button[data-radix-collection-item][aria-controls^="radix-"][data-state]') as HTMLElement | null;
                  if (trigger) {
                    trigger.click();
                    const searchSection = trigger.closest('div.max-w-4xl.mx-auto');
                    searchSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  } else {
                    alert("Click 'Advanced AI Filters' above to expand/collapse.");
                  }
                }}
              >
                More Filters <FilterIcon className="ml-2 h-4 w-4"/>
              </Button>
          </div>
        </section>

       <Separator className="my-16 md:my-20 bg-border/30"/>

      {/* Recently Viewed Section (Placeholder) */}
      <section className="mb-16 md:my-20">
        <div className="flex items-center gap-3 mb-2">
          <History className="section-header-icon" />
          <h2 className="section-header">Recently Viewed</h2>
        </div>
        <p className="section-subheader mb-6">Properties you recently checked out will appear here for quick access.</p>
        <Alert className="bg-card/80 border-border/50 text-card-foreground">
            <History className="h-5 w-5 text-primary" /> 
            <AlertTitle className="font-semibold">Nothing Here Yet</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Start browsing properties, and your recently viewed items will show up here.
            </AlertDescription>
        </Alert>
      </section>

      <Separator className="my-16 md:my-20 bg-border/30"/>

      {/* Popular Neighborhoods Section (Placeholder) */}
      <section className="mb-16 md:my-20">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="section-header-icon" />
          <h2 className="section-header">Popular Neighborhoods</h2>
        </div>
        <p className="section-subheader mb-6">Discover student hotspots around campus.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['Knowledge Park III', 'Alpha II', 'Omega I', 'Gamma II', 'Swarn Nagri', 'Beta II', 'Delhi University Area', 'Kota Hostels', 'Mumbai PGs', 'Bangalore Student Housing', 'Pune University Area', 'Chennai Hostels'].map(hood => (
            <Card key={hood} className="p-4 hover:shadow-primary/20 cursor-pointer bg-card/80 transition-all hover:scale-105 border-border/40">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg text-center text-primary">{hood}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-center">
                <Button variant="link" size="sm" className="text-accent hover:text-accent/80">Explore Listings</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-16 md:my-20 bg-border/30"/>


      {/* Social Proof Section */}
      <section className="py-12 md:py-16 bg-card/50 rounded-xl border border-border/20 shadow-2xl">
        <div className="container mx-auto px-4 text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4 section-header-icon" /> 
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">Trusted by Students Like You</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our AI has successfully matched <span className="font-bold text-accent">10,000+</span> students with their ideal accommodations last semester! 
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <TestimonialCard
                    quote="The AI recommendations were spot on! Found a quiet place with great WiFi for my studies."
                    author="Priya S."
                    detail="B.Tech CSE Student"
                    avatarSeed="priya"
                />
                <TestimonialCard
                    quote="StudentStay made finding a PG near campus so easy. The smart filters saved me a lot of time."
                    author="Rahul M."
                    detail="MBA Student"
                    avatarSeed="rahul"
                />
                <TestimonialCard
                    quote="Loved the detailed property info and virtual tours. Matched with a great flatmate too!"
                    author="Aisha K."
                    detail="B.Design Student"
                    avatarSeed="aisha"
                />
            </div>
        </div>
      </section>

      <AIAssistantBubble />
    </div>
  );
}

