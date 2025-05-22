
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Plus } from 'lucide-react';
import { TableSettingsForm } from './TableSettingsForm';
import { useTableForm } from '@/hooks/useTableForm';
import { useTranslation } from '@/hooks/useTranslation';

export function CreateTableDialog() {
  const [open, setOpen] = useState(false);
  const { formState, loading, handleSubmit } = useTableForm();
  const { t } = useTranslation();
  
  const onSubmit = async () => {
    const result = await handleSubmit();
    if (result) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" /> {t('createTable')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('createTable')}</DialogTitle>
          <DialogDescription>
            {t('tableSettings')}
          </DialogDescription>
        </DialogHeader>
        <TableSettingsForm {...formState} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={onSubmit} disabled={loading || !formState.name}>
            {loading ? t('creating', 'Creating...') : t('createTable')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
