
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface PlayerReport {
  id: string;
  reporterId: string;
  reportedPlayerId: string;
  category: 'CHEATING' | 'INAPPROPRIATE_BEHAVIOR' | 'ABUSE' | 'COLLUSION' | 'OTHER';
  description: string;
  evidence?: string[];
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedModerator?: string;
  createdAt: Date;
  updatedAt: Date;
  resolution?: string;
}

interface ModerationAction {
  id: string;
  targetPlayerId: string;
  moderatorId: string;
  actionType: 'WARNING' | 'MUTE' | 'TEMPORARY_BAN' | 'PERMANENT_BAN' | 'ACCOUNT_RESTRICTION';
  reason: string;
  duration?: number; // in hours
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  activeActions: number;
  averageResolutionTime: number;
}

export function useModerationSystem() {
  const [reports, setReports] = useState<PlayerReport[]>([]);
  const [actions, setActions] = useState<ModerationAction[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    activeActions: 0,
    averageResolutionTime: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitReport = async (report: Omit<PlayerReport, 'id' | 'status' | 'priority' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newReport: PlayerReport = {
        ...report,
        id: `report_${Date.now()}`,
        status: 'PENDING',
        priority: calculateReportPriority(report),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setReports(prev => [newReport, ...prev]);
      
      // Simulate database save
      const { error } = await supabase
        .from('player_activities')
        .insert({
          player_id: report.reporterId,
          activity_type: 'SUBMIT_REPORT',
          content: report.description,
          metadata: {
            reported_player_id: report.reportedPlayerId,
            category: report.category,
            evidence: report.evidence
          }
        });

      if (error) throw error;

      updateStats();
      
      toast({
        title: "Reporte Enviado",
        description: "Tu reporte ha sido enviado y será revisado por nuestro equipo de moderación",
      });

      return newReport;
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el reporte. Inténtalo nuevamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const calculateReportPriority = (report: Omit<PlayerReport, 'id' | 'status' | 'priority' | 'createdAt' | 'updatedAt'>) => {
    const priorityMap = {
      'CHEATING': 'CRITICAL',
      'COLLUSION': 'HIGH',
      'ABUSE': 'MEDIUM',
      'INAPPROPRIATE_BEHAVIOR': 'MEDIUM',
      'OTHER': 'LOW'
    };
    
    return priorityMap[report.category] as PlayerReport['priority'];
  };

  const investigateReport = async (reportId: string, moderatorId: string) => {
    try {
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                status: 'INVESTIGATING', 
                assignedModerator: moderatorId,
                updatedAt: new Date() 
              }
            : report
        )
      );

      toast({
        title: "Investigación Iniciada",
        description: "El reporte está siendo investigado",
      });
    } catch (error) {
      console.error('Error investigating report:', error);
    }
  };

  const resolveReport = async (
    reportId: string, 
    resolution: string, 
    action?: Omit<ModerationAction, 'id' | 'createdAt' | 'isActive'>
  ) => {
    try {
      // Update report status
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                status: 'RESOLVED', 
                resolution,
                updatedAt: new Date() 
              }
            : report
        )
      );

      // Apply moderation action if provided
      if (action) {
        const newAction: ModerationAction = {
          ...action,
          id: `action_${Date.now()}`,
          createdAt: new Date(),
          isActive: true,
          expiresAt: action.duration ? new Date(Date.now() + action.duration * 60 * 60 * 1000) : undefined
        };

        setActions(prev => [newAction, ...prev]);
        
        toast({
          title: "Acción de Moderación Aplicada",
          description: `Se aplicó ${action.actionType} al jugador`,
        });
      }

      updateStats();
      
      toast({
        title: "Reporte Resuelto",
        description: "El reporte ha sido resuelto exitosamente",
      });
    } catch (error) {
      console.error('Error resolving report:', error);
      toast({
        title: "Error",
        description: "No se pudo resolver el reporte",
        variant: "destructive",
      });
    }
  };

  const dismissReport = async (reportId: string, reason: string) => {
    try {
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                status: 'DISMISSED', 
                resolution: reason,
                updatedAt: new Date() 
              }
            : report
        )
      );

      updateStats();
      
      toast({
        title: "Reporte Desestimado",
        description: "El reporte ha sido desestimado",
      });
    } catch (error) {
      console.error('Error dismissing report:', error);
    }
  };

  const applyModerationAction = async (action: Omit<ModerationAction, 'id' | 'createdAt' | 'isActive'>) => {
    try {
      const newAction: ModerationAction = {
        ...action,
        id: `action_${Date.now()}`,
        createdAt: new Date(),
        isActive: true,
        expiresAt: action.duration ? new Date(Date.now() + action.duration * 60 * 60 * 1000) : undefined
      };

      setActions(prev => [newAction, ...prev]);
      updateStats();
      
      toast({
        title: "Acción Aplicada",
        description: `Se aplicó ${action.actionType} al jugador`,
      });

      return newAction;
    } catch (error) {
      console.error('Error applying moderation action:', error);
      throw error;
    }
  };

  const expireModerationAction = async (actionId: string) => {
    try {
      setActions(prev => 
        prev.map(action => 
          action.id === actionId 
            ? { ...action, isActive: false }
            : action
        )
      );

      updateStats();
      
      toast({
        title: "Acción Expirada",
        description: "La acción de moderación ha expirado",
      });
    } catch (error) {
      console.error('Error expiring moderation action:', error);
    }
  };

  const getPlayerModerationHistory = (playerId: string) => {
    return {
      reports: reports.filter(report => 
        report.reportedPlayerId === playerId || report.reporterId === playerId
      ),
      actions: actions.filter(action => action.targetPlayerId === playerId)
    };
  };

  const updateStats = () => {
    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status === 'PENDING').length;
    const resolvedReports = reports.filter(r => r.status === 'RESOLVED').length;
    const activeActions = actions.filter(a => a.isActive).length;
    
    // Calculate average resolution time
    const resolvedWithTimes = reports.filter(r => r.status === 'RESOLVED');
    const averageResolutionTime = resolvedWithTimes.length > 0 
      ? resolvedWithTimes.reduce((sum, report) => {
          const resolutionTime = report.updatedAt.getTime() - report.createdAt.getTime();
          return sum + resolutionTime;
        }, 0) / resolvedWithTimes.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    setStats({
      totalReports,
      pendingReports,
      resolvedReports,
      activeActions,
      averageResolutionTime
    });
  };

  // Auto-expire actions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      actions.forEach(action => {
        if (action.isActive && action.expiresAt && action.expiresAt <= now) {
          expireModerationAction(action.id);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [actions]);

  useEffect(() => {
    updateStats();
  }, [reports, actions]);

  return {
    reports,
    actions,
    stats,
    loading,
    submitReport,
    investigateReport,
    resolveReport,
    dismissReport,
    applyModerationAction,
    expireModerationAction,
    getPlayerModerationHistory
  };
}
