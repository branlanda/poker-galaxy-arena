
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BotDetectionMetrics {
  actionTiming: number[];
  mouseMovement: { x: number; y: number; timestamp: number }[];
  clickPatterns: { x: number; y: number; timestamp: number }[];
  keystrokePatterns: { key: string; timestamp: number }[];
  sessionDuration: number;
  decisionSpeed: number[];
}

interface BotAlert {
  id: string;
  playerId: string;
  detectionType: 'timing_pattern' | 'mouse_behavior' | 'decision_speed' | 'repetitive_actions';
  confidence: number;
  evidence: any;
  timestamp: Date;
}

export function useBotDetection() {
  const [metrics, setMetrics] = useState<BotDetectionMetrics>({
    actionTiming: [],
    mouseMovement: [],
    clickPatterns: [],
    keystrokePatterns: [],
    sessionDuration: 0,
    decisionSpeed: []
  });
  const [alerts, setAlerts] = useState<BotAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isMonitoring) {
      startBehaviorTracking();
    }
    
    return () => stopBehaviorTracking();
  }, [isMonitoring]);

  const startBehaviorTracking = () => {
    // Track mouse movements
    const handleMouseMove = (event: MouseEvent) => {
      setMetrics(prev => ({
        ...prev,
        mouseMovement: [
          ...prev.mouseMovement.slice(-100), // Keep last 100 movements
          { x: event.clientX, y: event.clientY, timestamp: Date.now() }
        ]
      }));
    };

    // Track clicks
    const handleClick = (event: MouseEvent) => {
      setMetrics(prev => ({
        ...prev,
        clickPatterns: [
          ...prev.clickPatterns.slice(-50),
          { x: event.clientX, y: event.clientY, timestamp: Date.now() }
        ]
      }));
    };

    // Track keystrokes
    const handleKeyPress = (event: KeyboardEvent) => {
      setMetrics(prev => ({
        ...prev,
        keystrokePatterns: [
          ...prev.keystrokePatterns.slice(-100),
          { key: event.key, timestamp: Date.now() }
        ]
      }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keypress', handleKeyPress);

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keypress', handleKeyPress);
    };
  };

  const stopBehaviorTracking = () => {
    // Cleanup is handled by the useEffect cleanup
  };

  const recordAction = (actionType: string, timestamp: number = Date.now()) => {
    setMetrics(prev => ({
      ...prev,
      actionTiming: [...prev.actionTiming.slice(-50), timestamp],
      decisionSpeed: [...prev.decisionSpeed.slice(-20), timestamp]
    }));
    
    // Analyze for bot patterns after recording action
    analyzeForBotBehavior();
  };

  const analyzeForBotBehavior = () => {
    const suspiciousPatterns = [];

    // Analyze timing patterns
    if (metrics.actionTiming.length > 10) {
      const timingVariance = calculateVariance(
        metrics.actionTiming.slice(-10).map((time, index, arr) => 
          index > 0 ? time - arr[index - 1] : 0
        ).slice(1)
      );
      
      if (timingVariance < 100) { // Very low variance = suspicious
        suspiciousPatterns.push({
          type: 'timing_pattern',
          confidence: 0.8,
          evidence: { variance: timingVariance, pattern: 'consistent_timing' }
        });
      }
    }

    // Analyze mouse movement
    if (metrics.mouseMovement.length > 20) {
      const mouseVariance = calculateMouseMovementVariance(metrics.mouseMovement.slice(-20));
      if (mouseVariance < 50) {
        suspiciousPatterns.push({
          type: 'mouse_behavior',
          confidence: 0.7,
          evidence: { variance: mouseVariance, pattern: 'minimal_movement' }
        });
      }
    }

    // Analyze decision speed
    if (metrics.decisionSpeed.length > 10) {
      const avgDecisionTime = calculateAverageDecisionTime(metrics.decisionSpeed.slice(-10));
      if (avgDecisionTime < 500) { // Less than 500ms average
        suspiciousPatterns.push({
          type: 'decision_speed',
          confidence: 0.75,
          evidence: { avgTime: avgDecisionTime, pattern: 'too_fast' }
        });
      }
    }

    // Create alerts for suspicious patterns
    suspiciousPatterns.forEach(pattern => {
      if (pattern.confidence > 0.7) {
        const alert: BotAlert = {
          id: `bot_alert_${Date.now()}_${Math.random()}`,
          playerId: 'current_player', // This would be the actual player ID
          detectionType: pattern.type as any,
          confidence: pattern.confidence,
          evidence: pattern.evidence,
          timestamp: new Date()
        };
        
        setAlerts(prev => [...prev, alert]);
        
        toast({
          title: "Comportamiento Sospechoso Detectado",
          description: "Se ha detectado un posible comportamiento automatizado",
          variant: "destructive",
        });
      }
    });
  };

  const calculateVariance = (numbers: number[]) => {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    return variance;
  };

  const calculateMouseMovementVariance = (movements: { x: number; y: number }[]) => {
    if (movements.length < 2) return 0;
    
    const distances = movements.slice(1).map((movement, index) => {
      const prev = movements[index];
      return Math.sqrt(Math.pow(movement.x - prev.x, 2) + Math.pow(movement.y - prev.y, 2));
    });
    
    return calculateVariance(distances);
  };

  const calculateAverageDecisionTime = (times: number[]) => {
    if (times.length < 2) return 0;
    
    const intervals = times.slice(1).map((time, index) => time - times[index]);
    return intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return {
    metrics,
    alerts,
    isMonitoring,
    setIsMonitoring,
    recordAction,
    clearAlert,
    analyzeForBotBehavior
  };
}
