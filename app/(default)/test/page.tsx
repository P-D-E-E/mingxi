"use client"
import { FormEvent, useEffect, useState } from 'react'
import PostItemS from '@/components/post-item-selected'
import PostItemN from '@/components/post-item-nonselected'
import { Separator } from '@/components/ui/separator';
import { ReactTextEditor } from '@/components/RichTextEditor/rich-text-editor';
import MyComponent from '@/content/test';

export default function Test() {
    const [eventSelected, setEventSelected] = useState([]); // 创建状态来存储事件数据
    const [eventNonSelected, setEventNonSelected] = useState([]); // 创建状态来存储事件数据
    const getPostInfo = async () => {     
            const Nresponse = await fetch('/api/event?status=NONSELECTED', {  
                method: 'GET',         
                headers: {
                    'Content-Type': 'application/json',         
                },     
            });     
            const Ndata = await Nresponse.json();
            const Sresponse = await fetch('/api/event?status=SELECTED', {
                method: 'GET',         
                headers: {
                    'Content-Type': 'application/json',         
                },
            })
            const Sdata = await Sresponse.json();  

            setEventSelected(Sdata.events);
            
            setEventNonSelected(Ndata);    
            
        };
    
    useEffect(() => {         
        getPostInfo(); // 组件挂载时获取事件信息  
    }, []);

    return (
        <>
        //多个事件
        <section>
            
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pb-12 md:pb-20">
            <div className="lg:flex lg:justify-between">
                
              {/* Main content */}
              <div className="lg:grow" data-aos="fade-down" data-aos-delay="200">

                {/* Section title */}
                <h4 className="h3 font-red-hat-display mb-8">Latest</h4>


                <div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
                        <p className="text-sm text-muted-foreground">
                        An open-source UI component library.
                        </p>
                    </div>
                    <footer className="my-4" />
                    <div className="flex h-5 items-center space-x-4 text-sm">
                        <div>Blog</div>
                        <Separator orientation="vertical" />
                        <div>Docs</div>
                        <Separator orientation="vertical" />
                        <div>Source</div>
                    </div>
                    {/*<ReactTextEditor />*/}
                    
                    
                    </div>
                    
                </div>
                
                {/* Load more button */}
                <div className="flex justify-center mt-12 md:mt-16">
                  <a className="btn-sm text-gray-300 hover:text-gray-100 bg-gray-800 flex items-center" href="#0">
                    <span>See previous articles</span>
                    <svg className="w-4 h-4 shrink-0 ml-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path className="fill-current text-gray-500" d="M14.7 9.3l-1.4-1.4L9 12.2V0H7v12.2L2.7 7.9 1.3 9.3 8 16z" />
                    </svg>
                  </a>
                </div>
                
                <div className="h-6xl mt-16 lg:mt-20">
                  <MyComponent />

                </div>
                
              </div>
                  
            </div>
          </div>

      </section>
        </>
 
    );
}