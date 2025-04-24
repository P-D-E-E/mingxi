import React from 'react';

const MingxiLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      <span className="text-white text-4xl mr-2">Mingxi</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        
         
      </svg>
    </div>
  );
};

export default MingxiLogo;