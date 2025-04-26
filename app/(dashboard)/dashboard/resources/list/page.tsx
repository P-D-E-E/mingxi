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

// 分页结果类型定义
interface PaginationResult {
  data: Resource[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
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
      // 修改API调用，添加分页参数
      const response = await fetch(`/api/resource/retrieve?page=${currentPage}&pageSize=${itemsPerPage}`);
      if (!response.ok) {
        throw new Error('获取资源失败');
      }
      
      const data = await response.json();
      
      // 处理API返回的数据
      if (data.data && Array.isArray(data.data)) {
        // API返回了分页数据结构
        setResources(data.data);
        setTotalItems(data.total);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        // API返回了数组（未分页的数据）
        // 我们需要手动进行客户端分页
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedResources = data.slice(startIndex, endIndex);
        
        setResources(paginatedResources);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else {
        console.error('API返回了未知格式的数据:', data);
        setResources([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('获取资源数据失败:', error);
      setResources([]);
      setTotalItems(0);
      setTotalPages(1);
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

  // 删除单个资源
  const deleteResourceById = async (id: string) => {
    setIsLoading(true);
    try {
      // 发送删除请求到API
      const response = await fetch('/api/resource/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [id] }),
      });

      if (!response.ok) {
        throw new Error('删除资源失败');
      }

      // 删除成功后重新获取资源列表
      fetchResources();
      alert('资源删除成功');
    } catch (error) {
      console.error('删除资源出错:', error);
      alert('删除资源失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  // 处理删除资源
  const handleDeleteResource = async (skipConfirm = false) => {
    if (selectedItems.length === 0) {
      alert('请至少选择一个资源进行删除');
      return;
    }

    // 如果不跳过确认，则显示确认对话框
    if (!skipConfirm) {
      const confirmDelete = window.confirm(`确定要删除选中的 ${selectedItems.length} 个资源吗？此操作不可撤销。`);
      if (!confirmDelete) return;
    }

    setIsLoading(true);
    try {
      // 发送删除请求到API
      const response = await fetch('/api/resource/delete', {
        method: 'POST',  // 使用POST方法
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      });

      if (!response.ok) {
        throw new Error('删除资源失败');
      }

      // 删除成功后重新获取资源列表
      fetchResources();
      // 清空已选项
      setSelectedItems([]);
      alert('资源删除成功');
    } catch (error) {
      console.error('删除资源出错:', error);
      alert('删除资源失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">资源管理 ✨</h1>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        <DeleteButton onDelete={() => handleDeleteResource(false)} />
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
                                  setSelectedItems(resources.map(resource => resource.id));
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
                            {resource.description && resource.description.length > 30 
                              ? `${resource.description.substring(0, 30)}...` 
                              : resource.description || '无描述'}
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
                        {/* 操作列 */}
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
                            
                            {/* 删除按钮 */}
                            <button
                              className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 rounded-full"
                              onClick={() => {
                                const confirmDelete = window.confirm(`确定要删除资源 "${resource.name}" 吗？此操作不可撤销。`);
                                if (confirmDelete) {
                                  // 直接在这里执行删除操作，不依赖于selectedItems状态
                                  deleteResourceById(resource.id);
                                }
                              }}
                            >
                              <span className="sr-only">删除</span>
                              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
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