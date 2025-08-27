import React from 'react';

interface StatusBarProps {
  isConnected?: boolean;
  status?: string;
  liveStatus?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ isConnected = true, status = "Connected", liveStatus }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center items-center z-10">
      <div className="bg-black/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-sm text-white/80 shadow-lg flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span className="font-medium">{status}</span>
        {liveStatus && (
          <>
            <span className="text-white/60">|</span>
            <span className="font-medium">{liveStatus}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
