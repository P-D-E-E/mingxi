import Logo from './logo'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover"
import Paper from '@/public/images/QR_code.jpg'
import Image from 'next/image'
export default function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Bottom area */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 md:py-4 border-t border-gray-200 space-y-2 md:space-y-0">

          {/* 公众号 */}
          <div className="text-[10px] md:text-xs text-gray-600 text-center md:text-left order-1">
              <HoverCard>
                <HoverCardTrigger><p>公众号：明曦咨询</p></HoverCardTrigger>
                <HoverCardContent className="w-auto p-1">
                  <div>
                    <Image 
                      className="rounded" 
                      src={Paper} 
                      width={140} 
                      height={140} 
                      priority 
                      alt="About us" 
                    />
                  </div>
                </HoverCardContent>
              </HoverCard>
          </div>
          
          {/* Copyrights note */}
          <div className="text-[10px] md:text-xs text-gray-600 text-center order-3 md:order-2">
            &copy; 明曦教育科技有限责任公司 版权所有
            <div className="text-center mt-0.5">
              <a 
                href="http://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-900 transition duration-150 ease-in-out"
              >
                浙ICP备2025161156号
              </a>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="text-[10px] md:text-xs text-gray-600 text-center md:text-right order-2 md:order-3">
            <div className="md:flex justify-end">
              <span className="">联系方式：</span>
              <span className="ml-1">policy@ming-xi.cn</span>
            </div>
            <div className="md:flex justify-end">
              <span className="md:ml-1">info@ming-xi.cn</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}