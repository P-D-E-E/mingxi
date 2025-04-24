import { Skeleton } from "@/components/ui/skeleton"

export default function PostItemSSkeleton() {
  return (
    <article className="flex flex-col h-[390px]">
      {/* 图片区域 skeleton */}
      <header>
        <figure className="relative h-0 pb-9/16">
          <Skeleton className="absolute inset-0 w-full h-full" />
        </figure>
      </header>
      
      {/* 标题 skeleton */}
      <div className="mt-3 mb-2">
        <Skeleton className="h-6 w-4/5" />
      </div>
      
      {/* 中间留白部分用 flex-grow 占据更多空间 */}
      <div className="flex-grow"></div>
      
      {/* Footer 部分固定在底部 */}
      <footer className="mt-auto">
        <div className="text-sm">
          <Skeleton className="h-4 w-24" />
        </div>
      </footer>
    </article>
  );
}