"use client"


import { Separator } from "@/components/ui/separator"

import { FormEvent, useEffect, useState } from 'react'
import PostItemS from '@/components/post-item-selected'
import PostItemN from '@/components/post-item-nonselected'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import PostItemSkeleton from '@/components/post-item-skeleton'
import PostItemSSkeleton from '@/components/post-item-s-skeleton'

interface Event {
  id: string;
  name: string;
  description?: string;
  article?: string;
  image?: string;
  createdAt: string; // 确保包含这个属性
  status: string;
  // 添加其他需要的属性
}

export default function AboutStory() {  
  const [eventSelected, setEventSelected] = useState<Event[]>([]); 
  const [eventNonSelected, setEventNonSelected] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 6; // 每页显示6条

  // 获取选中的事件数据
  const getSelectedEvents = async () => {     
    const response = await fetch('/api/event?status=SELECTED', {  
        method: 'GET',         
        headers: {
            'Content-Type': 'application/json',         
        },     
    });     
    const data = await response.json();  
    setEventSelected(data);
  };
  
  // 获取非选中的事件数据（带分页）
  const getNonSelectedEvents = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/event?status=NONSELECTED&page=${page}&limit=${itemsPerPage}`, {  
          method: 'GET',         
          headers: {
              'Content-Type': 'application/json',         
          },     
      });     
      const data = await response.json();
      
      setEventNonSelected(data.events);
      setTotalPages(data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error("获取数据失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    getSelectedEvents();
    getNonSelectedEvents(1);
  }, []);

  // 处理页码变化
  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
      getNonSelectedEvents(page);
      
      // 保持滚动位置，不跳到页面顶部
      // 可以使用 ref 来获取分页组件的位置
  };
  
  // 生成页码数组
  const generatePagination = () => {
    // 如果总页数小于等于3，显示所有页码
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // 如果当前页接近开始
    if (currentPage <= 2) {
      return [1, 2, 3, '...', totalPages];
    }
    
    // 如果当前页接近结束
    if (currentPage >= totalPages - 1) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    
    // 如果当前页在中间
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  console.log("eventSelected:", eventSelected)
  console.log("eventNonSelected:", eventNonSelected)

  eventSelected.sort((a, b) => {
    return (new Date(a.createdAt) > new Date(b.createdAt)) ? -1 : 1
  });

  eventNonSelected.sort((a, b) => {
    return (new Date(a.createdAt) > new Date(b.createdAt)) ? -1 : 1
  });

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          <div className="max-w-6xl mx-auto">
            <section>
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pb-8 md:pb-12 pt-12">
                  <div className="lg:flex lg:justify-between">

                    {/* Main content */}
                    <div className="lg:grow" data-aos="fade-down" data-aos-delay="200">

                      {/* 上方分隔线 - 增加上边距 */}
                      
                      {/* 标题 - 向右移动 */}
                      <h2 className="text-2xl font-bold mb-8 pl-8">最新资讯</h2>
                      
                      {/* Articles container - 增加上下内边距 */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 py-6">
                        {isLoading ? (
                          // 显示骨架屏
                          Array(3).fill(0).map((_, index) => (
                            <div key={`skeleton-${index}`} className="relative">
                              <PostItemSSkeleton />
                              
                              {/* 垂直分隔线 */}
                              {index < 2 && (
                                <div className="hidden sm:block absolute right-[-16px] top-0 h-full w-[1px] bg-gray-300"></div>
                              )}
                            </div>
                          ))
                        ) : (
                          // 显示实际内容
                          eventSelected.slice(0, 3).map((event, index) => (
                            <div key={event.id} className="relative">
                              <PostItemS event={event} />
                              
                              {/* 垂直分隔线 */}
                              {index < Math.min(eventSelected.length, 3) - 1 && (
                                <div className="hidden sm:block absolute right-[-16px] top-0 h-full w-[1px] bg-gray-300"></div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      
                      {/* 下方分隔线 - 增加下边距 */}
                      <div className="border-b-2 border-rblue-900 mt-10 mb-4"></div>

                    </div>
                  </div>
                </div>
              </div>
              
              {/* 添加上方分隔线 */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                
                {/* 添加明曦观点标题 */}
                <h2 className="text-2xl font-bold mb-8 pl-8">明曦观点</h2>
              </div>
              
              <div className="grid gap-12 sm:grid-cols-2 sm:gap-x-6 md:gap-y-2 items-start">
                {isLoading ? (
                  // 显示骨架屏
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <div key={`skeleton-${index}`} className="h-[200px]">
                      <PostItemSkeleton />
                    </div>
                  ))
                ) : (
                  // 显示实际内容
                  eventNonSelected.map((event, index) => (
                    <div key={index} className="h-[200px]">
                      <PostItemN key={event.id} event={event} />
                    </div>
                  ))
                )}
              </div>
              
              {/* 分页组件 */}
              <div className="mt-8" id="pagination-section">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#pagination-section"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {generatePagination().map((page, i) => (
                      <PaginationItem key={i}>
                        {page === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink 
                            href="#pagination-section"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              if (typeof page === 'number') {  // 添加类型检查
                                handlePageChange(page);
                              }
                            }}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#pagination-section"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              {/* 添加下方分隔线 */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="border-b-2 border-rblue-900 mt-10 mb-8"></div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}