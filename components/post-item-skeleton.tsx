import { Skeleton } from "@/components/ui/skeleton"

export default function PostItemSkeleton() {
  return (
    <div className="flex flex-col h-[230px] p-5 border-b border-slate-100">
      {/* 标题区域 - 固定高度 */}
      <div className="h-[40px] flex items-center">
        <Skeleton className="h-6 w-3/4" />
      </div>
      
      {/* 描述区域 - 固定高度，固定3行 */}
      <div className="h-[90px] my-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      
      {/* 日期区域 - 固定在底部 */}
      <div className="font-hkgrotesk font-medium text-sm flex items-center space-x-2">
        <Skeleton className="h-4 w-24" />
        <div className="mx-1">·</div>
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}

export function PostItemSKeleton() {
    return (
      <article className="flex items-center justify-between py-4 border-b border-gray-200 h-[200px] w-full">
        <div className="flex-grow flex flex-col h-full">
          {/* 标题区域 skeleton */}
          <header className="h-[50px]">
            <Skeleton className="h-6 w-3/4 mb-2" />
          </header>
          
          {/* 描述区域 skeleton */}
          <div className="mb-4 h-[80px] space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
          
          {/* 页脚区域 skeleton */}
          <footer className="text-sm mt-auto">
            <div className="flex items-center">
              <Skeleton className="h-4 w-48" />
            </div>
          </footer>
        </div>
        
        {/* 右侧箭头 skeleton */}
        <div className="block shrink-0 ml-6">
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
      </article>
    )
  }

  export function SkeletonDemo() {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }