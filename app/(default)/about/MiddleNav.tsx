'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function MiddleNav() {
  // 获取当前路径
  const pathname = usePathname();

  // 定义导航项
  const navItems = [
    { href: '/about/parteners', label: '合作伙伴' },
    { href: '/about/team', label: '团队' },
    { href: '/about/events', label: '客户' },
  ];


  return (
            <section>
                <nav className="bg-white w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out">
                    <div className="max-w-6xl mx-auto px-5 sm:px-6">
                    <div className="flex justify-center h-16 md:h-20">
                        <ul className="flex space-x-72 text-center"> {/* 调整 space-x 值以控制空格宽度 */}
                        {navItems.map((item) => (
                            <li key={item.href}>
                            <Link
                                href={item.href}
                                className="text-gray-600 hover:text-gray-900 px-4 lg:px-6 py-2 text-xl flex items-center transition duration-150 ease-in-out"
                            >
                                {item.label}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                </nav>
            </section>

  );
}

export default MiddleNav;

