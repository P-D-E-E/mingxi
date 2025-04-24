"use client"

import { signIn } from 'next-auth/react'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()
  const [data, setData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const loginUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    })
    if (result?.error) {
      setLoading(false)
      if (result.error === "CredentialsSignin") {
        setError("邮箱或密码错误")
      } else {
        setError("登录失败，请稍后重试")
      }
    } else {
      router.push('/resources')
    }
  }
  return (
    <section className="bg-gradient-to-b from-gray-200 to-white">
      <div className="max-w-xl max-h-32 mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Form */}
          <div className="relative flex flex-col p-6 h-96 bg-white rounded shadow-xl">
            <div className="mx-auto">
              <form onSubmit={loginUser}>
                <div className="flex flex-wrap -mx-3 mt-8 mb-4">
                  <div className="w-full px-3">
                    <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email">邮箱</label>
                    <input 
                      id="email" 
                      type="email" 
                      name="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      className="form-input w-full text-gray-800" 
                      placeholder="请输入邮箱" 
                      required 
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <div className="flex justify-between">
                      <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="password">密码</label>
                    </div>
                    <input 
                      id="password" 
                      name="password"
                      type="password" 
                      value={data.password}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      className="form-input w-full text-gray-800" 
                      placeholder="请输入密码" 
                      required 
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap -mx-3 mt-6">
                  <div className="w-full px-3">
                    {mounted && (
                      <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 text-white transition-all duration-200 ease-in-out rounded
                          ${loading ? 'bg-gray-400' : 'bg-rblue-900 hover:bg-blue-800'}
                        `}
                      >
                        {loading ? '登录中...' : '登录'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
