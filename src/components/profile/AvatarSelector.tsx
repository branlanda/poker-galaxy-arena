
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAvatarCollection, Avatar as AvatarType } from '@/hooks/useAvatarCollection';
import { useTranslation } from '@/hooks/useTranslation';
import { Lock, Crown, Star, Zap } from 'lucide-react';

interface AvatarSelectorProps {
  open: boolean;
  onClose: () => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { avatars, loading, selectAvatar } = useAvatarCollection();

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return <Crown className="h-3 w-3" />;
      case 'epic': return <Star className="h-3 w-3" />;
      case 'rare': return <Zap className="h-3 w-3" />;
      default: return null;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const handleSelectAvatar = async (avatar: AvatarType) => {
    await selectAvatar(avatar.id);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Avatar</DialogTitle>
            <DialogDescription>Loading avatars...</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-navy/50 rounded-full animate-pulse"></div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Choose Your Avatar</DialogTitle>
          <DialogDescription>
            Select an avatar to represent yourself at the poker tables
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 py-4 max-h-96 overflow-y-auto">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className={`relative group p-3 rounded-lg border-2 transition-all cursor-pointer ${
                avatar.isOwned 
                  ? 'border-emerald/50 bg-emerald/10 hover:border-emerald' 
                  : 'border-gray-600 bg-navy/30 hover:border-gray-500'
              }`}
              onClick={() => avatar.isOwned && handleSelectAvatar(avatar)}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={avatar.imageUrl} alt={avatar.name} />
                    <AvatarFallback>{avatar.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  {!avatar.isOwned && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Lock className="h-6 w-6 text-gray-400" />
                    </div>
                  )}

                  {avatar.rarity !== 'COMMON' && (
                    <div className="absolute -top-1 -right-1">
                      <Badge className={`px-1 py-0 text-xs ${getRarityColor(avatar.rarity)}`}>
                        {getRarityIcon(avatar.rarity)}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-xs font-medium text-white truncate w-full">
                    {avatar.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {avatar.rarity.toLowerCase()}
                  </p>
                </div>

                {avatar.isNft && (
                  <Badge variant="outline" className="text-xs">
                    NFT
                  </Badge>
                )}

                {!avatar.isOwned && avatar.unlockRequirement && (
                  <p className="text-xs text-gray-500 text-center">
                    {avatar.unlockRequirement}
                  </p>
                )}
              </div>

              {avatar.isOwned && (
                <div className="absolute inset-0 bg-emerald/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="outline" className="text-xs">
                    Select
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-600">
          <p className="text-xs text-gray-400">
            {avatars.filter(a => a.isOwned).length} of {avatars.length} avatars unlocked
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
