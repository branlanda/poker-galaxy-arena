
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Globe, Zap, HardDrive, TrendingUp, Settings } from 'lucide-react';

interface CDNRule {
  id: string;
  pattern: string;
  ttl: number; // seconds
  cacheLevel: 'BYPASS' | 'STANDARD' | 'AGGRESSIVE';
  enabled: boolean;
  priority: number;
}

interface CDNNode {
  id: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  load: number;
  latency: number;
  requests: number;
}

const CDNManager: React.FC = () => {
  const [rules, setRules] = useState<CDNRule[]>([
    {
      id: 'rule_1',
      pattern: '*.css, *.js, *.woff2',
      ttl: 31536000, // 1 year
      cacheLevel: 'AGGRESSIVE',
      enabled: true,
      priority: 1
    },
    {
      id: 'rule_2',
      pattern: '*.png, *.jpg, *.webp, *.svg',
      ttl: 15552000, // 6 months
      cacheLevel: 'AGGRESSIVE',
      enabled: true,
      priority: 2
    },
    {
      id: 'rule_3',
      pattern: '/api/public/*',
      ttl: 300, // 5 minutes
      cacheLevel: 'STANDARD',
      enabled: true,
      priority: 3
    },
    {
      id: 'rule_4',
      pattern: '/lobby/tables',
      ttl: 30, // 30 seconds
      cacheLevel: 'STANDARD',
      enabled: true,
      priority: 4
    }
  ]);

  const [nodes, setNodes] = useState<CDNNode[]>([
    { id: 'node_1', location: 'Madrid, ES', status: 'ONLINE', load: 45, latency: 12, requests: 15420 },
    { id: 'node_2', location: 'Frankfurt, DE', status: 'ONLINE', load: 38, latency: 18, requests: 12380 },
    { id: 'node_3', location: 'London, UK', status: 'ONLINE', load: 52, latency: 15, requests: 18750 },
    { id: 'node_4', location: 'Paris, FR', status: 'ONLINE', load: 33, latency: 14, requests: 11290 },
    { id: 'node_5', location: 'Amsterdam, NL', status: 'MAINTENANCE', load: 0, latency: 0, requests: 0 },
    { id: 'node_6', location: 'Stockholm, SE', status: 'ONLINE', load: 41, latency: 22, requests: 9840 }
  ]);

  const [newRule, setNewRule] = useState<Partial<CDNRule>>({
    pattern: '',
    ttl: 3600,
    cacheLevel: 'STANDARD',
    enabled: true,
    priority: rules.length + 1
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  const addRule = () => {
    if (newRule.pattern) {
      const rule: CDNRule = {
        ...newRule as CDNRule,
        id: `rule_${Date.now()}`
      };

      setRules(prev => [...prev, rule].sort((a, b) => a.priority - b.priority));
      setNewRule({
        pattern: '',
        ttl: 3600,
        cacheLevel: 'STANDARD',
        enabled: true,
        priority: rules.length + 2
      });
      setShowCreateForm(false);
    }
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const formatTTL = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`;
    return `${Math.floor(seconds / 31536000)}y`;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'ONLINE': 'bg-green-500',
      'OFFLINE': 'bg-red-500',
      'MAINTENANCE': 'bg-yellow-500'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const purgeCache = async () => {
    // Simulate cache purge
    console.log('Purging CDN cache...');
  };

  const preloadContent = async () => {
    // Simulate content preloading
    console.log('Preloading content to CDN nodes...');
  };

  return (
    <div className="space-y-6">
      {/* CDN Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-navy-light border-emerald/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Nodos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {nodes.filter(node => node.status === 'ONLINE').length}
            </div>
            <div className="text-xs text-gray-400">de {nodes.length} total</div>
          </CardContent>
        </Card>

        <Card className="bg-navy-light border-emerald/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Cache Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">95.2%</div>
            <div className="text-xs text-gray-400">últimas 24h</div>
          </CardContent>
        </Card>

        <Card className="bg-navy-light border-emerald/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Bandwidth Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">180 GB</div>
            <div className="text-xs text-gray-400">este mes</div>
          </CardContent>
        </Card>

        <Card className="bg-navy-light border-emerald/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Requests/min
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">25.4K</div>
            <div className="text-xs text-gray-400">promedio actual</div>
          </CardContent>
        </Card>
      </div>

      {/* CDN Controls */}
      <Card className="bg-navy-light border-emerald/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Controles CDN</CardTitle>
          <div className="flex gap-2">
            <Button onClick={preloadContent} variant="outline" size="sm">
              Precargar Contenido
            </Button>
            <Button onClick={purgeCache} variant="outline" size="sm">
              Purgar Caché
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Cache Rules */}
      <Card className="bg-navy-light border-emerald/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Reglas de Caché
          </CardTitle>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant="outline"
            size="sm"
          >
            {showCreateForm ? 'Cancelar' : 'Nueva Regla'}
          </Button>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="mb-6 p-4 bg-navy rounded border border-emerald/10">
              <h4 className="text-white font-medium mb-4">Crear Nueva Regla</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Patrón</label>
                  <Input
                    value={newRule.pattern || ''}
                    onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                    placeholder="*.css, /api/*"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">TTL (segundos)</label>
                  <Input
                    type="number"
                    value={newRule.ttl}
                    onChange={(e) => setNewRule({ ...newRule, ttl: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nivel de Caché</label>
                  <Select 
                    value={newRule.cacheLevel} 
                    onValueChange={(value: any) => setNewRule({ ...newRule, cacheLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BYPASS">Bypass</SelectItem>
                      <SelectItem value="STANDARD">Estándar</SelectItem>
                      <SelectItem value="AGGRESSIVE">Agresivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prioridad</label>
                  <Input
                    type="number"
                    value={newRule.priority}
                    onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
              </div>

              <Button onClick={addRule}>Crear Regla</Button>
            </div>
          )}

          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 bg-navy rounded border border-emerald/10">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-mono text-emerald">#{rule.priority}</div>
                  <div>
                    <div className="text-white font-medium">{rule.pattern}</div>
                    <div className="text-sm text-gray-400">
                      TTL: {formatTTL(rule.ttl)} • {rule.cacheLevel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                    {rule.enabled ? 'Activa' : 'Inactiva'}
                  </Badge>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteRule(rule.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CDN Nodes */}
      <Card className="bg-navy-light border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white">Nodos CDN</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <div key={node.id} className="p-4 bg-navy rounded border border-emerald/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-medium">{node.location}</div>
                  {getStatusBadge(node.status)}
                </div>
                
                {node.status === 'ONLINE' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Carga CPU</span>
                      <span className="text-white">{node.load}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Latencia</span>
                      <span className="text-white">{node.latency}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Requests</span>
                      <span className="text-white">{node.requests.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                
                {node.status === 'MAINTENANCE' && (
                  <div className="text-sm text-yellow-500">
                    Nodo en mantenimiento programado
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CDNManager;
