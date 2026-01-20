import React from 'react';

interface StatusBarProps {
  isConnected?: boolean;
  status?: string;
  liveStatus?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ isConnected = true, status = "Connected", liveStatus }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center items-center z-10">
      <div
        className="backdrop-blur-md rounded-full px-6 py-3 text-sm shadow-lg flex items-center space-x-3"
        style={{
          background: 'rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--status-border)',
          color: 'var(--text-secondary)',
        }}
      >
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{status}</span>
        {liveStatus && (
          <>
            <span style={{ opacity: 0.65 }}>|</span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{liveStatus}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
