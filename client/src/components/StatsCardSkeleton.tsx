import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-12 w-12 mx-auto rounded-full" />
          <Skeleton className="h-5 w-16 mx-auto" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}
