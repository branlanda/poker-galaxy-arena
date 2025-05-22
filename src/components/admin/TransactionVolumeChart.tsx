
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface TransactionVolumeChartProps {
  timeRange: 'day' | 'week' | 'month';
}

const generateMockData = (timeRange: 'day' | 'week' | 'month') => {
  const data = [];
  let points = 0;
  let format = '';
  
  switch (timeRange) {
    case 'day':
      points = 24; // Hours in a day
      format = 'HH:00';
      break;
    case 'week':
      points = 7; // Days in a week
      format = 'ddd';
      break;
    case 'month':
      points = 30; // Days in a month
      format = 'MMM D';
      break;
  }
  
  const now = new Date();
  
  for (let i = 0; i < points; i++) {
    const date = new Date();
    
    if (timeRange === 'day') {
      date.setHours(date.getHours() - (points - i - 1));
    } else if (timeRange === 'week') {
      date.setDate(date.getDate() - (points - i - 1));
    } else {
      date.setDate(date.getDate() - (points - i - 1));
    }
    
    // Generate random but somewhat realistic transaction volumes
    const depositsBase = Math.floor(Math.random() * 1000) + 500;
    const withdrawalsBase = Math.floor(Math.random() * 800) + 300;
    
    // Add time-of-day patterns for realism
    let hourFactor = 1;
    if (timeRange === 'day') {
      const hour = date.getHours();
      // More active during evenings, less in early morning
      hourFactor = hour >= 18 || hour <= 2 ? 1.5 : hour >= 3 && hour <= 7 ? 0.3 : 1;
    }
    
    const deposits = Math.round(depositsBase * hourFactor);
    const withdrawals = Math.round(withdrawalsBase * hourFactor);
    
    data.push({
      name: timeRange === 'day' 
        ? date.toLocaleTimeString([], { hour: '2-digit' })
        : timeRange === 'week'
          ? date.toLocaleDateString([], { weekday: 'short' })
          : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      deposits,
      withdrawals,
      net: deposits - withdrawals,
    });
  }
  
  return data;
};

const TransactionVolumeChart: React.FC<TransactionVolumeChartProps> = ({ timeRange }) => {
  const data = React.useMemo(() => generateMockData(timeRange), [timeRange]);
  
  return (
    <div className="h-[280px]">
      <ChartContainer
        config={{
          deposits: {
            label: "Deposits",
            color: "#10b981",
          },
          withdrawals: {
            label: "Withdrawals",
            color: "#f43f5e",
          },
          net: {
            label: "Net",
            color: "#f59e0b",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax + 100']}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="text-sm font-bold mb-1">{label}</div>
                      {payload.map((item, index) => (
                        <div key={index} className="flex justify-between gap-2">
                          <span style={{ color: item.color }}>{item.name}:</span>
                          <span className="font-medium">${item.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="deposits" 
              name="Deposits"
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="withdrawals" 
              name="Withdrawals"
              stroke="#f43f5e" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="net" 
              name="Net Flow"
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 3 }}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default TransactionVolumeChart;
