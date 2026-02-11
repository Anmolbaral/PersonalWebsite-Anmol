import React from 'react';
import { BookOpen, BookMarked } from 'lucide-react';
import type { ReadItem } from '../types';
import { currently_reading, read } from '../data/reads';

const ReadCard: React.FC<{ item: ReadItem }> = ({ item }) => {
  const content = (
    <>
      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
      {item.author && (
        <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>{item.author}</span>
      )}
      {item.note && (
        <span className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>{item.note}</span>
      )}
    </>
  );

  const cardClass = 'rounded-lg xs:rounded-xl p-3 xs:p-4 transition-all text-left flex flex-col gap-0.5';
  const cardStyle = {
    background: 'var(--surface)',
    boxShadow: 'var(--shadow-button)',
  };

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cardClass} hover:opacity-90`}
        style={cardStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={cardClass} style={cardStyle}>
      {content}
    </div>
  );
};

const ReadsSection: React.FC = () => {
  const hasCurrent = currently_reading.length > 0;
  const hasRead = read.length > 0;

  if (!hasCurrent && !hasRead) return null;

  return (
    <div
      className="w-full max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto rounded-xl xs:rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-strong)',
      }}
    >
      <div
        className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 border-b"
        style={{ borderColor: 'var(--surface-contrast)' }}
      >
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <BookOpen className="w-4 h-4 xs:w-5 xs:h-5" style={{ color: 'var(--text-primary)' }} />
          Reads
        </h2>
        <p className="text-[10px] xs:text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          What I’m reading and what I’ve read
        </p>
      </div>

      <div className="p-3 xs:p-4 sm:p-6 space-y-4 sm:space-y-6">
        {hasCurrent && (
          <div>
            <h3 className="text-xs xs:text-sm font-medium mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <BookOpen className="w-3.5 h-3.5" />
              Currently reading
            </h3>
            <div className="grid gap-2 sm:gap-3">
              {currently_reading.map((item, i) => (
                <ReadCard key={`current-${i}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {hasRead && (
          <div>
            <h3 className="text-xs xs:text-sm font-medium mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <BookMarked className="w-3.5 h-3.5" />
              Read
            </h3>
            <div className="grid gap-2 sm:gap-3">
              {read.map((item, i) => (
                <ReadCard key={`read-${i}`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadsSection;
