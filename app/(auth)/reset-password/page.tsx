"use client"

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
enum ResetMode {
  SELECT,           // 选择重置方式
  OLD_PASSWORD_VERIFY, // 使用旧密码验证
  EMAIL_REQUEST,    // 请求邮箱验证码
  EMAIL_VERIFY,     // 验证邮箱验证码
  SET_NEW_PASSWORD  // 设置新密码(统一页面)
}

export default function ResetPassword() {
  const router = useRouter()
  const [mode, setMode] = useState<ResetMode>(ResetMode.SELECT)
  
  // 旧密码验证相关状态
  const [oldPasswordData, setOldPasswordData] = useState({
    email: "",
    oldPassword: ""
  })
  
  // 邮箱验证码相关状态
  const [emailRequestData, setEmailRequestData] = useState({
    email: ""
  })
  
  const [emailVerifyData, setEmailVerifyData] = useState({
    email: "",
    code: ""
  })
  
  // 新密码设置状态
  const [newPasswordData, setNewPasswordData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    token: "", // 可以是旧密码或验证码，作为修改凭证
    method: "" // "old_password" 或 "email_code"
  })
  
  // 通用状态
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [countdown, setCountdown] = useState(0)
  
  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // 处理模式选择
  const handleSelectMode = (selectedMode: ResetMode) => {
    setMode(selectedMode)
    setError("")
    setSuccess("")
  }
  
  // 返回选择页面
  const handleBack = () => {
    setMode(ResetMode.SELECT)
    setError("")
    setSuccess("")
  }
  
  // 验证邮箱是否存在
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('邮箱验证请求失败');
      }
      
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('验证邮箱出错:', error);
      return false;
    }
  }
  
  // 验证新密码
  const validatePassword = (password: string, confirmPassword: string): boolean => {
    if (password.length < 6) {
      setError('密码长度必须至少为6个字符');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }
    
    return true;
  }
  
  // 处理旧密码验证
  const handleOldPasswordVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      // 检查邮箱是否存在
      const emailExists = await checkEmailExists(oldPasswordData.email);
      if (!emailExists) {
        setError('该邮箱未注册');
        setLoading(false);
        return;
      }
      
      // 验证旧密码
      const response = await fetch('/api/auth/reset-password/verify-old-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: oldPasswordData.email,
          oldPassword: oldPasswordData.oldPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '密码验证失败');
      }
      
      // 验证成功，进入设置新密码页面
      setNewPasswordData({
        email: oldPasswordData.email,
        newPassword: "",
        confirmPassword: "",
        token: oldPasswordData.oldPassword, // 使用旧密码作为凭证
        method: "old_password"
      });
      
      setMode(ResetMode.SET_NEW_PASSWORD);
      
    } catch (error: any) {
      setError(error.message || '账号或密码验证失败');
    } finally {
      setLoading(false);
    }
  }
  
  // 请求邮箱验证码
  const handleRequestCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      // 检查邮箱是否存在
      const emailExists = await checkEmailExists(emailRequestData.email);
      if (!emailExists) {
        setError('该邮箱未注册');
        setLoading(false);
        return;
      }
      
      // 发送验证码请求
      const response = await fetch('/api/auth/reset-password/email/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailRequestData.email,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '发送验证码失败');
      }
      
      setSuccess('验证码已发送，请查看您的邮箱');
      setEmailVerifyData({
        ...emailVerifyData,
        email: emailRequestData.email
      });
      
      // 设置倒计时，60秒内不能重新请求
      setCountdown(60);
      
      // 自动跳转到验证码验证页面
      setMode(ResetMode.EMAIL_VERIFY);
      
    } catch (error: any) {
      setError(error.message || '发送验证码时出错，请稍后重试');
    } finally {
      setLoading(false);
    }
  }
  
  // 验证邮箱验证码
  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      // 检查邮箱是否存在
      const emailExists = await checkEmailExists(emailVerifyData.email);
      if (!emailExists) {
        setError('该邮箱未注册');
        setLoading(false);
        return;
      }
      
      // 验证验证码
      const response = await fetch('/api/auth/reset-password/email/verify-code-only', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailVerifyData.email,
          code: emailVerifyData.code,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '验证码验证失败');
      }
      
      // 验证码验证成功，进入设置新密码页面
      setNewPasswordData({
        email: emailVerifyData.email,
        newPassword: "",
        confirmPassword: "",
        token: emailVerifyData.code, // 使用验证码作为凭证
        method: "email_code"
      });
      
      setMode(ResetMode.SET_NEW_PASSWORD);
      
    } catch (error: any) {
      setError(error.message || '验证码验证失败');
    } finally {
      setLoading(false);
    }
  }
  
  // 设置新密码
  const handleSetNewPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      // 验证新密码
      if (!validatePassword(newPasswordData.newPassword, newPasswordData.confirmPassword)) {
        setLoading(false);
        return;
      }
      
      // 根据不同的验证方式调用不同的API
      let endpoint = '';
      let requestBody = {};
      
      if (newPasswordData.method === "old_password") {
        endpoint = '/api/auth/reset-password/old-password';
        requestBody = {
          email: newPasswordData.email,
          oldPassword: newPasswordData.token,
          newPassword: newPasswordData.newPassword,
        };
      } else if (newPasswordData.method === "email_code") {
        endpoint = '/api/auth/reset-password/email/verify-code';
        requestBody = {
          email: newPasswordData.email,
          code: newPasswordData.token,
          newPassword: newPasswordData.newPassword,
        };
      } else {
        throw new Error('无效的验证方式');
      }
      
      // 提交密码更新请求
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '密码更新失败');
      }
      
      setSuccess('密码修改成功！正在为您登录...');
      
      // 自动登录
      const loginResult = await signIn('credentials', {
        redirect: false,
        email: newPasswordData.email,
        password: newPasswordData.newPassword,
      });

      if (loginResult?.error) {
        // 登录失败，但密码已经更新
        setSuccess('密码修改成功！请使用新密码登录。');
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      } else {
        // 登录成功，重定向到资源页
        setTimeout(() => {
          router.push('/resources');
        }, 1000);
      }
      
      // 清空表单
      setNewPasswordData({
        email: "",
        newPassword: "",
        confirmPassword: "",
        token: "",
        method: ""
      });
      
    } catch (error: any) {
      setError(error.message || '密码修改失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <section className="">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          
          {/* Page header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1 mb-4">修改密码</h1>
            <p className="text-xl text-gray-600">
              {mode === ResetMode.SELECT && "请选择修改方式"}
              {mode === ResetMode.OLD_PASSWORD_VERIFY && "使用旧密码验证您的身份"}
              {mode === ResetMode.EMAIL_REQUEST && "获取邮箱验证码"}
              {mode === ResetMode.EMAIL_VERIFY && "验证邮箱验证码"}
              {mode === ResetMode.SET_NEW_PASSWORD && "设置新密码"}
            </p>
          </div>
          
          {/* 选择验证方式 */}
          {mode === ResetMode.SELECT && (
            <div className="max-w-sm mx-auto">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => handleSelectMode(ResetMode.OLD_PASSWORD_VERIFY)}
                  className="btn text-white bg-rblue-900 hover:bg-blue-800 w-full"
                >
                  使用旧密码验证
                </button>
                <button 
                  onClick={() => handleSelectMode(ResetMode.EMAIL_REQUEST)}
                  className="btn text-white bg-rblue-900 hover:bg-blue-800 w-full"
                >
                  使用邮箱验证码验证
                </button>
              </div>
            </div>
          )}
          
          {/* 旧密码验证表单 */}
          {mode === ResetMode.OLD_PASSWORD_VERIFY && (
            <div className="max-w-sm mx-auto">
              <form onSubmit={handleOldPasswordVerify}>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="reset-email">
                      邮箱 <span className="text-red-600">*</span>
                    </label>
                    <input 
                      id="reset-email" 
                      type="email" 
                      value={oldPasswordData.email}
                      onChange={(e) => setOldPasswordData({...oldPasswordData, email: e.target.value})}
                      className="form-input w-full text-gray-800" 
                      placeholder="请输入您的邮箱" 
                      required 
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="old-password">
                      旧密码 <span className="text-red-600">*</span>
                    </label>
                    <input 
                      id="old-password" 
                      type="password" 
                      value={oldPasswordData.oldPassword}
                      onChange={(e) => setOldPasswordData({...oldPasswordData, oldPassword: e.target.value})}
                      className="form-input w-full text-gray-800" 
                      placeholder="请输入旧密码" 
                      required 
                    />
                  </div>
                </div>
                
                {error && <div className="text-red-600 mb-4">{error}</div>}
                {success && <div className="text-green-600 mb-4">{success}</div>}
                
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full px-3">
                    <button 
                      type="submit"
                      disabled={loading}
                      className={`btn text-white w-full ${loading ? 'bg-gray-400' : 'bg-rblue-900 hover:bg-blue-800'}`}
                    >
                      {loading ? '验证中...' : '下一步'}
                    </button>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={handleBack}
                    className="text-blue-600 hover:underline"
                    >
                      返回
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* 请求邮箱验证码表单 */}
            {mode === ResetMode.EMAIL_REQUEST && (
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleRequestCode}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email-request">
                        邮箱 <span className="text-red-600">*</span>
                      </label>
                      <input 
                        id="email-request" 
                        type="email" 
                        value={emailRequestData.email}
                        onChange={(e) => setEmailRequestData({...emailRequestData, email: e.target.value})}
                        className="form-input w-full text-gray-800" 
                        placeholder="请输入您的邮箱" 
                        required 
                      />
                    </div>
                  </div>
                  
                  {error && <div className="text-red-600 mb-4">{error}</div>}
                  {success && <div className="text-green-600 mb-4">{success}</div>}
                  
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full px-3">
                      <button 
                        type="submit"
                        disabled={loading || countdown > 0}
                        className={`btn text-white w-full ${loading || countdown > 0 ? 'bg-gray-400' : 'bg-rblue-900 hover:bg-blue-800'}`}
                      >
                        {loading ? '发送中...' : 
                         countdown > 0 ? `请等待 ${countdown} 秒后重试` : 
                         '发送验证码'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <button 
                      type="button" 
                      onClick={handleBack}
                      className="text-blue-600 hover:underline"
                    >
                      返回
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* 验证邮箱验证码表单 */}
            {mode === ResetMode.EMAIL_VERIFY && (
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleVerifyCode}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email-verify">
                        邮箱 <span className="text-red-600">*</span>
                      </label>
                      <input 
                        id="email-verify" 
                        type="email" 
                        value={emailVerifyData.email}
                        onChange={(e) => setEmailVerifyData({...emailVerifyData, email: e.target.value})}
                        className="form-input w-full text-gray-800" 
                        placeholder="请输入您的邮箱" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="verification-code">
                        验证码 <span className="text-red-600">*</span>
                      </label>
                      <input 
                        id="verification-code" 
                        type="text" 
                        value={emailVerifyData.code}
                        onChange={(e) => setEmailVerifyData({...emailVerifyData, code: e.target.value})}
                        className="form-input w-full text-gray-800" 
                        placeholder="请输入6位验证码" 
                        required 
                        maxLength={6}
                        pattern="\d{6}"
                        title="请输入6位数字验证码"
                      />
                    </div>
                  </div>
                  
                  {error && <div className="text-red-600 mb-4">{error}</div>}
                  {success && <div className="text-green-600 mb-4">{success}</div>}
                  
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full px-3">
                      <button 
                        type="submit"
                        disabled={loading}
                        className={`btn text-white w-full ${loading ? 'bg-gray-400' : 'bg-rblue-900 hover:bg-blue-800'}`}
                      >
                        {loading ? '验证中...' : '下一步'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap -mx-3 mt-4">
                    <div className="w-full px-3">
                      <button 
                        type="button"
                        onClick={() => {
                          setMode(ResetMode.EMAIL_REQUEST)
                          setSuccess("");  // 清空成功消息

                        }
                        }
                        disabled={countdown > 0}
                        className={`btn text-white w-full ${countdown > 0 ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'}`}
                      >
                        {countdown > 0 ? `${countdown} 秒后重新获取验证码` : '重新获取验证码'}
                      </button>
                    </div>
                  </div>
      
                  
                  <div className="text-center mt-4">
                    <button 
                      type="button" 
                      onClick={handleBack}
                      className="text-blue-600 hover:underline"
                    >
                      返回
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* 设置新密码表单 */}
            {mode === ResetMode.SET_NEW_PASSWORD && (
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleSetNewPassword}>

                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="new-password">
                        新密码 <span className="text-red-600">*</span>
                      </label>
                      <input 
                        id="new-password" 
                        type="password" 
                        value={newPasswordData.newPassword}
                        onChange={(e) => setNewPasswordData({...newPasswordData, newPassword: e.target.value})}
                        className="form-input w-full text-gray-800" 
                        placeholder="请输入新密码" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="confirm-password">
                        确认密码 <span className="text-red-600">*</span>
                      </label>
                      <input 
                        id="confirm-password" 
                        type="password" 
                        value={newPasswordData.confirmPassword}
                        onChange={(e) => setNewPasswordData({...newPasswordData, confirmPassword: e.target.value})}
                        className="form-input w-full text-gray-800" 
                        placeholder="请再次输入新密码" 
                        required 
                      />
                    </div>
                  </div>
                  
                  {error && <div className="text-red-600 mb-4">{error}</div>}
                  {success && <div className="text-green-600 mb-4">{success}</div>}
                  
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full px-3">
                      <button 
                        type="submit"
                        disabled={loading}
                        className={`btn text-white w-full ${loading ? 'bg-gray-400' : 'bg-rblue-900 hover:bg-blue-800'}`}
                      >
                        {loading ? '处理中...' : '确认修改'}
                      </button>
                    </div>
                  </div>
                  
                  
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }