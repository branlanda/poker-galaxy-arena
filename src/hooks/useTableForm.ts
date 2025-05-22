
import { useState } from 'react';
import { useCreateTable } from '@/hooks/useCreateTable';
import { TableType } from '@/types/lobby';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export function useTableForm() {
  const [name, setName] = useState('');
  const [smallBlind, setSmallBlind] = useState(1);
  const [bigBlind, setBigBlind] = useState(2);
  const [minBuyIn, setMinBuyIn] = useState(40); // 20x Big Blind
  const [maxBuyIn, setMaxBuyIn] = useState(200); // 100x Big Blind
  const [maxPlayers, setMaxPlayers] = useState(9);
  const [tableType, setTableType] = useState<TableType>('CASH');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  
  const { createTable, loading } = useCreateTable();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const handleSubmit = async () => {
    // Validate buy-in ranges
    if (minBuyIn > maxBuyIn) {
      toast({
        title: "Error",
        description: t('errors.minBuyInGreaterThanMax'),
        variant: "destructive",
      });
      return null;
    }

    // Validate blinds vs buy-ins
    if (minBuyIn < bigBlind * 20) {
      toast({
        title: "Error",
        description: t('errors.minBuyInTooLow'),
        variant: "destructive",
      });
      return null;
    }

    const newTable = await createTable({
      name,
      smallBlind,
      bigBlind,
      minBuyIn,
      maxBuyIn,
      maxPlayers,
      tableType,
      isPrivate,
      password: isPrivate ? password : undefined,
    });
    
    if (newTable) {
      // Navigate to the new table
      navigate(`/game/${newTable.id}`);
      return newTable;
    }
    
    return null;
  };

  return {
    formState: {
      name,
      setName,
      smallBlind,
      setSmallBlind,
      bigBlind,
      setBigBlind,
      minBuyIn,
      setMinBuyIn,
      maxBuyIn, 
      setMaxBuyIn,
      maxPlayers,
      setMaxPlayers,
      tableType,
      setTableType,
      isPrivate,
      setIsPrivate,
      password,
      setPassword
    },
    loading,
    handleSubmit
  };
}
