
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Edit,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { useSupport, FAQItem } from '@/hooks/useSupport';

interface FAQSectionProps {
  searchQuery: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ searchQuery }) => {
  const { faqItems, searchFAQ } = useSupport();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: '',
    tags: ''
  });

  const categories = Array.from(new Set(faqItems.map(item => item.category)));
  const filteredFAQs = searchQuery 
    ? searchFAQ(searchQuery) 
    : selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const handleCreateFAQ = () => {
    // In a real implementation, this would call an API
    console.log('Creating FAQ:', newFAQ);
    setNewFAQ({ question: '', answer: '', category: '', tags: '' });
    setShowCreateDialog(false);
  };

  const handleVote = (faqId: string, isHelpful: boolean) => {
    // In a real implementation, this would update the vote counts
    console.log(`Voting ${isHelpful ? 'helpful' : 'not helpful'} for FAQ ${faqId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Preguntas Frecuentes</h2>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald hover:bg-emerald/90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy border-emerald/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nueva FAQ</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Pregunta</label>
                <Input
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                  placeholder="¿Cuál es la pregunta frecuente?"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Respuesta</label>
                <Textarea
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  placeholder="Proporciona una respuesta clara y detallada"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Categoría</label>
                  <Input
                    value={newFAQ.category}
                    onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                    placeholder="ej. Pagos, Cuenta, Juego"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tags (separados por comas)</label>
                  <Input
                    value={newFAQ.tags}
                    onChange={(e) => setNewFAQ({ ...newFAQ, tags: e.target.value })}
                    placeholder="deposito, pago, transferencia"
                  />
                </div>
              </div>

              <Button 
                onClick={handleCreateFAQ}
                disabled={!newFAQ.question || !newFAQ.answer}
                className="w-full bg-emerald hover:bg-emerald/90"
              >
                Crear FAQ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-navy-light border-emerald/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Categoría:</span>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Total:</span>
              <Badge variant="secondary">{filteredFAQs.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} className="bg-navy-light border-emerald/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2">
                    {faq.question}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{faq.category}</Badge>
                    {faq.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-gray-300 leading-relaxed">
                {faq.answer}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-emerald/20">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {faq.views} vistas
                  </div>
                  <div className="text-xs">
                    Actualizado: {faq.updatedAt.toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">¿Te ayudó?</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(faq.id, true)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {faq.helpful}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(faq.id, false)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    {faq.notHelpful}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredFAQs.length === 0 && (
          <Card className="bg-navy-light border-emerald/20">
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchQuery 
                  ? 'No se encontraron FAQs con esos términos de búsqueda'
                  : 'No hay FAQs en esta categoría'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FAQSection;
