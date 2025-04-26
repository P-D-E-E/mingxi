"use client"

import PostItem from '@/components/post-item'
import { useEffect, useState } from 'react'
import PostItemSKeleton from '@/components/post-item-skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Resource {
  id: string;
  title: string;
  description?: string;
  // 其他字段
  [key: string]: any;
}

interface PaginationResult {
  data: Resource[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function Blog() {
  // 初始化为空数组而不是 undefined
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/resource/retrieve?page=${currentPage}&pageSize=${pageSize}`);
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
        const data: PaginationResult = await response.json();
        setResources(data.data);
        setTotalItems(data.total);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (error) {
        console.error('获取资源失败:', error);
        setError('获取资源失败，请稍后再试');
        // 确保在发生错误时资源为空数组而不是 undefined
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
  
  return (
    <section>
      <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 sm:px-6">
        <div className="pt-24 md:pt-32 pb-4 md:pt-40 md:pb-20">
          {/* Page header */}
          <div className="max-w-3xl pb-8 md:pb-12 lg:pb-20 text-center md:text-left">
            <h1 className="h1 mb-4">明曦智库资源</h1>
            <p className="text-xl text-gray-600">这里汇集了明曦中美研究中心最新的研究进展</p>
          </div>
          {/* Main content */}
          <div className="md:flex md:justify-between">
            <div className="md:grow">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}
              {isLoading ? (
                // 显示骨架屏
                Array(pageSize).fill(0).map((_, index) => (
                  <PostItemSKeleton key={`skeleton-${index}`} />
                ))
              ) : resources && resources.length > 0 ? (
                // 显示实际内容
                <>
                  {resources.map((item) => (
                    <PostItem key={item.id} {...item} />
                  ))}
                  
                  {/* 分页控制器 */}
                  <div className="mt-6 md:mt-8" id="pagination-section">
                    <Pagination>
                      <PaginationContent className="flex flex-wrap justify-center">
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
                </>
              ) : (
                // 没有数据时显示
                <div className="text-center py-8 md:py-12">
                  <p className="text-gray-500">暂无资源</p>
                </div>
              )}
            </div>
            {/* Sidebar */}
            <aside className="relative mt-8 md:mt-0 md:w-64 md:ml-12 lg:ml-20 md:shrink-0">
              {/* 可以根据需要添加侧边栏内容 */}
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}