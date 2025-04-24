// app/(default)/vision/events/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Separator } from "@/components/ui/separator"
import { formatDate } from '@/lib/utils'
import prisma from '@/prisma/client'
import RecentEvents from './recent-events'

// 根据ID从数据库获取事件
async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id
      }
    })
    
    if (!event) {
      return null
    }
    
    return event
  } catch (error) {
    console.error('获取事件详情失败:', error)
    return null
  }
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const event = await getEventById(params.slug)
  
  if (!event) {
    return {
      title: '文章未找到',
      description: '请求的文章不存在'
    }
  }
  
  return {
    title: `${event.name} - 明曦观点`,
    description: event.description || '明曦观点文章详情'
  }
}

// 页面组件
export default async function EventPage({ params }: { params: { slug: string } }) {
  // 从URL参数中获取事件ID
  const eventId = params.slug
  // 根据ID获取事件详情
  const event = await getEventById(eventId)
  
  // 如果事件不存在，显示404页面
  if (!event) {
    notFound()
  }
  
  return (
    <section>
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="grid grid-cols-12 gap-8">
          {/* 左侧空白区域 */}
          <div className="hidden lg:block lg:col-span-2"></div>
          
          {/* 文章内容区域 - 减小宽度 */}
          <div className="col-span-12 lg:col-span-5 text-left">
            {/* 文章标题 */}
            <h1 className="text-3xl md:text-3xl font-bold mb-6">{event.name}</h1>
            
            {/* 文章元信息 */}
            <div className="flex items-center text-gray-500 mb-4">
              <span>{formatDate(event.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>明曦中美研究中心</span>
            </div>
            
            {/* 标题和日期下方的分割线 */}
            <div className="border-b-2 border-gray-300 mt-4 mb-10"></div>

            {/* 文章封面图 - 调整为更小的尺寸 */}
            {event.image && (
              <div className="mb-10">
                <Image 
                  src={event.image} 
                  alt={event.name || ""}
                  width={600}
                  height={350}
                  className="rounded-lg w-3/4 h-auto object-cover mx-auto"
                />
              </div>
            )}
            
            <Separator className="my-8" />
            
            {/* 文章内容 */}
            <article className="prose prose-lg max-w-none text-left">
              <div 
                className="prose max-w-full prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-lg" 
                dangerouslySetInnerHTML={{ __html: event.article || '' }}
              />
            </article>
            
            <Separator className="my-8" />
            
            {/* 返回按钮 - 左下角 */}
            <div className="flex justify-start mt-8">
              <Link 
                href="/vision/events" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rblue-900 hover:bg-rblue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回文章列表
              </Link>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-1"></div>

            {/* 右侧区域 - 明曦回顾 */}
            <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32">
                <div className="max-w-[360px]">
                <RecentEvents currentEventId={eventId} />
                </div>
            </div>
            </div>
          
          {/* 右侧空白区域 */}
          <div className="hidden lg:block lg:col-span-1"></div>
          
          {/* 移动端显示的明曦回顾 */}
          <div className="col-span-12 mt-12 lg:hidden">
            <RecentEvents currentEventId={eventId} />
          </div>
        </div>
      </div>
    </section>
  )
}