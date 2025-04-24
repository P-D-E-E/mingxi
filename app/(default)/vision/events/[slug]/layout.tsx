import { ReactNode } from 'react';

export default function EventLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-8xl mx-auto px-4 relative">
      {children}
    </div>
  )
}