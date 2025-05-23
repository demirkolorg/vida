export const handleAddNewFilter = ({ table, form, setIsEditMode, setEditingFilter, setShowSaveForm }) => {
    if (!table) {
        toast.error('Filtre kaydetmek için tablo referansı bulunamadı.');
        return;
    }
    const currentTableState = {
        columnFilters: table.getState().columnFilters,
        globalFilter: table.getState().globalFilter, // Bu, string veya gelişmiş filtre objesi olabilir
        sorting: table.getState().sorting,
    };
    if (currentTableState.columnFilters.length === 0 && !currentTableState.globalFilter && currentTableState.sorting.length === 0) {
        // toast.info('Kaydedilecek aktif bir filtre veya sıralama bulunmuyor. Yine de boş bir filtre kaydedebilirsiniz.');
    }

    setIsEditMode(false);
    setEditingFilter({ filterState: currentTableState }); // Sadece filterState'i ayarla
    form.reset({ filterName: '', description: '' }); // Formu temizle
    setShowSaveForm(true);
};