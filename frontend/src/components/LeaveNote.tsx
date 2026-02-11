import React, { useState, useEffect, useRef } from 'react';
import type { NoteSubmission } from '../types';

interface LeaveNoteProps {
  isOpen: boolean;
  onClose: () => void;
  triggerButtonRef?: React.RefObject<HTMLButtonElement>;
}

const LeaveNote: React.FC<LeaveNoteProps> = ({ isOpen, onClose, triggerButtonRef }) => {
  const [formData, setFormData] = useState<NoteSubmission>({
    name: '',
    email: '',
    message: '',
    contactInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  const apply_field_focus = (element: HTMLInputElement | HTMLTextAreaElement) => {
    element.style.boxShadow = 'inset 7px 7px 14px var(--shadow-dark), inset -7px -7px 14px var(--shadow-light)';
  };

  const apply_field_blur = (element: HTMLInputElement | HTMLTextAreaElement) => {
    element.style.boxShadow = 'var(--shadow-button-inset)';
  };

  // Submit note form to API
  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leave-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '', contactInfo: '' });
        
        // Auto-close modal after success
        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to submit note');
      }
    } catch (error) {
      console.error('Error submitting note:', error);
      setIsSubmitting(false);
      alert('Failed to submit note. Please try again.');
    }
  };

  // Update form field values
  const handle_change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle ESC key to close modal
  const handle_key_down = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isSubmitting) {
      onClose();
    }
  };

  // Focus trap: Keep focus within modal
  const handle_tab_key = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Focus management: Focus first element when modal opens, return focus when closes
  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element when modal opens
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    } else {
      // Return focus to trigger button when modal closes
      triggerButtonRef?.current?.focus();
    }
  }, [isOpen, triggerButtonRef]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className="backdrop-blur-xl border rounded-xl xs:rounded-2xl w-full max-w-[calc(100vw-1rem)] xs:max-w-sm sm:max-w-md md:max-w-lg p-4 xs:p-5 sm:p-6 relative"
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
        {/* Close button */}
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
          className="absolute top-4 right-4 transition-colors focus:outline-none rounded-lg p-1"
          style={{
            color: 'var(--text-secondary)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-button)',
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-card)',
                  color: 'var(--text-primary)',
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h2 id="modal-title" className="text-xl font-semibold text-[var(--text-primary)] mb-2">Leave a Note</h2>
              <p id="modal-description" className="text-sm text-[var(--text-secondary)]">Share your thoughts or get in touch!</p>
            </div>

            {/* Form */}
            <form onSubmit={handle_submit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handle_change}
                  required
                  className="w-full text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-lg px-4 py-3 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--input-bg)',
                    boxShadow: 'var(--shadow-button-inset)',
                  }}
                  onFocus={(e) => apply_field_focus(e.currentTarget)}
                  onBlur={(e) => apply_field_blur(e.currentTarget)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handle_change}
                  required
                  className="w-full text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-lg px-4 py-3 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--input-bg)',
                    boxShadow: 'var(--shadow-button-inset)',
                  }}
                  onFocus={(e) => apply_field_focus(e.currentTarget)}
                  onBlur={(e) => apply_field_blur(e.currentTarget)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handle_change}
                  required
                  rows={4}
                  className="w-full text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 resize-none"
                  style={{
                    background: 'var(--input-bg)',
                    boxShadow: 'var(--shadow-button-inset)',
                  }}
                  onFocus={(e) => apply_field_focus(e.currentTarget)}
                  onBlur={(e) => apply_field_blur(e.currentTarget)}
                  placeholder="Your message..."
                />
              </div>

              <div>
                <label htmlFor="contactInfo" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Additional Contact Info
                </label>
                <input
                  type="text"
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo || ''}
                  onChange={handle_change}
                  className="w-full text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-lg px-4 py-3 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--input-bg)',
                    boxShadow: 'var(--shadow-button-inset)',
                  }}
                  onFocus={(e) => apply_field_focus(e.currentTarget)}
                  onBlur={(e) => apply_field_blur(e.currentTarget)}
                  placeholder="Phone, LinkedIn, etc. (optional)"
                />
              </div>

              <button
                ref={lastFocusableRef}
                type="submit"
                disabled={isSubmitting}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send Note</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success message */
          <div className="text-center py-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-card)',
                color: 'var(--text-primary)',
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Message Sent!</h3>
            <p className="text-sm text-[var(--text-secondary)]">Thank you for your note. I'll get back to you soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveNote;
