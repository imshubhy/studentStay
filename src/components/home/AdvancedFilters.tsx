// src/components/home/AdvancedFilters.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Bed, Bath, Wifi, SearchCode, Lightbulb, MapPin, SlidersHorizontal, Sparkles, X, Building, Home, Filter as FilterIcon } from "lucide-react"; // Added Home
import { cn } from '@/lib/utils';
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface Filters {
  priceRange: [number, number];
  amenities: string[];
  propertyType: string;
  smartSearchActive: boolean;
  naturalLanguageQuery?: string; // Added for active filters display
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: Filters) => void;
}

const availableAmenities = [
  { id: "wifi", label: "WiFi", icon: <Wifi className="h-4 w-4" /> },
  { id: "kitchen", label: "Kitchen", icon: <DollarSign className="h-4 w-4" /> }, // Placeholder, needs Utensils
  { id: "ac", label: "AC", icon: <Sparkles className="h-4 w-4" /> },
  { id: "laundry", label: "Laundry", icon: <Sparkles className="h-4 w-4" /> },
  { id: "parking", label: "Parking", icon: <Sparkles className="h-4 w-4" /> },
  { id: "gym", label: "Gym", icon: <Sparkles className="h-4 w-4" /> },
];
const propertyTypes = [
  { id: "Apartment", label: "Apartment", icon: <Building className="h-4 w-4" /> },
  { id: "PG", label: "PG / Hostel", icon: <Bed className="h-4 w-4" /> },
  { id: "Room", label: "Private Room", icon: <Bed className="h-4 w-4" /> },
  { id: "House", label: "Full House", icon: <Home className="h-4 w-4" /> } // Used Home from lucide-react
];


export default function AdvancedFilters({ onApplyFilters }: AdvancedFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([5000, 20000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("Any");
  const [smartSearchActive, setSmartSearchActive] = useState<boolean>(true);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>("");

  const [activeFilters, setActiveFilters] = useState<Partial<Filters>>({});

  useEffect(() => {
    // Update activeFilters whenever a filter state changes
    // This is a simplified representation; more complex logic might be needed for NLQ
    const currentActive: Partial<Filters> = {};
    if (priceRange[0] !== 5000 || priceRange[1] !== 20000) {
      currentActive.priceRange = priceRange;
    }
    if (selectedAmenities.length > 0) {
      currentActive.amenities = selectedAmenities;
    }
    if (selectedPropertyType !== "Any") {
      currentActive.propertyType = selectedPropertyType;
    }
    if (naturalLanguageQuery.trim() !== "") {
        currentActive.naturalLanguageQuery = naturalLanguageQuery;
    }
    if (smartSearchActive) { // Or based on a specific condition for AI filters
        // You might want a specific flag for this in activeFilters
    }
    setActiveFilters(currentActive);
  }, [priceRange, selectedAmenities, selectedPropertyType, naturalLanguageQuery, smartSearchActive]);


  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId) ? prev.filter(a => a !== amenityId) : [...prev, amenityId]
    );
  };

  const handleSubmit = () => {
    onApplyFilters({
      priceRange: priceRange,
      amenities: selectedAmenities,
      propertyType: selectedPropertyType,
      smartSearchActive: smartSearchActive,
      naturalLanguageQuery: naturalLanguageQuery,
    });
  };
  
  const clearFilter = (filterKey: keyof Filters) => {
    if (filterKey === 'priceRange') setPriceRange([5000, 20000]);
    else if (filterKey === 'amenities') setSelectedAmenities([]);
    else if (filterKey === 'propertyType') setSelectedPropertyType("Any");
    else if (filterKey === 'naturalLanguageQuery') setNaturalLanguageQuery("");
  };


  return (
    <TooltipProvider>
    <div className="space-y-6 p-4 md:p-5 bg-card/60 border border-border/30 rounded-xl shadow-xl backdrop-blur-sm">
      
      {/* Active Filters Display */}
       {Object.keys(activeFilters).length > 0 && (
        <div className="pb-2 border-b border-border/20">
            <div className="flex items-center justify-between mb-2">
                 <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                    <FilterIcon className="h-4 w-4 mr-1.5 text-primary"/>
                    Active Filters:
                 </h4>
                 <Button variant="link" size="sm" className="text-xs text-accent hover:text-accent/80 p-0 h-auto" onClick={() => {
                     setPriceRange([5000, 20000]);
                     setSelectedAmenities([]);
                     setSelectedPropertyType("Any");
                     setNaturalLanguageQuery("");
                 }}>Clear All</Button>
            </div>
           
            <div className="flex flex-wrap gap-2">
                {activeFilters.priceRange && (
                    <Badge variant="outline" className="filter-chip group">
                        Price: ₹{activeFilters.priceRange[0]}-₹{activeFilters.priceRange[1]}
                        <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100" onClick={() => clearFilter('priceRange')}><X className="h-3 w-3"/></Button>
                    </Badge>
                )}
                {activeFilters.propertyType && (
                     <Badge variant="outline" className="filter-chip group">
                        Type: {activeFilters.propertyType}
                        <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100" onClick={() => clearFilter('propertyType')}><X className="h-3 w-3"/></Button>
                    </Badge>
                )}
                {activeFilters.amenities?.map(amenity => (
                    <Badge key={amenity} variant="outline" className="filter-chip group capitalize">
                        {amenity}
                         <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100" onClick={() => setSelectedAmenities(prev => prev.filter(a => a !== amenity))}><X className="h-3 w-3"/></Button>
                    </Badge>
                ))}
                 {activeFilters.naturalLanguageQuery && (
                    <Badge variant="outline" className="filter-chip filter-chip-ai group">
                        <Lightbulb className="h-3 w-3 mr-1"/> {activeFilters.naturalLanguageQuery.substring(0,20)}...
                        <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100" onClick={() => clearFilter('naturalLanguageQuery')}><X className="h-3 w-3"/></Button>
                    </Badge>
                )}
            </div>
        </div>
      )}


      {/* Quick Filters Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center">
          <SlidersHorizontal className="mr-2 h-5 w-5 text-primary/80"/>
          Quick Filters
        </h3>
        
        {/* Price Range */}
        <div>
          <Label htmlFor="price-range-slider" className="text-sm font-medium text-muted-foreground mb-1.5 block">
            Price Range (₹ per month)
          </Label>
          <Slider
            id="price-range-slider"
            min={1000}
            max={50000}
            step={500}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="my-3 [&>span>span]:bg-gradient-to-r [&>span>span]:from-primary [&>span>span]:to-accent" // Gradient track
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Property Type</Label>
          <RadioGroup
            value={selectedPropertyType}
            onValueChange={setSelectedPropertyType}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {[{id: "Any", label: "Any", icon: <FilterIcon className="h-4 w-4"/>}, ...propertyTypes].map(type => (
              <Label
                key={type.id}
                htmlFor={`type-${type.id}`}
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 border rounded-md cursor-pointer transition-all",
                  "bg-input/30 border-border/50 hover:bg-primary/10 hover:border-primary",
                  selectedPropertyType === type.id && "bg-primary/20 border-primary ring-2 ring-primary/70 text-primary"
                )}
              >
                <RadioGroupItem value={type.id} id={`type-${type.id}`} className="sr-only" />
                {React.cloneElement(type.icon, { className: cn("h-5 w-5 mb-1", selectedPropertyType === type.id ? "text-primary" : "text-muted-foreground") })}
                <span className="text-xs font-medium">{type.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* AI-Powered Search Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-accent"/>
          AI-Driven Search
        </h3>

        {/* Natural Language Filtering */}
        <div className="space-y-1.5">
          <Label htmlFor="natural-language-query-input" className="text-sm font-medium text-muted-foreground">
            Describe what you're looking for...
          </Label>
          <div className="relative">
            <Lightbulb className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent/80 pointer-events-none" />
            <Input
              id="natural-language-query-input"
              type="text"
              placeholder="e.g., quiet studio near library with AC"
              value={naturalLanguageQuery}
              onChange={(e) => setNaturalLanguageQuery(e.target.value)}
              className="pl-10 bg-input border-border/70 focus:border-accent focus-visible:ring-accent/50"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">Key Amenities</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {availableAmenities.map(amenity => (
              <div key={amenity.id} className="flex items-center space-x-2 p-2 bg-input/30 rounded-md border border-transparent hover:border-primary/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary/70 transition-all">
                <Checkbox
                  id={`amenity-${amenity.id}`}
                  checked={selectedAmenities.includes(amenity.id)}
                  onCheckedChange={() => handleAmenityChange(amenity.id)}
                  className="border-muted-foreground/50 data-[state=checked]:border-primary"
                />
                <Label htmlFor={`amenity-${amenity.id}`} className="text-xs font-normal text-foreground flex items-center gap-1.5 cursor-pointer">
                  {React.cloneElement(amenity.icon, { className: "h-3.5 w-3.5 text-primary/90"})} 
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Smart Search Toggle */}
        <div className="flex items-center justify-between space-x-2 pt-2">
            <div className="flex items-center gap-1.5">
                <Label htmlFor="smart-search-toggle" className="text-sm font-medium text-muted-foreground">
                    AI Smart Search
                </Label>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <Sparkles className="h-4 w-4 text-accent cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                        <p>Enhances your search with contextual understanding and learning from your preferences.</p>
                    </TooltipContent>
                </Tooltip>
            </div>
          <ToggleGroup
            id="smart-search-toggle"
            type="single"
            variant="outline"
            value={smartSearchActive ? "smart" : "basic"}
            onValueChange={(value) => { if(value) setSmartSearchActive(value === "smart")}}
            className="grid grid-cols-2 gap-0 p-0.5 border border-input rounded-md bg-background w-auto h-9"
          >
            <ToggleGroupItem value="smart" aria-label="Smart Search" className="px-3 text-xs data-[state=on]:bg-primary/20 data-[state=on]:text-primary data-[state=on]:shadow-inner h-full">
              Active
            </ToggleGroupItem>
            <ToggleGroupItem value="basic" aria-label="Basic Search" className="px-3 text-xs data-[state=on]:bg-muted/50 data-[state=on]:text-muted-foreground h-full">
              Basic
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {/* Placeholder for "Suggested for you" */}
        <div className="pt-2">
            <p className="text-xs text-muted-foreground/80 italic text-center">
                AI will learn and suggest filters as you browse!
            </p>
        </div>

      </div>

      <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-base py-3 shadow-lg hover:shadow-xl transition-all duration-300">
        <SearchCode className="mr-2 h-5 w-5"/>Apply AI Filters
      </Button>
    </div>
    </TooltipProvider>
  );
}

