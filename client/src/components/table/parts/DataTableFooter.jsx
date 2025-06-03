import { Badge } from '@/components/ui/badge';
import { Table, TableCell, TableRow } from '@/components/ui/table';

export function DataTableFooter({ summarySetup, allSummaries, visibleColumnsCount }) {
  // Eğer summary setup yoksa veya summary data yoksa footer'ı render etme
  if (!summarySetup || summarySetup.length === 0 || !allSummaries || Object.keys(allSummaries).length === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-0 z-20 bg-background border-t">
      <Table className="w-full table-fixed">
        <tfoot>
          <TableRow className="border-t-1 border-b-0 h-11 bg-primary-foreground">
            <TableCell colSpan={visibleColumnsCount} className="p-2 text-left space-y-1">
              <div className="flex gap-10 mx-5">
                {Object.values(allSummaries).map(summaryGroup => (
                  <div key={summaryGroup.title} className="flex items-center flex-wrap gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold text-muted-foreground mr-1">
                      {summaryGroup.title}
                    </span>
                    {summaryGroup.items.map(({ key, count }) => (
                      <Badge key={key} variant="secondary" className="whitespace-nowrap">
                        {key}:<span className="font-bold ml-1">{count}</span>
                      </Badge>
                    ))}
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        </tfoot>
      </Table>
    </div>
  );
}