
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
  const [minBuyIn, setMinBuyIn] = useState(40);
  const [maxBuyIn, setMaxBuyIn] = useState(200);
  const [maxPlayers, setMaxPlayers] = useState(9);
  const [tableType, setTableType] = useState<TableType>('CASH');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  
  const { createTable, loading } = useCreateTable();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const handleSubmit = async () => {
    console.log('Submitting table creation with data:', {
      name: name.trim(),
      smallBlind,
      bigBlind,
      minBuyIn,
      maxBuyIn,
      maxPlayers,
      tableType,
      isPrivate,
      password: isPrivate ? password : undefined,
    });

    // Validate required fields
    if (!name.trim()) {
      toast({
        title: "❌ Error",
        description: t('errors.tableNameRequired', 'Table name is required'),
        variant: "destructive",
      });
      return null;
    }

    // Validate buy-in ranges
    if (minBuyIn >= maxBuyIn) {
      toast({
        title: "❌ Error",
        description: t('errors.minBuyInGreaterThanMax', 'Minimum buy-in must be less than maximum buy-in'),
        variant: "destructive",
      });
      return null;
    }

    // Validate blinds vs buy-ins
    if (minBuyIn < bigBlind * 10) {
      toast({
        title: "❌ Error",
        description: t('errors.minBuyInTooLow', 'Minimum buy-in should be at least 10x the big blind'),
        variant: "destructive",
      });
      return null;
    }

    // Validate private table password
    if (isPrivate && (!password || password.length < 3)) {
      toast({
        title: "❌ Error",
        description: t('errors.privateTablePasswordRequired', 'Private tables require a password (at least 3 characters)'),
        variant: "destructive",
      });
      return null;
    }

    const newTable = await createTable({
      name: name.trim(),
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
      toast({
        title: "🎉 Success!",
        description: `Table "${name}" created successfully!`,
      });
      
      // Navigate to the lobby to see the new table
      navigate('/lobby');
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
