"use client"
import { usePathname } from 'next/navigation';
import { ReactElement, useEffect, useState } from 'react';
import { LocalizationMap, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/search/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import zh_CN from '@react-pdf-viewer/locales/lib/zh_CN.json';


export default function ResourcePage() {
    const pathname = usePathname();
    const uniquefilename = pathname.split('/').filter(Boolean).pop();
    const [error, setError] = useState<string>('');
    const [resourceName, setResourceName] = useState<string>('');
    
    const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
        <Toolbar>
            {(slots: ToolbarSlot) => {
                const {
                    CurrentPageInput,
                    EnterFullScreen,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    ShowSearchPopover,
                    Zoom,
                    ZoomIn,
                    ZoomOut,
                } = slots;
                return (
                    <div
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                            width: '100%',
                            flexWrap: 'wrap',
                            gap: '4px',
                        }}
                    >
                        <div style={{ padding: '0px 2px' }}>
                            <ShowSearchPopover />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <GoToPreviousPage />
                        </div>
                        <div style={{ padding: '0px 2px', display: 'flex', alignItems: 'center' }}>
                            <div style={{     
                                width: '45px', 
                                marginRight: '8px',
                                textAlign: 'center' // 添加文本居中
                                }}>
                                <CurrentPageInput />
                            </div>
                            <span style={{ margin: '0 8px' }}>/</span>
                            <NumberOfPages />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <GoToNextPage />
                        </div>

                        <div style={{ padding: '0px 2px' }}>
                            <ZoomOut />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <Zoom />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <ZoomIn />
                        </div>
                        <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                            <EnterFullScreen />
                        </div>
                    </div>
                );
            }}
        </Toolbar>
    );

    // 在组件内部创建插件实例
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
        sidebarTabs: (defaultTabs) => [
            defaultTabs[0], 
            defaultTabs[1], 
        ],

    });

    useEffect(() => {
        if (!uniquefilename) {
            setError('文件未找到');
        }
    }, [uniquefilename]);
    
    useEffect(() => {
        const fetchResourceName = async () => {
            try {
                const response = await fetch(`/api/resource/retrieve?uniquefilename=${uniquefilename}`);
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                const data = await response.json();
                if (data && data.name) {
                    setResourceName(data.name);
                }
            } catch (error) {
            }
        };

        if (uniquefilename) {
            fetchResourceName();
        }
    }, [uniquefilename]);
    
    if (!uniquefilename) {
        return <div className="text-red-500">文件未找到</div>;
    }
    
    return (
        <div className="flex flex-col justify-center items-center container mx-auto px-4 pt-32 md:pt-36 lg:pt-40">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 lg:mb-12 text-center">{resourceName}</h1>
            <h2 className="text-lg md:text-lg lg:text-xl mb-4 text-center">作者：明曦中美研究中心</h2>
            {error && <div className="text-red-500">{error}</div>}
            
            <div className="mt-8 md:mt-12 lg:mt-[120px] border border-solid border-[rgba(0,0,0,0.3)] w-full md:w-[75%] lg:w-[55%] h-[500px] md:h-[600px] lg:h-[750px] mx-auto">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer
                        fileUrl={`/api/resource/file/${uniquefilename}`}
                        plugins={[defaultLayoutPluginInstance]}
                        localization={zh_CN as unknown as LocalizationMap}      
                    />
                </Worker>
            </div>
            
            <div className="mt-8 md:mt-12 lg:mt-16 mb-8 text-center">
                <a className="text-gray-700 hover:text-gray-400"
                   href="/resources">—— 返回资源列表 ——</a>
            </div>
        </div>
    );
}