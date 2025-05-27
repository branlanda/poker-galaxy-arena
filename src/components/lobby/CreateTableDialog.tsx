
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
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit();
    if (result) {
      setOpen(false);
      // Reset form after successful creation
      formState.setName('');
      formState.setSmallBlind(1);
      formState.setBigBlind(2);
      formState.setMinBuyIn(40);
      formState.setMaxBuyIn(200);
      formState.setMaxPlayers(9);
      formState.setIsPrivate(false);
      formState.setPassword('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald hover:bg-emerald/90">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" /> 
          {t('lobby.createTable', 'Create Table')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-navy border-emerald/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald text-xl">
            🎰 {t('lobby.createTable', 'Create Table')}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {t('lobby.tableSettings', 'Configure your poker table settings')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit}>
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
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={loading || !formState.name.trim()}
              className="bg-emerald hover:bg-emerald/90 relative"
            >
              {loading ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                  {t('common.creating', 'Creating...')}
                </div>
              ) : (
                <>🎮 {t('lobby.createTable', 'Create Table')}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
