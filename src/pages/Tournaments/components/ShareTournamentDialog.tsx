
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Tournament } from '@/types/tournaments';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Facebook, Twitter, Link, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament: Tournament;
}

export function ShareTournamentDialog({
  open,
  onOpenChange,
  tournament
}: ShareTournamentDialogProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  // Generate tournament share URL
  const shareUrl = `${window.location.origin}/tournaments/${tournament.id}`;
  
  // Generate social media share URLs
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me in the ${tournament.name} poker tournament! ${shareUrl}`)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`Join me in the ${tournament.name} poker tournament!`)}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    toast({
      title: t('tournaments.linkCopied'),
      description: t('tournaments.linkCopiedToClipboard'),
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleSocialShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('tournaments.shareTournament')}</DialogTitle>
          <DialogDescription>
            {t('tournaments.shareDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="link" className="flex-1">
              <Link className="h-4 w-4 mr-2" />
              {t('tournaments.copyLink')}
            </TabsTrigger>
            <TabsTrigger value="social" className="flex-1">
              <Twitter className="h-4 w-4 mr-2" />
              {t('tournaments.socialMedia')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="link">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input 
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {t('tournaments.shareLinkDescription', { 
                  tournamentName: tournament.name,
                  date: new Date(tournament.start_time).toLocaleDateString(),
                })}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="social">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare(twitterShareUrl)}
                  className="flex-1 h-20 flex-col"
                >
                  <Twitter className="h-6 w-6 mb-2" />
                  Twitter
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare(facebookShareUrl)}
                  className="flex-1 h-20 flex-col"
                >
                  <Facebook className="h-6 w-6 mb-2" />
                  Facebook
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {t('tournaments.shareSocialDescription')}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
