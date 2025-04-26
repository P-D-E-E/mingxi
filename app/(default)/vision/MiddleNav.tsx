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
            {/* 移动端导航 */}
            <div className="flex md:hidden justify-center w-full">
              <ul className="flex justify-between items-center w-full max-w-md">
                {navItems.map((item) => (
                  <li key={item.href} className="px-1 text-center whitespace-nowrap">
                    <Link
                      href={item.href}
                      scroll={false}
                      className={`text-gray-600 hover:text-gray-900 py-2 block text-sm transition duration-150 ease-in-out
                        ${lastSegment === item.href.split('/')[2] ? 'text-rblue-400 font-bold' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 中等屏幕和桌面端导航 */}
            <ul className="hidden md:flex md:space-x-10 lg:space-x-60 text-center">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    scroll={false}
                    className={`text-gray-600 hover:text-gray-900 px-2 md:px-3 lg:px-6 py-2 flex items-center transition duration-150 ease-in-out whitespace-nowrap
                      ${lastSegment === item.href.split('/')[2] ? 'text-rblue-400 font-bold md:text-lg lg:text-xl' : 'md:text-lg lg:text-xl'}`}
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