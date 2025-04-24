import Link from 'next/link'
import PostDate from '@/components/post-date'
import { PostItemProps } from '@/types/post'

export default function PostItemN({event}: PostItemProps) {
  return (
    <div className="flex flex-col h-[200px] p-5 border-b border-slate-100">
      {/* 标题区域 - 固定高度 */}
      <div className="h-[40px]">
        <h3 className="font-hkgrotesk font-extrabold text-lg truncate">
          <Link className="text-slate-800 hover:text-blue-500 transition duration-150 ease-in-out" href={`/vision/events/${event.id}`}>{event.name}</Link>
        </h3>
      </div>
      
      {/* 描述区域 - 固定高度，固定5行 */}
      <div className="h-[90px] my-2">
        <div className="text-sm text-slate-500 line-clamp-3 overflow-hidden">{event.description}</div>
      </div>
      
      {/* 日期区域 - 固定在底部 */}
      <div className=" font-hkgrotesk font-medium text-sm text-slate-500">
        <PostDate dateString={event.createdAt} />
        <span className="mx-1 text-stale-500">·</span>
        <span className="">明曦中美政策团队</span>  
      </div>
    </div>
  )
}