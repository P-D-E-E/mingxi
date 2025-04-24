'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function MiddleNav() {
  // 获取当前路径
  const pathname = usePathname();
  const lastSegment = pathname.split('/')[2];

  // 定义导航项
  const navItems = [
    { href: '/vision/team', label: '团队' },
    { href: '/vision/partners', label: '合作伙伴' },
    { href: '/vision/events', label: 'EVENTS' },
  ];
  
  return (
    <section>
      <nav className="bg-white w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex justify-center h-16 md:h-20">
            <ul className="flex space-x-60 text-center">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    scroll={false} // 添加 scroll={false} 来防止滚动到顶部
                    className={`text-gray-600 hover:text-gray-900 px-4 lg:px-6 py-2 flex items-center transition duration-150 ease-in-out
                      ${lastSegment === item.href.split('/')[2] ? 'text-rblue-400 font-bold text-xl' : 'text-xl'}`}
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
