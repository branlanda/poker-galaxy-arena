
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Mock data for table activity
const tableActivityData = [
  { name: 'Hold\'em 1', active: 6, full: 9, inactive: 0 },
  { name: 'Hold\'em 2', active: 2, full: 2, inactive: 0 },
  { name: 'Omaha 1', active: 3, full: 0, inactive: 0 },
  { name: 'Omaha 2', active: 0, full: 0, inactive: 1 },
  { name: 'Tourney 1', active: 8, full: 4, inactive: 0 },
];

const TableActivityWidget: React.FC = () => {
  return (
    <div className="h-[180px]">
      <ChartContainer
        config={{
          active: {
            label: "Active Players",
            color: "#10b981",
          },
          full: {
            label: "Full Tables",
            color: "#f59e0b",
          },
          inactive: {
            label: "Inactive Tables",
            color: "#ef4444",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={tableActivityData}
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
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="text-sm font-bold mb-1">{label}</div>
                      {payload.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between gap-2">
                          <span style={{ color: item.color }}>{item.name}:</span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="active" name="Active" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="full" name="Full" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="inactive" name="Inactive" fill="#ef4444" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default TableActivityWidget;
