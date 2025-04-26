import Link from 'next/link'
import Image from 'next/image'
import PostDate from '@/components/post-date'
import { PostItemProps } from "@/types/post"

export default function PostItemS({ event }: PostItemProps) {
  return (
    <article className="flex flex-col h-[280px] md:h-[320px] lg:h-[390px]"> {/* 针对平板优化高度 */}
      <header>
        {event.image && (
          <Link className="block mb-2 sm:mb-4" href={`/vision/events/${event.id}`}>
            <figure className="relative h-0 pb-9/16">
              <Image
                className="absolute inset-0 w-full h-full object-cover"
                src={event.image}
                width={352}
                height={198}
                alt={event.name}
              />
            </figure>
          </Link>
        )}
      </header>
      <Link className="hover:underline" href={`/vision/events/${event.id}`}>
        <h4 className="h4 font-red-hat-display mt-2 sm:mt-3 mb-1 sm:mb-2 text-base sm:text-xl line-clamp-2">{event.name}</h4>
      </Link>
      
      {/* 中间留白部分用 flex-grow 占据更多空间 */}
      <div className="flex-grow"></div>

      {/* Footer 部分固定在底部 */}
      <footer className="mt-auto"> {/* mt-auto 已经确保 footer 在底部 */}
        <div className="text-xs sm:text-sm text-gray-500">
          <span className="text-gray-500">
            <PostDate dateString={event.createdAt} />
          </span>
        </div>
      </footer>
    </article>
);
}