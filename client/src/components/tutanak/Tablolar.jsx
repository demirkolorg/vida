import { DemirbasMalzemeTablo } from './Demirbas';
import { SarfMalzemeTablo } from './Sarf';
import { MalzemeYok } from './MalzemeYok';

export const Tablolar = ({ malzemeler, demirbasMalzemeler, sarfMalzemeler }) => {
  return (
    <div className="mb-8">
      <div className="space-y-8">
        <DemirbasMalzemeTablo demirbasMalzemeler={demirbasMalzemeler} />
        <SarfMalzemeTablo sarfMalzemeler={sarfMalzemeler} />
        <MalzemeYok malzemeler={malzemeler} />
      </div>
    </div>
  );
};
