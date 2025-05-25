
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
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { TableSettingsForm } from './TableSettingsForm';
import { useTableForm } from '@/hooks/useTableForm';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';

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
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" /> {t('createTable', 'Crear Mesa')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('createTable', 'Crear Mesa')}</DialogTitle>
          <DialogDescription>
            {t('tableSettings', 'Configura los ajustes de tu mesa de póker')}
          </DialogDescription>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TableSettingsForm {...formState} />
          </motion.div>
        </AnimatePresence>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('cancel', 'Cancelar')}
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={loading || !formState.name}
            className="relative"
          >
            {loading ? (
              <div className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                {t('creating', 'Creando...')}
              </div>
            ) : (
              <>{t('createTable', 'Crear Mesa')}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
