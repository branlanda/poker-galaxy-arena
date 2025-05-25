
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarfallEffect from '@/components/effects/StarfallEffect';

export const TermsOfServicePage: React.FC = () => {
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
              <CardTitle className="text-white text-3xl">Términos de Servicio</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Aceptación de Términos</h2>
                <p>Al acceder y usar esta plataforma de poker, aceptas cumplir con estos términos de servicio.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. Elegibilidad</h2>
                <p>Debes tener al menos 18 años de edad para usar este servicio. El poker en línea puede no estar disponible en todas las jurisdicciones.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. Conducta del Usuario</h2>
                <p>Los usuarios deben mantener un comportamiento respetuoso y jugar de manera justa. Está prohibida la colusión, el uso de software no autorizado, y cualquier forma de trampa.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. Responsabilidades Financieras</h2>
                <p>Los usuarios son responsables de gestionar sus fondos de manera responsable. No nos hacemos responsables de pérdidas debido a decisiones de juego.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. Privacidad y Datos</h2>
                <p>Nos comprometemos a proteger tu privacidad. Consulta nuestra Política de Privacidad para más detalles.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">6. Modificaciones</h2>
                <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a los usuarios.</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
