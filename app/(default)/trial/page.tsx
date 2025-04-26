"use client"

import { FormEvent, useState } from 'react'

export default function Trial() {
    const [data, setData] = useState(
        {
            name: '',
            email: '',
            wechatAccount: '',
            company: '',
            ApplyReason: ''
        }
    )
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [error, setError] = useState<string|null>("")
    // const submitTrial = async (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
    //     const res = await fetch('/api/trial', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({data:data})
    //     })
    //     if (res.ok) {
    //         console.log(data)
    //     }
    // }
    const submitTrial = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError("");
      
      try {
          const res = await fetch('/api/trial', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({data:data})
          });
          
          if (res.ok) {
              setSuccess(true);
              setData({
                  name: '',
                  email: '',
                  wechatAccount: '',
                  company: '',
                  ApplyReason: ''
              });
          } else {
              const errorData = await res.json();
              setError(errorData.error || "提交失败，请稍后再试");
          }
      } catch (err) {
          setError("提交失败，请检查网络连接");
      } finally {
          setIsSubmitting(false);
      }
  }
  return (
    <>
      <section className="relative">
        <div className="max-w-6xl mx-auto pt-12 px-4 sm:px-6 relative">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">

            {/* Page header */}
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h1 className="h1 font-red-hat-display mb-4">欢迎使用明曦</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">您可以通过此处申请阅读明曦独家的研究资料</p>
            </div>

            {/* Contact form */}
            <form className="max-w-xl mx-auto"
                  onSubmit={submitTrial}        
            >
            <div className="flex flex-wrap -mx-3 mb-5">                 
                <div className="w-full px-3">                   
                <label className="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="company">姓名 <span className="text-red-600">*</span></label>              
                <input id="name" 
                       type="text" 
                       value={data.name} 
                       onChange={(e) => setData({ ...data, name: e.target.value })}
                       className="form-input w-full" 
                       placeholder="请输入您的姓名" 
                       required />                 
            </div>
            </div>
              
            <div className="flex flex-wrap -mx-3 mb-5">
                <div className="w-full px-3">
                  <label className="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="company">邮箱 <span className="text-red-600">*</span></label>
                  <input id="company" 
                         type="email" 
                         value={data.email}
                         onChange={(e) => setData({ ...data, email: e.target.value })}
                         className="form-input w-full" 
                         placeholder="请输入您的邮箱" 
                         required />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-5">
                <div className="w-full px-3">
                  <label className="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="phone">微信号 <span className="text-red-600">*</span></label>
                  <input id="phone" 
                         type="wechataccount" 
                         value={data.wechatAccount}
                         onChange={(e) => setData({ ...data, wechatAccount: e.target.value })}
                         className="form-input w-full" 
                         placeholder="请输入您的微信号，方便后续与您联系" 
                         required />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-5">
                <div className="w-full px-3">
                  <label className="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="country">公司 <span className="text-red-600">*</span></label>
                  <input id="country" 
                         type="text" 
                         value={data.company}
                         onChange={(e) => setData({ ...data, company: e.target.value })}
                         className="form-input w-full" 
                         placeholder="请输入您的公司" 
                         required />    
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-5">
                <div className="w-full px-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-gray-800 dark:text-gray-300 text-sm font-medium" htmlFor="message">您为何想要申请试用？（选填）</label>
                    <span className="text-sm text-gray-500"></span>
                  </div>
                  <textarea id="message" 
                            rows={4} 
                            className="form-textarea w-full" 
                            value={data.ApplyReason}
                            onChange={(e) => setData({ ...data, ApplyReason: e.target.value})}
                            placeholder="可以分享您为何希望试用我们的产品，以便我们更好地了解您的需求">

                        </textarea>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                <button 
                  className="btn text-white bg-rblue-900 hover:bg-rblue-400 w-full flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>提交中...</span>
                  ) : (
                    <>
                      <span>请求试用</span>
                      <svg className="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path className="fill-current" d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                      </svg>
                    </>
                  )}
                </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </section>
      {/* 成功消息 */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSuccess(false)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4 sm:mx-auto relative transform transition-all">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">申请已成功提交</h3>
            <p className="text-gray-500 dark:text-gray-300 text-center mt-2">我们将尽快与您联系。感谢您的耐心等待！</p>
            <div className="mt-6">
              <button 
                onClick={() => setSuccess(false)} 
                className="btn text-white bg-rblue-900 hover:bg-rblue-400 w-full flex items-center justify-center"
                >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 错误消息 */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setError(null)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4 sm:mx-auto relative transform transition-all">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">提交失败</h3>
            <p className="text-gray-500 dark:text-gray-300 text-center mt-2">{error}</p>
            <div className="mt-6">
              <button 
                onClick={() => setError(null)} 
                className="btn text-white bg-rblue-900 hover:bg-rblue-400 w-full flex items-center justify-center"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
