import React from 'react';

interface StatusBarProps {
  isConnected?: boolean;
  status?: string;
  liveStatus?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ isConnected = true, status = "Connected", liveStatus }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 xs:p-3 sm:p-4 md:p-6 flex justify-center items-center z-10">
      <div
        className="backdrop-blur-md rounded-full px-2.5 xs:px-3 sm:px-4 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 text-[9px] xs:text-xs sm:text-sm shadow-lg flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 max-w-[calc(100vw-1rem)] xs:max-w-[calc(100vw-1.5rem)]"
        style={{
          background: 'rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--status-border)',
          color: 'var(--text-secondary)',
        }}
      >
        <div className={`w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{status}</span>
        {liveStatus && (
          <>
            <span className="hidden md:inline" style={{ opacity: 0.65 }}>|</span>
            <span className="hidden md:inline font-medium truncate" style={{ color: 'var(--text-primary)' }}>{liveStatus}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
