"use client"

import PostItem from '@/components/post-item'
import { useEffect, useState } from 'react'
import PostItemSKeleton from '@/components/post-item-skeleton'

interface Resource {
  id: string;
  title: string;
  description?: string;
  // 根据 PostItem 组件需要的属性添加其他字段
  [key: string]: any; // 如果有其他未知属性，可以添加这一行
}

export default function Blog() {
  const [resources, setResources] = useState<Resource[]>([]);  // 添加类型注解
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/resource/retrieve');
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
        const data = await response.json();
        setResources(data);
        setError(null);
      } catch (error) {
        console.error('获取资源失败:', error);
        setError('获取资源失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);
  
  return (
    <section>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <div className="pt-32 pb-4 md:pt-40 md:pb-20">
          {/* Page header */}
          <div className="max-w-3xl pb-12 md:pb-20 text-center md:text-left">
            <h1 className="h1 mb-4">明曦智库资源</h1>
            <p className="text-xl text-gray-600">这里汇集了明曦中美研究中心最新的研究进展。</p>
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
                Array(5).fill(0).map((_, index) => (
                  <PostItemSKeleton key={`skeleton-${index}`} />
                ))
              ) : resources.length > 0 ? (
                // 显示实际内容
                resources.map((item) => (
                  <PostItem key={item.id} {...item} />
                ))
              ) : (
                // 没有数据时显示
                <div className="text-center py-12">
                  <p className="text-gray-500">暂无资源</p>
                </div>
              )}
            </div>
            {/* Sidebar */}
            <aside className="relative mt-12 md:mt-0 md:w-64 md:ml-12 lg:ml-20 md:shrink-0">
              {/* 可以根据需要添加侧边栏内容 */}
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}