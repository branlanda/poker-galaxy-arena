
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface HandAuditEntry {
  id: string;
  handId: string;
  tableId: string;
  timestamp: Date;
  players: string[];
  actions: any[];
  communityCards: string[];
  finalPot: number;
  winners: { playerId: string; amount: number }[];
  integrity: {
    checksumValid: boolean;
    sequenceValid: boolean;
    timingValid: boolean;
    actionsValid: boolean;
  };
  flags: string[];
}

interface AuditFilters {
  dateRange: [Date, Date] | null;
  tableId?: string;
  playerId?: string;
  flagged?: boolean;
  integrityIssues?: boolean;
}

export function useHandAuditing() {
  const [auditEntries, setAuditEntries] = useState<HandAuditEntry[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({
    dateRange: null
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalHands: 0,
    flaggedHands: 0,
    integrityIssues: 0,
    verifiedHands: 0
  });
  const { toast } = useToast();

  const auditHand = async (handData: any) => {
    try {
      const auditEntry: HandAuditEntry = {
        id: `audit_${Date.now()}`,
        handId: handData.id,
        tableId: handData.tableId,
        timestamp: new Date(handData.timestamp),
        players: handData.players.map((p: any) => p.id),
        actions: handData.actions,
        communityCards: handData.communityCards,
        finalPot: handData.pot,
        winners: handData.winners,
        integrity: await validateHandIntegrity(handData),
        flags: await generateAuditFlags(handData)
      };

      setAuditEntries(prev => [auditEntry, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalHands: prev.totalHands + 1,
        flaggedHands: auditEntry.flags.length > 0 ? prev.flaggedHands + 1 : prev.flaggedHands,
        integrityIssues: !auditEntry.integrity.checksumValid ? prev.integrityIssues + 1 : prev.integrityIssues,
        verifiedHands: auditEntry.integrity.checksumValid && auditEntry.flags.length === 0 ? prev.verifiedHands + 1 : prev.verifiedHands
      }));

      // Log critical issues
      if (!auditEntry.integrity.checksumValid || auditEntry.flags.includes('CRITICAL')) {
        toast({
          title: "Problema de Integridad Detectado",
          description: `Mano ${handData.id} tiene problemas críticos de integridad`,
          variant: "destructive",
        });
      }

      return auditEntry;
    } catch (error) {
      console.error('Error auditing hand:', error);
      throw error;
    }
  };

  const validateHandIntegrity = async (handData: any) => {
    // Simulate integrity validation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      checksumValid: Math.random() > 0.05, // 95% pass rate
      sequenceValid: validateActionSequence(handData.actions),
      timingValid: validateActionTiming(handData.actions),
      actionsValid: validatePlayerActions(handData.actions, handData.players)
    };
  };

  const validateActionSequence = (actions: any[]) => {
    // Simulate sequence validation
    return actions.length > 0 && Math.random() > 0.02;
  };

  const validateActionTiming = (actions: any[]) => {
    // Simulate timing validation
    if (actions.length < 2) return true;
    
    for (let i = 1; i < actions.length; i++) {
      const timeDiff = new Date(actions[i].timestamp).getTime() - new Date(actions[i-1].timestamp).getTime();
      if (timeDiff < 0) return false; // Actions out of order
      if (timeDiff > 300000) return false; // More than 5 minutes between actions
    }
    
    return true;
  };

  const validatePlayerActions = (actions: any[], players: any[]) => {
    // Simulate player action validation
    const playerIds = players.map((p: any) => p.id);
    return actions.every((action: any) => playerIds.includes(action.playerId));
  };

  const generateAuditFlags = async (handData: any) => {
    const flags = [];
    
    // Check for unusual betting patterns
    if (detectUnusualBetting(handData.actions)) {
      flags.push('UNUSUAL_BETTING');
    }
    
    // Check for timing anomalies
    if (detectTimingAnomalies(handData.actions)) {
      flags.push('TIMING_ANOMALY');
    }
    
    // Check for pot size discrepancies
    if (detectPotDiscrepancies(handData)) {
      flags.push('POT_DISCREPANCY');
    }
    
    // Check for impossible actions
    if (detectImpossibleActions(handData.actions)) {
      flags.push('CRITICAL');
    }
    
    return flags;
  };

  const detectUnusualBetting = (actions: any[]) => {
    // Simulate unusual betting detection
    return Math.random() > 0.9;
  };

  const detectTimingAnomalies = (actions: any[]) => {
    // Simulate timing anomaly detection
    return Math.random() > 0.95;
  };

  const detectPotDiscrepancies = (handData: any) => {
    // Simulate pot discrepancy detection
    const calculatedPot = handData.actions
      .filter((action: any) => ['BET', 'CALL', 'RAISE'].includes(action.type))
      .reduce((sum: number, action: any) => sum + (action.amount || 0), 0);
    
    return Math.abs(calculatedPot - handData.pot) > 0.01;
  };

  const detectImpossibleActions = (actions: any[]) => {
    // Simulate impossible action detection
    return Math.random() > 0.98;
  };

  const fetchAuditEntries = async (appliedFilters: AuditFilters = filters) => {
    setLoading(true);
    try {
      // Simulate fetching from database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Apply filters
      let filtered = auditEntries;
      
      if (appliedFilters.flagged) {
        filtered = filtered.filter(entry => entry.flags.length > 0);
      }
      
      if (appliedFilters.integrityIssues) {
        filtered = filtered.filter(entry => 
          !entry.integrity.checksumValid || 
          !entry.integrity.sequenceValid ||
          !entry.integrity.timingValid ||
          !entry.integrity.actionsValid
        );
      }
      
      if (appliedFilters.tableId) {
        filtered = filtered.filter(entry => entry.tableId === appliedFilters.tableId);
      }
      
      if (appliedFilters.playerId) {
        filtered = filtered.filter(entry => entry.players.includes(appliedFilters.playerId!));
      }
      
      setAuditEntries(filtered);
    } catch (error) {
      console.error('Error fetching audit entries:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las entradas de auditoría",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportAuditReport = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const data = auditEntries.map(entry => ({
        handId: entry.handId,
        tableId: entry.tableId,
        timestamp: entry.timestamp.toISOString(),
        players: entry.players.join(', '),
        finalPot: entry.finalPot,
        checksumValid: entry.integrity.checksumValid,
        flags: entry.flags.join(', ')
      }));
      
      let exportData;
      if (format === 'csv') {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        exportData = [headers, ...rows].join('\n');
      } else {
        exportData = JSON.stringify(data, null, 2);
      }
      
      // Create download
      const blob = new Blob([exportData], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_report_${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Reporte Exportado",
        description: `Reporte de auditoría exportado en formato ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error exporting audit report:', error);
      toast({
        title: "Error de Exportación",
        description: "No se pudo exportar el reporte de auditoría",
        variant: "destructive",
      });
    }
  };

  return {
    auditEntries,
    filters,
    loading,
    stats,
    auditHand,
    fetchAuditEntries,
    setFilters,
    exportAuditReport
  };
}
