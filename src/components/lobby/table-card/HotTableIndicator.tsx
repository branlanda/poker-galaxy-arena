
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

export function HotTableIndicator() {
  const { t } = useTranslation();
  
  return (
    <div className="absolute top-0 right-0 mt-2 mr-2 z-10">
      <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 flex items-center gap-1">
        <Flame size={14} className="animate-pulse" />
        {t('hot', 'Hot')}
      </Badge>
    </div>
  );
}
