
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface RakeData {
  name: string;
  value: number;
}

const RakeChart = () => {
  const { t } = useTranslation();
  
  // Mock data for the chart
  const data: RakeData[] = [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 140 },
    { name: 'Wed', value: 100 },
    { name: 'Thu', value: 180 },
    { name: 'Fri', value: 160 },
    { name: 'Sat', value: 190 },
    { name: 'Sun', value: 210 },
  ];

  return (
    <div className="bg-[#0e2337] p-6 rounded-2xl">
      <p className="mb-4 text-gray-400 font-medium">{t('admin.dashboard.rake7d')}</p>
      <div className="h-80">
        <ChartContainer 
          config={{
            rake: {
              label: "Rake",
              theme: { light: "#10b981", dark: "#10b981" },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="rake"
                stroke="#10b981"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default RakeChart;
