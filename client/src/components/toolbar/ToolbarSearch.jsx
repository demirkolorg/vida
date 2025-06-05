import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { XIcon } from 'lucide-react';

export const ToolbarSearch = props => {
  const { globalSearchTerm, onGlobalSearchChange, selectedRowCount, clearSelection } = props;

  const handleGlobalFilterChange = event => {
    onGlobalSearchChange(event.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      {selectedRowCount > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-0">
            <Button onClick={clearSelection} variant="" size={'icon'} className="h-8 rounded-r-none ">
              <XIcon /> 
            </Button>
            <Badge className="bg-primary/10 text-primary h-8 rounded-l-none">{selectedRowCount} satır seçildi </Badge>
          </div>
          <div className="flex items-center space-x-2">{/* Bulk action butonları buraya eklenebilir */}</div>
        </div>
      )}
      <div className="relative flex-grow sm:flex-grow-0">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={'Tabloda ara...'} value={globalSearchTerm} onChange={handleGlobalFilterChange} className="max-w-xs h-8 pl-8" aria-label="Global Search" />
      </div>
    </div>
  );
};
