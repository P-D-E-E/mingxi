import Link from 'next/link'
import PostDate from '@/components/post-date'
import { PostItemProps } from '@/types/post'

export default function PostItemN({event}: PostItemProps) {
  return (
    <div className="flex flex-col h-auto sm:h-[200px] p-3 sm:p-5 border-b border-slate-100">
      {/* 标题区域 - 响应式高度 */}
      <div className="min-h-[30px] sm:h-[40px] mb-1 sm:mb-0">
        <h3 className="font-hkgrotesk font-extrabold text-base sm:text-lg line-clamp-2 sm:truncate">
          <Link className="text-slate-800 hover:text-blue-500 transition duration-150 ease-in-out" href={`/vision/events/${event.id}`}>{event.name}</Link>
        </h3>
      </div>
      
      {/* 描述区域 - 响应式高度，自适应行数 */}
      <div className="min-h-[60px] sm:h-[90px] my-1 sm:my-2">
        <div className="text-xs sm:text-sm text-slate-500 line-clamp-3 overflow-hidden">{event.description}</div>
      </div>
      
      {/* 日期区域 - 固定在底部 */}
      <div className="mt-auto font-hkgrotesk font-medium text-xs sm:text-sm text-slate-500">
        <PostDate dateString={event.createdAt} />
        <span className="mx-1 text-stale-500">·</span>
        <span className="">明曦中美政策团队</span>  
      </div>
    </div>
  )
}