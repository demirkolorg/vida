// client/src/app/globalsearch/components/SearchResultItem.jsx - FINAL FIX
import React, { forwardRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getEntityConfig } from '../helpers/entityConfig';

export const SearchResultItem = forwardRef(({ item, entityType, onSelect, hasContextMenu = false, searchTerm = '', className, ...props }, ref) => {
  const config = getEntityConfig(entityType);
  const Icon = config.icon;

  // SORUN BURADA! onClick handler'ı context menu'yu engelliyor
  // Event handler'ları tamamen değiştir
  const handleMouseDown = e => {
    // Sadece sol tık için select işlemi yap
    if (e.button === 0) {
      // Sol tık
      // Context menu varsa, sol tıkla sadece select yap, context menu açık değilse
      onSelect?.(item, entityType);
    }
    // Sağ tık (button === 2) için hiçbir şey yapma, Radix halletsin
  };

  // Context menu için özel handler
  const handleContextMenu = e => {
    // Bu event'i durdurmayalım, Radix'e bıraka
    // e.preventDefault(); // BUNU YAPMAYIN!
    // e.stopPropagation(); // BUNU DA YAPMAYIN!
  };

  const highlightText = text => {
    if (!text || !searchTerm) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const renderItemContent = () => {
    switch (entityType) {
      case 'personel':
        return (
          <div className="flex items-center gap-3">
            {item.avatar && <img src={item.avatar} alt={`${item.ad} ${item.soyad}`} className="w-8 h-8 rounded-full object-cover" />}
            <div className="space-y-1 flex-1">
              <div className="font-medium">{highlightText(`${item.ad || ''} ${item.soyad || ''}`.trim())}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Sicil: {highlightText(item.sicil)}</span>
                <Badge variant="outline" className="text-xs">
                  {item.role || 'Personel'}
                </Badge>
              </div>
              {item.buro && (
                <div className="text-xs text-muted-foreground">
                  {item.buro.ad}
                  {item.buro.sube && ` - ${item.buro.sube.ad}`}
                  {item.buro.sube?.birim && ` (${item.buro.sube.birim.ad})`}
                </div>
              )}
            </div>
          </div>
        );

      case 'malzeme':
        return (
          <div className="space-y-1">
            <div className="font-medium">{highlightText(item.vidaNo || item.kod)}</div>
            {item.aciklama && <div className="text-sm text-muted-foreground">{highlightText(item.aciklama)}</div>}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {item.marka && <span>{highlightText(item.marka.ad)}</span>}
              {item.model && <span>{highlightText(item.model.ad)}</span>}
              <Badge variant="outline" className="text-xs">
                {item.status || 'Aktif'}
              </Badge>
              {item.malzemeTipi && (
                <Badge variant="secondary" className="text-xs">
                  {item.malzemeTipi}
                </Badge>
              )}
            </div>
            {/* Son hareket bilgisi */}
            {item.malzemeHareketleri && item.malzemeHareketleri.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Son: {item.malzemeHareketleri[0].hareketTuru}
                {item.malzemeHareketleri[0].hedefPersonel && ` → ${item.malzemeHareketleri[0].hedefPersonel.ad}`}
                {item.malzemeHareketleri[0].hedefKonum && ` → ${item.malzemeHareketleri[0].hedefKonum.ad}`}
              </div>
            )}
          </div>
        );

      case 'tutanak':
        return (
          <div className="space-y-1">
            <div className="font-medium">{highlightText(item.baslik || item.ad || 'Tutanak')}</div>
            {item.aciklama && <div className="text-sm text-muted-foreground">{highlightText(item.aciklama)}</div>}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {new Date(item.tarih || item.olusturmaTarihi).toLocaleDateString('tr-TR')}
              </Badge>
              {item.tip && (
                <Badge variant="secondary" className="text-xs">
                  {item.tip}
                </Badge>
              )}
              {item.status && (
                <Badge variant={item.status === 'Onaylandı' ? 'default' : 'outline'} className="text-xs">
                  {item.status}
                </Badge>
              )}
            </div>
            {item.katilimcilar && item.katilimcilar.length > 0 && <div className="text-xs text-muted-foreground">Katılımcılar: {item.katilimcilar.length} kişi</div>}
            {item.olusturan && (
              <div className="text-xs text-muted-foreground">
                Oluşturan: {item.olusturan.ad} {item.olusturan.soyad}
              </div>
            )}
          </div>
        );

      case 'malzemeHareket':
        return (
          <div className="space-y-1">
            <div className="font-medium">{item.malzeme?.vidaNo || 'Hareket Kaydı'}</div>
            <div className="text-sm text-muted-foreground">
              {item.hareketTuru} - {item.malzemeKondisyonu}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {new Date(item.islemTarihi).toLocaleDateString('tr-TR')}
              </Badge>
              {item.kaynakPersonel && (
                <span>
                  → {item.kaynakPersonel?.ad} {item.kaynakPersonel?.soyad}
                </span>
              )}
              {item.kaynakKonum && <span>→ {item.kaynakKonum?.ad}</span>}
              {item.hedefPersonel && (
                <span>
                  → {item.hedefPersonel.ad} {item.hedefPersonel.soyad}
                </span>
              )}
              {item.hedefKonum && <span>→ {item.hedefKonum.ad}</span>}
            </div>
            {item.aciklama && <div className="text-xs text-muted-foreground">{highlightText(item.aciklama)}</div>}
          </div>
        );

      case 'birim':
        return (
          <div className="space-y-1">
            <div className="font-medium">{highlightText(item.ad)}</div>
            {item.aciklama && <div className="text-sm text-muted-foreground">{highlightText(item.aciklama)}</div>}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {item.status || 'Aktif'}
              </Badge>
              {(item.subeler?.length || 0) > 0 && <span>{item.subeler.length} şube</span>}
              {(item.malzemeler?.length || 0) > 0 && <span>{item.malzemeler.length} malzeme</span>}
            </div>
          </div>
        );
     
        case 'sube':
        return (
          <div className="space-y-1">
            <div className="font-medium">{highlightText(item.ad)}</div>
            {item.aciklama && <div className="text-sm text-muted-foreground">{highlightText(item.aciklama)}</div>}
            {item.birim && <div className="text-xs text-muted-foreground">Birim: {highlightText(item.birim.ad)}</div>}
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            <div className="font-medium">{highlightText(item.ad || item.name || item.id)}</div>
            {item.aciklama && <div className="text-sm text-muted-foreground">{highlightText(item.aciklama)}</div>}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {item.status && (
                <Badge variant="outline" className="text-xs">
                  {item.status}
                </Badge>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-start gap-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors border-b border-border/50 last:border-b-0',
        hasContextMenu && 'select-none', // Context menu için text selection'ı kapat
        className,
      )}
      onMouseDown={handleMouseDown} // onClick yerine onMouseDown kullan
      onContextMenu={handleContextMenu} // Context menu event'ini logla ama durdurum
      {...props}
    >
      <Icon className={cn('h-5 w-5 mt-0.5', config.color)} />
      <div className="flex-1 min-w-0">{renderItemContent()}</div>
      {/* Debug indicator */}
      {hasContextMenu && <div className="text-xs bg-green-100 text-green-700 px-1 rounded">R-CLICK</div>}
    </div>
  );
});

SearchResultItem.displayName = 'SearchResultItem';
