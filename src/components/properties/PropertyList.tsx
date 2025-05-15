import PropertyCard from './PropertyCard';
import type { PropertyCardData } from '@/lib/types';

interface PropertyListProps {
  properties: PropertyCardData[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return null; // Handled by parent component (HomePage)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
}
