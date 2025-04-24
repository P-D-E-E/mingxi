'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import Link from 'next/link'
import Image from 'next/image'
import { Separator } from "@/components/ui/separator"
import { formatDate } from '@/lib/utils'

interface ContentPreviewProps {
  content: string;
}

export function ContentPreview({ content }: ContentPreviewProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // 模拟当前日期作为预览的发布日期
  const currentDate = new Date().toISOString();
  
  return (
    <div className="mt-4 rounded-md p-4 max-w-6xl">
      <div className="flex justify-between mb-2 text-lg font-medium">
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="text-sm px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md"
        >
          全屏预览
        </button>
      </div>
      
      {/* 全屏预览对话框 */}
      {isPreviewOpen && (
        <Dialog
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            
            {/* 修改这里：添加最大宽度和居中 */}
            <div className="relative bg-white dark:bg-slate-800 max-w-7xl mx-auto h-full overflow-auto">
              <div className="px-4 relative">
                <section>
                  <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    <div className="grid grid-cols-12 gap-8">
                      {/* 左侧空白区域 */}
                      <div className="hidden lg:block lg:col-span-2"></div>
                      
                      {/* 文章内容区域 - 减小宽度 */}
                      <div className="col-span-12 lg:col-span-5 text-left">
                        {/* 文章标题 */}
                        <h1 className="text-3xl md:text-3xl font-bold mb-6">预览标题</h1>
                        
                        {/* 文章元信息 */}
                        <div className="flex items-center text-gray-500 mb-4">
                          <span>{formatDate(currentDate)}</span>
                          <span className="mx-2">•</span>
                          <span>明曦中美研究中心</span>
                        </div>
                        
                        {/* 标题和日期下方的分割线 */}
                        <div className="border-b-2 border-gray-300 mt-4 mb-10"></div>
                        
                        {/* 文章封面图 - 这里可以添加一个示例图片 */}
                        <div className="mb-10">
                          <div className="rounded-lg w-3/4 h-48 bg-gray-200 mx-auto flex items-center justify-center">
                            <span className="text-gray-500">封面图预览位置</span>
                          </div>
                        </div>
                        
                        <Separator className="my-8" />
                        
                        {/* 文章内容 */}
                        <article className="prose prose-lg max-w-none text-left">
                          {showRaw ? (
                            <pre className="bg-gray-50 p-3 rounded-md overflow-auto text-sm">
                              {content}
                            </pre>
                          ) : (
                            <div 
                              className="prose max-w-full prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-lg" 
                              dangerouslySetInnerHTML={{ __html: content }}
                            />
                          )}
                          
                          {!content && (
                            <p className="text-gray-500 italic">暂无内容</p>
                          )}
                        </article>
                        
                        <Separator className="my-8" />
                        
                        {/* 返回按钮 - 左下角 */}
                        <div className="flex justify-between mt-8">
                          <button 
                            onClick={() => setIsPreviewOpen(false)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rblue-900 hover:bg-rblue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            关闭预览
                          </button>
                          
                          <button 
                            onClick={() => setShowRaw(!showRaw)}
                            className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                          >
                            {showRaw ? '查看渲染效果' : '查看原始HTML'}
                          </button>
                        </div>
                      </div>
                      
                      {/* 右侧区域 - 明曦回顾 */}
                      <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-32">
                          <div className="max-w-[360px]">
                            <div className="mb-8 bg-white p-5 rounded-lg shadow-sm">
                              <h4 className="text-lg font-bold leading-snug tracking-tight mb-4">明曦回顾</h4>
                              <ul className="-my-2">
                                {[1, 2, 3, 4].map((i) => (
                                  <li key={i} className="flex py-2 border-b border-gray-200 last:border-0">
                                    <svg className="w-4 h-4 shrink-0 fill-current text-rblue-500 mt-1 mr-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M15.686 5.695L10.291.3c-.4-.4-.999-.4-1.399 0s-.4.999 0 1.399l.6.599-6.794 3.697-1-1c-.4-.399-.999-.399-1.398 0-.4.4-.4 1 0 1.4l1.498 1.498 2.398 2.398L.6 13.988 2 15.387l3.696-3.697 3.997 3.996c.5.5 1.199.2 1.398 0 .4-.4.4-.999 0-1.398l-.999-1 3.697-6.694.6.6c.599.6 1.199.2 1.398 0 .3-.4.3-1.1-.1-1.499zM8.493 11.79L4.196 7.494l6.695-3.697 1.298 1.299-3.696 6.694z" />
                                    </svg>
                                    <article>
                                      <h3 className="font-medium mb-1">
                                        <span className="hover:underline">
                                          示例文章标题 {i}
                                        </span>
                                      </h3>
                                      <div className="text-sm text-gray-800">
                                        <span className="text-gray-600">发布于 </span>
                                        <span className="font-medium">{formatDate(currentDate)}</span>
                                      </div>
                                    </article>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 右侧空白区域 */}
                      <div className="hidden lg:block lg:col-span-2"></div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}