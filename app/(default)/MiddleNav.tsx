'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function MiddleNav() {
  // 获取当前路径
  const pathname = usePathname();

  // 定义导航项
  const navItems = [
    { href: '/vision', label: '明曦起源' },
    { href: '/services', label: '主营服务' },
    { href: '/vision/partners', label: '合作伙伴' },
  ];


  return (
    <section>
      <nav className="bg-white w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex justify-center h-16 md:h-20">
              <ul className="flex items-center">
              {navItems.map((item, index) => (
                  <li key={item.href} className={index !== 0 ? "ml-6 sm:ml-8 md:ml-12" : ""}>
                  <Link
                      href={item.href}
                      className="text-rblue-900 hover:text-hightlight py-2 text-base sm:text-lg lg:text-xl flex items-center transition duration-150 ease-in-out whitespace-nowrap"
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
