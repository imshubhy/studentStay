// src/components/search/AISearchBar.tsx
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Mic, MapPin as LocationIcon } from 'lucide-react';
// performAiSearch is no longer called directly from here
// import type { SemanticSearchOutput } from '@/ai/flows/semantic-search'; 
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AISearchBarProps {
  onSearchStart: () => void;
  onSearch: (query: string, campus: string) => void; // Changed from onResults
  initialCampus?: string; // To set initial campus from parent
  onCampusChange?: (campus: string) => void; // To notify parent of campus change
}

const sampleQueries = [
  'e.g., "cheap rooms with laundry and AC near Block A"',
  'e.g., "quiet apartments with good WiFi under ₹10000"',
  'e.g., "PG for girls, walking distance to StudentStay Gate 3"',
  'e.g., "studio with parking and power backup"',
];

export default function AISearchBar({ 
  onSearchStart, 
  onSearch, 
  initialCampus = "sharda_university",
  onCampusChange 
}: AISearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // This might be managed by parent now
  const [currentPlaceholder, setCurrentPlaceholder] = useState(sampleQueries[0]);
  const [selectedCampus, setSelectedCampus] = useState<string>(initialCampus);

  useEffect(() => {
    setSelectedCampus(initialCampus);
  }, [initialCampus]);

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % sampleQueries.length;
      setCurrentPlaceholder(sampleQueries[currentIndex]);
    }, 4000); 

    return () => clearInterval(intervalId);
  }, []);

  const handleCampusSelectionChange = (campus: string) => {
    setSelectedCampus(campus);
    if (onCampusChange) {
      onCampusChange(campus);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      // Optionally, call onSearch with empty query if parent needs to clear results
      // onSearch("", selectedCampus); 
      return;
    }
    // setIsLoading(true); // Parent (HomePage) will manage overall loading state
    onSearchStart(); // Notify parent that search process has started
    onSearch(query, selectedCampus); // Pass query and campus to parent
    // setIsLoading(false); // Parent will manage this
  };

  return (
    <div className="space-y-3">
      <form 
        onSubmit={handleSubmit} 
        className={cn(
          "flex gap-0 items-center w-full p-1.5 border border-input rounded-lg shadow-lg bg-card transition-all duration-300",
          "h-14",
          "input-ai-focus" 
        )}
      >
        <Search className="h-6 w-6 text-muted-foreground ml-3 mr-2 flex-shrink-0" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={currentPlaceholder}
          className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-base bg-transparent pl-0 h-full"
          aria-label="Search for properties"
        />
        <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary h-full w-12">
          <Mic className="h-5 w-5" />
          <span className="sr-only">Voice Search</span>
        </Button>
        <Button
          type="submit"
          disabled={isLoading} // isLoading could be a prop from parent if fine-grained control is needed here
          className={cn(
            "px-6 py-3 m-1 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 h-[calc(100%-0.5rem)] text-base relative overflow-hidden",
            "hover:shadow-[0_0_15px_2px_hsl(var(--accent)/0.5)] glow-accent" 
            )}
          aria-label="Perform AI Search"
        >
          {isLoading ? ( // isLoading here could be local to button or from parent
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="font-semibold">Search</span>
          )}
        </Button>
      </form>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground pl-1">
        <LocationIcon className="h-4 w-4 text-primary" /> 
        <span>Searching near:</span>
        <Select value={selectedCampus} onValueChange={handleCampusSelectionChange}>
          <SelectTrigger className="w-[200px] h-8 text-xs bg-input border-border/70 focus:ring-ring focus:border-primary">
            <SelectValue placeholder="Select Campus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sharda_university">Sharda University</SelectItem>
            <SelectItem value="gla_university">GLA University, Mathura</SelectItem>
            <SelectItem value="galgotias_university">Galgotias University</SelectItem>
            <SelectItem value="delhi_university_north">Delhi University (North)</SelectItem>
            <SelectItem value="delhi_university_south">Delhi University (South)</SelectItem>
            <SelectItem value="generic_area">Any Area (Generic)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}