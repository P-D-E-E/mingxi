
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'

import { LocalizationMap, Viewer, Worker } from '@react-pdf-viewer/core'

// 导入样式
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import '@react-pdf-viewer/search/lib/styles/index.css'
import '@react-pdf-viewer/page-navigation/lib/styles/index.css'
import zh_CN from '@react-pdf-viewer/locales/lib/zh_CN.json'

interface Resource {
  id: string;
  name: string;
  description: string;
  path: string;
  uniquefilename: string;
  createdAt: string;
  updatedAt?: string;
  lastModifier?: string;
}

interface ResourceCreatePanelProps {
  resourceData?: Resource | null;
}

export default function ResourceCreatePanel({ resourceData }: ResourceCreatePanelProps) {
  const router = useRouter();
  
  // 使用useState的函数形式来确保初始值只计算一次
  const [resourceName, setResourceName] = useState(() => resourceData?.name || '');
  const [description, setDescription] = useState(() => resourceData?.description || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState(() => resourceData?.path || '');
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // 开始加载
    
    if (resourceData) {
      console.log("ResourceCreatePanel - 接收到资源数据:", resourceData);
      setResourceName(resourceData.name || '');
      setDescription(resourceData.description || '');
      setCurrentFilePath(resourceData.path || '');
    }
    
    setIsLoading(false); // 加载完成
  }, [resourceData]);

  // 关键修复：添加useEffect来响应resourceData的变化
  useEffect(() => {
    if (resourceData) {
      console.log("ResourceCreatePanel - 接收到资源数据:", resourceData);
      setResourceName(resourceData.name || '');
      setDescription(resourceData.description || '');
      setCurrentFilePath(resourceData.path || '');
    }
  }, [resourceData]); // 当resourceData变化时更新表单状态
  // 文件选择处理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 检查文件类型是否为PDF
      if (file.type !== 'application/pdf') {
        setErrorMessage('请上传PDF格式的文件');
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  // 重置表单
  const resetForm = () => {
    setResourceName('');
    setDescription('');
    setSelectedFile(null);
    setCurrentFilePath('');
    setErrorMessage('');
  };

// 修改handleSubmit函数中的文件处理部分
const handleSubmit = async () => {
  try {
    setIsSubmitting(true);
    setErrorMessage('');
    
    // 表单验证
    if (!resourceName.trim()) {
      setErrorMessage('请输入资源名称');
      setIsSubmitting(false);
      return;
    }
    if (!description.trim()) {
      setErrorMessage('请输入资源描述');
      setIsSubmitting(false);
      return;
    }
    
    // 如果是新建资源且没有选择文件
    if (!resourceData && !selectedFile) {
      setErrorMessage('请上传PDF文件');
      setIsSubmitting(false);
      return;
    }

    // 准备表单数据
    const formData = new FormData();
    
    if (resourceData) {
      // 更新现有资源
      formData.append('id', resourceData.id);
      console.log("正在更新资源ID:", resourceData.id);
    }
    
    formData.append('name', resourceName);
    formData.append('description', description);
    
    // 确保文件正确添加到FormData中
    if (selectedFile) {
      // 明确指定文件名和类型
      formData.append('pdf', selectedFile, selectedFile.name);
      console.log("包含新文件:", selectedFile.name, "类型:", selectedFile.type, "大小:", selectedFile.size);
    }

    // 发送API请求
    const endpoint = resourceData ? '/api/resource/update' : '/api/resource/create';
    console.log("提交到端点:", endpoint);
    
    // 添加更详细的请求日志
    console.log("FormData内容:", [...formData.entries()].map(entry => {
      if (entry[1] instanceof File) {
        return [entry[0], `File: ${(entry[1] as File).name}`];
      }
      return entry;
    }));
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      // 不要设置Content-Type头，让浏览器自动设置multipart/form-data边界
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || '提交失败');
    }
    
    // 成功处理
    console.log('提交成功:', responseData);
    alert(resourceData ? '资源更新成功!' : '资源创建成功!');
    
    // 重置表单或重定向
    if (!resourceData) {
      resetForm();
    } else {
      // 更新成功后返回列表页
      router.push('/dashboard/resources/list');
    }
    
  } catch (error: any) {
    console.error('提交失败:', error);
    setErrorMessage(`提交失败: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

    // 添加PDF预览处理函数
  const handlePdfPreview = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsPdfPreviewOpen(true);
  };
  return (
    <div className="grow">
      {/* Panel body */}
      <div className="p-6 space-y-6">

      {isLoading ? (
          // 加载中显示骨架屏或加载指示器
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (<>
        <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">资源{resourceData ? '编辑' : '上传'}</h2>

        {/* Resource Form */}
        <section>
          <div className="flex flex-col space-y-4 mt-5">
            <div className="w-1/2">
              <label className="block text-m font-medium mb-2" htmlFor="name">
                资源名称
                <span className="text-red-500"> *</span>
              </label>
              <input
                id="name"
                className="form-input w-full"
                type="text"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                required
              />
            </div>
            <div className="w-2/3">
              <label className="block text-m font-medium mb-1" htmlFor="description">
                资源描述
                <span className="text-red-500"> *</span>
              </label>
              <textarea
                id="description"
                className="form-input w-full h-32 text-left resize-none"
                style={{ textAlign: 'left', verticalAlign: 'top' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            {/* 文件上传部分 */}
            <div className="w-2/3">
              <label className="block text-m font-medium mb-2">
                PDF文件
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center w-64 h-40 hover:border-indigo-500 transition-colors">
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">{selectedFile.name}</p>
                    </div>
                  ) : currentFilePath ? (
                    <div className="flex flex-col items-center">
                      <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">当前文件: {resourceData?.uniquefilename}</p>
                      <p className="text-xs text-indigo-500 mt-1">点击更换文件</p>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">点击上传PDF文件</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={handleFileChange}
                    style={{ pointerEvents: 'auto' }}
                  />
                </div>



                {/* 修改这里，添加对 selectedFile 的支持 */}
                {(currentFilePath || selectedFile) && (
                  <a 
                    href="#"
                    onClick={handlePdfPreview}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    查看{selectedFile ? '选择的' : '当前'}文件
                  </a>
                )}
              </div>
            </div>
          
          {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
          <button
            className={`btn border-slate-200 dark:border-slate-700 hover:border-slate-300 w-40 dark:hover:border-slate-600 shadow-sm text-indigo-500 mt-6 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中...' : resourceData ? '更新资源' : '上传资源'}
          </button>
          
          </div>
          
        </section>
        </>
        )}
      </div>
        
      {/* PDF预览对话框 */}

      {/* 修改 PDF 预览对话框部分 */}
      {isPdfPreviewOpen && (
        <Dialog
          open={isPdfPreviewOpen}
          onClose={() => setIsPdfPreviewOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            
            <div className="relative bg-white dark:bg-slate-800 rounded-lg max-w-5xl w-full mx-4 p-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-medium text-slate-800 dark:text-slate-100">
                  {resourceName || '文件预览'}
                </Dialog.Title>
                <button
                  onClick={() => setIsPdfPreviewOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div style={{ height: '70vh', border: '1px solid rgba(0, 0, 0, 0.3)' }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  {selectedFile ? (
                    // 如果有新上传的文件，预览这个文件
                    <Viewer
                      fileUrl={URL.createObjectURL(selectedFile)}
                      plugins={[]}
                      localization={zh_CN as unknown as LocalizationMap}
                    />
                  ) : resourceData?.uniquefilename ? (
                    // 如果没有新上传的文件，但有现有文件，预览现有文件
                    <Viewer
                      fileUrl={`/resource/${resourceData.uniquefilename}`}
                      plugins={[]}
                      localization={zh_CN as unknown as LocalizationMap}
                    />
                  ) : (
                    // 如果两者都没有，显示错误信息
                    <div className="flex items-center justify-center h-full">
                      <p className="text-red-500">没有可预览的文件</p>
                    </div>
                  )}
                </Worker>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
    
  )
}