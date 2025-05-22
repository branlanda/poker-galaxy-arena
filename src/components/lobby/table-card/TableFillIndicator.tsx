
interface TableFillIndicatorProps {
  fillPercentage: number;
}

export function TableFillIndicator({ fillPercentage }: TableFillIndicatorProps) {
  return (
    <div 
      className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${
        fillPercentage < 30 ? 'bg-blue-500/40' : 
        fillPercentage < 70 ? 'bg-emerald/40' : 'bg-amber-500/40'
      }`} 
      style={{ width: `${fillPercentage}%` }}
    />
  );
}
