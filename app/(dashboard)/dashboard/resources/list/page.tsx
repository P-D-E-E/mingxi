"use client"
import { useEffect, useState, useCallback } from 'react';
import { SelectedItemsProvider, useSelectedItems } from '@/app/(dashboard)/selected-items-context';
import { FlyoutProvider } from '@/app/(dashboard)/flyout-context';
import DeleteButton from '@/components/delete-button';
import SearchForm from '@/components/search-form';
import PaginationNumeric from '@/components/pagination-numeric';
import Link from 'next/link';
import PostDate from '@/components/post-date';

// Resource类型定义
interface Resource {
  id: string;
  name: string;
  description: string;
  path: string;
  uniquefilename: string;
  createdAt: string;
  updatedAt?: string;
  lastModifier?: string;
}

function ResourcesList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 获取资源列表
  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/resource/retrieve');
      if (!response.ok) {
        throw new Error('获取资源失败');
      }
      
      const data = await response.json();
      
      // 计算分页
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedResources = data.slice(startIndex, endIndex);
      
      setResources(paginatedResources);
      setTotalItems(data.length);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error('获取资源数据失败:', error);
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    // 如果需要搜索功能，可以在这里实现客户端搜索
    // 或者修改fetchResources函数，添加搜索参数
  }, []);

  // 处理选择资源
  const handleSelectResource = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
    return true;
  };
  // 处理编辑资源
  const handleEditResource = (resource: Resource) => {
    try {
      // 将整个资源对象序列化
      const resourceData = encodeURIComponent(JSON.stringify(resource));
      // 使用路由导航到编辑页面
      window.location.href = `/dashboard/resources/create?resourceData=${resourceData}`;
      console.log("已传递资源数据:", resource);
    } catch (error) {
      console.error("传递资源数据失败:", error);
      alert("无法编辑资源，请稍后再试");
    }
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">资源管理 ✨</h1>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <DeleteButton />
          <div className="hidden sm:block">
            <SearchForm onSearch={handleSearch} />
          </div>
          <Link href="/dashboard/resources/create" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
            上传新资源
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
        <div className="flex flex-col">
          {/* 加载状态 */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="table-auto w-full divide-y divide-slate-200 dark:divide-slate-700">
                  {/* Table header */}
                  <thead className="text-xs uppercase text-slate-500 bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                        <div className="flex items-center">
                          <label className="inline-flex">
                            <span className="sr-only">全选</span>
                            <input 
                              className="form-checkbox" 
                              type="checkbox" 
                              onChange={(e) => {
                                const allSelected = e.target.checked && resources.length > 0;
                                if (allSelected) {
                                  resources.forEach(resource => handleSelectResource(resource.id, true));
                                } else {
                                  setSelectedItems([]);
                                }
                              }} 
                              checked={selectedItems.length === resources.length && resources.length > 0} 
                            />
                          </label>
                        </div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">资源名称</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">描述</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">创建时间</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">更新时间</div>
                      </th>

                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-right">操作</div>
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                    {resources.map(resource => (
                      <tr key={resource.id}>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                          <div className="flex items-center">
                            <label className="inline-flex">
                              <span className="sr-only">选择</span>
                              <input 
                                className="form-checkbox" 
                                type="checkbox" 
                                onChange={(e) => {
                                  handleSelectResource(resource.id, e.target.checked);
                                }} 
                                checked={selectedItems.includes(resource.id)} 
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="font-medium text-slate-800 dark:text-slate-100">
                            {resource.name}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-slate-800 dark:text-slate-100">
                            {resource.description.length > 30 
                              ? `${resource.description.substring(0, 30)}...` 
                              : resource.description}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <PostDate dateString={resource.createdAt} />
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          {resource.updatedAt ? (
                            <PostDate dateString={resource.updatedAt} />
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">-</span>
                          )}
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                          <div className="space-x-1 flex items-center justify-end">

                            
                            {/* 编辑按钮 */}
                            <button
                              className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
                              onClick={() => handleEditResource(resource)}
                            >
                              <span className="sr-only">编辑</span>
                              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <PaginationNumeric 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
}

export default function ResourcesListPage() {
  return (
    <SelectedItemsProvider>
      <FlyoutProvider>
        <ResourcesList />
      </FlyoutProvider>
    </SelectedItemsProvider>
  );
}