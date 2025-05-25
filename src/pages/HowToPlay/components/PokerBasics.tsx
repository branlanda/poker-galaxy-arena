import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Zap, Users, Clock, Coins } from 'lucide-react';

export function PokerBasics() {
  const [selectedHand, setSelectedHand] = useState<string | null>(null);

  const handRankings = [
    {
      name: "Escalera Real",
      description: "A, K, Q, J, 10 del mismo palo",
      example: ["A♠", "K♠", "Q♠", "J♠", "10♠"],
      strength: 10,
      probability: "0.000154%"
    },
    {
      name: "Escalera de Color",
      description: "Cinco cartas consecutivas del mismo palo",
      example: ["9♥", "8♥", "7♥", "6♥", "5♥"],
      strength: 9,
      probability: "0.00139%"
    },
    {
      name: "Póker",
      description: "Cuatro cartas del mismo valor",
      example: ["K♠", "K♥", "K♦", "K♣", "3♠"],
      strength: 8,
      probability: "0.024%"
    },
    {
      name: "Full House",
      description: "Tres cartas iguales + una pareja",
      example: ["A♠", "A♥", "A♦", "8♣", "8♠"],
      strength: 7,
      probability: "0.144%"
    },
    {
      name: "Color",
      description: "Cinco cartas del mismo palo",
      example: ["K♦", "J♦", "9♦", "6♦", "3♦"],
      strength: 6,
      probability: "0.197%"
    },
    {
      name: "Escalera",
      description: "Cinco cartas consecutivas",
      example: ["10♠", "9♥", "8♦", "7♣", "6♠"],
      strength: 5,
      probability: "0.392%"
    },
    {
      name: "Trío",
      description: "Tres cartas del mismo valor",
      example: ["Q♠", "Q♥", "Q♦", "7♣", "4♠"],
      strength: 4,
      probability: "2.11%"
    },
    {
      name: "Doble Pareja",
      description: "Dos parejas diferentes",
      example: ["J♠", "J♥", "5♦", "5♣", "2♠"],
      strength: 3,
      probability: "4.75%"
    },
    {
      name: "Pareja",
      description: "Dos cartas del mismo valor",
      example: ["10♠", "10♥", "K♦", "6♣", "3♠"],
      strength: 2,
      probability: "42.3%"
    },
    {
      name: "Carta Alta",
      description: "Ninguna combinación",
      example: ["A♠", "J♥", "8♦", "5♣", "2♠"],
      strength: 1,
      probability: "50.1%"
    }
  ];

  const gameRules = [
    {
      icon: Users,
      title: "Jugadores",
      description: "2-9 jugadores por mesa",
      details: "Cada jugador recibe 2 cartas privadas"
    },
    {
      icon: Target,
      title: "Objetivo",
      description: "Formar la mejor mano de 5 cartas",
      details: "Usa tus 2 cartas + 5 comunitarias"
    },
    {
      icon: Coins,
      title: "Blinds",
      description: "Apuestas obligatorias iniciales",
      details: "Small blind y big blind rotan cada mano"
    },
    {
      icon: Clock,
      title: "Turnos",
      description: "Se juega en sentido horario",
      details: "Cada jugador tiene tiempo limitado para actuar"
    }
  ];

  const positions = [
    { name: "UTG", description: "Under the Gun - Primera posición", color: "bg-red-500" },
    { name: "MP", description: "Middle Position - Posición media", color: "bg-orange-500" },
    { name: "CO", description: "Cut Off - Antes del botón", color: "bg-yellow-500" },
    { name: "BTN", description: "Button - Última posición", color: "bg-emerald-500" },
    { name: "SB", description: "Small Blind", color: "bg-blue-500" },
    { name: "BB", description: "Big Blind", color: "bg-purple-500" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Conceptos Básicos del Póker</h1>
        <p className="text-gray-300 text-lg">
          Todo lo que necesitas saber para dominar el Texas Hold'em
        </p>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-navy/50 border border-emerald/20">
          <TabsTrigger value="rules" className="data-[state=active]:bg-emerald/20">Reglas</TabsTrigger>
          <TabsTrigger value="hands" className="data-[state=active]:bg-emerald/20">Manos</TabsTrigger>
          <TabsTrigger value="positions" className="data-[state=active]:bg-emerald/20">Posiciones</TabsTrigger>
          <TabsTrigger value="betting" className="data-[state=active]:bg-emerald/20">Apuestas</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameRules.map((rule, index) => (
              <Card key={index} className="bg-navy/70 border-emerald/20">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <rule.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{rule.title}</CardTitle>
                      <p className="text-gray-400 text-sm">{rule.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{rule.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">Secuencia de Juego</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Pre-flop</h4>
                  <p className="text-gray-400 text-sm">Cada jugador recibe 2 cartas privadas</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Flop</h4>
                  <p className="text-gray-400 text-sm">Se revelan 3 cartas comunitarias</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Turn</h4>
                  <p className="text-gray-400 text-sm">Se revela la 4ta carta comunitaria</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">River</h4>
                  <p className="text-gray-400 text-sm">Se revela la 5ta y última carta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hands" className="space-y-6">
          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-emerald" />
                <span>Ranking de Manos</span>
              </CardTitle>
              <p className="text-gray-400">De mayor a menor fuerza</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {handRankings.map((hand, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedHand === hand.name
                        ? 'border-emerald bg-emerald/10'
                        : 'border-gray-600 hover:border-emerald/50'
                    }`}
                    onClick={() => setSelectedHand(selectedHand === hand.name ? null : hand.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-emerald border-emerald/30">
                            #{hand.strength}
                          </Badge>
                          <h4 className="text-white font-semibold">{hand.name}</h4>
                        </div>
                        <p className="text-gray-400 text-sm">{hand.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-xs">{hand.probability}</span>
                        <div className="flex space-x-1">
                          {hand.example.map((card, cardIndex) => (
                            <div
                              key={cardIndex}
                              className="w-8 h-10 bg-white rounded text-black text-xs flex items-center justify-center font-bold"
                            >
                              {card}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {selectedHand === hand.name && (
                      <div className="mt-3 pt-3 border-t border-emerald/20">
                        <p className="text-gray-300 text-sm">
                          <strong>Probabilidad:</strong> {hand.probability} de conseguir esta mano
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">Posiciones en la Mesa</CardTitle>
              <p className="text-gray-400">La posición determina el orden de las acciones</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {positions.map((position, index) => (
                  <Card key={index} className="bg-navy/50 border-emerald/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${position.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-semibold text-sm">{position.name}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{position.description.split(' - ')[0]}</h4>
                          <p className="text-gray-400 text-sm">{position.description.split(' - ')[1]}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-gray-300 text-center p-4 rounded-lg border border-emerald/20">
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Importancia de la Posición</h4>
                  <p className="text-gray-400">Las posiciones tardías (BTN, CO) tienen ventaja estratégica</p>
                </div>
                <div className="w-full max-w-lg mx-auto aspect-video bg-navy/70 border border-emerald/30 rounded-lg flex items-center justify-center p-4">
                  <div className="w-64 h-32 rounded-full border-4 border-emerald/40 relative">
                    {/* Dealer Button */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-emerald rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">D</span>
                    </div>
                    {/* SB Position */}
                    <div className="absolute -bottom-3 left-1/3 -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">SB</span>
                    </div>
                    {/* BB Position */}
                    <div className="absolute -bottom-2 left-1/4 -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">BB</span>
                    </div>
                    {/* Other positions */}
                    <div className="absolute top-0 left-1/4 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">UTG</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="betting" className="space-y-6">
          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center space-x-2">
                <Coins className="h-5 w-5 text-emerald" />
                <span>Estructura de Apuestas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Blinds */}
              <div className="bg-navy/50 p-4 rounded-lg border border-emerald/20">
                <h4 className="text-white font-semibold mb-2">Blinds (Apuestas Obligatorias)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">SB</span>
                    </div>
                    <div>
                      <h5 className="text-white">Small Blind</h5>
                      <p className="text-gray-400 text-sm">Mitad de la apuesta mínima</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">BB</span>
                    </div>
                    <div>
                      <h5 className="text-white">Big Blind</h5>
                      <p className="text-gray-400 text-sm">Apuesta mínima completa</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Betting actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-navy/50 border-emerald/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Acciones sin Apuesta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">C</span>
                        </div>
                        <h5 className="text-white">Check</h5>
                      </div>
                      <p className="text-gray-400 text-sm">Pasar sin apostar</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">B</span>
                        </div>
                        <h5 className="text-white">Bet</h5>
                      </div>
                      <p className="text-gray-400 text-sm">Primera apuesta</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-navy/50 border-emerald/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Respuestas a una Apuesta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">F</span>
                        </div>
                        <h5 className="text-white">Fold</h5>
                      </div>
                      <p className="text-gray-400 text-sm">Retirarse</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">C</span>
                        </div>
                        <h5 className="text-white">Call</h5>
                      </div>
                      <p className="text-gray-400 text-sm">Igualar apuesta</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">R</span>
                        </div>
                        <h5 className="text-white">Raise</h5>
                      </div>
                      <p className="text-gray-400 text-sm">Subir apuesta</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Betting rounds */}
              <Card className="bg-navy/50 border-emerald/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-emerald" />
                    <span>Rondas de Apuestas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-300">
                    Hay 4 rondas de apuestas: Pre-flop, Flop, Turn y River
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-emerald">Objetivo:</strong> Decidir cuándo apostar, subir o retirarse según tu mano y la situación
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-emerald">Consejo:</strong> La cantidad de tu apuesta debe ser proporcional a la fuerza de tu mano y al tamaño del bote
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="flex justify-center">
        <Button variant="primary" size="lg" asChild>
          <Link to="/">
            Comenzar a Jugar
          </Link>
        </Button>
      </div>
    </div>
  );
}
