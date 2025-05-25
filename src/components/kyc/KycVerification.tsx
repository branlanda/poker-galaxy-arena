
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface KycData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  documentType: string;
  documentNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface DocumentUpload {
  front: File | null;
  back: File | null;
  selfie: File | null;
  proofOfAddress: File | null;
}

const KycVerification: React.FC = () => {
  const [kycData, setKycData] = useState<KycData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    documentType: '',
    documentNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  
  const [documents, setDocuments] = useState<DocumentUpload>({
    front: null,
    back: null,
    selfie: null,
    proofOfAddress: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected' | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof KycData, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: keyof DocumentUpload, file: File | null) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!kycData.firstName || !kycData.lastName || !kycData.documentNumber) {
        throw new Error('Por favor complete todos los campos obligatorios');
      }

      if (!documents.front || !documents.selfie) {
        throw new Error('Por favor suba al menos la foto del documento frontal y selfie');
      }

      // Simulate KYC submission
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setVerificationStatus('pending');
      toast({
        title: "KYC Enviado",
        description: "Su documentación ha sido enviada para verificación. Recibirá una respuesta en 24-48 horas.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar documentación';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  if (verificationStatus === 'verified') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Verificación Completada</h3>
            <p className="text-muted-foreground">
              Su identidad ha sido verificada exitosamente. Ahora puede acceder a todas las funciones de la plataforma.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Verificación de Identidad (KYC)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete este proceso para cumplir con las regulaciones y acceder a todas las funciones.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={kycData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={kycData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Fecha de Nacimiento *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={kycData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidad</Label>
                <Select onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su nacionalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AR">Argentina</SelectItem>
                    <SelectItem value="BR">Brasil</SelectItem>
                    <SelectItem value="CL">Chile</SelectItem>
                    <SelectItem value="CO">Colombia</SelectItem>
                    <SelectItem value="MX">México</SelectItem>
                    <SelectItem value="PE">Perú</SelectItem>
                    <SelectItem value="UY">Uruguay</SelectItem>
                    <SelectItem value="US">Estados Unidos</SelectItem>
                    <SelectItem value="ES">España</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documento de Identidad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento *</Label>
                <Select onValueChange={(value) => handleInputChange('documentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dni">DNI</SelectItem>
                    <SelectItem value="passport">Pasaporte</SelectItem>
                    <SelectItem value="license">Licencia de Conducir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número de Documento *</Label>
                <Input
                  id="documentNumber"
                  value={kycData.documentNumber}
                  onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dirección</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección Completa</Label>
                <Input
                  id="address"
                  value={kycData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={kycData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    value={kycData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Select onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AR">Argentina</SelectItem>
                      <SelectItem value="BR">Brasil</SelectItem>
                      <SelectItem value="CL">Chile</SelectItem>
                      <SelectItem value="CO">Colombia</SelectItem>
                      <SelectItem value="MX">México</SelectItem>
                      <SelectItem value="PE">Perú</SelectItem>
                      <SelectItem value="UY">Uruguay</SelectItem>
                      <SelectItem value="US">Estados Unidos</SelectItem>
                      <SelectItem value="ES">España</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Subir Documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="front">Documento Frontal *</Label>
                <Input
                  id="front"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('front', e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="back">Documento Reverso</Label>
                <Input
                  id="back"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('back', e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selfie">Selfie con Documento *</Label>
                <Input
                  id="selfie"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('selfie', e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proofOfAddress">Comprobante de Domicilio</Label>
                <Input
                  id="proofOfAddress"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('proofOfAddress', e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || verificationStatus === 'pending'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando documentación...
              </>
            ) : verificationStatus === 'pending' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verificación en proceso...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Enviar para Verificación
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KycVerification;
