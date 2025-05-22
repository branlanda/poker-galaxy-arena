
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PayoutLevel {
  position: number;
  percentage: number;
}

interface PayoutStructureEditorProps {
  payouts: PayoutLevel[];
  onChange: (payouts: PayoutLevel[]) => void;
}

export const PayoutStructureEditor: React.FC<PayoutStructureEditorProps> = ({
  payouts,
  onChange,
}) => {
  const { t } = useTranslation();

  const addPayout = () => {
    const lastPosition = payouts[payouts.length - 1]?.position || 0;
    const newPosition = lastPosition + 1;
    onChange([...payouts, { position: newPosition, percentage: 5 }]);
  };

  const removePayout = (index: number) => {
    const newPayouts = [...payouts];
    newPayouts.splice(index, 1);
    
    // Renumber positions if needed
    const renumberedPayouts = newPayouts.map((payout, idx) => ({
      ...payout,
      position: idx + 1,
    }));
    
    onChange(renumberedPayouts);
  };

  const updatePayout = (index: number, field: keyof PayoutLevel, value: number) => {
    const newPayouts = [...payouts];
    newPayouts[index] = {
      ...newPayouts[index],
      [field]: value,
    };
    onChange(newPayouts);
  };

  // Calculate total percentage
  const totalPercentage = payouts.reduce((sum, payout) => sum + payout.percentage, 0);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">{t('tournaments.position', 'Position')}</th>
              <th className="text-left py-2 px-2">{t('tournaments.percentage', 'Percentage')}</th>
              <th className="text-left py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-2">{payout.position}</td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={payout.percentage}
                      onChange={(e) => updatePayout(index, 'percentage', parseFloat(e.target.value))}
                      className="w-20 p-1 border rounded"
                    />
                    <span>%</span>
                  </div>
                </td>
                <td className="py-2 px-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removePayout(index)}
                    disabled={payouts.length <= 1}
                    className="h-7 w-7"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td className="py-2 px-2 font-medium">{t('total', 'Total')}</td>
              <td className="py-2 px-2 font-medium" colSpan={2}>
                <div className={`${totalPercentage !== 100 ? 'text-red-500' : ''}`}>
                  {totalPercentage}%
                </div>
                {totalPercentage !== 100 && (
                  <div className="text-xs text-red-500">
                    {t('tournaments.percentageShouldBe100', 'Total percentage should be 100%')}
                  </div>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={addPayout}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('tournaments.addPosition', 'Add Position')}
      </Button>
    </div>
  );
};
