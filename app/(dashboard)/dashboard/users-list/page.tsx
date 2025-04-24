"use client"
import { useEffect, useState, useCallback, FormEvent } from 'react';
import { SelectedItemsProvider, useSelectedItems } from '@/app/(dashboard)/selected-items-context';
import { FlyoutProvider } from '@/app/(dashboard)/flyout-context';
import { UserProvider } from './transaction-context';
import DeleteButton from '@/components/delete-button';
import SearchForm from '@/components/search-form';
import OrdersTable from './transactions-table';
import PaginationNumeric from '@/components/pagination-numeric';


function Transactions() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'TRIAL' });
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async (page = currentPage) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/users?role=${selectedRole}&search=${searchTerm}&page=${page}&pageSize=${itemsPerPage}`
      );
      const data = await response.json();
      setUsers(data.users);
      setTotalItems(data.totalCount);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch (error) {
      console.error('获取用户数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRole, searchTerm, itemsPerPage, currentPage]);

  useEffect(() => {
    fetchUsers(1); // 当筛选条件改变时，重置到第一页
  }, [selectedRole, searchTerm]);

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { ...newUser } }),
    });

    if (response.ok) {
      const createdUser = await response.json();
      fetchUsers(); // 重新获取用户列表
      setShowCreateUserForm(false);
      setNewUser({ name: '', email: '', password: '', role: 'TRIAL' });
      setErrorMessage('');
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message);
    }
  };

  // 定义角色及其对应的中文名称
  const roles = [
    { value: '', label: '全部用户' },
    { value: 'ADMIN', label: '管理员' },
    { value: 'PREMIUM', label: '正式用户' },
    { value: 'TRIAL', label: '试用用户' },
  ];

  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8 md:mb-8">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">用户管理</h1>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <DeleteButton />
            <div className="hidden sm:block">
              <SearchForm onSearch={handleSearch} />
            </div>
            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" onClick={() => setShowCreateUserForm(true)}>创建新用户</button>
          </div>
        </div>

        {/* 角色选择按钮 */}
        <div className="mb-4">
          {roles.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedRole(value)}
              className={`mr-2 px-4 py-2 rounded ${selectedRole === value ? 'bg-indigo-500 text-white' : 'bg-white text-black border border-gray-300 hover:bg-indigo-500 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 创建用户表单 */}
        {showCreateUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full transform transition-all">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">创建新用户</h3>
                <button 
                  onClick={() => setShowCreateUserForm(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateUser} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
                      用户名
                    </label>
                    <input
                      id="name"
                      className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      type="text"
                      placeholder="请输入用户名"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                      邮箱
                    </label>
                    <input
                      id="email"
                      className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      type="email"
                      placeholder="user@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                      密码
                    </label>
                    <input
                      id="password"
                      className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      type="password"
                      placeholder="请输入密码"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="role">
                      用户类型
                    </label>
                    <select
                      id="role"
                      className="form-select w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="TRIAL">试用用户</option>
                      <option value="PREMIUM">正式用户</option>
                    </select>
                  </div>
                </div>
                
                {errorMessage && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm">
                    <div className="flex">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
                    onClick={() => setShowCreateUserForm(false)}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    创建
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Table */}
            <OrdersTable Users={users} />

            {/* Pagination */}
            <div className="mt-8">
              <PaginationNumeric 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Orders() {
  return (
    <SelectedItemsProvider>
      <FlyoutProvider>
        <UserProvider>
          <Transactions />
        </UserProvider>
      </FlyoutProvider>
    </SelectedItemsProvider>
  );
}