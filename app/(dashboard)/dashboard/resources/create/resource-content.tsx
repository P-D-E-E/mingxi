
// 创建一个新文件 resource-content.tsx
// app/(dashboard)/dashboard/resources/create/resource-content.tsx
"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResourceCreatePanel from "./resource-create-panel"

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

export default function ResourceContent() {
  const searchParams = useSearchParams();
  const resourceDataParam = searchParams.get('resourceData');
  const [resourceData, setResourceData] = useState<Resource | null>(null);
  
  useEffect(() => {
    if (resourceDataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(resourceDataParam));
        console.log("页面解析到的资源数据:", parsedData);
        setResourceData(parsedData);
      } catch (error) {
        console.error('解析资源数据失败:', error);
      }
    }
  }, [resourceDataParam]);

  return <ResourceCreatePanel resourceData={resourceData} />
}