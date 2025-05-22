import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, DownloadIcon, EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportTableToExcel } from '@/lib/exportUtils';
import { EntityStatusOptions } from '@/constants/statusOptions';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const ToolbarDigerAraclarContent = props => {
  const { isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen, renderCollapsibleToolbarContent, table, entityType, displayStatusFilter, onToggleStatus } = props;
  return (
    <>
      {renderCollapsibleToolbarContent && (
        <Collapsible
          open={isCollapsibleToolbarOpen}
          onOpenChange={setIsCollapsibleToolbarOpen}
          className="w-full" // Veya duruma göre farklı bir stil
        >
          <CollapsibleContent className="">
            <div className="rounded-md flex items-center justify-end gap-2 mt-2">
              {renderCollapsibleToolbarContent()}

              <Button variant="outline" size="sm" className="h-8" onClick={() => exportTableToExcel(table, entityType)}>
                <DownloadIcon className="mr-2 h-4 w-4" /> Dışa Aktar (Excel)
              </Button>

              <Button variant="outline" size="sm" className="h-8 cursor-pointer" onClick={onToggleStatus}>
                <EyeIcon className="mr-2 h-4 w-4" />
                {displayStatusFilter === EntityStatusOptions.Aktif ? 'Pasif Kayıtları Göster' : 'Aktif Kayıtları Göster'}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 cursor-pointer">
                    Sütunlar <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sütunları Göster/Gizle</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => (
                      <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={value => column.toggleVisibility(!!value)}>
                        {/* Başlık olarak column.id kullanmak daha güvenilir olabilir */}
                        {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
};
