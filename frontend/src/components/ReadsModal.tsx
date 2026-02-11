import React, { useEffect, useRef } from 'react';
import { BookOpen, BookMarked, X } from 'lucide-react';
import type { ReadItem } from '../types';
import { currently_reading, read } from '../data/reads';

interface ReadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerButtonRef?: React.RefObject<HTMLButtonElement>;
}

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

const ReadsModal: React.FC<ReadsModalProps> = ({ isOpen, onClose, triggerButtonRef }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const handle_key_down = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handle_tab_key = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    } else {
      triggerButtonRef?.current?.focus();
    }
  }, [isOpen, triggerButtonRef]);

  if (!isOpen) return null;

  const hasCurrent = currently_reading.length > 0;
  const hasRead = read.length > 0;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reads-modal-title"
    >
      <div 
        ref={modalRef}
        className="backdrop-blur-xl border rounded-xl xs:rounded-2xl w-full max-w-[calc(100vw-1rem)] xs:max-w-sm sm:max-w-md md:max-w-lg p-4 xs:p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--surface-contrast)',
          boxShadow: 'var(--shadow-strong)',
        }}
        onKeyDown={(e) => {
          handle_key_down(e);
          handle_tab_key(e);
        }}
      >
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 transition-colors focus:outline-none rounded-lg p-1"
          style={{
            color: 'var(--text-secondary)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-button)',
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
            style={{
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <BookOpen className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
          </div>
          <h2 id="reads-modal-title" className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Reads</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>What I'm reading and what I've read</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
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

          {!hasCurrent && !hasRead && (
            <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>No reads listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadsModal;
