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
        <div className="md:flex md:items-center md:justify-between relative py-4 md:py-8 border-t border-gray-200">


          {/* 公众号*/}
          <div className="text-sm text-gray-600">
              <HoverCard>
                    <HoverCardTrigger><p>公众号：明曦咨询</p> </HoverCardTrigger>
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
          <div className="text-sm text-gray-600 absolute left-1/2 transform -translate-x-1/2">
           &copy; Mingxi.com. All rights reserved.

          </div>

          <div className="text-sm text-gray-600">
          <div className="flex">
            <span className="">联系方式：</span>
            <span className="ml-2 ">policy@ming-xi.cn</span>
            </div>
            <div className="flex">
            <span className="invisible">联系方式：</span> {/* 保留对齐 */}
            <span className="ml-2 ">info@ming-xi.cn</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}
