import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SpellCheck } from 'lucide-react';
import { FontSizeControls } from './FontSizeControls';

export const FontSizeMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-md h-8 w-8">
          <SpellCheck />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-1" >
        <FontSizeControls />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
