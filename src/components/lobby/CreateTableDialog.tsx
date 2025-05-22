
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

export function CreateTableDialog() {
  const [open, setOpen] = useState(false);
  const { formState, loading, handleSubmit } = useTableForm();
  
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
          <Plus className="h-4 w-4 mr-2" /> Create Table
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Poker Table</DialogTitle>
          <DialogDescription>
            Configure your table settings below.
          </DialogDescription>
        </DialogHeader>
        <TableSettingsForm {...formState} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading || !formState.name}>
            {loading ? 'Creating...' : 'Create Table'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
