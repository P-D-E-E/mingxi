export const metadata = {
  title: '明曦 - 主页',
  description: 'Page description',
  icons: {
    icon: [
      { url: '/images/Mingxi.png' },
    ],
  },
}

import ContactIntro from "./Intro"
import MiddleNav from './MiddleNav'

export default function Home() {
  return (
    <><div className='flex flex-col justify-center items-center'>
        <div className="">
          <ContactIntro />
        </div>

        <section>
          <div className="max-w-3xl mx-auto text-center px-4 md:px-0 pb-8 md:pb-16">
                <h3 className="text-xl font-bold sm:text-2xl lg:h3 mb-4" data-aos="zoom-y-out">中美关系——国际关系的核心
                </h3>
                <h3 className="text-xl font-bold sm:text-2xl lg:h3 mb-4" data-aos="zoom-y-out">我们提供来自华府一手信息与政策分析
                </h3>
          </div>
        </section>
        <MiddleNav />
      </div>
    </>
  )
}