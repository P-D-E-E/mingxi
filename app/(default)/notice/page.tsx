export default function Notice() {
    return (
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="pt-20 pb-8 md:pt-40 md:pb-20">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-4 md:mb-8">
                您的权限已经过期，请
                <a
                  href="https://www.ming-xi.cn/trial"
                  className="text-blue-600 underline hover:text-blue-800 mx-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  向我们申请试用
                </a>
                或者联系管理员购买服务。
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }