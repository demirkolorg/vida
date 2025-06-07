// src/app/malzemehareket/modals/BulkDevirValidationModal.jsx
'use client';

import { AlertTriangle, User, Package, XCircle, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function BulkDevirValidationModal({ 
  isOpen, 
  onClose, 
  onProceed, 
  validationResult 
}) {
  if (!validationResult) return null;

  const { isValid, errorType, errorMessage, validPersonel, invalidPersoneller, validMalzemeler, invalidMalzemeler } = validationResult;

  if (isValid) {
    // Eğer geçerliyse, doğrudan proceed et ve modal gösterme
    return null;
  }

  const renderPersonelMalzemeler = (personel, malzemeler, isValid = true) => (
    <Card key={personel.id} className={`${!isValid ? 'border-destructive bg-destructive/5' : 'border-success bg-success/5'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className={`h-4 w-4 ${!isValid ? 'text-destructive' : 'text-success'}`} />
            <CardTitle className="text-sm font-medium">{personel.ad}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {personel.sicil}
            </Badge>
          </div>
          <Badge variant={!isValid ? 'destructive' : 'success'} className="text-xs">
            {malzemeler.length} malzeme
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {malzemeler.slice(0, 3).map((malzeme) => (
            <div key={malzeme.id} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Package className="h-3 w-3" />
              <span>{malzeme.vidaNo || `ID: ${malzeme.id}`}</span>
              {malzeme.sabitKodu?.ad && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {malzeme.sabitKodu.ad}
                </Badge>
              )}
            </div>
          ))}
          {malzemeler.length > 3 && (
            <div className="text-xs text-muted-foreground italic">
              ... ve {malzemeler.length - 3} malzeme daha
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Toplu Devir İşlemi - Doğrulama Hatası
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="space-y-4">
            {/* Hata Mesajı */}
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-destructive mb-1">İşlem Gerçekleştirilemez</p>
                    <p className="text-sm text-muted-foreground">{errorMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kural Açıklaması */}
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <ArrowRightLeft className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Toplu Devir Kuralı</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Toplu devir işleminde seçilen tüm malzemeler aynı personelde zimmetli olmalıdır. 
                      Farklı personellerin malzemelerini aynı anda devir edemezsiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detaylı Durum */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Geçerli Personel ve Malzemeler */}
              {validPersonel && validMalzemeler && validMalzemeler.length > 0 && (
                <div>
                  <h4 className="font-medium text-success mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Geçerli Personel ({validMalzemeler.length} malzeme)
                  </h4>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {renderPersonelMalzemeler(validPersonel, validMalzemeler, true)}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Geçersiz Personeller ve Malzemeler */}
              {invalidPersoneller && invalidPersoneller.length > 0 && (
                <div>
                  <h4 className="font-medium text-destructive mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Çakışan Personeller ({invalidMalzemeler?.length || 0} malzeme)
                  </h4>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {invalidPersoneller.map((data) => 
                        renderPersonelMalzemeler(data.personel, data.malzemeler, false)
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Öneriler */}
            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
              <CardContent className="pt-4">
                <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Öneriler:</h5>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                  <li>Sadece aynı personele ait malzemeleri seçerek tekrar deneyin</li>
                  <li>Farklı personellerin malzemelerini ayrı ayrı devir işlemlerine tabi tutun</li>
                  <li>Malzeme seçimini gözden geçirin ve gereksiz seçimleri kaldırın</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Anladım, Seçimi Gözden Geçir
          </Button>
          {validPersonel && validMalzemeler && validMalzemeler.length > 0 && (
            <Button 
              onClick={() => onProceed(validMalzemeler)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sadece {validPersonel.ad} Malzemelerini Devret ({validMalzemeler.length})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}