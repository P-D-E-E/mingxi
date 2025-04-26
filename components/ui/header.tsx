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
  const [viewportWidth, setViewportWidth] = useState(0);
  
  // 添加一个 useEffect 来处理滚动条
  useEffect(() => {
    // 确保页面始终有滚动条，防止布局抖动
    const originalOverflow = document.body.style.overflowY;
    document.body.style.overflowY = 'scroll';
    
    return () => {
      document.body.style.overflowY = originalOverflow;
    };
  }, []);

  // 检测视口宽度
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    // 初始化检查
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth);
    }
    
    // 添加事件监听器
    window.addEventListener('resize', handleResize);
    
    // 清理
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userRole = session?.user?.role || null;
  const isAdmin = userRole === "ADMIN";
  
  // 根据视口宽度确定导航类型
  const showDesktopNav = viewportWidth > 1024; // 大屏幕显示桌面导航
  const showMobileNav = viewportWidth <= 1024;   // 小屏幕和中等屏幕显示移动导航
  
  // 添加加载状态检查
  if (status === 'loading') {
    return (
      <header className={`fixed bg-white text-md shadow-md w-full z-30 transition duration-300 ease-in-out ${!top ? 'bg-white backdrop-blur-sm shadow-lg' : ''}`}>
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-24">
            {/* Site branding */}
            <div className="shrink-0 mr-4">
              <Logo />
            </div>

            {/* 空占位 */}
            <div className="h-8 w-8"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
      <header className={`hide-cursor fixed bg-white text-md shadow-md w-full z-30 transition duration-300 ease-in-out ${!top ? 'bg-white backdrop-blur-sm shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-20 md:h-28">

            {/* 增加右边距，使logo右移 */}
            <div className="shrink-0 mr-4 pl-2 md:pl-12">
              <Logo />
            </div>

            {/* Desktop navigation - 调整左边距保持居中 */}
            {showDesktopNav && (
              <nav className="flex grow mr-8 md:mr-12">
              {/* Desktop menu links */}
              <ul className="pl-0 lg:pl-6 flex grow justify-end flex-wrap items-center space-x-1 lg:space-x-12">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-rblue-900 px-1 lg:px-2 py-2 flex items-center transition duration-150 ease-in-out text-sm lg:text-base">关于我们</Link>
              </li>

              <span className="hidden lg:block border-l-2 border-rblue-900 h-full"></span>
              <li>
                <Link href="/vision" className="text-gray-600 hover:text-rblue-900 px-1 lg:px-2 py-2 flex items-center transition duration-150 ease-in-out text-sm lg:text-base">愿景</Link>
              </li>

              <span className="hidden lg:block border-l-2 border-rblue-900 h-full"></span>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-rblue-900 px-1 lg:px-2 py-2 flex items-center transition duration-150 ease-in-out text-sm lg:text-base">服务业务</Link>
              </li>
              
              <span className="hidden lg:block border-l-2 border-rblue-900 h-full"></span>
              <li>
                <Link 
                  href={status === 'authenticated' ? "/resources" : "/trial"} 
                  className="text-gray-600 hover:text-rblue-900 px-1 lg:px-2 py-2 flex items-center transition duration-150 ease-in-out text-sm lg:text-base"
                >资源</Link>
              </li>
              
              <span className="hidden lg:block border-l-2 border-rblue-900 h-full"></span>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-rblue-900 px-1 lg:px-2 py-2 flex items-center transition duration-150 ease-in-out text-sm lg:text-base">联系我们</Link>
              </li>
            </ul>
          
              {/* Desktop sign in links */}
              <ul className="flex grow justify-end flex-wrap items-center">
                { 
                  status === 'unauthenticated' && (
                    <li>
                      <Link href="/trial" className="text-black-900 pr-1 hover:text-rblue-400 ml-3 text-sm lg:text-base">
                        试用
                      </Link>
                    </li>
                  )
                }
                
                {status === 'unauthenticated' && (
                  <Link href="/signin" className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3 text-xs lg:text-sm">
                    <span>登录</span>
                    <svg className="w-2 h-2 lg:w-3 lg:h-3 fill-current text-gray-400 shrink-0 ml-1 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
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
                        className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3 text-xs lg:text-sm">
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
          )}

          {/* 移动菜单按钮 - 在所有非大屏幕设备上显示 */}
          {showMobileNav && (
            <MobileMenu />
          )}

        </div>
      </div>
    </header>
  )
}