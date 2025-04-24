import Image from 'next/image';
import { User } from '@prisma/client';
import { TransactionsProperties } from './transactions-properties';
import { useFlyoutContext } from '@/app/(dashboard)/flyout-context';
import { useUser } from './transaction-context';
import PostDate from '@/components/post-date';
import { useSelectedItems } from '@/app/(dashboard)/selected-items-context';
import { useState } from 'react';

interface UserTableItemProps {
  user: User;
  onCheckboxChange: (nid: number, checked: boolean) => void;
  isSelected: boolean;
}

export default function UserTableItem({ user, onCheckboxChange, isSelected }: UserTableItemProps) {
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const { setFlyoutOpen } = useFlyoutContext();
  const { setUser } = useUser();
  const { statusColor, amountColor } = TransactionsProperties();
  
  const [role, setRole] = useState(user.role); // 新增状态管理用户角色
  const [isEditing, setIsEditing] = useState(false); // 控制下拉菜单的显示

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(user.nid, e.target.checked);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = user.nid;
    if (e.target.checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "ADMIN" | "PREMIUM" | "TRIAL";
    setRole(newRole); // 更新本地状态以立即反映更改

    // 更新数据库中的用户角色
    const response = await fetch(`/api/users/${user.email}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole, email: user.email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData.message);
    }
  };

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex items-center">
          <label className="inline-flex">
            <span className="sr-only">选择</span>
            <input className="form-checkbox" type="checkbox" onChange={handleSelect} checked={selectedItems.includes(user.nid)} />
          </label>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-semibold text-left">{user.name}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-semibold text-left">{user.email}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <PostDate dateString={user.createdAt.toString()} />
      </td>
      
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left relative min-w-[100px] h-6">
          {role === 'ADMIN' ? (
            <span className="font-semibold text-left">管理员</span>
          ) : isEditing ? (
            <select
              value={role}
              onChange={handleRoleChange}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="absolute inset-0 form-select w-16 text-sm border rounded bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-6 py-0 px-2"
              style={{ minWidth: '100px', maxWidth: '100%' }}
            >
              <option value="TRIAL">试用用户</option>
              <option value="PREMIUM">正式用户</option>
            </select>
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="cursor-pointer font-semibold text-left inline-block"
            >
              {role === 'TRIAL' ? '试用用户' : role === 'PREMIUM' ? '正式用户' : role}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}