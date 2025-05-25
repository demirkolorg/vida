import { Badge } from "@/components/ui/badge"
import { EntityStatusOptions } from '@/constants/statusOptions';
import { useMemo } from 'react';

export const PageHeader = ({ useEntityStore, EntityHuman, center, right }) => {
    const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);
  
  const title = useMemo(
    () => (
      <p className="border-b-3 border-b-primary/50  flex items-center">
        {EntityHuman} Listesi 
        {/* <strong className="text-3xl text-primary">.</strong> */}
        {displayStatusFilter === EntityStatusOptions.Pasif && (
          <Badge className="text-xl ml-2 mb-2" variant="destructive">
            Pasif Kayıtlar
          </Badge>
        )}
      </p>
    ),
    [displayStatusFilter, EntityHuman],
  );

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 rounded-md ">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
      <div className="">{center}</div>
      <div className="">{right}</div>
    </div>
  );
};
