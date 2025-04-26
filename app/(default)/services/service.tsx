export default function Service() {
  return (
      <section className="bg-gradient-to-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pb-8 md:pb-12 lg:pb-20">
          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none" data-aos-id-blocks>

            {/* 1st item */}
            <div className="relative flex flex-col p-4 md:p-6 h-auto md:h-72 bg-white rounded shadow-xl" data-aos="zoom-y-out" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-10 h-10 md:w-12 md:h-12 mb-2 md:mb-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <circle className="fill-current text-rblue-900" cx="24" cy="24" r="24" />
                <g transform="translate(8 8)" strokeWidth="2">
                  <path className="stroke-current text-blue-300" d="M23.778 8.222l-4.242 4.242M23.778 23.778l-4.242-4.242M8.222 23.778l4.242-4.242M8.222 8.222l4.242 4.242" />
                  <circle className="stroke-current text-white" transform="rotate(-45 16 16)" cx="16" cy="16" r="11" fill="none" />
                  <circle className="stroke-current text-blue-300" transform="rotate(-45 16 16)" cx="16" cy="16" r="5" fill="none" />
                </g>
              </svg>
              <h3 className="text-lg md:text-xl font-bold leading-snug tracking-tight mb-1">政策咨询</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1">· 国际风险预警简讯</p>
              <p className="text-sm md:text-base text-gray-600 mb-1">· 美国政策动态跟踪解读月报</p>
              <p className="text-sm md:text-base text-gray-600 mb-1">· 全球产业发展动态季报</p>
              <p className="text-sm md:text-base text-gray-600 mb-1">· 研究资料库访问权限</p>
              <p className="text-sm md:text-base text-gray-600 mb-1">· 中美专家访谈</p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col p-4 md:p-6 h-auto md:h-72 bg-white rounded shadow-xl" data-aos="zoom-y-out" data-aos-delay="150" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-10 h-10 md:w-12 md:h-12 mb-2 md:mb-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <circle className="fill-current text-rblue-900" cx="24" cy="24" r="24" />
                  <g strokeWidth="2">
                    <path className="stroke-current text-blue-300" d="M24 19v16M13 25h3M16 17l2.1 2.1M32 17l-2.1 2.1M16 34l2.1-2.1M32 34l-2.1-2.1M32 25h3M21 15l-2-2M27 15l2-2" />
                    <path className="stroke-current text-white" d="M27.9 17.2c2.5 1.6 4.1 4.7 4.1 8.3 0 5.2-3.6 9.5-8 9.5s-8-4.3-8-9.5c0-3.6 1.7-6.7 4.1-8.3" />
                    <path className="stroke-current text-white" d="M24 14c-2 0-3.7 1.5-4 3.5 0 0 2 1.5 4 1.5s4-1.5 4-1.5c-.3-2-2-3.5-4-3.5z" strokeLinecap="square" />
                  </g>
                </g>
              </svg>
              <h3 className="text-lg md:text-xl font-bold leading-snug tracking-tight mb-1">出海解决方案</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1 md:mb-2">· 全球市场进入/退出风险评估</p>
              <p className="text-sm md:text-base text-gray-600 mb-1 md:mb-2">· 专项定制化策略报告</p>
              <p className="text-sm md:text-base text-gray-600 mb-1 md:mb-2">· 企业专属顾问，提供战略支持</p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col p-4 md:p-6 h-auto md:h-72 bg-white rounded shadow-xl" data-aos="zoom-y-out" data-aos-delay="300" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-10 h-10 md:w-12 md:h-12 mb-2 md:mb-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <circle className="fill-current text-rblue-900" cx="24" cy="24" r="24" />
                  <g strokeWidth="2">
                    <path className="stroke-current text-blue-300" d="M33 16L22 27" />
                    <path className="stroke-current text-white" d="M33 16l-7 19-4-8-8-4z" />
                  </g>
                </g>
              </svg>
              <h3 className="text-lg md:text-xl font-bold leading-snug tracking-tight mb-1">中美教育交流</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1 md:mb-2">· 访问学者项目</p>
              <p className="text-sm md:text-base text-gray-600 mb-1 md:mb-2">· 赴美交流项目</p>
              <p className="text-sm md:text-base text-gray-600 mb-1 md:mb-2">· 高管教育公开课</p>
              <p className="text-sm md:text-base text-gray-600 mb-1 md:mb-2">· 企业储备干部定制化团体培训项目</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}