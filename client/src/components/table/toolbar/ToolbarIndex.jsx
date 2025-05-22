import { ToolbarSearch } from "@/components/table/toolbar/ToolbarSearch";
import { ToolbarFacetedFilter } from "@/components/table/toolbar/ToolbarFacetedFilter";
import { ToolbarGeneral } from "@/components/table/toolbar/ToolbarGeneral";
import { ToolbarDigerAraclarContent } from "@/components/table/toolbar/ToolbarDigerAraclarContent";

export const ToolbarIndex = props => {
  const {
    table,
    setGlobalFilter,
    isFiltered,
    facetedFilterSetup,
    data,
    moreButtonRendered,
    onRefresh,
    isLoading,
    hideNewButton,
    handleCreate,
    isCollapsibleToolbarOpen,
    setIsCollapsibleToolbarOpen,
    globalFilter,
    handleGlobalFilterChange,
    globalFilterPlaceholder,
    renderCollapsibleToolbarContent,
    entityType,
    displayStatusFilter,
    onToggleStatus,
  } = props;

  return (
    <div className="flex items-center py-4 gap-2 flex-wrap">
      <ToolbarSearch globalFilter={globalFilter} handleGlobalFilterChange={handleGlobalFilterChange} globalFilterPlaceholder={globalFilterPlaceholder} />

      <ToolbarFacetedFilter data={data} table={table} setGlobalFilter={setGlobalFilter} facetedFilterSetup={facetedFilterSetup} isFiltered={isFiltered} />

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
      />
    </div>
  );
};
