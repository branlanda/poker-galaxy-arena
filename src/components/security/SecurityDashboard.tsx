
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAntiCollusion } from '@/hooks/useAntiCollusion';
import { useBotDetection } from '@/hooks/useBotDetection';
import { useHandAuditing } from '@/hooks/useHandAuditing';
import { useModerationSystem } from '@/hooks/useModerationSystem';
import { Shield, AlertTriangle, Activity, FileText, Users, Bot, Eye, Flag } from 'lucide-react';

const SecurityDashboard: React.FC = () => {
  const { alerts: collusionAlerts, isAnalyzing, config: antiCollusionConfig } = useAntiCollusion();
  const { alerts: botAlerts, isMonitoring, setIsMonitoring } = useBotDetection();
  const { stats: auditStats, exportAuditReport } = useHandAuditing();
  const { stats: moderationStats, reports } = useModerationSystem();

  const [activeTab, setActiveTab] = useState('overview');

  const overviewStats = [
    {
      title: 'Alertas de Colusión',
      value: collusionAlerts.filter(a => a.status === 'new').length,
      icon: Users,
      color: 'text-red-500'
    },
    {
      title: 'Detección de Bots',
      value: botAlerts.length,
      icon: Bot,
      color: 'text-orange-500'
    },
    {
      title: 'Manos Auditadas',
      value: auditStats.totalHands,
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      title: 'Reportes Pendientes',
      value: moderationStats.pendingReports,
      icon: Flag,
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 bg-navy min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-emerald" />
        <h1 className="text-3xl font-bold text-white">Centro de Seguridad y Fair Play</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="bg-navy-light border-emerald/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-navy-light">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="collusion">Anti-Colusión</TabsTrigger>
          <TabsTrigger value="bots">Anti-Bots</TabsTrigger>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
          <TabsTrigger value="moderation">Moderación</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card className="bg-navy-light border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Alertas Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...collusionAlerts.slice(0, 3), ...botAlerts.slice(0, 2)].map((alert, index) => {
                    const isCollusionAlert = 'players' in alert;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-navy rounded border border-emerald/10">
                        <div>
                          <p className="text-sm text-white">
                            {isCollusionAlert ? `Colusión: ${alert.detectionType}` : `Bot: ${alert.detectionType}`}
                          </p>
                          <p className="text-xs text-gray-400">
                            Confianza: {(alert.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Badge variant={alert.confidence > 0.8 ? 'destructive' : 'secondary'}>
                          {alert.confidence > 0.8 ? 'Crítico' : 'Medio'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-navy-light border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald" />
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Anti-Colusión</span>
                    <Badge variant={antiCollusionConfig.enabled ? 'default' : 'secondary'}>
                      {antiCollusionConfig.enabled ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Detección de Bots</span>
                    <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                      {isMonitoring ? 'Monitoreando' : 'Parado'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Auditoría de Manos</span>
                    <Badge variant="default">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Sistema de Reportes</span>
                    <Badge variant="default">Activo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collusion" className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Sistema Anti-Colusión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Estado:</span>
                  <Badge variant={antiCollusionConfig.enabled ? 'default' : 'secondary'}>
                    {antiCollusionConfig.enabled ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Sensibilidad:</span>
                  <Badge variant="outline">{antiCollusionConfig.sensitivityLevel}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Analizando:</span>
                  <Badge variant={isAnalyzing ? 'default' : 'secondary'}>
                    {isAnalyzing ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Alertas de Colusión ({collusionAlerts.length})</h4>
                <div className="space-y-3">
                  {collusionAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-navy rounded border border-emerald/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={alert.confidence > 0.8 ? 'destructive' : 'secondary'}>
                          {alert.detectionType}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {alert.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Jugadores: {alert.players.join(', ')}
                      </p>
                      <p className="text-sm text-gray-400">
                        Confianza: {(alert.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Detección de Bots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Monitoreo:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                      {isMonitoring ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => setIsMonitoring(!isMonitoring)}
                      variant={isMonitoring ? 'destructive' : 'default'}
                    >
                      {isMonitoring ? 'Detener' : 'Iniciar'}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Alertas de Bots ({botAlerts.length})</h4>
                <div className="space-y-3">
                  {botAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-navy rounded border border-emerald/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={alert.confidence > 0.8 ? 'destructive' : 'secondary'}>
                          {alert.detectionType}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {alert.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Jugador: {alert.playerId}
                      </p>
                      <p className="text-sm text-gray-400">
                        Confianza: {(alert.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Auditoría de Manos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">{auditStats.totalHands}</div>
                  <div className="text-sm text-gray-400">Total Manos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{auditStats.verifiedHands}</div>
                  <div className="text-sm text-gray-400">Verificadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{auditStats.flaggedHands}</div>
                  <div className="text-sm text-gray-400">Con Flags</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{auditStats.integrityIssues}</div>
                  <div className="text-sm text-gray-400">Problemas</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => exportAuditReport('csv')}
                  variant="outline"
                  size="sm"
                >
                  Exportar CSV
                </Button>
                <Button 
                  onClick={() => exportAuditReport('json')}
                  variant="outline"
                  size="sm"
                >
                  Exportar JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Sistema de Moderación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">{moderationStats.totalReports}</div>
                  <div className="text-sm text-gray-400">Total Reportes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{moderationStats.pendingReports}</div>
                  <div className="text-sm text-gray-400">Pendientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{moderationStats.resolvedReports}</div>
                  <div className="text-sm text-gray-400">Resueltos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{moderationStats.activeActions}</div>
                  <div className="text-sm text-gray-400">Acciones Activas</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Reportes Recientes</h4>
                <div className="space-y-3">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report.id} className="p-3 bg-navy rounded border border-emerald/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={
                          report.priority === 'CRITICAL' ? 'destructive' : 
                          report.priority === 'HIGH' ? 'secondary' : 'outline'
                        }>
                          {report.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {report.createdAt.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        {report.description}
                      </p>
                      <p className="text-sm text-gray-400">
                        Estado: {report.status} | Prioridad: {report.priority}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
