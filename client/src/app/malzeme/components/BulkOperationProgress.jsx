// client/src/app/malzeme/components/BulkOperationProgress.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  AlertCircle,
  Eye,
  Download,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MalzemeHareket_Store 
} from '@/app/malzemehareket/constants/store';
import { 
  BULK_OPERATION_STATUS, 
  BULK_OPERATION_TYPE_LABELS, 
  BULK_OPERATION_STATUS_LABELS, 
  BULK_OPERATION_STATUS_COLORS 
} from '@/app/malzemehareket/constants/api';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const BulkOperationProgress = () => {
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [selectedOperationResults, setSelectedOperationResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

  // Store states
  const activeBulkOperations = MalzemeHareket_Store(state => state.activeBulkOperations);
  const bulkOperationProgress = MalzemeHareket_Store(state => state.bulkOperationProgress);
  const bulkOperations = MalzemeHareket_Store(state => state.bulkOperations);
  const loadingBulkOperations = MalzemeHareket_Store(state => state.loadingBulkOperations);
  
  // Store actions
  const getUserBulkOperations = MalzemeHareket_Store(state => state.getUserBulkOperations);
  const getBulkOperationResults = MalzemeHareket_Store(state => state.getBulkOperationResults);
  const stopBulkOperationPolling = MalzemeHareket_Store(state => state.stopBulkOperationPolling);

  // Component mount'ta bulk işlemleri yükle
  useEffect(() => {
    getUserBulkOperations();
  }, [getUserBulkOperations]);

  const getStatusIcon = (status) => {
    switch (status) {
      case BULK_OPERATION_STATUS.PENDING:
        return <Clock className="h-4 w-4" />;
      case BULK_OPERATION_STATUS.PROCESSING:
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case BULK_OPERATION_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case BULK_OPERATION_STATUS.FAILED:
        return <XCircle className="h-4 w-4" />;
      case BULK_OPERATION_STATUS.CANCELLED:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewResults = async (operationId) => {
    setLoadingResults(true);
    try {
      const results = await getBulkOperationResults(operationId);
      setSelectedOperationResults(results);
      setShowResultsDialog(true);
    } catch (error) {
      console.error('Sonuçlar yüklenirken hata:', error);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleStopPolling = (operationId) => {
    stopBulkOperationPolling(operationId);
  };

  // Aktif işlemler (polling edilen)
  const activeOperationsArray = Array.from(activeBulkOperations.entries()).map(([id, status]) => ({
    operationId: id,
    status: status,
    isActive: true
  }));

  // Tamamlanmış işlemler (son 10)
  const recentOperations = bulkOperations
    ?.filter(op => [BULK_OPERATION_STATUS.COMPLETED, BULK_OPERATION_STATUS.FAILED].includes(op.status))
    ?.slice(0, 10) || [];

  const hasActiveOperations = activeOperationsArray.length > 0;
  const hasRecentOperations = recentOperations.length > 0;

  if (!hasActiveOperations && !hasRecentOperations) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        {/* Aktif İşlemler */}
        {hasActiveOperations && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Devam Eden Bulk İşlemler
              </CardTitle>
              <CardDescription>
                Şu anda {activeOperationsArray.length} bulk işlem devam ediyor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeOperationsArray.map((operation) => (
                <div key={operation.operationId} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(operation.status)}
                      <span className="font-medium">İşlem ID: {operation.operationId}</span>
                      <Badge 
                        variant={BULK_OPERATION_STATUS_COLORS[operation.status]}
                        className="text-xs"
                      >
                        {BULK_OPERATION_STATUS_LABELS[operation.status]}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStopPolling(operation.operationId)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  {bulkOperationProgress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>İlerleme</span>
                        <span>
                          {bulkOperationProgress.completed || 0} / {bulkOperationProgress.total || 0}
                        </span>
                      </div>
                      <Progress 
                        value={
                          bulkOperationProgress.total > 0 
                            ? (bulkOperationProgress.completed / bulkOperationProgress.total) * 100 
                            : 0
                        } 
                        className="h-2"
                      />
                      {bulkOperationProgress.failed > 0 && (
                        <div className="text-xs text-destructive">
                          {bulkOperationProgress.failed} başarısız
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Son İşlemler */}
        {hasRecentOperations && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Son Bulk İşlemler</CardTitle>
              <CardDescription>
                Tamamlanan son {recentOperations.length} bulk işlem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {recentOperations.map((operation) => (
                    <div key={operation.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(operation.status)}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {BULK_OPERATION_TYPE_LABELS[operation.operationType] || operation.operationType}
                            </span>
                            <Badge 
                              variant={BULK_OPERATION_STATUS_COLORS[operation.status]}
                              className="text-xs"
                            >
                              {BULK_OPERATION_STATUS_LABELS[operation.status]}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(operation.createdAt), 'dd.MM.yyyy HH:mm', { locale: tr })}
                          </div>
                          {operation.summary && (
                            <div className="text-xs text-muted-foreground">
                              {operation.summary.successful} başarılı, {operation.summary.failed} başarısız
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewResults(operation.id)}
                          disabled={loadingResults}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sonuçlar Dialog'u */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Bulk İşlem Sonuçları</DialogTitle>
            <DialogDescription>
              Detaylı işlem sonuçları ve malzeme bazlı durum bilgileri
            </DialogDescription>
          </DialogHeader>

          {selectedOperationResults ? (
            <div className="space-y-4">
              {/* Özet Bilgiler */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedOperationResults.summary?.total || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Toplam</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedOperationResults.summary?.successful || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Başarılı</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {selectedOperationResults.summary?.failed || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Başarısız</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {selectedOperationResults.summary?.skipped || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Atlandı</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detaylar */}
              {selectedOperationResults.details && (
                <div className="space-y-3">
                  <h4 className="font-medium">Malzeme Bazlı Sonuçlar</h4>
                  <ScrollArea className="h-[300px] border rounded">
                    <div className="p-3 space-y-2">
                      {selectedOperationResults.details.map((detail, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            "flex items-center justify-between p-2 rounded text-sm",
                            detail.success 
                              ? "bg-green-50 border border-green-200" 
                              : "bg-red-50 border border-red-200"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {detail.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-mono">
                              {detail.malzeme?.vidaNo || detail.malzemeId}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {detail.error || 'Başarılı'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowResultsDialog(false)}>
                  Kapat
                </Button>
                <Button onClick={() => {
                  // Excel export implementasyonu eklenebilir
                  console.log('Excel export:', selectedOperationResults);
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel'e Aktar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Sonuçlar yükleniyor...
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkOperationProgress;