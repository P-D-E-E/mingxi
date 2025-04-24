// 创建一个新文件 event-content.tsx
// app/(dashboard)/dashboard/events/create/event-content.tsx
"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EventCreatePanel from "./event-create-panel"

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

export default function EventContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      fetch(`/api/event/${eventId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('获取事件数据失败');
          }
          return response.json();
        })
        .then(data => {
          setEventData(data.event);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('获取事件数据失败:', err);
          setError('获取事件数据失败，请重试');
          setIsLoading(false);
        });
    }
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 text-center w-full">
        {error}
      </div>
    );
  }

  return <EventCreatePanel eventData={eventData} />
}