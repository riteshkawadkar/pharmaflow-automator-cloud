import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface MasterDataLookupProps {
  type: string;
  value: string;
  onChange: (value: string, data?: any) => void;
  placeholder?: string;
}

export const MasterDataLookup: React.FC<MasterDataLookupProps> = ({
  type,
  value,
  onChange,
  placeholder
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  const handleSearch = () => {
    // Mock search functionality
    onChange(searchTerm);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleSearch}
        className="px-3"
      >
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
};