
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, BookOpen, Gamepad2, Target, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarfallEffect from '@/components/effects/StarfallEffect';
import { TutorialWizard } from './components/TutorialWizard';
import { PokerBasics } from './components/PokerBasics';
import { InteractiveSimulator } from './components/InteractiveSimulator';

type ViewMode = 'overview' | 'tutorial' | 'basics' | 'simulator';

export default function HowToPlayPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');

  const features = [
    {
      icon: BookOpen,
      title: 'Conceptos Básicos',
      description: 'Aprende las reglas fundamentales del Texas Hold\'em',
      badge: 'Esencial',
      color: 'bg-blue-500',
      onClick: () => setCurrentView('basics')
    },
    {
      icon: Play,
      title: 'Tutorial Interactivo',
      description: 'Guía paso a paso para tu primera partida',
      badge: 'Nuevo',
      color: 'bg-emerald-500',
      onClick: () => setCurrentView('tutorial')
    },
    {
      icon: Gamepad2,
      title: 'Simulador de Práctica',
      description: 'Practica tus habilidades sin riesgo',
      badge: 'Popular',
      color: 'bg-purple-500',
      onClick: () => setCurrentView('simulator')
    }
  ];

  const quickStats = [
    { icon: Users, label: 'Jugadores', value: '2-9' },
    { icon: Target, label: 'Objetivo', value: 'Mejor mano' },
    { icon: Clock, label: 'Duración', value: '15-60 min' }
  ];

  if (currentView !== 'overview') {
    return (
      <div className="min-h-screen bg-navy relative">
        <StarfallEffect />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={() => setCurrentView('overview')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Cómo Jugar
            </Button>
          </div>

          {currentView === 'tutorial' && <TutorialWizard />}
          {currentView === 'basics' && <PokerBasics />}
          {currentView === 'simulator' && <InteractiveSimulator />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy relative">
      <StarfallEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            ¿Cómo Jugar
            <span className="text-emerald"> Póker?</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Aprende las reglas del Texas Hold'em, domina las estrategias básicas y conviértete en un jugador experto con nuestros tutoriales interactivos.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald/20 rounded-full mb-2 mx-auto">
                  <stat.icon className="h-6 w-6 text-emerald" />
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-lg font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-navy/70 border-emerald/20 hover:border-emerald/40 transition-colors cursor-pointer group"
              onClick={feature.onClick}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  <Badge variant="outline" className="text-emerald border-emerald/30">
                    {feature.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <Button variant="outline" className="border-emerald/30 text-emerald hover:bg-emerald/10">
                  Comenzar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Section */}
        <Card className="bg-navy/70 border-emerald/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Acceso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="ghost" 
                className="h-auto p-4 flex flex-col items-center space-y-2 text-gray-300 hover:text-emerald"
                onClick={() => setCurrentView('basics')}
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Reglas Básicas</span>
              </Button>
              <Button 
                variant="ghost" 
                className="h-auto p-4 flex flex-col items-center space-y-2 text-gray-300 hover:text-emerald"
                onClick={() => setCurrentView('tutorial')}
              >
                <Play className="h-6 w-6" />
                <span className="text-sm">Tutorial</span>
              </Button>
              <Button 
                variant="ghost" 
                className="h-auto p-4 flex flex-col items-center space-y-2 text-gray-300 hover:text-emerald"
                onClick={() => setCurrentView('simulator')}
              >
                <Gamepad2 className="h-6 w-6" />
                <span className="text-sm">Práctica</span>
              </Button>
              <Button 
                variant="ghost" 
                className="h-auto p-4 flex flex-col items-center space-y-2 text-gray-300 hover:text-emerald"
              >
                <Link to="/register" className="flex flex-col items-center space-y-2">
                  <Target className="h-6 w-6" />
                  <span className="text-sm">Jugar Ahora</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-emerald/20 to-blue-500/20 border-emerald/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                ¿Listo para jugar?
              </h3>
              <p className="text-gray-300 mb-6">
                Únete a miles de jugadores y pon en práctica lo que has aprendido
              </p>
              <div className="flex justify-center space-x-4">
                <Button asChild variant="primary" size="lg">
                  <Link to="/register">
                    Crear Cuenta
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-emerald/30 text-emerald hover:bg-emerald/10">
                  <Link to="/login">
                    Iniciar Sesión
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
