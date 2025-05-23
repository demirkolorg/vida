import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const ToolbarSearch = props => {
  const { globalSearchTerm, onGlobalSearchChange } = props;

    const handleGlobalFilterChange = event => {
    onGlobalSearchChange(event.target.value);
  };


  return (
    <div className="relative flex-grow sm:flex-grow-0">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder={'Tabloda ara...'} value={globalSearchTerm} onChange={handleGlobalFilterChange} className="max-w-xs h-8 pl-8" aria-label="Global Search" />
    </div>
  );
};
