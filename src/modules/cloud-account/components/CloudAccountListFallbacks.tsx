import { Cloud, Loader2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface CloudAccountLoadErrorProps {
  onRetry: () => void;
}

export function CloudAccountLoadingState() {
  return (
    <div className="flex justify-center p-8">
      <Loader2 className="animate-spin" />
    </div>
  );
}

export function CloudAccountLoadError({ onRetry }: CloudAccountLoadErrorProps) {
  const { t } = useTranslation();

  return (
    <div
      className="col-span-full rounded-lg border border-dashed p-8 text-center"
      data-testid="cloud-load-error-fallback"
    >
      <Cloud className="text-muted-foreground mx-auto mb-3 h-10 w-10 opacity-40" />
      <div className="text-sm font-medium">{t('cloud.error.loadFailed')}</div>
      <div className="text-muted-foreground mt-2 text-xs">{t('action.retry')}</div>
      <Button
        className="mt-4"
        variant="outline"
        onClick={onRetry}
        data-testid="cloud-load-error-retry"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        {t('action.retry')}
      </Button>
    </div>
  );
}
