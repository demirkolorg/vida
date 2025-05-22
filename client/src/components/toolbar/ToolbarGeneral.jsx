import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/general/Spinner';
import { Plus, RefreshCw } from 'lucide-react';
import { ToolbarDigerAraclarButton } from '@/components/toolbar/ToolbarDigerAraclarButton';

export const ToolbarGeneral = props => {
  const { moreButtonRendered, onRefresh, isLoading, hideNewButton,handleCreate, isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen } = props;
  return (
    <div className="flex items-center gap-2 ml-auto">
      {moreButtonRendered}
      {onRefresh && ( // onRefresh varsa butonu göster
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading} aria-label="Verileri Yenile" className="h-8 cursor-pointer">
          {isLoading ? <Spinner size={'small'} className="h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Yenile
        </Button>
      )}
      {!hideNewButton && (
        <Button variant="outline" size="sm" className="h-8 cursor-pointer" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" /> Yeni Ekle
        </Button>
      )}

      <ToolbarDigerAraclarButton isCollapsibleToolbarOpen={isCollapsibleToolbarOpen} setIsCollapsibleToolbarOpen={setIsCollapsibleToolbarOpen} />
    </div>
  );
};
