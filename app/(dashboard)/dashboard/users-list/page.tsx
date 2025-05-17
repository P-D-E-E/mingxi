"use client"
import { useEffect, useState, useCallback } from 'react';
import { SelectedItemsProvider, useSelectedItems } from '@/app/(dashboard)/selected-items-context';
import { FlyoutProvider } from '@/app/(dashboard)/flyout-context';
import { UserProvider } from './transaction-context';
import DeleteButton from '@/components/delete-button';
import SearchForm from '@/components/search-form';
import PaginationNumeric from '@/components/pagination-numeric';
import PostDate from '@/components/post-date';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


// 用户类型定义
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string; // 新增：到期时间
}

function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'TRIAL',
    expiresAt: '', // 新增
    days: 30 // 新增，默认30天
  });
  const [editExpireUser, setEditExpireUser] = useState<User | null>(null); // 当前要编辑的用户
  const [editExpireDate, setEditExpireDate] = useState<Dayjs | null>(null); // 当前选择的日期
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
    setNewUser((prev) => ({
      ...prev,
      days: prev.role === 'TRIAL' ? 30 : 365
    }));
  }, [newUser.role]);

    // 监听days变化，自动计算expiresAt
    useEffect(() => {
      setNewUser((prev) => ({
        ...prev,
        expiresAt: dayjs().add(prev.days, 'day').endOf('day').toISOString()
      }));
    }, [newUser.days]);

  useEffect(() => {
    fetchUsers(1); // 当筛选条件改变时，重置到第一页
  }, [selectedRole, searchTerm]);

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { ...newUser } }),
    });

    if (response.ok) {
      await fetchUsers(); // 重新获取用户列表
      setShowCreateUserForm(false);
      setNewUser({ name: '', email: '', password: '', role: 'TRIAL', expiresAt: '', days: 30 });
      setErrorMessage('');
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message);
    }
  };

  // 处理选择用户
  const handleSelectUser = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  // 删除单个用户
  const deleteUserById = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${email}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除用户失败');
      }

      await fetchUsers();
      alert('用户删除成功');
    } catch (error) {
      console.error('删除用户出错:', error);
      alert('删除用户失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理批量删除用户
  const handleDeleteUsers = async (skipConfirm = false) => {
    if (selectedItems.length === 0) {
      alert('请至少选择一个用户进行删除');
      return;
    }

    if (!skipConfirm) {
      const confirmDelete = window.confirm(`确定要删除选中的 ${selectedItems.length} 个用户吗？此操作不可撤销。`);
      if (!confirmDelete) return;
    }

    setIsLoading(true);
    try {
      for (const email of selectedItems) {
        await fetch(`/api/users/${email}`, {
          method: 'DELETE',
        });
      }

      await fetchUsers();
      setSelectedItems([]);
      alert('用户删除成功');
    } catch (error) {
      console.error('删除用户出错:', error);
      alert('删除用户失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 定义角色及其对应的中文名称
  const roles = [
    { value: '', label: '全部用户' },
    { value: 'ADMIN', label: '管理员' },
    { value: 'PREMIUM', label: '正式用户' },
    { value: 'TRIAL', label: '试用用户' },
  ];

  // 获取角色中文名称
  const getRoleName = (role: string) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };
  // 添加切换用户角色的函数
  const toggleUserRole = async (email: string, currentRole: string) => {
    // 确定要切换到的新角色
    const newRole = currentRole === 'PREMIUM' ? 'TRIAL' : 'PREMIUM';
    
    try {
      // 在开始请求前就先更新本地UI状态，实现乐观更新
      setUsers(users.map(user => 
        user.email === email ? { ...user, role: newRole } : user
      ));
      
      const response = await fetch(`/api/users/${email}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!response.ok) {
        // 如果请求失败，回滚更改
        setUsers(users.map(user => 
          user.email === email ? { ...user, role: currentRole } : user
        ));
        throw new Error('更新用户角色失败');
      }
      
      // 请求成功，但不需要重新加载整个列表
      // 因为我们已经提前更新了本地状态
      
    } catch (error) {
      console.error('更新用户角色失败:', error);
      alert('更新用户角色失败，请稍后重试');
    }
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">用户管理 ✨</h1>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <DeleteButton onDelete={() => handleDeleteUsers(false)} />
          <div className="hidden sm:block">
            <SearchForm onSearch={handleSearch} />
          </div>
          <button 
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white" 
            onClick={() => setShowCreateUserForm(true)}
          >
            创建新用户
          </button>
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

                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="days">
                  权限天数
                </label>
                <input
                  id="days"
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  type="number"
                  min={1}
                  value={newUser.days}
                  onChange={e => setNewUser({ ...newUser, days: Number(e.target.value) })}
                  required
                />
                <div className="text-xs text-gray-400 mt-1">
                  到期时间：{dayjs().add(newUser.days, 'day').endOf('day').format('YYYY-MM-DD')}
                </div>
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
                                const allSelected = e.target.checked && users.length > 0;
                                if (allSelected) {
                                  setSelectedItems(users.map(user => user.id));
                                } else {
                                  setSelectedItems([]);
                                }
                              }} 
                              checked={selectedItems.length === users.length && users.length > 0} 
                            />
                          </label>
                        </div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">用户名</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">邮箱</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">用户类型</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">创建时间</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">到期时间</div> {/* 新增 */}
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-right">操作</div>
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                    {users.map(user => (
                      <tr key={user.id} className={user.role === 'ADMIN' ? 'bg-amber-50 dark:bg-amber-900/10' : ''}>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                          <div className="flex items-center">
                            <label className="inline-flex">
                              <span className="sr-only">选择</span>
                              <input 
                                className="form-checkbox" 
                                type="checkbox" 
                                onChange={(e) => {
                                  handleSelectUser(user.id, e.target.checked);
                                }} 
                                checked={selectedItems.includes(user.id)} 
                                disabled={user.role === 'ADMIN'} // 禁止选择管理员
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="font-medium text-slate-800 dark:text-slate-100">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-slate-800 dark:text-slate-100">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          {user.role === 'ADMIN' ? (
                            // 管理员角色不可切换
                            <div className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400`}>
                              {getRoleName(user.role)}
                            </div>
                          ) : (
                            // 正式用户和试用用户可以点击切换
                            <button 
                              onClick={() => toggleUserRole(user.email, user.role)}
                              className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 cursor-pointer ${
                                user.role === 'PREMIUM'
                                  ? 'bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {getRoleName(user.role)}
                            </button>
                          )}
                          </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          {dayjs(user.createdAt).format('YYYY-MM-DD')}
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span
                              className="cursor-pointer hover:underline"
                              onClick={user.role != "ADMIN" ? 
                                () => {
                                setEditExpireUser(user);
                                setEditExpireDate(user.expiresAt ? dayjs(user.expiresAt) : dayjs()); 
                              }
                              : () => {}
                            }
                            >
                              {user.expiresAt
                                ? <>{dayjs(user.expiresAt).format('YYYY-MM-DD')}
                                  
                                </>
                                : <span className="text-gray-400">未设置</span>
                              }
                            </span>
                            {
                              user.role != 'ADMIN' ?
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditExpireUser(user);
                                setEditExpireDate(user.expiresAt ? dayjs(user.expiresAt) : dayjs());
                              }}
                              aria-label="编辑到期时间"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            : <></>
                            }
                          </div>
                        </td>


                        
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                          <div className="space-x-1 flex items-center justify-end">

                            
                            {/* 删除按钮 - 仅对非管理员显示 */}
                            {user.role !== 'ADMIN' && (
                              <button
                                className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 rounded-full"
                                onClick={() => {
                                  const confirmDelete = window.confirm(`确定要删除用户 "${user.name}" 吗？此操作不可撤销。`);
                                  if (confirmDelete) {
                                    deleteUserById(user.email);
                                  }
                                }}
                              >
                                <span className="sr-only">删除</span>
                                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                  <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                  <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                </svg>
                              </button>
                            )}
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
      

      <Dialog open={!!editExpireUser} onClose={() => setEditExpireUser(null)}>
        <DialogTitle>修改到期时间</DialogTitle>
        <DialogContent>
          <div className="flex flex-col space-y-6">
          <DatePicker
            label="到期日期"
            value={editExpireDate}
            onChange={(date) => setEditExpireDate(date)}
            format="YYYY-MM-DD"
            slotProps={{ textField: { fullWidth: true } }} // 关键：让输入框全宽
          />
            <div className="flex space-x-2">
              <Button variant="outlined" onClick={() => setEditExpireDate(dayjs())}>今天</Button>
              <Button variant="outlined" onClick={() => setEditExpireDate(dayjs().add(30, 'day'))}>+30天</Button>
              <Button variant="outlined" onClick={() => setEditExpireDate(dayjs().add(90, 'day'))}>+90天</Button>
              <Button variant="outlined" onClick={() => setEditExpireDate(dayjs().add(1, 'year'))}>+1年</Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditExpireUser(null)}>取消</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!editExpireUser || !editExpireDate) return;
              // PATCH 请求更新后端
              const res = await fetch(`/api/users/${editExpireUser.email}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expiresAt: editExpireDate.endOf('day').toISOString() }),
              });
              if (res.ok) {
                // 本地更新
                setUsers(users.map(u =>
                  u.id === editExpireUser.id
                    ? { ...u, expiresAt: editExpireDate.endOf('day').toISOString() }
                    : u
                ));
                setEditExpireUser(null);
              } else {
                alert('更新失败');
              }
            }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

    </div>

    
  );
}


export default function Users() {
  return (
    <SelectedItemsProvider>
      <FlyoutProvider>
        <UserProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <UsersList />
          </LocalizationProvider>
        </UserProvider>
      </FlyoutProvider>
    </SelectedItemsProvider>
  );
}