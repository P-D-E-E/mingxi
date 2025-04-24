import Link from 'next/link'
import PostDate from '@/components/post-date'

export default function PostItem({ ...props }) {
  return (
    <article className="flex items-center justify-between py-4 border-b border-gray-200 h-[200px] w-full">
      <div className="flex-grow flex flex-col h-full">
        <header className="h-[50px]">
          <h2 className="h4 mb-2 truncate">
            <Link href={`/resources/${props.uniquefilename}`} className="hover:underline">{props.name}</Link>
          </h2>
        </header>
        
        <div className="text-lg text-gray-600 mb-2 h-[120px] overflow-hidden line-clamp-4">{props.description}</div>
        
        <footer className="text-sm mt-auto">
          <div className="flex items-center">
            <div>
              <a className="text-m text-gray-600">明曦中美研究中心</a>
              <span className="text-gray-600"> · <PostDate dateString={props.createdAt} /></span>
            </div>
          </div>
        </footer>
      </div>
      
      <Link href={`/resources/${props.uniquefilename}`} className="block shrink-0 ml-6">
        <span className="sr-only">Read more</span>
        <svg className="w-4 h-4 fill-current text-blue-600" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.3 14.7l-1.4-1.4L12.2 9H0V7h12.2L7.9 2.7l1.4-1.4L16 8z" />
        </svg>
      </Link>
    </article>
  )
}
