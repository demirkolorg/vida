import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, DownloadIcon, EyeIcon, Table2, FileTextIcon, SlidersHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportTableToExcel, exportTableToTxt } from '@/lib/exportUtils';
import { EntityStatusOptions } from '@/constants/statusOptions';
import { DropdownMenu, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSheetStore } from '@/stores/sheetStore'; // Zaten kullanıyorsunuz


export const ToolbarDigerAraclarContent = props => {
  const { isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen, renderCollapsibleToolbarContent, table, entityType, displayStatusFilter, onToggleStatus } = props;

const openSheet = useSheetStore(state => state.openSheet);

const handleOpenFilterSheet = () => {
  // Yeni bir sheet tipi tanımlayacağız: 'filterManagement'
  // Bu sheet'e tablo instance'ını ve entityType'ı prop olarak geçebiliriz.
  openSheet('filterManagement', { table, entityType }, entityType, {
    title: `${entityType} İçin Kayıtlı Filtreler`, // Sheet başlığı
    size: 'lg', // veya 'md', 'sm'
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




               <Button variant="outline" size="sm" onClick={handleOpenFilterSheet} className="h-8">
            <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
            Filtreleri Yönet
          </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Dışa Aktar
                    {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end"> {/* Menünün butonun sağına hizalanması için */}
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

              <Button variant="outline" size="sm" className="h-8 cursor-pointer" onClick={onToggleStatus}>
                <EyeIcon className="mr-2 h-4 w-4" />
                {displayStatusFilter === EntityStatusOptions.Aktif ? 'Pasif Kayıtlar' : 'Aktif Kayıtlar'}
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
