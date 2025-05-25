
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
}

const EMOJI_CATEGORIES = {
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲'],
  gestures: ['👍', '👎', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏'],
  poker: ['♠️', '♥️', '♦️', '♣️', '🃏', '🎰', '🎲', '💰', '💵', '💴', '💶', '💷', '🪙', '💸', '🔥', '⚡', '💎', '👑', '🏆', '🥇', '🎯', '🎊', '🎉'],
  objects: ['❤️', '💔', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💤', '👁️', '🗨️', '💭', '🗯️', '💬'],
};

export function EmojiPicker({ onEmojiSelect, disabled }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('faces');
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
      >
        <Smile className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-navy border border-emerald/20 rounded-lg shadow-lg z-50">
          <div className="p-3">
            {/* Category tabs */}
            <div className="flex gap-2 mb-3 border-b border-emerald/20 pb-2">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
                  className="text-xs capitalize"
                >
                  {category === 'faces' && '😊'}
                  {category === 'gestures' && '👍'}
                  {category === 'poker' && '♠️'}
                  {category === 'objects' && '❤️'}
                </Button>
              ))}
            </div>

            {/* Emoji grid */}
            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
                <Button
                  key={`${emoji}-${index}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-1 h-8 hover:bg-emerald/20 text-lg"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
