"use client"
import { useEffect, useState, useCallback } from 'react';
import { SelectedItemsProvider, useSelectedItems } from '@/app/(dashboard)/selected-items-context';
import { FlyoutProvider } from '@/app/(dashboard)/flyout-context';
import DeleteButton from '@/components/delete-button';
import SearchForm from '@/components/search-form';
import PaginationNumeric from '@/components/pagination-numeric';
import Link from 'next/link';
import PostDate from '@/components/post-date';
import { useRouter } from 'next/navigation';

// Event类型定义
interface Event {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  description?: string;
  article?: string;
  image?: string | null;
  authorId?: string;
}

function EventsList() {
  const [ events, setEvents] = useState<Event[]>([]);
  const [ currentPage, setCurrentPage] = useState(1);
  const [ itemsPerPage] = useState(10);
  const [ totalItems, setTotalItems] = useState(0);
  const [ totalPages, setTotalPages] = useState(1);
  const [ searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [ isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchEvents = useCallback(async (page = currentPage) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/event/dashboard?page=${page}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      const data = await response.json();
      
      // 直接使用后端排序好的数据
      setEvents(data.events || []);
      setTotalItems(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('获取事件数据失败:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage, currentPage, searchTerm]);

  useEffect(() => {
    fetchEvents(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    fetchEvents(page);
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // 处理选择事件
  const handleSelectEvent = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
    return true;
  };

  // 处理编辑事件
  // app/(dashboard)/dashboard/events/list/page.tsx 中的 handleEditEvent 函数
  const handleEditEvent = (event: Event) => {
    router.push(`/dashboard/events/create?id=${event.id}`);
  };

    // 切换事件状态
    const toggleEventStatus = async (event: Event) => {
        const newStatus = event.status === 'SELECTED' ? 'NONSELECTED' : 'SELECTED';
        
        try {
        const response = await fetch(`/api/event/${event.id}/status`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });
        
        if (response.ok) {
            // 更新本地状态
            setEvents(events.map(e => 
            e.id === event.id ? { ...e, status: newStatus } : e
            ));
        } else {
            const errorData = await response.json();
            alert(`更新状态失败: ${errorData.error || '未知错误'}`);
        }
        } catch (error) {
        console.error('更新事件状态失败:', error);
        alert('更新状态失败');
        }
    };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">事件管理 ✨</h1>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <DeleteButton />
          <div className="hidden sm:block">
            <SearchForm onSearch={handleSearch} />
          </div>
          <Link href="/dashboard/events/create" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
            创建新事件
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
                                const newSelectedItems = e.target.checked 
                                  ? events.map(event => event.id)
                                  : [];
                                setSelectedItems(newSelectedItems);
                              }} 
                              checked={selectedItems.length > 0 && selectedItems.length === events.length}
                            />
                          </label>
                        </div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">事件名称</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">创建时间</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">更新时间</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">状态</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-right">操作</div>
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                    {events.map(event => (
                      <tr key={event.id} className={event.status === 'SELECTED' ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''}>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                          <div className="flex items-center">
                            <label className="inline-flex">
                              <span className="sr-only">选择</span>
                              <input 
                                className="form-checkbox" 
                                type="checkbox" 
                                onChange={(e) => {
                                  handleSelectEvent(event.id, e.target.checked);
                                }} 
                                checked={selectedItems.includes(event.id)} 
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-medium text-slate-800 dark:text-slate-100">
                                {event.name}
                            </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <PostDate dateString={event.createdAt} />
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <PostDate dateString={event.updatedAt} />
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <button
                            onClick={() => toggleEventStatus(event)}
                            className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 cursor-pointer ${
                              event.status === 'SELECTED' 
                              ? 'bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {event.status}
                          </button>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                          <div className="space-x-1 flex items-center justify-end">
                            <button
                              className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
                              onClick={() => handleEditEvent(event)}
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

export default function EventsPage() {
  return (
    <SelectedItemsProvider>
      <FlyoutProvider>
        <EventsList />
      </FlyoutProvider>
    </SelectedItemsProvider>
  );
}