import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen w-full bg-cg-dark flex items-center justify-center p-4">
      <div className="relative w-full max-w-[390px] h-[844px] max-h-[90vh] bg-cg-white rounded-[32px] shadow-2xl overflow-hidden border-[6px] border-gray-800 flex flex-col">
        {/* Status bar simulation */}
        <div className="bg-cg-white px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-cg-dark shrink-0 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M1 8.5C1 8.5 2.5 9.5 4 9.5C5.5 9.5 7 8.5 7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4 9.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="4" cy="1.5" r="1" fill="currentColor"/>
              <path d="M9 10.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 7.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11 4.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 1.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <rect x="0.5" y="0.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1"/>
              <rect x="2" y="2" width="9.5" height="6" rx="0.5" fill="currentColor"/>
            </svg>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
        
        {/* Home indicator */}
        <div className="bg-cg-white pb-2 pt-1 flex justify-center shrink-0">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
