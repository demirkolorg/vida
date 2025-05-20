import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Column } from '@tanstack/react-table';

export const HeaderButton = ({ column, title }: { column: Column<any, unknown>; title: string }) => {
  return (
    <Button className="cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};
