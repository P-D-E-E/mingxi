export const metadata = {
    title: '明曦 - 联系我们',
    description: 'Page description',
  }

import ContactIntro from "./Intro"


export default function Contact() {
    return <>
        <ContactIntro />
        <section>
        <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
        <h4 className="h4 mb-4 text-rblue-900" data-aos="zoom-y-out">明曦教育科技有限责任公司</h4>
        <p className="text-xl text-gray-600" data-aos="zoom-y-out" data-aos-delay="150">
            中国浙江省杭州市西溪路525号浙大科技园B栋301-2
        </p>

        <div
            className="text-xl text-gray-600 flex flex-col items-center" 
            data-aos="zoom-y-out" 
            data-aos-delay="150"
        >
            <div className="flex w-full justify-center">
            <span className="text-right">联系方式：</span>
            <span className="ml-2 text-left">policy@ming-xi.cn</span>
            </div>
            <div className="flex w-full justify-center">
            <span className="text-right invisible">联系方式：</span> {/* 保留对齐 */}
            <span className="ml-2 text-left">info@ming-xi.cn</span>
            </div>
        </div>

        <p className="text-xl text-gray-600 mb-4" data-aos="zoom-y-out" data-aos-delay="150">
            美国分公司2025年开张
        </p>
        </div>

        
        



        </section>
    </>
}