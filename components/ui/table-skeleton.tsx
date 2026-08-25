interface TableSkeletonProps {
  rows?: number
  cols?: number
  className?: string
}

export function TableSkeleton({ rows = 5, cols = 4, className = "" }: TableSkeletonProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex gap-4 px-6 py-3 border-b border-gray-100">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className={`h-3 rounded-full bg-gray-100 animate-pulse ${i === 0 ? 'flex-1' : 'w-24'}`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4 items-center px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 rounded-full bg-gray-100 animate-pulse w-3/4" />
              <div className="h-2.5 rounded-full bg-gray-50 animate-pulse w-1/2" />
            </div>
          </div>
          {Array.from({ length: cols - 1 }).map((_, col) => (
            <div key={col} className="h-3 rounded-full bg-gray-100 animate-pulse w-20" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 rounded-full bg-gray-100 animate-pulse w-3/4" />
              <div className="h-3 rounded-full bg-gray-100 animate-pulse w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 rounded-full bg-gray-100 animate-pulse" />
            <div className="h-2.5 rounded-full bg-gray-100 animate-pulse w-4/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(count, 6)} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-5 rounded-full bg-gray-100 animate-pulse w-1/2" />
          <div className="h-3 rounded-full bg-gray-100 animate-pulse w-3/4" />
          <div className="h-2.5 rounded-full bg-gray-100 animate-pulse w-2/3" />
        </div>
      ))}
    </div>
  )
}
