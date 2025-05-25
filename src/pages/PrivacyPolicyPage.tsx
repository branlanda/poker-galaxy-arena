
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarfallEffect from '@/components/effects/StarfallEffect';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy relative">
      <StarfallEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white text-3xl">Política de Privacidad</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Información que Recopilamos</h2>
                <p>Recopilamos información personal necesaria para proporcionar nuestros servicios, incluyendo nombre, email, y datos de juego.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. Uso de la Información</h2>
                <p>Utilizamos tu información para proporcionar servicios de poker, procesar transacciones, y mejorar la experiencia del usuario.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. Compartir Información</h2>
                <p>No vendemos ni compartimos tu información personal con terceros, excepto cuando sea requerido por ley o para procesar pagos.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. Seguridad de Datos</h2>
                <p>Implementamos medidas de seguridad robustas para proteger tu información personal y financiera.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
                <p>Utilizamos cookies para mejorar la funcionalidad del sitio y personalizar tu experiencia.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">6. Tus Derechos</h2>
                <p>Tienes derecho a acceder, modificar o eliminar tu información personal. Contáctanos para ejercer estos derechos.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">7. Contacto</h2>
                <p>Si tienes preguntas sobre esta política, puedes contactarnos a través de nuestros canales de soporte.</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
