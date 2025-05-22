
import React, { useState, useEffect } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

// In a real application, this data would come from Supabase
const generateMockData = () => {
  const now = new Date();
  const data = [];
  
  for (let i = 24; i >= 0; i--) {
    // Generate a reasonable fluctuation centered around 120 users
    const baseValue = 120;
    const randomFactor = Math.random() * 60 - 30; // Random number between -30 and 30
    const timeOfDayFactor = Math.sin((now.getHours() - i) * Math.PI / 12) * 50; // Time of day factor
    
    const activeUsers = Math.max(20, Math.round(baseValue + randomFactor + timeOfDayFactor));
    
    const time = new Date(now);
    time.setHours(time.getHours() - i);
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      users: activeUsers
    });
  }
  
  return data;
};

const ActiveUsersWidget: React.FC = () => {
  const [data, setData] = useState(generateMockData());
  const [currentUsers, setCurrentUsers] = useState(data[data.length - 1].users);
  
  // Simulate real-time user updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...data];
      const lastPoint = { ...newData[newData.length - 1] };
      
      // Random fluctuation between -10 and +10
      const fluctuation = Math.floor(Math.random() * 21) - 10;
      const newUsers = Math.max(20, lastPoint.users + fluctuation);
      
      // Update the last data point
      newData[newData.length - 1] = {
        ...lastPoint,
        users: newUsers
      };
      
      setData(newData);
      setCurrentUsers(newUsers);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [data]);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold">{currentUsers}</div>
          <div className="text-sm text-muted-foreground">Current active users</div>
        </div>
        <div className="px-2 py-1 bg-emerald/10 text-emerald rounded text-sm">Live</div>
      </div>
      
      <div className="h-[180px]">
        <ChartContainer
          config={{
            users: {
              label: "Active Users",
              color: "#10b981",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        <div className="flex justify-between">
                          <span>Active Users:</span>
                          <span className="font-medium">{payload[0].value}</span>
                        </div>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                name="users"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#gradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default ActiveUsersWidget;
