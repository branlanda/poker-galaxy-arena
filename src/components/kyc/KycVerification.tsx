
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle, Clock, AlertCircle, Shield, FileText, Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KycLevel {
  level: number;
  name: string;
  description: string;
  requirements: string[];
  limits: string;
  status: 'completed' | 'pending' | 'rejected' | 'not_started';
}

const KycVerification: React.FC = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState({
    id_front: null as File | null,
    id_back: null as File | null,
    proof_of_address: null as File | null,
    selfie: null as File | null
  });

  const kycLevels: KycLevel[] = [
    {
      level: 1,
      name: 'Verificación Básica',
      description: 'Verificación de identidad básica',
      requirements: ['Documento de identidad válido'],
      limits: 'Límite de depósito: $1,000/mes',
      status: 'completed'
    },
    {
      level: 2,
      name: 'Verificación Estándar',
      description: 'Verificación completa de identidad',
      requirements: ['Documento de identidad', 'Selfie con documento'],
      limits: 'Límite de depósito: $10,000/mes',
      status: 'pending'
    },
    {
      level: 3,
      name: 'Verificación Premium',
      description: 'Verificación completa con comprobante de domicilio',
      requirements: ['Documento de identidad', 'Selfie', 'Comprobante de domicilio'],
      limits: 'Sin límites de depósito',
      status: 'not_started'
    }
  ];

  const handleFileUpload = (type: keyof typeof documents, file: File) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
    toast({
      title: "Archivo cargado",
      description: `${file.name} ha sido cargado exitosamente`,
    });
  };

  const handleSubmitVerification = async () => {
    setUploading(true);
    try {
      // Simular envío de documentos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Documentos enviados",
        description: "Tus documentos han sido enviados para revisión. Te notificaremos el resultado en 1-3 días hábiles.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron enviar los documentos. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: KycLevel['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Shield className="h-5 w-5 text-white" />;
    }
  };

  const getStatusBadge = (status: KycLevel['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Completado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">Pendiente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/20">Rechazado</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-white border-gray-500/20">No iniciado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-transparent border-emerald/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-white" />
            Verificación KYC (Know Your Customer)
          </CardTitle>
          <p className="text-white">
            Verifica tu identidad para aumentar los límites de tu cuenta y acceder a todas las funcionalidades.
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="levels" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent border border-emerald/20">
          <TabsTrigger value="levels" className="text-white data-[state=active]:bg-emerald data-[state=active]:text-white">
            Niveles de Verificación
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-white data-[state=active]:bg-emerald data-[state=active]:text-white">
            Subir Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="levels" className="space-y-4">
          {kycLevels.map((level) => (
            <Card key={level.level} className="bg-transparent border-emerald/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(level.status)}
                    <div>
                      <CardTitle className="text-lg text-white">Nivel {level.level} - {level.name}</CardTitle>
                      <p className="text-white">{level.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(level.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-white">Requisitos:</h4>
                    <ul className="space-y-1">
                      {level.requirements.map((req, index) => (
                        <li key={index} className="text-sm flex items-center gap-2 text-white">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-white">Límites:</h4>
                    <p className="text-sm text-white">{level.limits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card className="bg-transparent border-emerald/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Subir Documentos</CardTitle>
              <p className="text-white">
                Sube los documentos requeridos para completar tu verificación KYC.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="id-front" className="text-white">Documento de Identidad (Frente)</Label>
                  <div className="border-2 border-dashed border-emerald/20 rounded-lg p-6 text-center bg-slate-800/30">
                    <FileText className="h-12 w-12 mx-auto text-white mb-4" />
                    <Input
                      id="id-front"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('id_front', file);
                      }}
                      className="hidden"
                    />
                    <Label htmlFor="id-front" className="cursor-pointer">
                      <Button variant="outline" asChild className="border-emerald/20 text-white hover:bg-emerald/10 bg-transparent">
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Seleccionar archivo
                        </span>
                      </Button>
                    </Label>
                    {documents.id_front && (
                      <p className="text-sm text-green-400 mt-2">
                        ✓ {documents.id_front.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id-back" className="text-white">Documento de Identidad (Reverso)</Label>
                  <div className="border-2 border-dashed border-emerald/20 rounded-lg p-6 text-center bg-slate-800/30">
                    <FileText className="h-12 w-12 mx-auto text-white mb-4" />
                    <Input
                      id="id-back"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('id_back', file);
                      }}
                      className="hidden"
                    />
                    <Label htmlFor="id-back" className="cursor-pointer">
                      <Button variant="outline" asChild className="border-emerald/20 text-white hover:bg-emerald/10 bg-transparent">
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Seleccionar archivo
                        </span>
                      </Button>
                    </Label>
                    {documents.id_back && (
                      <p className="text-sm text-green-400 mt-2">
                        ✓ {documents.id_back.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selfie" className="text-white">Selfie con Documento</Label>
                  <div className="border-2 border-dashed border-emerald/20 rounded-lg p-6 text-center bg-slate-800/30">
                    <Camera className="h-12 w-12 mx-auto text-white mb-4" />
                    <Input
                      id="selfie"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('selfie', file);
                      }}
                      className="hidden"
                    />
                    <Label htmlFor="selfie" className="cursor-pointer">
                      <Button variant="outline" asChild className="border-emerald/20 text-white hover:bg-emerald/10 bg-transparent">
                        <span>
                          <Camera className="h-4 w-4 mr-2" />
                          Tomar/Seleccionar foto
                        </span>
                      </Button>
                    </Label>
                    {documents.selfie && (
                      <p className="text-sm text-green-400 mt-2">
                        ✓ {documents.selfie.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proof-address" className="text-white">Comprobante de Domicilio</Label>
                  <div className="border-2 border-dashed border-emerald/20 rounded-lg p-6 text-center bg-slate-800/30">
                    <FileText className="h-12 w-12 mx-auto text-white mb-4" />
                    <Input
                      id="proof-address"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('proof_of_address', file);
                      }}
                      className="hidden"
                    />
                    <Label htmlFor="proof-address" className="cursor-pointer">
                      <Button variant="outline" asChild className="border-emerald/20 text-white hover:bg-emerald/10 bg-transparent">
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Seleccionar archivo
                        </span>
                      </Button>
                    </Label>
                    {documents.proof_of_address && (
                      <p className="text-sm text-green-400 mt-2">
                        ✓ {documents.proof_of_address.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-emerald/20 rounded-lg p-4 bg-slate-800/30">
                <h4 className="font-medium text-white mb-2">Información importante:</h4>
                <ul className="text-sm text-white space-y-1">
                  <li>• Los documentos deben estar en formato JPG, PNG o PDF</li>
                  <li>• Asegúrate de que la información sea legible y no esté borrosa</li>
                  <li>• Los documentos deben estar vigentes</li>
                  <li>• El procesamiento puede tomar entre 1-3 días hábiles</li>
                </ul>
              </div>

              <Button
                onClick={handleSubmitVerification}
                disabled={uploading || !documents.id_front}
                className="w-full bg-emerald hover:bg-emerald/90 text-white"
              >
                {uploading ? "Enviando..." : "Enviar Documentos para Verificación"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KycVerification;
