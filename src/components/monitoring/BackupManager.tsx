
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, Calendar, Database, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BackupJob {
  id: string;
  type: 'database' | 'storage' | 'full';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  size?: number;
  downloadUrl?: string;
  error?: string;
}

export const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<BackupJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadBackups();
    const interval = setInterval(loadBackups, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadBackups = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_jobs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setBackups(data || []);
    } catch (error) {
      console.error('Failed to load backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async (type: 'database' | 'storage' | 'full') => {
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-backup', {
        body: { type }
      });

      if (error) throw error;
      
      toast.success('Backup job started');
      loadBackups();
    } catch (error) {
      console.error('Failed to create backup:', error);
      toast.error('Failed to start backup');
    } finally {
      setCreating(false);
    }
  };

  const downloadBackup = async (backup: BackupJob) => {
    if (!backup.downloadUrl) return;

    try {
      const response = await fetch(backup.downloadUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `backup-${backup.type}-${backup.startedAt}.sql`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Backup downloaded');
    } catch (error) {
      console.error('Failed to download backup:', error);
      toast.error('Failed to download backup');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'storage': return <Upload className="h-4 w-4" />;
      case 'full': return <Calendar className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (start: Date, end?: Date) => {
    const duration = (end ? end.getTime() : Date.now()) - start.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  if (loading) {
    return <div>Loading backups...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Backup Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button
              onClick={() => createBackup('database')}
              disabled={creating}
              className="flex items-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>Database Backup</span>
            </Button>
            <Button
              onClick={() => createBackup('storage')}
              disabled={creating}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Storage Backup</span>
            </Button>
            <Button
              onClick={() => createBackup('full')}
              disabled={creating}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Full Backup</span>
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Backups</h3>
            {backups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-2" />
                <p>No backups found</p>
                <p className="text-sm">Create your first backup above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div key={backup.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(backup.type)}
                        <div>
                          <h4 className="font-medium capitalize">
                            {backup.type} Backup
                          </h4>
                          <p className="text-sm text-gray-600">
                            Started: {new Date(backup.startedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(backup.status)}>
                          {backup.status.toUpperCase()}
                        </Badge>
                        {backup.status === 'completed' && backup.downloadUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadBackup(backup)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {backup.status === 'running' && (
                      <div className="mb-2">
                        <Progress value={backup.progress} className="w-full" />
                        <p className="text-sm text-gray-600 mt-1">
                          {backup.progress}% complete
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        {backup.size && (
                          <span>Size: {formatFileSize(backup.size)}</span>
                        )}
                        <span>
                          Duration: {formatDuration(backup.startedAt, backup.completedAt)}
                        </span>
                      </div>
                      {backup.error && (
                        <span className="text-red-600 text-xs">
                          Error: {backup.error}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
