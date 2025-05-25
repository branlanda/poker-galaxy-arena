
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LegalDocument {
  id: string;
  type: 'TERMS_CONDITIONS' | 'PRIVACY_POLICY' | 'RESPONSIBLE_GAMING' | 'COOKIE_POLICY';
  version: string;
  content: string;
  effectiveDate: Date;
  isActive: boolean;
  jurisdiction: string;
}

interface UserConsent {
  id: string;
  userId: string;
  documentId: string;
  consentDate: Date;
  ipAddress: string;
  userAgent: string;
  isWithdrawn: boolean;
}

interface SelfExclusionRequest {
  id: string;
  userId: string;
  type: 'TEMPORARY' | 'PERMANENT';
  duration?: number; // in days for temporary
  reason: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED';
  requestDate: Date;
  effectiveDate?: Date;
  expiryDate?: Date;
}

interface GDPRRequest {
  id: string;
  userId: string;
  type: 'DATA_ACCESS' | 'DATA_DELETION' | 'DATA_PORTABILITY' | 'DATA_RECTIFICATION';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  requestDate: Date;
  completionDate?: Date;
  details: string;
  response?: string;
}

interface GeographicRestriction {
  id: string;
  country: string;
  region?: string;
  isBlocked: boolean;
  reason: string;
  effectiveDate: Date;
}

interface AgeVerification {
  id: string;
  userId: string;
  verificationMethod: 'DOCUMENT' | 'DATABASE' | 'THIRD_PARTY';
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  dateOfBirth?: Date;
  documentType?: string;
  verificationDate: Date;
  notes?: string;
}

export function useLegalCompliance() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [consents, setConsents] = useState<UserConsent[]>([]);
  const [selfExclusions, setSelfExclusions] = useState<SelfExclusionRequest[]>([]);
  const [gdprRequests, setGdprRequests] = useState<GDPRRequest[]>([]);
  const [geoRestrictions, setGeoRestrictions] = useState<GeographicRestriction[]>([]);
  const [ageVerifications, setAgeVerifications] = useState<AgeVerification[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createLegalDocument = async (document: Omit<LegalDocument, 'id'>) => {
    try {
      const newDocument: LegalDocument = {
        ...document,
        id: `doc_${Date.now()}`,
      };

      setDocuments(prev => [newDocument, ...prev]);
      
      toast({
        title: "Documento Legal Creado",
        description: "El documento ha sido creado exitosamente",
      });

      return newDocument;
    } catch (error) {
      console.error('Error creating legal document:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el documento legal",
        variant: "destructive",
      });
      throw error;
    }
  };

  const recordUserConsent = async (consent: Omit<UserConsent, 'id'>) => {
    try {
      const newConsent: UserConsent = {
        ...consent,
        id: `consent_${Date.now()}`,
      };

      setConsents(prev => [newConsent, ...prev]);
      
      toast({
        title: "Consentimiento Registrado",
        description: "El consentimiento del usuario ha sido registrado",
      });

      return newConsent;
    } catch (error) {
      console.error('Error recording consent:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el consentimiento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const requestSelfExclusion = async (request: Omit<SelfExclusionRequest, 'id' | 'status' | 'requestDate'>) => {
    try {
      const newRequest: SelfExclusionRequest = {
        ...request,
        id: `exclusion_${Date.now()}`,
        status: 'PENDING',
        requestDate: new Date(),
        effectiveDate: new Date(),
        expiryDate: request.type === 'TEMPORARY' && request.duration 
          ? new Date(Date.now() + request.duration * 24 * 60 * 60 * 1000)
          : undefined
      };

      setSelfExclusions(prev => [newRequest, ...prev]);
      
      toast({
        title: "Solicitud de Auto-exclusión",
        description: "Tu solicitud ha sido procesada. Será efectiva inmediatamente.",
      });

      return newRequest;
    } catch (error) {
      console.error('Error processing self-exclusion:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud de auto-exclusión",
        variant: "destructive",
      });
      throw error;
    }
  };

  const submitGDPRRequest = async (request: Omit<GDPRRequest, 'id' | 'status' | 'requestDate'>) => {
    try {
      const newRequest: GDPRRequest = {
        ...request,
        id: `gdpr_${Date.now()}`,
        status: 'PENDING',
        requestDate: new Date(),
      };

      setGdprRequests(prev => [newRequest, ...prev]);
      
      toast({
        title: "Solicitud GDPR Enviada",
        description: "Tu solicitud será procesada dentro de 30 días",
      });

      return newRequest;
    } catch (error) {
      console.error('Error submitting GDPR request:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud GDPR",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyAge = async (verification: Omit<AgeVerification, 'id' | 'status' | 'verificationDate'>) => {
    try {
      const newVerification: AgeVerification = {
        ...verification,
        id: `age_${Date.now()}`,
        status: 'PENDING',
        verificationDate: new Date(),
      };

      setAgeVerifications(prev => [newVerification, ...prev]);
      
      toast({
        title: "Verificación de Edad Enviada",
        description: "Tu documentación será revisada en las próximas 24 horas",
      });

      return newVerification;
    } catch (error) {
      console.error('Error submitting age verification:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la verificación de edad",
        variant: "destructive",
      });
      throw error;
    }
  };

  const checkGeographicRestrictions = (country: string, region?: string) => {
    return geoRestrictions.find(restriction => 
      restriction.country === country && 
      (!restriction.region || restriction.region === region) &&
      restriction.isBlocked
    );
  };

  const isUserSelfExcluded = (userId: string) => {
    const activeExclusion = selfExclusions.find(exclusion => 
      exclusion.userId === userId && 
      exclusion.status === 'ACTIVE' &&
      (!exclusion.expiryDate || exclusion.expiryDate > new Date())
    );
    
    return !!activeExclusion;
  };

  const getUserConsents = (userId: string) => {
    return consents.filter(consent => 
      consent.userId === userId && !consent.isWithdrawn
    );
  };

  const withdrawConsent = async (consentId: string) => {
    try {
      setConsents(prev => 
        prev.map(consent => 
          consent.id === consentId 
            ? { ...consent, isWithdrawn: true }
            : consent
        )
      );
      
      toast({
        title: "Consentimiento Retirado",
        description: "Tu consentimiento ha sido retirado exitosamente",
      });
    } catch (error) {
      console.error('Error withdrawing consent:', error);
      toast({
        title: "Error",
        description: "No se pudo retirar el consentimiento",
        variant: "destructive",
      });
    }
  };

  const processGDPRRequest = async (requestId: string, response: string, status: GDPRRequest['status']) => {
    try {
      setGdprRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { 
                ...request, 
                status, 
                response,
                completionDate: status === 'COMPLETED' ? new Date() : undefined
              }
            : request
        )
      );
      
      toast({
        title: "Solicitud GDPR Procesada",
        description: "La solicitud ha sido actualizada",
      });
    } catch (error) {
      console.error('Error processing GDPR request:', error);
    }
  };

  // Initialize with some default legal documents
  useEffect(() => {
    const defaultDocuments: LegalDocument[] = [
      {
        id: 'terms_v1',
        type: 'TERMS_CONDITIONS',
        version: '1.0',
        content: 'Términos y condiciones del servicio...',
        effectiveDate: new Date('2024-01-01'),
        isActive: true,
        jurisdiction: 'ES'
      },
      {
        id: 'privacy_v1',
        type: 'PRIVACY_POLICY',
        version: '1.0',
        content: 'Política de privacidad GDPR compliant...',
        effectiveDate: new Date('2024-01-01'),
        isActive: true,
        jurisdiction: 'EU'
      }
    ];

    setDocuments(defaultDocuments);

    // Initialize geographic restrictions
    const defaultRestrictions: GeographicRestriction[] = [
      {
        id: 'us_restriction',
        country: 'US',
        isBlocked: true,
        reason: 'Regulaciones federales de juego online',
        effectiveDate: new Date('2024-01-01')
      }
    ];

    setGeoRestrictions(defaultRestrictions);
  }, []);

  return {
    documents,
    consents,
    selfExclusions,
    gdprRequests,
    geoRestrictions,
    ageVerifications,
    loading,
    createLegalDocument,
    recordUserConsent,
    requestSelfExclusion,
    submitGDPRRequest,
    verifyAge,
    checkGeographicRestrictions,
    isUserSelfExcluded,
    getUserConsents,
    withdrawConsent,
    processGDPRRequest
  };
}
