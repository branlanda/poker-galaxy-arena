
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SecurityRule {
  id: string;
  name: string;
  type: 'amount' | 'velocity' | 'location' | 'device' | 'pattern';
  enabled: boolean;
  threshold: number;
  timeWindow?: number; // in minutes
  description: string;
}

export interface ValidationContext {
  userId: string;
  amount?: number;
  timestamp: Date;
  ipAddress?: string;
  deviceId?: string;
  location?: string;
  transactionType: string;
}

export interface ValidationResult {
  passed: boolean;
  riskScore: number;
  triggeredRules: string[];
  recommendation: 'approve' | 'review' | 'block';
  message: string;
}

export function useSecurityValidation() {
  const [validating, setValidating] = useState(false);
  const { toast } = useToast();

  const defaultRules: SecurityRule[] = [
    {
      id: 'max-amount',
      name: 'Límite de Monto Máximo',
      type: 'amount',
      enabled: true,
      threshold: 10000,
      description: 'Bloquear transacciones superiores a $10,000'
    },
    {
      id: 'velocity-check',
      name: 'Control de Velocidad',
      type: 'velocity',
      enabled: true,
      threshold: 5,
      timeWindow: 15,
      description: 'Máximo 5 transacciones en 15 minutos'
    },
    {
      id: 'geo-location',
      name: 'Verificación Geográfica',
      type: 'location',
      enabled: true,
      threshold: 1000, // km
      description: 'Alertar si la ubicación cambia más de 1000km'
    },
    {
      id: 'device-fingerprint',
      name: 'Huella Digital del Dispositivo',
      type: 'device',
      enabled: true,
      threshold: 1,
      description: 'Verificar dispositivo conocido'
    }
  ];

  const validateTransaction = async (context: ValidationContext): Promise<ValidationResult> => {
    setValidating(true);
    try {
      // Simulate validation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let riskScore = 0;
      const triggeredRules: string[] = [];
      
      // Amount validation
      if (context.amount && context.amount > 10000) {
        riskScore += 30;
        triggeredRules.push('Monto excede límite máximo');
      }
      
      // Velocity check (simulate checking recent transactions)
      const recentTransactions = Math.floor(Math.random() * 8);
      if (recentTransactions > 5) {
        riskScore += 25;
        triggeredRules.push('Demasiadas transacciones recientes');
      }
      
      // Location check (simulate unusual location)
      if (Math.random() > 0.8) {
        riskScore += 20;
        triggeredRules.push('Ubicación geográfica inusual');
      }
      
      // Device check (simulate new device)
      if (Math.random() > 0.9) {
        riskScore += 15;
        triggeredRules.push('Dispositivo no reconocido');
      }
      
      // Pattern analysis (simulate suspicious patterns)
      if (Math.random() > 0.85) {
        riskScore += 10;
        triggeredRules.push('Patrón de comportamiento sospechoso');
      }
      
      let recommendation: 'approve' | 'review' | 'block';
      let message: string;
      
      if (riskScore >= 50) {
        recommendation = 'block';
        message = 'Transacción bloqueada por alto riesgo de fraude';
      } else if (riskScore >= 25) {
        recommendation = 'review';
        message = 'Transacción requiere revisión manual';
      } else {
        recommendation = 'approve';
        message = 'Transacción aprobada automáticamente';
      }
      
      const result: ValidationResult = {
        passed: riskScore < 50,
        riskScore,
        triggeredRules,
        recommendation,
        message
      };
      
      toast({
        title: "Validación completada",
        description: result.message,
        variant: result.recommendation === 'block' ? 'destructive' : 'default',
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Error de validación",
        description: "No se pudo completar la validación de seguridad",
        variant: "destructive",
      });
      throw error;
    } finally {
      setValidating(false);
    }
  };

  const checkUserRiskProfile = async (userId: string) => {
    try {
      // Simulate risk profile check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const riskLevel = Math.random();
      let profile: 'low' | 'medium' | 'high';
      
      if (riskLevel > 0.8) profile = 'high';
      else if (riskLevel > 0.5) profile = 'medium';
      else profile = 'low';
      
      return {
        userId,
        riskLevel: profile,
        score: Math.round(riskLevel * 100),
        factors: [
          'Historial de transacciones',
          'Verificación de identidad',
          'Comportamiento previo'
        ]
      };
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo obtener el perfil de riesgo del usuario",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    validating,
    validateTransaction,
    checkUserRiskProfile,
    defaultRules
  };
}
