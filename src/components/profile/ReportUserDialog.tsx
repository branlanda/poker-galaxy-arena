
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: string;
  reportedUserAlias: string;
}

export const ReportUserDialog: React.FC<ReportUserDialogProps> = ({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserAlias
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setReason('');
    setCategory('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!category) {
      toast({
        title: t('errors.missingField'),
        description: t('errors.selectReportCategory'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!reason || reason.length < 10) {
      toast({
        title: t('errors.missingField'),
        description: t('errors.reportReasonLength'),
        variant: 'destructive',
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Insert into database - we'll create a player_reports table instead
      // of using an existing table to avoid schema modifications
      const { error } = await supabase
        .from('player_activities')
        .insert({
          player_id: user.id,
          activity_type: 'REPORT_USER',
          is_public: false,
          content: reason,
          metadata: {
            reported_user_id: reportedUserId,
            reported_user_alias: reportedUserAlias,
            category
          }
        });
      
      if (error) throw error;
      
      toast({
        title: t('profile.reportSubmitted'),
        description: t('profile.reportReviewMessage'),
      });
      
      handleClose();
    } catch (error: any) {
      toast({
        title: t('errors.reportFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const reportCategories = [
    { value: 'INAPPROPRIATE_BEHAVIOR', label: t('profile.inappropriateBehavior') },
    { value: 'CHEATING', label: t('profile.cheating') },
    { value: 'OFFENSIVE_LANGUAGE', label: t('profile.offensiveLanguage') },
    { value: 'HARASSMENT', label: t('profile.harassment') },
    { value: 'OTHER', label: t('profile.other') }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-navy/90 backdrop-blur-lg border border-emerald/20">
        <DialogHeader>
          <DialogTitle>{t('profile.reportUser')}</DialogTitle>
          <DialogDescription>
            {t('profile.reportUserDescription', { username: reportedUserAlias })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              {t('profile.reportCategory')}
            </label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('profile.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {reportCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              {t('profile.reportReason')}
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('profile.reportReasonPlaceholder')}
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500">
              {t('profile.reportDetailsHelp')}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            {t('cancel')}
          </Button>
          <Button 
            variant="primary"
            onClick={handleSubmit}
            loading={submitting}
          >
            {t('profile.submitReport')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
