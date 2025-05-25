import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Calendar, ChevronDown, CreditCard, FileText, HelpCircle, Plus, Settings } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const StatisticsSection: React.FC<{ stats: any }> = ({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle>Statistics</CardTitle>
      <CardDescription>Your game statistics</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      <div className="flex items-center justify-between">
        <span>Total Hands Played</span>
        <span>{stats.totalHands}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Total Winnings</span>
        <span>${stats.totalWinnings}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Tournament Wins</span>
        <span>{stats.tournamentWins}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Rank Position</span>
        <span>{stats.rankPosition}</span>
      </div>
    </CardContent>
  </Card>
);

const AchievementsSection: React.FC<{ achievements: any[] }> = ({ achievements }) => (
  <Card>
    <CardHeader>
      <CardTitle>Achievements</CardTitle>
      <CardDescription>Your unlocked achievements</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{achievement.name}</p>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
          </div>
          {achievement.unlocked ? (
            <Badge variant="outline">Unlocked</Badge>
          ) : (
            <span>{achievement.progress}%</span>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);

const FriendsSection: React.FC<{ friends: any[], onRefresh: () => void }> = ({ friends, onRefresh }) => (
  <Card>
    <CardHeader>
      <CardTitle>Friends</CardTitle>
      <CardDescription>Your list of friends</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {friends.map((friend) => (
        <div key={friend.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{friend.username}</p>
            <p className="text-sm text-muted-foreground">{friend.status}</p>
          </div>
          <Badge variant="secondary">{friend.status}</Badge>
        </div>
      ))}
      <Button variant="outline" onClick={onRefresh}>Refresh</Button>
    </CardContent>
  </Card>
);

const RecentGamesSection: React.FC<{ games: any[] }> = ({ games }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Games</CardTitle>
      <CardDescription>Your recent game history</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell>{game.type}</TableCell>
              <TableCell>{game.result}</TableCell>
              <TableCell>{game.amount}</TableCell>
              <TableCell>{format(game.date, 'PPP')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  return (
    <DropdownMenu open={open} onOpenChange={onClose}>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[200px] w-full pr-2">
          <div className="space-y-1">
            <p className="text-sm leading-tight">
              Your account was created <Calendar className="inline-block h-4 w-4 align-middle" />
            </p>
            <p className="px-2 text-xs text-muted-foreground">
              on January 1, 2024
            </p>
          </div>
          <DropdownMenuSeparator />
          <div className="space-y-1">
            <p className="text-sm leading-tight">
              You received a new credit <CreditCard className="inline-block h-4 w-4 align-middle" />
            </p>
            <p className="px-2 text-xs text-muted-foreground">
              on January 1, 2024
            </p>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const mockStats = {
    totalHands: 1250,
    totalWinnings: 5420.50,
    tournamentWins: 15,
    rankPosition: 42
  };
  
  const mockAchievements = [
    { id: '1', name: 'First Win', description: 'Win your first game', unlocked: true, progress: 100 },
    { id: '2', name: 'High Roller', description: 'Win a high stakes game', unlocked: false, progress: 60 }
  ];
  
  const mockFriends = [
    { id: '1', username: 'Player1', status: 'online' },
    { id: '2', username: 'Player2', status: 'offline' }
  ];
  
  const mockGames = [
    { id: '1', type: 'Cash Game', result: 'win', amount: 250, date: new Date() },
    { id: '2', type: 'Tournament', result: 'loss', amount: -100, date: new Date() }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Your Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">Your Profile</h2>
            <p className="text-muted-foreground">Manage your profile and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => setShowNotifications(true)}>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Funds <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Deposit Funds</DropdownMenuItem>
              <DropdownMenuItem>Withdraw Funds</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Transactions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatisticsSection stats={mockStats} />
            <AchievementsSection achievements={mockAchievements} />
            <FriendsSection friends={mockFriends} onRefresh={() => {}} />
            <RecentGamesSection games={mockGames} />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <input type="text" id="name" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <input type="email" id="email" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="Your Email" />
              </div>
              <Button>Update Information</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-base font-medium leading-none">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Enable two-factor authentication for added security</p>
                </div>
                <Switch id="2fa" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <input type="password" id="password" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="New Password" />
                <Button>Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Get help and support for our platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-base font-medium leading-none">FAQ</p>
                  <p className="text-sm text-muted-foreground">Find answers to common questions</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-base font-medium leading-none">Contact Support</p>
                  <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <NotificationsPanel 
        open={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}
