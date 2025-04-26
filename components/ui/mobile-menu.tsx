'use client'

import { useState, useRef, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function MobileMenu() {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false)
  const { data: session, status } = useSession()
  
  const trigger = useRef<HTMLButtonElement>(null)
  const mobileNav = useRef<HTMLDivElement>(null)
  
  const userRole = session?.user?.role || null;
  const isAdmin = userRole === "ADMIN";

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!mobileNav.current || !trigger.current) return;
      if (!mobileNavOpen || mobileNav.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setMobileNavOpen(false)
    };
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false)
    };
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  return (
    <div className="flex mr-4">
      {/* 汉堡按钮 */}
      <button
        ref={trigger}
        className={`hamburger ${mobileNavOpen && 'active'}`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">菜单</span>
        <svg className="w-6 h-6 fill-current text-gray-900" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect y="4" width="24" height="2" />
          <rect y="11" width="24" height="2" />
          <rect y="18" width="24" height="2" />
        </svg>
      </button>

      {/* 移动端导航 */}
      <div ref={mobileNav}>
        <Transition
          show={mobileNavOpen}
          as="nav"
          id="mobile-nav"
          className="absolute top-full h-screen pb-16 z-20 left-0 w-full overflow-scroll bg-white"
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ul className="px-5 py-2">
            <li>
              <Link href="/about" className="flex text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileNavOpen(false)}>关于我们</Link>
            </li>
            <li className="border-t border-gray-200 pt-2">
              <Link href="/vision" className="flex text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileNavOpen(false)}>愿景</Link>
            </li>
            <li className="border-t border-gray-200 pt-2">
              <Link href="/services" className="flex text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileNavOpen(false)}>服务业务</Link>
            </li>
            <li className="border-t border-gray-200 pt-2">
              <Link 
                href={status === 'authenticated' ? "/resources" : "/trial"} 
                className="flex text-gray-600 hover:text-gray-900 py-2" 
                onClick={() => setMobileNavOpen(false)}
              >
                资源
              </Link>
            </li>
            <li className="border-t border-gray-200 pt-2">
              <Link href="/contact" className="flex text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileNavOpen(false)}>联系我们</Link>
            </li>
            
            {/* 根据登录状态显示不同选项 */}
            {status === 'unauthenticated' && (
              <>
                <li className="border-t border-gray-200 pt-2 mt-2">
                  <Link href="/trial" className="flex text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileNavOpen(false)}>试用</Link>
                </li>
                <li>
                  <Link href="/signin" className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 w-full my-4 flex items-center justify-center" onClick={() => setMobileNavOpen(false)}>
                    <span>登录</span>
                    <svg className="w-3 h-3 fill-current text-gray-400 shrink-0 ml-2 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                    </svg>
                  </Link>
                </li>
              </>
            )}
            
            {status === 'authenticated' && (
              <>
                <li className="border-t border-b border-gray-200 py-2 my-2">
                  <span className="flex font-medium text-gray-900 py-2">
                    {session?.user?.name}
                  </span>
                  <ul className="pl-4">
                    {isAdmin && (
                      <li>
                        <Link href="/dashboard" className="text-sm flex font-medium text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileNavOpen(false)}>管理仪表盘</Link>
                      </li>
                    )}
                    <li>
                      <button 
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setMobileNavOpen(false);
                        }}
                        className="text-sm flex font-medium text-gray-600 hover:text-gray-900 py-2 w-full text-left"
                      >
                        注销
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>          
        </Transition>
      </div>
    </div>
  )
}