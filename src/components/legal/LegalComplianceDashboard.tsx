
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLegalCompliance } from '@/hooks/useLegalCompliance';
import { Shield, FileText, User, Globe, AlertTriangle, Calendar } from 'lucide-react';

const LegalComplianceDashboard: React.FC = () => {
  const {
    documents,
    consents,
    selfExclusions,
    gdprRequests,
    geoRestrictions,
    ageVerifications,
    createLegalDocument,
    requestSelfExclusion,
    submitGDPRRequest,
    verifyAge,
    processGDPRRequest
  } = useLegalCompliance();

  const [activeTab, setActiveTab] = useState('overview');
  const [newDocument, setNewDocument] = useState({
    type: 'TERMS_CONDITIONS' as const,
    version: '',
    content: '',
    jurisdiction: 'ES'
  });

  const stats = [
    {
      title: 'Documentos Legales',
      value: documents.filter(d => d.isActive).length,
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      title: 'Auto-exclusiones Activas',
      value: selfExclusions.filter(s => s.status === 'ACTIVE').length,
      icon: User,
      color: 'text-red-500'
    },
    {
      title: 'Solicitudes GDPR Pendientes',
      value: gdprRequests.filter(r => r.status === 'PENDING').length,
      icon: Shield,
      color: 'text-yellow-500'
    },
    {
      title: 'Verificaciones de Edad',
      value: ageVerifications.filter(v => v.status === 'PENDING').length,
      icon: Calendar,
      color: 'text-green-500'
    }
  ];

  const handleCreateDocument = () => {
    if (newDocument.version && newDocument.content) {
      createLegalDocument({
        ...newDocument,
        effectiveDate: new Date(),
        isActive: true
      });
      setNewDocument({
        type: 'TERMS_CONDITIONS',
        version: '',
        content: '',
        jurisdiction: 'ES'
      });
    }
  };

  const handleSelfExclusion = (type: 'TEMPORARY' | 'PERMANENT', duration?: number) => {
    requestSelfExclusion({
      userId: 'current_user', // This would be the actual user ID
      type,
      duration,
      reason: 'Solicitud voluntaria del usuario'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-navy min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-emerald" />
        <h1 className="text-3xl font-bold text-white">Centro Legal y Compliance</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-navy-light">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR</TabsTrigger>
          <TabsTrigger value="self-exclusion">Auto-exclusión</TabsTrigger>
          <TabsTrigger value="age-verification">Verificación</TabsTrigger>
          <TabsTrigger value="geo-restrictions">Restricciones Geo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-navy-light border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white">Estado de Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Términos y Condiciones</span>
                    <Badge variant="default">Actualizado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Política de Privacidad GDPR</span>
                    <Badge variant="default">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Verificación de Edad</span>
                    <Badge variant="secondary">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Restricciones Geográficas</span>
                    <Badge variant="default">Configuradas</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-light border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...gdprRequests.slice(0, 3), ...selfExclusions.slice(0, 2)].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-navy rounded border border-emerald/10">
                      <div>
                        <p className="text-sm text-white">
                          {'type' in item && item.type === 'DATA_ACCESS' ? 'Solicitud GDPR' : 'Auto-exclusión'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {('requestDate' in item ? item.requestDate : new Date()).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Crear Nuevo Documento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select value={newDocument.type} onValueChange={(value: any) => setNewDocument({...newDocument, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TERMS_CONDITIONS">Términos y Condiciones</SelectItem>
                    <SelectItem value="PRIVACY_POLICY">Política de Privacidad</SelectItem>
                    <SelectItem value="RESPONSIBLE_GAMING">Juego Responsable</SelectItem>
                    <SelectItem value="COOKIE_POLICY">Política de Cookies</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Versión"
                  value={newDocument.version}
                  onChange={(e) => setNewDocument({...newDocument, version: e.target.value})}
                />
              </div>
              <Textarea
                placeholder="Contenido del documento"
                value={newDocument.content}
                onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
                rows={6}
              />
              <Button onClick={handleCreateDocument}>Crear Documento</Button>
            </CardContent>
          </Card>

          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Documentos Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-navy rounded border border-emerald/10">
                    <div>
                      <p className="text-sm text-white font-medium">{doc.type}</p>
                      <p className="text-xs text-gray-400">Versión {doc.version} - {doc.jurisdiction}</p>
                    </div>
                    <Badge variant={doc.isActive ? 'default' : 'secondary'}>
                      {doc.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gdpr" className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Solicitudes GDPR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gdprRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-navy rounded border border-emerald/10">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        request.status === 'COMPLETED' ? 'default' : 
                        request.status === 'PENDING' ? 'secondary' : 'outline'
                      }>
                        {request.type}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {request.requestDate.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-white mb-2">{request.details}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{request.status}</Badge>
                      {request.status === 'PENDING' && (
                        <Button 
                          size="sm" 
                          onClick={() => processGDPRRequest(request.id, 'Procesado', 'COMPLETED')}
                        >
                          Procesar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="self-exclusion" className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Auto-exclusión Voluntaria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-500 font-medium">Juego Responsable</span>
                </div>
                <p className="text-sm text-gray-300">
                  La auto-exclusión te permite limitar tu acceso a la plataforma por un período determinado.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleSelfExclusion('TEMPORARY', 30)}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="font-medium">30 Días</span>
                  <span className="text-xs text-gray-400">Exclusión Temporal</span>
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleSelfExclusion('PERMANENT')}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="font-medium">Permanente</span>
                  <span className="text-xs">Exclusión Definitiva</span>
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-medium">Auto-exclusiones Activas</h4>
                {selfExclusions.map((exclusion) => (
                  <div key={exclusion.id} className="p-3 bg-navy rounded border border-emerald/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">{exclusion.type}</p>
                        <p className="text-xs text-gray-400">
                          Desde: {exclusion.requestDate.toLocaleDateString()}
                          {exclusion.expiryDate && ` - Hasta: ${exclusion.expiryDate.toLocaleDateString()}`}
                        </p>
                      </div>
                      <Badge variant={exclusion.status === 'ACTIVE' ? 'destructive' : 'outline'}>
                        {exclusion.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="age-verification" className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Verificaciones de Edad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ageVerifications.map((verification) => (
                  <div key={verification.id} className="p-3 bg-navy rounded border border-emerald/10">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        verification.status === 'VERIFIED' ? 'default' : 
                        verification.status === 'PENDING' ? 'secondary' : 'destructive'
                      }>
                        {verification.verificationMethod}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {verification.verificationDate.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">Usuario: {verification.userId}</span>
                      <Badge variant="outline">{verification.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geo-restrictions" className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Restricciones Geográficas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geoRestrictions.map((restriction) => (
                  <div key={restriction.id} className="p-3 bg-navy rounded border border-emerald/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white font-medium">
                        {restriction.country} {restriction.region && `- ${restriction.region}`}
                      </span>
                      <Badge variant={restriction.isBlocked ? 'destructive' : 'default'}>
                        {restriction.isBlocked ? 'Bloqueado' : 'Permitido'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{restriction.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalComplianceDashboard;
