'use client'

import { useState, useRef, useEffect } from 'react'
import { ReactTextEditorRef, ReactTextEditor } from '@/components/RichTextEditor/rich-text-editor';
import Image from 'next/image';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ContentPreview } from './preview';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  description?: string;
  article?: string;
  image?: string | null;
  authorId?: string;
}

interface EventCreatePanelProps {
  eventData?: Event | null;
}

export default function EventCreatePanel({ eventData }: EventCreatePanelProps) {
  const router = useRouter();
  
  // 使用useState的函数形式来确保初始值只计算一次
  const [resourceName, setResourceName] = useState(() => eventData?.name || '');
  const [description, setDescription] = useState(() => eventData?.description || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [content, setContent] = useState(() => eventData?.article || '');
  const [eventType, setEventType] = useState<'SELECTED' | 'NONSELECTED'>(() => 
    eventData?.status as 'SELECTED' | 'NONSELECTED' || 'NONSELECTED'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(() => eventData?.image || null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const editorRef = useRef<ReactTextEditorRef>(null);

  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedLimitReached, setSelectedLimitReached] = useState(false);

  // 检查SELECTED数量
  const fetchSelectedCount = async () => {
    try {
      const res = await fetch('/api/event/selected-count');
      const data = await res.json();
      console.log('SELECTED', data.count);
      setSelectedCount(data.count);
      setSelectedLimitReached(data.count >= 3);
    } catch (e) {
      // 可以根据需要处理错误
    }
  };

  useEffect(() => {
    fetchSelectedCount();
  }, []);

  // 当组件挂载时设置加载状态
  useEffect(() => {
    setIsLoading(true); // 开始加载
    
    if (eventData) {
      console.log("EventCreatePanel - 接收到事件数据:", eventData);
      setResourceName(eventData.name || '');
      setDescription(eventData.description || '');
      setContent(eventData.article || '');
      setEventType(eventData.status as 'SELECTED' | 'NONSELECTED' || 'NONSELECTED');
      
      if (eventData.image) {
        setCroppedImage(eventData.image);
        setOriginalImage(eventData.image);
      }
      
      // 如果编辑器已经初始化，设置内容
      if (editorRef.current && editorRef.current.setContent && eventData.article) {
        editorRef.current.setContent(eventData.article);
      }
    }
    
    setIsLoading(false); // 加载完成
  }, [eventData]);



  const handleReCrop = () => {
    if (!originalImage && croppedImage) {
      setOriginalImage(croppedImage);
    }
    setShowCropModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        setOriginalImage(imageDataUrl);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = () => {
    if (!imgRef.current || !completedCrop) return null;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleCropComplete = () => {
    const croppedImageUrl = getCroppedImg();
    if (croppedImageUrl) {
      setCroppedImage(croppedImageUrl);
    }
    setShowCropModal(false);
  };

  const resetForm = () => {
    setResourceName('');
    setDescription('');
    setOriginalImage(null);
    setCroppedImage(null);
    setContent('');
    setErrorMessage('');
    setEventType('NONSELECTED');
    
    if (editorRef.current && editorRef.current.resetContent) {
      editorRef.current.resetContent();
    } else if (editorRef.current && editorRef.current.setContent) {
      editorRef.current.setContent('');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      let currentContent = content;
      if (editorRef.current && editorRef.current.getContent) {
        currentContent = editorRef.current.getContent();
        setContent(currentContent);
      }
      
      if (!resourceName.trim()) {
        setErrorMessage('请输入Event名称');
        setIsSubmitting(false);
        return;
      }
      if (!description.trim()) {
        setErrorMessage('请输入Event简介');
        setIsSubmitting(false);
        return;
      }
      
      if (eventType === 'SELECTED' && !croppedImage) {
        setErrorMessage('最新资讯必须上传封面图片');
        setIsSubmitting(false);
        return;
      }
      
      if (!currentContent.trim()) {
        setErrorMessage('请输入Event内容');
        setIsSubmitting(false);
        return;
      }
      
      const submitData = {
        name: resourceName,
        description,
        article: currentContent,
        image: croppedImage,
        status: eventType
      };
      
      let response;
      
      if (eventData?.id) {
        response = await fetch(`/api/event/${eventData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch('/api/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '提交失败');
      }
      
      const result = await response.json();
      
      if (!eventData?.id) {
        resetForm();
        setSuccessMessage('Event创建成功！');
      } else {
        window.alert('资源修改成功！');
        router.push('/dashboard/events/list');
      }
      
    } catch (error) {
      console.error('提交失败:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message || '提交失败，请稍后重试');
      } else {
        setErrorMessage('提交失败，请稍后重试');
      }
    } finally {
      setIsSubmitting(false);
    }
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
        ) : (
          <>
            <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
              {eventData ? 'Event编辑' : 'Event发布'}
            </h2>

            {/* Business Profile */}
            <section>
              <div className="flex flex-col space-y-4 mt-5">
                <div className="w-1/2">
                  <label className="block text-m font-medium mb-2" htmlFor="name">
                    名称
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
                  <label className="block text-m font-medium mb-1" htmlFor="business-id">简介
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
                
                {/* Event类型选择 */}
                <div className="flex space-x-4">
                <label className="block text-m font-medium mb-1" htmlFor="business-id">Event类型
                    <span className="text-red-500"> *</span>
                  </label>

                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="eventType"
                      value="NONSELECTED"
                      checked={eventType === 'NONSELECTED'}
                      onChange={() => setEventType('NONSELECTED')}
                    />
                    <span className="ml-2">明曦观点</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="eventType"
                      value="SELECTED"
                      checked={eventType === 'SELECTED'}
                      onChange={() => setEventType('SELECTED')}
                      disabled={selectedLimitReached && eventType !== 'SELECTED'}
                    />
                    <span className="ml-2">最新资讯</span>
                    {selectedLimitReached && eventType !== 'SELECTED' && (
                      <span className="ml-2 text-xs text-red-500">（最多只能有3个）</span>
                    )}
                  </label>
                </div>
                
                {/* 图片上传部分 */}
                <div className="w-2/3">
                  <label className="block text-m font-medium mb-2">
                    封面图片
                    {eventType === 'SELECTED' && <span className="text-red-500"> *</span>}
                    {eventType === 'NONSELECTED' && <span className="text-gray-500"> (可选)</span>}
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center w-64 h-40 hover:border-indigo-500 transition-colors">
                      {croppedImage ? (
                        <div className="relative w-full h-full">
                          <Image 
                            src={croppedImage} 
                            alt="上传的图片" 
                            fill 
                            style={{ objectFit: 'contain' }} 
                          />
                        </div>
                      ) : (
                        <>
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">点击上传图片</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        onChange={handleImageUpload}
                        style={{ pointerEvents: 'auto' }}
                      />
                    </div>
                    
                    {(originalImage || croppedImage) && (
                      <button 
                        type="button"
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                        onClick={handleReCrop}
                      >
                        重新裁剪
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
           
            <section>
            <h2 className="text-m leading-snug text-slate-800 dark:text-slate-100 mb-4">内容编辑 <span className="text-red-500"> *</span></h2>
              <div className="w-3/4">
                <ReactTextEditor
                  ref={editorRef}
                  onChange={(newContent) => setContent(newContent)}
                  value={content}
                />
              </div>
              
              {/* 添加内容预览组件 */}
              <ContentPreview content={content} />        

              {errorMessage && <div className="text-red-500 mt-2 ">{errorMessage}</div>}
              <div className="flex space-x-4 mt-6">
                <button
                  className={`btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm text-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '提交中...' : eventData ? '更新' : '上传'}
                </button>
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                  </div>
                )}                    
                {eventData && (
                  <button
                    className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm text-slate-600 dark:text-slate-300"
                    onClick={() => router.push('/dashboard/events/list')}
                    type="button"
                  >
                    取消
                  </button>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {/* 图片裁剪模态框 */}
      {showCropModal && originalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h3 className="text-lg font-medium mb-4">裁剪图片</h3>
            <div className="mb-4 overflow-auto max-h-[60vh]">
              <div className="max-w-full inline-block">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={16 / 9}
                >
                  <img
                    ref={imgRef}
                    src={originalImage}
                    alt="待裁剪的图片"
                    className="max-w-full"
                    style={{ maxHeight: '50vh' }}
                  />
                </ReactCrop>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setShowCropModal(false)}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                onClick={handleCropComplete}
              >
                确认裁剪
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}