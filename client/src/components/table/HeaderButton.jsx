import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';

export const HeaderButton = ({ column, title }) => {
  return (
    <Button className="cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};