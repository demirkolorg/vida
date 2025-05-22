import { ToolbarSearch } from "@/components/toolbar/ToolbarSearch";
import { ToolbarFacetedFilter } from "@/components/toolbar/ToolbarFacetedFilter";
import { ToolbarGeneral } from "@/components/toolbar/ToolbarGeneral";
import { ToolbarDigerAraclarContent } from "@/components/toolbar/ToolbarDigerAraclarContent";

export const ToolbarIndex = props => {
  const {
    table,
    setGlobalFilter,
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
    renderCollapsibleToolbarContent,
    entityType,
    displayStatusFilter,
    onToggleStatus,
  } = props;

  return (
    <div className="flex items-center py-4 gap-2 flex-wrap">
      <ToolbarSearch globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

      <ToolbarFacetedFilter data={data} table={table} setGlobalFilter={setGlobalFilter} facetedFilterSetup={facetedFilterSetup} />

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
