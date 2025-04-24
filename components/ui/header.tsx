'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import Logo from './logo'
import MobileMenu from './mobile-menu'
import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {

  const [ top, setTop ] = useState<boolean>(true)
  const { data: session, status } = useSession()
  const [ menuOpen, setMenuOpen ] = useState(false);
  
  // 添加一个 useEffect 来处理滚动条
  useEffect(() => {
    // 确保页面始终有滚动条，防止布局抖动
    const originalOverflow = document.body.style.overflowY;
    document.body.style.overflowY = 'scroll';
    
    // 正确打印 session 和 status
    // console.log('Session:', session);
    // console.log('Status:', status);
    return () => {
      document.body.style.overflowY = originalOverflow;
    };
  }, []);

  const userRole = session?.user?.role || null;
  const isAdmin = userRole === "ADMIN";
  // 添加加载状态检查
  if (status === 'loading') {
    return (
      <header className={`fixed bg-white text-md shadow-md w-full z-30 md:bg-opacity-96 transition duration-300 ease-in-out ${!top ? 'bg-white backdrop-blur-sm shadow-lg' : ''}`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-36">
            {/* Site branding */}
            <div className="shrink-0 mr-4">
              <Logo />
            </div>

            {/* Desktop navigation skeleton */}
            <nav className="hidden md:flex md:grow">
              {/* Menu links skeleton */}
              <ul className="flex grow justify-end flex-wrap items-center">
                <div className="animate-pulse flex items-center space-x-8">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-px bg-gray-200"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-px bg-gray-200"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-px bg-gray-200"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-px bg-gray-200"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              </ul>

              {/* Sign in button skeleton */}
              <ul className="flex grow justify-end flex-wrap items-center">
                <div className="animate-pulse">
                  <div className="h-8 w-20 bg-gray-200 rounded ml-3"></div>
                </div>
              </ul>
            </nav>

            <MobileMenu />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={`hide-cursor fixed bg-white text-md shadow-md w-full z-30 md:bg-opacity-96 transition duration-300 ease-in-out ${!top ? 'bg-white backdrop-blur-sm shadow-lg' : ''}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-32">

          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">

            {/* Desktop menu links */}
            <ul className="pl-10 flex grow justify-end flex-wrap items-center space-x-8">

              <li>
                <Link href="/about" className="text-gray-600 hover:text-rblue-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">关于我们 </Link>
              </li>

              <span className="hidden md:block border-l-2 border-rblue-900 h-full"></span>
              <li>

                <Link href="/vision" className="text-gray-600 hover:text-rblue-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">
                  愿景
                </Link>
              </li>

              <span className="hidden md:block border-l-2 border-rblue-900 h-full"></span>

              <li>
                <Link href="/services" className="text-gray-600 hover:text-rblue-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">服务业务</Link>
              </li>
              <span className="hidden md:block border-l-2 border-rblue-900 h-full"></span>

              <li>
                <Link 
                  href={status === 'authenticated' ? "/resources" : "/trial"} 
                  className="text-gray-600 hover:text-rblue-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                >
                  资源
                </Link>
              </li>
              <span className="hidden md:block border-l-2 border-rblue-900 h-full"></span>

              <li>
                <Link href="/contact" className="text-gray-600 hover:text-rblue-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">联系我们</Link>
              </li>
              
            </ul>
        
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              { 
                status === 'unauthenticated' && (
                  <li>
                    <Link href="/trial" className=" text-black-900 pr-1 hover:text-rblue-400 ml-3">
                      试用
                    </Link>
                  </li>
                )
              }
                {status === 'unauthenticated' && (
                  <Link href="/signin" className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3">
                    <span>登录</span>
                    <svg className="w-3 h-3 fill-current text-gray-400 shrink-0 ml-2 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                    </svg>
                  </Link>
                )}
                {status === 'authenticated' && (
                        <div>
                          <DropdownMenu 
                            open={menuOpen} 
                            onOpenChange={(open) => {
                              setMenuOpen(open);
                              document.body.style.overflowY = 'scroll';
                            }}
                          >
                            <DropdownMenuTrigger 
                              className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3">
                              {session?.user?.name}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                  sideOffset={5} 
                                  align="center"
                                  alignOffset={0}>
                              {/* 仅对管理员显示仪表盘入口 */}
                              {isAdmin && (
                                <DropdownMenuItem asChild>
                                  <Link href="/dashboard" className="w-full text-center justify-center hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-300">
                                    管理仪表盘
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              
                              {/* 分隔线 - 仅在有管理员菜单时显示 */}
                              {isAdmin && (
                                <div className="h-px bg-gray-200 my-1 mx-2"></div>
                              )}
                              
                              {/* 注销按钮 */}
                              <DropdownMenuItem 
                                onClick={() => {
                                  signOut({ callbackUrl: '/' });
                                }}
                                className="text-center justify-center hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-300"
                              >
                                注销
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
            </ul>

          </nav>

          <MobileMenu />

        </div>
      </div>
    </header>
  )
}
