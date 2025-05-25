import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, HelpCircle, Award, ArrowRight, Users, Coins, RefreshCcw } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  stack: number;
  cards: [string, string];
  position: string;
  isUser: boolean;
  hasFolded: boolean;
}

interface SimulatorState {
  stage: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
  pot: number;
  currentBet: number;
  communityCards: string[];
  players: Player[];
  activePlayerIndex: number;
  minimumBet: number;
}

export function InteractiveSimulator() {
  const [state, setState] = useState<SimulatorState>({
    stage: 'preflop',
    pot: 15, // SB + BB
    currentBet: 10,
    communityCards: [],
    players: [
      { id: 1, name: 'Tú', stack: 1000, cards: ['A♠', 'K♥'], position: 'BTN', isUser: true, hasFolded: false },
      { id: 2, name: 'Jugador 1', stack: 950, cards: ['?', '?'], position: 'SB', isUser: false, hasFolded: false },
      { id: 3, name: 'Jugador 2', stack: 980, cards: ['?', '?'], position: 'BB', isUser: false, hasFolded: false }
    ],
    activePlayerIndex: 0,
    minimumBet: 10
  });

  const [betAmount, setBetAmount] = useState(state.minimumBet);
  const [gameMessage, setGameMessage] = useState<string>("Tu turno. ¿Qué acción tomarás?");
  const [showHint, setShowHint] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [result, setResult] = useState<{ won: boolean; amount: number } | null>(null);
  
  const resetSimulator = () => {
    setState({
      stage: 'preflop',
      pot: 15,
      currentBet: 10,
      communityCards: [],
      players: [
        { id: 1, name: 'Tú', stack: 1000, cards: ['A♠', 'K♥'], position: 'BTN', isUser: true, hasFolded: false },
        { id: 2, name: 'Jugador 1', stack: 950, cards: ['?', '?'], position: 'SB', isUser: false, hasFolded: false },
        { id: 3, name: 'Jugador 2', stack: 980, cards: ['?', '?'], position: 'BB', isUser: false, hasFolded: false }
      ],
      activePlayerIndex: 0,
      minimumBet: 10
    });
    setBetAmount(10);
    setGameMessage("Tu turno. ¿Qué acción tomarás?");
    setShowHint(false);
    setIsGameOver(false);
    setResult(null);
  };

  const getStageCards = (stage: string) => {
    switch(stage) {
      case 'flop':
        return ['J♠', '10♠', '3♥'];
      case 'turn':
        return ['J♠', '10♠', '3♥', 'Q♠'];
      case 'river':
      case 'showdown':
        return ['J♠', '10♠', '3♥', 'Q♠', '2♦'];
      default:
        return [];
    }
  };

  const fold = () => {
    const newPlayers = [...state.players];
    newPlayers[state.activePlayerIndex].hasFolded = true;
    
    setGameMessage("Te has retirado de la mano.");
    setIsGameOver(true);
    setResult({ won: false, amount: 0 });
    
    setState({
      ...state,
      players: newPlayers
    });
  };

  const check = () => {
    if (state.currentBet > 0) {
      setGameMessage("No puedes pasar cuando hay una apuesta activa.");
      return;
    }
    
    progressGame("has pasado");
  };

  const call = () => {
    const newPlayers = [...state.players];
    const currentPlayer = newPlayers[state.activePlayerIndex];
    const amountToCall = state.currentBet;
    
    if (currentPlayer.stack < amountToCall) {
      setGameMessage("No tienes suficientes fichas para igualar.");
      return;
    }
    
    currentPlayer.stack -= amountToCall;
    
    setState({
      ...state,
      pot: state.pot + amountToCall,
      players: newPlayers
    });
    
    progressGame("has igualado la apuesta");
  };

  const bet = () => {
    if (betAmount < state.minimumBet) {
      setGameMessage(`La apuesta mínima es ${state.minimumBet}.`);
      return;
    }
    
    const newPlayers = [...state.players];
    const currentPlayer = newPlayers[state.activePlayerIndex];
    
    if (currentPlayer.stack < betAmount) {
      setGameMessage("No tienes suficientes fichas para apostar esa cantidad.");
      return;
    }
    
    currentPlayer.stack -= betAmount;
    
    setState({
      ...state,
      pot: state.pot + betAmount,
      currentBet: betAmount,
      players: newPlayers
    });
    
    progressGame(`has apostado ${betAmount}`);
  };
  
  const progressGame = (action: string) => {
    setGameMessage(`Tú ${action}.`);
    
    // Simulate opponent action
    setTimeout(() => {
      // This is a simplified simulation - in a real game, AI would make decisions based on their cards and the board
      if (state.stage === 'preflop') {
        setGameMessage("Jugadores 1 y 2 han igualado tu apuesta. Avanzando al flop...");
        setTimeout(() => {
          setState({
            ...state,
            stage: 'flop',
            communityCards: getStageCards('flop'),
            currentBet: 0,
            activePlayerIndex: 0
          });
          setGameMessage("Flop: J♠ 10♠ 3♥. Tu turno.");
        }, 2000);
      } 
      else if (state.stage === 'flop') {
        setGameMessage("Jugadores 1 y 2 han igualado tu apuesta. Avanzando al turn...");
        setTimeout(() => {
          setState({
            ...state,
            stage: 'turn',
            communityCards: getStageCards('turn'),
            currentBet: 0,
            activePlayerIndex: 0
          });
          setGameMessage("Turn: Q♠. Tu turno.");
        }, 2000);
      } 
      else if (state.stage === 'turn') {
        setGameMessage("Jugadores 1 y 2 han igualado tu apuesta. Avanzando al river...");
        setTimeout(() => {
          setState({
            ...state,
            stage: 'river',
            communityCards: getStageCards('river'),
            currentBet: 0,
            activePlayerIndex: 0
          });
          setGameMessage("River: 2♦. Tu turno final.");
        }, 2000);
      } 
      else if (state.stage === 'river') {
        setGameMessage("Jugadores 1 y 2 han igualado tu apuesta. Avanzando al showdown...");
        // Reveal opponent cards for showdown
        setTimeout(() => {
          const newPlayers = [...state.players];
          newPlayers[1].cards = ['7♦', '8♣'];
          newPlayers[2].cards = ['J♦', 'K♠'];
          
          setState({
            ...state,
            stage: 'showdown',
            communityCards: getStageCards('showdown'),
            players: newPlayers
          });
          
          setGameMessage("¡Showdown! Tienes escalera real. ¡Has ganado el bote!");
          setIsGameOver(true);
          setResult({ won: true, amount: state.pot });
        }, 2000);
      }
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Simulador de Póker Interactivo</h2>
          <p className="text-gray-400">Practica tus habilidades en un entorno sin riesgo</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="border-emerald/30 text-emerald hover:bg-emerald/10"
          onClick={resetSimulator}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reiniciar
        </Button>
      </div>

      {/* Game Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-navy/70 border-emerald/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-1">
              {['preflop', 'flop', 'turn', 'river', 'showdown'].map((stage, index) => (
                <div 
                  key={index} 
                  className={`flex-1 py-1 px-2 text-xs text-center rounded ${
                    state.stage === stage 
                      ? 'bg-emerald text-navy font-semibold' 
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-navy/70 border-emerald/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center">
              <Coins className="h-5 w-5 mr-2 text-emerald" />
              Bote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">{state.pot}</div>
            {state.currentBet > 0 && (
              <div className="text-sm text-gray-400">
                Apuesta actual: {state.currentBet}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-navy/70 border-emerald/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-emerald" />
              Jugadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-gray-400">
                Activos: <span className="text-white">{state.players.filter(p => !p.hasFolded).length}</span>
              </div>
              <Badge variant="outline" className="text-emerald border-emerald/30">
                {state.players[0].position}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Message */}
      {gameMessage && (
        <Alert className={`${isGameOver ? (result?.won ? 'bg-emerald/20 border-emerald' : 'bg-red-500/20 border-red-500') : 'bg-navy/70 border-emerald/20'}`}>
          <AlertCircle className={`h-4 w-4 ${isGameOver ? (result?.won ? 'text-emerald' : 'text-red-500') : 'text-emerald'}`} />
          <AlertDescription className="text-white">
            {gameMessage}
            {isGameOver && result && (
              <div className="mt-2">
                {result.won ? (
                  <div className="flex items-center font-semibold text-emerald">
                    <Award className="h-5 w-5 mr-1" />
                    <span>Has ganado {result.amount} fichas</span>
                  </div>
                ) : (
                  <span className="text-red-400">Has perdido esta mano</span>
                )}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Poker Table */}
      <Card className="bg-navy/70 border-emerald/20 p-6 relative">
        {/* Help Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 border-emerald/30 text-emerald hover:bg-emerald/10"
          onClick={() => setShowHint(!showHint)}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {showHint && (
          <div className="absolute top-12 right-2 w-64 bg-navy-light border border-emerald/30 p-3 rounded-lg text-sm text-gray-300 z-10">
            <h5 className="text-white font-semibold mb-1">Sugerencia:</h5>
            <p>
              {state.stage === 'preflop' && "Con A♠ K♥ (AK suited) tienes una mano premium. Considera hacer una apuesta para proteger tu mano."}
              {state.stage === 'flop' && "El flop J♠ 10♠ 3♥ te da un proyecto de escalera real. Es una mano muy fuerte, considera apostar."}
              {state.stage === 'turn' && "Con la Q♠ en el turn, ahora tienes un proyecto de escalera real con muchas posibilidades. Considera una apuesta fuerte."}
              {state.stage === 'river' && "El river no completa tu escalera, pero sigues teniendo una mano fuerte con proyecto de color. Considera una apuesta de valor."}
            </p>
            <div className="absolute top-0 -translate-y-1/2 right-4 w-4 h-4 bg-navy-light rotate-45 border-t border-l border-emerald/30"></div>
          </div>
        )}

        {/* Community Cards */}
        <div className="flex justify-center mb-8 space-x-2">
          {state.communityCards.length > 0 ? (
            state.communityCards.map((card, index) => (
              <div 
                key={index} 
                className="w-14 h-20 bg-white rounded-md flex items-center justify-center text-2xl font-bold shadow-lg"
                style={{ 
                  color: card.includes('♥') || card.includes('♦') ? 'red' : 'black' 
                }}
              >
                {card}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">
              Las cartas comunitarias aparecerán aquí
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex justify-between items-end">
          {/* Other Players */}
          {state.players.slice(1).map((player, index) => (
            <div key={index} className={`text-center ${player.hasFolded ? 'opacity-50' : ''}`}>
              <div className="mb-2">
                <Badge variant="outline" className="text-gray-300 border-gray-600">
                  {player.position}
                </Badge>
              </div>
              <div className="flex justify-center space-x-1 mb-2">
                {player.cards.map((card, cardIdx) => (
                  <div 
                    key={cardIdx}
                    className={`w-10 h-14 flex items-center justify-center font-bold rounded ${
                      card === '?' 
                        ? 'bg-gray-700 text-gray-500' 
                        : 'bg-white' 
                    }`}
                    style={{ 
                      color: card.includes('♥') || card.includes('♦') ? 'red' : 'black' 
                    }}
                  >
                    {card}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="text-gray-400">{player.name}</span>
                <div className="font-semibold text-emerald">{player.stack}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Center */}
        <div className="w-20 h-20 mx-auto my-6 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center">
          <Coins className="h-8 w-8 text-emerald" />
        </div>

        {/* User Player */}
        <div className={`text-center ${state.players[0].hasFolded ? 'opacity-50' : ''}`}>
          <div className="flex justify-center space-x-2 mb-3">
            {state.players[0].cards.map((card, index) => (
              <div 
                key={index}
                className="w-14 h-20 bg-white rounded-md flex items-center justify-center text-2xl font-bold shadow-lg"
                style={{ 
                  color: card.includes('♥') || card.includes('♦') ? 'red' : 'black' 
                }}
              >
                {card}
              </div>
            ))}
          </div>
          <div className="mb-1">
            <Badge variant="outline" className="text-emerald border-emerald/30">
              {state.players[0].position}
            </Badge>
          </div>
          <div className="text-white font-semibold">{state.players[0].name}</div>
          <div className="font-bold text-lg text-emerald">{state.players[0].stack}</div>
        </div>
      </Card>

      {/* Action Controls */}
      {!isGameOver && (
        <Card className="bg-navy/70 border-emerald/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Tus Acciones</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Button 
                variant="outline" 
                className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                onClick={fold}
              >
                Fold
              </Button>
              
              <Button 
                variant="outline" 
                className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                onClick={check}
                disabled={state.currentBet > 0}
              >
                Check
              </Button>
              
              <Button 
                variant="outline" 
                className="border-emerald/30 text-emerald hover:bg-emerald/10"
                onClick={call}
                disabled={state.currentBet === 0}
              >
                Call {state.currentBet}
              </Button>
              
              <Button 
                variant="primary"
                onClick={bet}
              >
                Bet {betAmount}
              </Button>
            </div>

            {/* Bet Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Min: {state.minimumBet}</span>
                <span className="text-gray-400">Max: {state.players[0].stack}</span>
              </div>
              <Slider
                value={[betAmount]}
                min={state.minimumBet}
                max={state.players[0].stack}
                step={5}
                onValueChange={(value) => setBetAmount(value[0])}
              />
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Ajustar apuesta</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-gray-600 text-gray-400 hover:bg-gray-700"
                    onClick={() => setBetAmount(Math.max(state.minimumBet, betAmount - 10))}
                  >
                    -
                  </Button>
                  <div className="w-20 h-8 bg-navy/50 border border-gray-600 rounded flex items-center justify-center text-white">
                    {betAmount}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-gray-600 text-gray-400 hover:bg-gray-700"
                    onClick={() => setBetAmount(Math.min(state.players[0].stack, betAmount + 10))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Over Actions */}
      {isGameOver && (
        <div className="flex justify-center space-x-4">
          <Button variant="outline" className="border-emerald/30 text-emerald hover:bg-emerald/10" onClick={resetSimulator}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Jugar de nuevo
          </Button>
          <Button variant="primary">
            <ArrowRight className="h-4 w-4 mr-2" />
            Jugar en una mesa real
          </Button>
        </div>
      )}

      {/* Tips */}
      <Card className="bg-navy/70 border-emerald/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Consejos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Check className="h-4 w-4 mt-0.5 text-emerald" />
              <p className="text-gray-300 text-sm">Observa cómo cambian tus opciones en cada fase del juego</p>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-4 w-4 mt-0.5 text-emerald" />
              <p className="text-gray-300 text-sm">El tamaño del bote determina cuánto deberías apostar - generalmente entre 1/2 y 3/4 del bote</p>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-4 w-4 mt-0.5 text-emerald" />
              <p className="text-gray-300 text-sm">Tu posición en la mesa afecta tus decisiones - ser último en actuar es una ventaja</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
