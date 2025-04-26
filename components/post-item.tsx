import Link from 'next/link'
import PostDate from '@/components/post-date'

export default function PostItem({ ...props }) {
  return (
    <article className="flex items-center justify-between py-4 border-b border-gray-200 h-auto min-h-[150px] sm:h-auto sm:min-h-[180px] md:h-[200px] w-full">
      <div className="flex-grow flex flex-col h-full max-w-[85%] sm:max-w-[90%] md:max-w-none">
        <header className="h-auto min-h-[40px] sm:min-h-[45px] md:h-[50px]">
          <h2 className="h4 mb-2 line-clamp-2 sm:line-clamp-1 md:truncate">
            <Link href={`/resources/${props.uniquefilename}`} className="hover:underline">{props.name}</Link>
          </h2>
        </header>
        
        <div className="text-lg text-gray-600 mb-2 h-auto max-h-[90px] sm:max-h-[100px] md:h-[120px] overflow-hidden line-clamp-3 sm:line-clamp-4">{props.description}</div>
        
        <footer className="text-sm mt-auto">
          <div className="flex flex-wrap items-center">
            <div className="truncate max-w-full">
              <a className="text-m text-gray-600 truncate">明曦中美研究中心</a>
              <span className="text-gray-600 hidden xs:inline"> · <PostDate dateString={props.createdAt} /></span>
            </div>
          </div>
        </footer>
      </div>
      
      <Link href={`/resources/${props.uniquefilename}`} className="block shrink-0 ml-2 sm:ml-3 md:ml-6">
        <span className="sr-only">Read more</span>
        <svg className="w-4 h-4 fill-current text-blue-600" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.3 14.7l-1.4-1.4L12.2 9H0V7h12.2L7.9 2.7l1.4-1.4L16 8z" />
        </svg>
      </Link>
    </article>
  )
}