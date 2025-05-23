import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, DownloadIcon, EyeIcon, Table2, FileTextIcon, ListFilter,SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportTableToExcel, exportTableToTxt } from '@/lib/exportUtils';
import { EntityStatusOptions } from '@/constants/statusOptions';
import { DropdownMenu, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSheetStore } from '@/stores/sheetStore'; // Zaten kullanıyorsunuz

export const ToolbarDigerAraclarContent = props => {
  const { isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen, renderCollapsibleToolbarContent, table, entityType, displayStatusFilter, onToggleStatus } = props;

  const openSheet = useSheetStore(state => state.openSheet);

  const handleOpenFilterSheet = () => {
    openSheet('filterManagement', { table, entityType }, entityType, {
      title: `${entityType} İçin Kayıtlı Filtreler`, // Sheet başlığı
      size: 'lg',
    });
  };

  const handleOpenAdvencedSheet = () => {
    openSheet('advancedFilter', { table, entityType }, entityType, {
      title: `${entityType} İçin Kayıtlı Filtreler`,
      size: 'lg',
    });
  };
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <DownloadIcon className="mr-2 h-4 w-4 " />
                    Filtre İşlemleri <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                   <DropdownMenuItem onClick={handleOpenFilterSheet}>
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filtreleri Yönet
                  </DropdownMenuItem>
                   <DropdownMenuItem onClick={handleOpenAdvencedSheet}>
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Gelişmiş Filtre Oluştur
                  </DropdownMenuItem>
                
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <DownloadIcon className="mr-2 h-4 w-4 " />
                    Dışa Aktar
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {' '}
                  {/* Menünün butonun sağına hizalanması için */}
                  <DropdownMenuItem onClick={() => exportTableToExcel(table, entityType)}>
                    <Table2 className="mr-2 h-4 w-4" /> {/* Excel ikonu */}
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportTableToTxt(table, entityType)}>
                    <FileTextIcon className="mr-2 h-4 w-4" /> {/* TXT ikonu */}
                    Metin (.txt)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="h-8 " onClick={onToggleStatus}>
                <EyeIcon className="mr-2 h-4 w-4" />
                {displayStatusFilter === EntityStatusOptions.Aktif ? 'Pasif Kayıtlar' : 'Aktif Kayıtlar'}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 ">
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
