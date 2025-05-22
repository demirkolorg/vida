import { cn } from '@/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';

export const ToolbarDigerAraclarButton = ({ isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen, title = 'Diğer Araçlar' }) => {
  return (
    <Collapsible
      open={isCollapsibleToolbarOpen}
      onOpenChange={setIsCollapsibleToolbarOpen}
      className="w-full" // Veya duruma göre farklı bir stil
    >
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 cursor-pointer">
          {title}
          <ChevronsUpDown className={cn('ml-2 h-4 w-4 transition-transform', isCollapsibleToolbarOpen && 'rotate-180')} />
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
};
