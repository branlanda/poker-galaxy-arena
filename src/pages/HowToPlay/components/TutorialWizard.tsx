
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, CheckCircle2, Play, Eye, Users } from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
  actionText: string;
  completed?: boolean;
}

export function TutorialWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "Bienvenido al Póker",
      description: "Comenzaremos con lo básico",
      actionText: "Comenzar Tutorial",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <Play className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">¡Bienvenido al Póker!</h3>
            <p className="text-gray-300 text-lg">
              Te enseñaremos paso a paso cómo jugar Texas Hold'em. 
              Este tutorial te llevará aproximadamente 10 minutos.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="text-emerald border-emerald/30">
              10 minutos
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400/30">
              Interactivo
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400/30">
              Principiante
            </Badge>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Objetivo del Juego",
      description: "¿Cuál es el objetivo del póker?",
      actionText: "Entendido",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Objetivo del Póker</h3>
          </div>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              El objetivo principal es <span className="text-emerald font-semibold">ganar fichas</span> de otros jugadores.
            </p>
            <div className="bg-navy/50 p-4 rounded-lg border border-emerald/20">
              <h4 className="text-white font-semibold mb-2">Puedes ganar de dos formas:</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald rounded-full"></div>
                  <span>Teniendo la <strong>mejor mano</strong> al final</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald rounded-full"></div>
                  <span>Haciendo que todos los demás <strong>se retiren</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Las Cartas",
      description: "Entendiendo las cartas del póker",
      actionText: "Continuar",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Las Cartas del Póker</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-navy/50 border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Cartas Propias (Hole Cards)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-2 mb-4">
                  <div className="w-12 h-16 bg-white rounded-lg flex items-center justify-center text-black font-bold">
                    A♠
                  </div>
                  <div className="w-12 h-16 bg-white rounded-lg flex items-center justify-center text-red-500 font-bold">
                    K♥
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Recibes 2 cartas que solo tú puedes ver
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-navy/50 border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Cartas Comunitarias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-1 mb-4">
                  <div className="w-8 h-11 bg-white rounded flex items-center justify-center text-black text-xs font-bold">Q♣</div>
                  <div className="w-8 h-11 bg-white rounded flex items-center justify-center text-black text-xs font-bold">J♠</div>
                  <div className="w-8 h-11 bg-white rounded flex items-center justify-center text-red-500 text-xs font-bold">10♥</div>
                  <div className="w-8 h-11 bg-white rounded flex items-center justify-center text-black text-xs font-bold">9♠</div>
                  <div className="w-8 h-11 bg-white rounded flex items-center justify-center text-red-500 text-xs font-bold">8♦</div>
                </div>
                <p className="text-gray-300 text-sm">
                  5 cartas que todos pueden usar
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-emerald/10 p-4 rounded-lg border border-emerald/30">
            <p className="text-emerald text-center">
              <strong>Tu mejor mano:</strong> Combinas tus 2 cartas con las 5 comunitarias para formar la mejor mano de 5 cartas
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Rondas de Apuestas",
      description: "Cómo funciona cada ronda",
      actionText: "Continuar",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Rondas de Apuestas</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-navy/50 border-blue-400/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <h4 className="text-white font-semibold">Pre-flop</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Solo tienes tus 2 cartas</p>
                </CardContent>
              </Card>
              
              <Card className="bg-navy/50 border-emerald-400/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <h4 className="text-white font-semibold">Flop</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Se revelan 3 cartas comunitarias</p>
                </CardContent>
              </Card>
              
              <Card className="bg-navy/50 border-purple-400/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <h4 className="text-white font-semibold">Turn</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Se revela la 4ta carta</p>
                </CardContent>
              </Card>
              
              <Card className="bg-navy/50 border-red-400/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <h4 className="text-white font-semibold">River</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Se revela la 5ta y última carta</p>
                </CardContent>
              </Card>
            </div>
            <div className="bg-navy/50 p-4 rounded-lg border border-emerald/20">
              <p className="text-gray-300 text-center">
                <strong className="text-emerald">En cada ronda</strong> todos los jugadores pueden apostar, retirarse, o igualar apuestas
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Acciones Básicas",
      description: "Qué puedes hacer en tu turno",
      actionText: "Continuar",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Acciones en tu Turno</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-red-500/20 border-red-400/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-white font-semibold mb-2">Fold (Retirarse)</h4>
                <p className="text-gray-300 text-sm">Abandonas la mano y pierdes las fichas apostadas</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-500/20 border-blue-400/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-white font-semibold mb-2">Check (Pasar)</h4>
                <p className="text-gray-300 text-sm">No apuestas, pero sigues en la mano</p>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-500/20 border-emerald-400/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-white font-semibold mb-2">Call (Igualar)</h4>
                <p className="text-gray-300 text-sm">Igualas la apuesta actual</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-500/20 border-purple-400/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-white font-semibold mb-2">Bet (Apostar)</h4>
                <p className="text-gray-300 text-sm">Haces la primera apuesta de la ronda</p>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-500/20 border-orange-400/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-white font-semibold mb-2">Raise (Subir)</h4>
                <p className="text-gray-300 text-sm">Aumentas una apuesta existente</p>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-500/20 border-yellow-400/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-white font-semibold mb-2">All-in</h4>
                <p className="text-gray-300 text-sm">Apuestas todas tus fichas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "¡Tutorial Completado!",
      description: "Estás listo para comenzar",
      actionText: "Ir a Práctica",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">¡Felicitaciones!</h3>
            <p className="text-gray-300 text-lg mb-6">
              Has completado el tutorial básico de póker. Ya conoces los fundamentos para comenzar a jugar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-navy/50 p-4 rounded-lg border border-emerald/20">
                <CheckCircle2 className="h-6 w-6 text-emerald mx-auto mb-2" />
                <p className="text-sm text-gray-300">Objetivo del juego</p>
              </div>
              <div className="bg-navy/50 p-4 rounded-lg border border-emerald/20">
                <CheckCircle2 className="h-6 w-6 text-emerald mx-auto mb-2" />
                <p className="text-sm text-gray-300">Rondas de apuestas</p>
              </div>
              <div className="bg-navy/50 p-4 rounded-lg border border-emerald/20">
                <CheckCircle2 className="h-6 w-6 text-emerald mx-auto mb-2" />
                <p className="text-sm text-gray-300">Acciones básicas</p>
              </div>
            </div>
          </div>
          <p className="text-emerald font-semibold">
            Siguiente paso recomendado: Practica en el simulador
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="bg-navy/70 border-emerald/20 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Tutorial Interactivo</h2>
            <Badge variant="outline" className="text-emerald border-emerald/30">
              {currentStep + 1} de {tutorialSteps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between text-sm text-gray-400">
            <span>Progreso: {Math.round(progress)}%</span>
            <span>{tutorialSteps[currentStep].title}</span>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial Content */}
      <Card className="bg-navy/70 border-emerald/20 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl mb-2">
                {tutorialSteps[currentStep].title}
              </CardTitle>
              <p className="text-gray-400">{tutorialSteps[currentStep].description}</p>
            </div>
            {completedSteps.includes(currentStep) && (
              <CheckCircle2 className="h-6 w-6 text-emerald" />
            )}
          </div>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {tutorialSteps[currentStep].content}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="border-emerald/30 text-emerald hover:bg-emerald/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        {/* Step indicators */}
        <div className="flex space-x-2">
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-emerald'
                  : index < currentStep
                  ? 'bg-emerald/50'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <Button
          variant="primary"
          onClick={nextStep}
          disabled={currentStep === tutorialSteps.length - 1}
        >
          {tutorialSteps[currentStep].actionText}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
