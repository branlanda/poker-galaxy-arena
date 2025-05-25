
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHandHistory } from '@/hooks/useHandHistory';
import { MessageSquare, Star, Tag, Plus, Send } from 'lucide-react';

interface HandAnalysisPanelProps {
  handId: string;
}

export const HandAnalysisPanel: React.FC<HandAnalysisPanelProps> = ({ handId }) => {
  const { createAnalysis } = useHandHistory();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(3);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const commonTags = [
    'Bluff', 'Value Bet', 'Mistake', 'Good Play', 'Lucky', 'Unlucky',
    'Aggressive', 'Passive', 'Tight', 'Loose', 'Position Play', 'Pot Odds'
  ];

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const success = await createAnalysis(handId, content, rating, tags, isPublic);
      if (success) {
        setContent('');
        setRating(3);
        setTags([]);
        setIsPublic(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-navy/50 border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Añadir Análisis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content */}
          <div className="space-y-2">
            <Label className="text-white">Análisis de la mano</Label>
            <Textarea
              placeholder="Describe tu análisis de esta mano... ¿Qué hiciste bien? ¿Qué podrías haber hecho mejor?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-navy/50 border-emerald/20 text-white min-h-[100px]"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-white">Calificación de tu juego</Label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  size="sm"
                  variant="ghost"
                  onClick={() => setRating(star)}
                  className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                >
                  <Star className={`h-5 w-5 ${star <= rating ? 'fill-current' : ''}`} />
                </Button>
              ))}
              <span className="text-sm text-gray-400 ml-2">
                {rating}/5 estrellas
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white">Etiquetas</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-emerald border-emerald/30 cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Añadir etiqueta personalizada..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
                className="bg-navy/50 border-emerald/20 text-white flex-1"
              />
              <Button
                size="sm"
                onClick={() => addTag(newTag)}
                disabled={!newTag.trim()}
                className="bg-emerald text-white hover:bg-emerald/80"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm text-gray-400">Etiquetas sugeridas:</span>
              <div className="flex flex-wrap gap-2">
                {commonTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-emerald/10 text-gray-400 border-gray-600"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Public toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="public-analysis"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public-analysis" className="text-white">
              Hacer público este análisis
            </Label>
          </div>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
            className="w-full bg-emerald text-white hover:bg-emerald/80"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Guardando...' : 'Guardar Análisis'}
          </Button>
        </CardContent>
      </Card>

      {/* Placeholder for existing analyses */}
      <Card className="bg-navy/50 border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white">Análisis Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay análisis para esta mano aún.</p>
            <p className="text-sm">Sé el primero en analizar esta jugada.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
