
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface SSLCertificate {
  domain: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  daysUntilExpiry: number;
  isValid: boolean;
  autoRenew: boolean;
}

export const SSLCertificateManager: React.FC = () => {
  const [certificates, setCertificates] = useState<SSLCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkCertificates();
  }, []);

  const checkCertificates = async () => {
    setChecking(true);
    try {
      // In a real implementation, this would call your backend to check SSL certificates
      const domains = [
        'yourpokerapp.com',
        'api.yourpokerapp.com',
        'staging.yourpokerapp.com'
      ];

      const certificatePromises = domains.map(async (domain) => {
        try {
          // Simulate SSL certificate check
          const response = await fetch(`https://${domain}`, { mode: 'no-cors' });
          
          // Mock certificate data - in reality, you'd get this from your SSL provider's API
          const mockCert: SSLCertificate = {
            domain,
            issuer: 'Let\'s Encrypt',
            validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
            daysUntilExpiry: 60,
            isValid: true,
            autoRenew: true
          };

          return mockCert;
        } catch (error) {
          return {
            domain,
            issuer: 'Unknown',
            validFrom: new Date(),
            validTo: new Date(),
            daysUntilExpiry: 0,
            isValid: false,
            autoRenew: false
          };
        }
      });

      const results = await Promise.all(certificatePromises);
      setCertificates(results);
    } catch (error) {
      console.error('Failed to check certificates:', error);
      toast.error('Failed to check SSL certificates');
    } finally {
      setChecking(false);
      setLoading(false);
    }
  };

  const renewCertificate = async (domain: string) => {
    try {
      // In a real implementation, this would trigger certificate renewal
      toast.success(`Certificate renewal initiated for ${domain}`);
      
      // Refresh certificates after renewal
      setTimeout(() => {
        checkCertificates();
      }, 2000);
    } catch (error) {
      console.error('Failed to renew certificate:', error);
      toast.error('Failed to renew certificate');
    }
  };

  const getStatusColor = (cert: SSLCertificate) => {
    if (!cert.isValid) return 'bg-red-500';
    if (cert.daysUntilExpiry <= 7) return 'bg-red-500';
    if (cert.daysUntilExpiry <= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (cert: SSLCertificate) => {
    if (!cert.isValid) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (cert.daysUntilExpiry <= 7) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (cert.daysUntilExpiry <= 30) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  const getExpiryProgress = (cert: SSLCertificate) => {
    const totalDays = Math.ceil((cert.validTo.getTime() - cert.validFrom.getTime()) / (1000 * 60 * 60 * 24));
    const daysUsed = totalDays - cert.daysUntilExpiry;
    return Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));
  };

  if (loading) {
    return <div>Loading SSL certificates...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            SSL Certificate Management
            <Button
              size="sm"
              variant="outline"
              onClick={checkCertificates}
              disabled={checking}
            >
              <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.domain} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{cert.domain}</h4>
                      <p className="text-sm text-gray-600">
                        Issued by: {cert.issuer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(cert)}
                    <Badge className={getStatusColor(cert)}>
                      {cert.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Certificate Lifecycle</span>
                    <span>{cert.daysUntilExpiry} days remaining</span>
                  </div>
                  <Progress 
                    value={getExpiryProgress(cert)} 
                    className="w-full h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Valid from: {cert.validFrom.toLocaleDateString()}</span>
                    <span>Expires: {cert.validTo.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={cert.autoRenew ? 'default' : 'outline'}>
                      Auto-renewal: {cert.autoRenew ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                  {(cert.daysUntilExpiry <= 30 || !cert.isValid) && (
                    <Button
                      size="sm"
                      variant={cert.daysUntilExpiry <= 7 ? 'destructive' : 'outline'}
                      onClick={() => renewCertificate(cert.domain)}
                    >
                      Renew Certificate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">SSL Best Practices</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Certificates are automatically renewed 30 days before expiry</li>
              <li>• Monitor certificate health regularly</li>
              <li>• Use strong encryption (TLS 1.3 recommended)</li>
              <li>• Implement HTTP Strict Transport Security (HSTS)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
