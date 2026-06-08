import { AlertTriangle, FileText, Loader2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getErrorDetailsText, getLocalizedErrorMessage } from '@/shared/utils/errorMessages';

interface CloudAccountLoadErrorProps {
  error?: unknown;
  onRetry: () => void;
}

export function CloudAccountLoadingState() {
  return (
    <div className="flex justify-center p-8">
      <Loader2 className="animate-spin" />
    </div>
  );
}

export function CloudAccountLoadError({ error, onRetry }: CloudAccountLoadErrorProps) {
  const { t } = useTranslation();
  const message = error ? getLocalizedErrorMessage(error, t) : t('cloud.error.loadFailed');
  const details = error ? getErrorDetailsText(error) : '';

  return (
    <div
      className="border-destructive/40 bg-destructive/5 col-span-full rounded-lg border p-6"
      data-testid="cloud-load-error-fallback"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-destructive mt-0.5 h-5 w-5" />
        <div className="min-w-0 flex-1">
          <div className="text-destructive text-sm font-medium">{t('cloud.error.loadFailed')}</div>
          <div className="text-foreground mt-2 text-sm whitespace-pre-wrap">{message}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              data-testid="cloud-load-error-retry"
            >
              <RefreshCw className="h-4 w-4" />
              {t('action.retry')}
            </Button>
            {details ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="cloud-load-error-details">
                    <FileText className="h-4 w-4" />
                    {t('action.details')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{t('error.detailsTitle')}</DialogTitle>
                    <DialogDescription>{t('error.detailsDescription')}</DialogDescription>
                  </DialogHeader>
                  <pre className="bg-muted text-foreground max-h-[60vh] overflow-auto rounded-md p-4 text-xs whitespace-pre-wrap">
                    {details}
                  </pre>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
