import { ToolbarSearch } from '@/components/toolbar/ToolbarSearch';
import { ToolbarFacetedFilter } from '@/components/toolbar/ToolbarFacetedFilter';
import { ToolbarGeneral } from '@/components/toolbar/ToolbarGeneral';
import { ToolbarDigerAraclarContent } from '@/components/toolbar/ToolbarDigerAraclarContent';

export const ToolbarIndex = props => {
  const {
    table,
    globalSearchTerm,
    onGlobalSearchChange,
    facetedFilterSetup,
    data,
    moreButtonRendered,
    onRefresh,
    isLoading,
    hideNewButton,
    handleCreate,
    isCollapsibleToolbarOpen,
    setIsCollapsibleToolbarOpen,
    renderCollapsibleToolbarContent,
    entityType,
    displayStatusFilter,
    onToggleStatus,
    onClearAllFilters,
    isTableFiltered,selectedRowCount, clearSelection
  } = props;

  return (
    <div className="flex items-center py-4 gap-2 flex-wrap">
      <ToolbarSearch globalSearchTerm={globalSearchTerm} onGlobalSearchChange={onGlobalSearchChange} selectedRowCount={selectedRowCount} clearSelection={clearSelection} />

      <ToolbarFacetedFilter data={data} table={table} onClearAllFilters={onClearAllFilters} facetedFilterSetup={facetedFilterSetup}  isTableFiltered={isTableFiltered} />

      <ToolbarGeneral
        moreButtonRendered={moreButtonRendered}
        onRefresh={onRefresh}
        isLoading={isLoading}
        handleCreate={handleCreate}
        hideNewButton={hideNewButton}
        isCollapsibleToolbarOpen={isCollapsibleToolbarOpen}
        setIsCollapsibleToolbarOpen={setIsCollapsibleToolbarOpen}
      />

      <ToolbarDigerAraclarContent
        isCollapsibleToolbarOpen={isCollapsibleToolbarOpen}
        setIsCollapsibleToolbarOpen={setIsCollapsibleToolbarOpen}
        renderCollapsibleToolbarContent={renderCollapsibleToolbarContent}
        table={table}
        entityType={entityType}
        displayStatusFilter={displayStatusFilter}
        onToggleStatus={onToggleStatus}
         isTableFiltered={isTableFiltered}
      />
    </div>
  );
};
