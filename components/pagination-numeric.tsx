import React from 'react';
import Link from 'next/link';

interface PaginationNumericProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationNumeric({ 
  currentPage, 
  totalPages,
  onPageChange
}: PaginationNumericProps) {
  
  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    
    // 始终显示第一页
    pages.push(1);
    
    // 当前页附近的页码
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // 添加省略号
    if (startPage > 2) {
      pages.push('...');
    }
    
    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // 添加省略号
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // 添加最后一页
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center">
      <nav className="flex" role="navigation" aria-label="Navigation">
        <div className="mr-2">
          <button
            className={`inline-flex items-center justify-center rounded border border-slate-200 px-3 py-1.5 leading-5 text-slate-600 shadow-sm ${
              currentPage === 1
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
            }`}
            disabled={currentPage === 1}
            onClick={() => handlePageClick(currentPage - 1)}
          >
            <span className="sr-only">上一页</span>
            <wbr />
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
              <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
            </svg>
          </button>
        </div>
        <ul className="inline-flex -space-x-px text-sm font-medium shadow-sm">
          {getPageNumbers().map((page, index) => (
            <li key={index}>
              {page === '...' ? (
                <span className="inline-flex items-center justify-center border border-slate-200 px-3 py-1.5 leading-5 text-slate-600">
                  ...
                </span>
              ) : (
                <button
                  className={`inline-flex items-center justify-center border px-3 py-1.5 leading-5 ${
                    page === currentPage
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                  onClick={() => handlePageClick(page as number)}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="ml-2">
          <button
            className={`inline-flex items-center justify-center rounded border border-slate-200 px-3 py-1.5 leading-5 text-slate-600 shadow-sm ${
              currentPage === totalPages
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
            }`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
          >
            <span className="sr-only">下一页</span>
            <wbr />
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
              <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}