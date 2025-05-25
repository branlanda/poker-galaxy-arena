
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  riskScore: number;
  flags: string[];
  recommendation: 'approve' | 'review' | 'reject';
}

const TransactionValidator: React.FC = () => {
  const [transactionId, setTransactionId] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateTransaction = async () => {
    if (!transactionId.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingrese un ID de transacción",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      // Simulate validation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation results based on transaction ID patterns
      const riskScore = Math.random() * 100;
      const flags = [];
      
      if (riskScore > 80) {
        flags.push('Monto inusualmente alto');
        flags.push('Patron de transaccion sospechoso');
      } else if (riskScore > 60) {
        flags.push('Usuario con historial limitado');
      } else if (riskScore > 40) {
        flags.push('Horario inusual de transaccion');
      }

      const result: ValidationResult = {
        isValid: riskScore < 70,
        riskScore: Math.round(riskScore),
        flags,
        recommendation: riskScore > 80 ? 'reject' : riskScore > 60 ? 'review' : 'approve'
      };

      setValidationResult(result);
      
      toast({
        title: "Validación completada",
        description: `Transacción ${result.recommendation === 'approve' ? 'aprobada' : result.recommendation === 'review' ? 'marcada para revisión' : 'rechazada'}`,
        variant: result.recommendation === 'reject' ? 'destructive' : 'default',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al validar la transacción",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'approve':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'review':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'reject':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 80) return 'text-red-500';
    if (score > 60) return 'text-yellow-500';
    if (score > 40) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Validador de Transacciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transactionId">ID de Transacción</Label>
          <Input
            id="transactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Ingrese el ID de la transacción"
          />
        </div>

        <Button
          onClick={validateTransaction}
          disabled={isValidating}
          className="w-full"
        >
          {isValidating ? 'Validando...' : 'Validar Transacción'}
        </Button>

        {validationResult && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                {getRecommendationIcon(validationResult.recommendation)}
                <span className="font-medium">
                  Recomendación: {validationResult.recommendation === 'approve' ? 'Aprobar' : 
                                 validationResult.recommendation === 'review' ? 'Revisar' : 'Rechazar'}
                </span>
              </div>
              <div className={`font-bold ${getRiskColor(validationResult.riskScore)}`}>
                Riesgo: {validationResult.riskScore}%
              </div>
            </div>

            {validationResult.flags.length > 0 && (
              <Alert variant={validationResult.recommendation === 'reject' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <strong>Señales de alerta detectadas:</strong>
                    <ul className="list-disc list-inside">
                      {validationResult.flags.map((flag, index) => (
                        <li key={index}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionValidator;
