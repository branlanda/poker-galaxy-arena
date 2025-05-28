
import React, { useState } from 'react';
import { Bell, Settings, X, Check, CheckCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslation } from '@/hooks/useTranslation';
import { NotificationItem } from './NotificationItem';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  open,
  onClose
}) => {
  const { 
    notifications, 
    preferences, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    updatePreference 
  } = useNotifications();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read;
    return true;
  });

  const notificationTypes = [
    { key: 'TOURNAMENT_STARTING', label: 'Tournament Alerts' },
    { key: 'GAME_INVITE', label: 'Game Invitations' },
    { key: 'ACHIEVEMENT', label: 'Achievements' },
    { key: 'FRIEND_REQUEST', label: 'Friend Requests' },
    { key: 'REWARD', label: 'Rewards & Bonuses' },
    { key: 'SYSTEM_MESSAGE', label: 'System Messages' }
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-end p-4">
      <div className="bg-slate-800/95 backdrop-blur-lg border border-emerald/20 rounded-lg w-full max-w-md h-[80vh] overflow-hidden animate-in slide-in-from-right">
        <Tabs defaultValue="notifications" className="h-full flex flex-col">
          <div className="p-4 border-b border-emerald/10 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-emerald" />
              <h2 className="text-lg font-medium text-white">
                {t('notifications.title', 'Notifications')}
              </h2>
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-emerald/20 text-emerald border-emerald/30">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-300 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:bg-emerald/20 data-[state=active]:text-white">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-gray-300 data-[state=active]:bg-emerald/20 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="flex-1 flex flex-col m-0">
            <div className="p-4 border-b border-emerald/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="h-8 text-gray-300 hover:text-white"
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                    className="h-8 text-gray-300 hover:text-white"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    Unread ({unreadCount})
                  </Button>
                </div>
                
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8 text-emerald hover:text-emerald/80"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald border-t-transparent mx-auto"></div>
                  <p className="mt-4 text-gray-400">{t('loading', 'Loading...')}</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-10 w-10 mx-auto text-gray-500" />
                  <p className="mt-4 text-gray-400">
                    {filter === 'unread' 
                      ? t('notifications.noUnread', 'No unread notifications') 
                      : t('notifications.noNotifications', 'No notifications yet')
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-emerald/10">
                  {filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Choose how you want to receive notifications for different types of events.
                  </p>
                </div>

                {notificationTypes.map(type => {
                  const pref = preferences.find(p => p.notification_type === type.key);
                  
                  return (
                    <div key={type.key} className="space-y-4 p-4 rounded-lg bg-slate-700/50 border border-emerald/10">
                      <div>
                        <h4 className="font-medium text-white">{type.label}</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`${type.key}-in-app`} className="text-sm text-gray-300">
                            In-app notifications
                          </Label>
                          <Switch
                            id={`${type.key}-in-app`}
                            checked={pref?.in_app_enabled ?? true}
                            onCheckedChange={(checked) => 
                              updatePreference(type.key, 'in_app_enabled', checked)
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`${type.key}-email`} className="text-sm text-gray-300">
                            Email notifications
                          </Label>
                          <Switch
                            id={`${type.key}-email`}
                            checked={pref?.email_enabled ?? true}
                            onCheckedChange={(checked) => 
                              updatePreference(type.key, 'email_enabled', checked)
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`${type.key}-push`} className="text-sm text-gray-300">
                            Push notifications
                          </Label>
                          <Switch
                            id={`${type.key}-push`}
                            checked={pref?.push_enabled ?? true}
                            onCheckedChange={(checked) => 
                              updatePreference(type.key, 'push_enabled', checked)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
