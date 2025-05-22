
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface BlindLevel {
  level: number;
  small_blind: number;
  big_blind: number;
  ante: number;
  duration_minutes: number;
}

interface BlindLevelEditorProps {
  levels: BlindLevel[];
  onChange: (levels: BlindLevel[]) => void;
}

export const BlindLevelEditor: React.FC<BlindLevelEditorProps> = ({ 
  levels, 
  onChange 
}) => {
  const { t } = useTranslation();

  const addLevel = () => {
    const lastLevel = levels[levels.length - 1];
    const newLevel = {
      level: lastLevel.level + 1,
      small_blind: lastLevel.small_blind * 2,
      big_blind: lastLevel.big_blind * 2,
      ante: lastLevel.ante > 0 ? lastLevel.ante * 2 : 0,
      duration_minutes: lastLevel.duration_minutes,
    };
    onChange([...levels, newLevel]);
  };

  const removeLevel = (index: number) => {
    const newLevels = [...levels];
    newLevels.splice(index, 1);
    
    // Renumber remaining levels
    const renumberedLevels = newLevels.map((level, idx) => ({
      ...level,
      level: idx + 1,
    }));
    
    onChange(renumberedLevels);
  };

  const updateLevel = (index: number, field: keyof BlindLevel, value: number) => {
    const newLevels = [...levels];
    newLevels[index] = {
      ...newLevels[index],
      [field]: value,
    };
    onChange(newLevels);
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">{t('tournaments.level', 'Level')}</th>
              <th className="text-left py-2 px-2">{t('tournaments.smallBlind', 'Small Blind')}</th>
              <th className="text-left py-2 px-2">{t('tournaments.bigBlind', 'Big Blind')}</th>
              <th className="text-left py-2 px-2">{t('tournaments.ante', 'Ante')}</th>
              <th className="text-left py-2 px-2">{t('tournaments.duration', 'Duration (min)')}</th>
              <th className="text-left py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-2">{level.level}</td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    min="1"
                    value={level.small_blind}
                    onChange={(e) => updateLevel(index, 'small_blind', parseInt(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    min="1"
                    value={level.big_blind}
                    onChange={(e) => updateLevel(index, 'big_blind', parseInt(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    min="0"
                    value={level.ante}
                    onChange={(e) => updateLevel(index, 'ante', parseInt(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={level.duration_minutes}
                    onChange={(e) => updateLevel(index, 'duration_minutes', parseInt(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                </td>
                <td className="py-2 px-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeLevel(index)}
                    disabled={levels.length <= 1}
                    className="h-7 w-7"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={addLevel}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('tournaments.addLevel', 'Add Level')}
      </Button>
    </div>
  );
};
