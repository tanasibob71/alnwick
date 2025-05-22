import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface FundraisingProgressBarProps {
  className?: string;
}

const FundraisingProgressBar = ({ className }: FundraisingProgressBarProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/donations/total'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }
  
  const { total = 0, goal = 250000 } = data || {};
  const percentage = Math.min(Math.round((total / goal) * 100), 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold">Fundraising Progress</span>
        <span className="font-bold text-primary">
          {formatCurrency(total)} / {formatCurrency(goal)}
        </span>
      </div>
      <Progress value={percentage} className="h-4" />
      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <span>{percentage}% Complete</span>
        <span>Goal: {formatCurrency(goal)}</span>
      </div>
    </div>
  );
};

export default FundraisingProgressBar;
