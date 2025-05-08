import { Skeleton } from './Skeleton';

export function SetupGuideSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="w-32 h-6 mb-2" />
            <Skeleton className="w-24 h-4" />
          </div>
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="ml-4 flex-1">
                <Skeleton className="w-48 h-4 mb-2" />
                <Skeleton className="w-64 h-4 mb-2" />
                <Skeleton className="w-24 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}