# QA Review Report - Chat Performance Optimization

## Critical Issues Found

### 1. **CRITICAL: Race Condition with Message IDs**
**Location**: `frontend/src/App.tsx:39, 49`
**Issue**: Using `Date.now()` for message IDs can cause collisions if messages are sent rapidly (< 1ms apart)
**Impact**: Messages could overwrite each other or cause React key conflicts
**Fix Required**: Use UUID or timestamp + random component

### 2. **CRITICAL: Memory Leak - Timeout Not Cleared on Error**
**Location**: `frontend/src/App.tsx:62, 73`
**Issue**: If `fetch()` throws before response, `timeoutId` is never cleared
**Impact**: Memory leak, potential callback execution after component unmount
**Fix Required**: Use try-finally or cleanup in catch block

### 3. **CRITICAL: Stream Reader Not Released on Error**
**Location**: `frontend/src/App.tsx:89, 134`
**Issue**: If error occurs during streaming, `reader` is not released/cancelled
**Impact**: Resource leak, connection not properly closed
**Fix Required**: Add reader.releaseLock() in finally block

### 4. **CRITICAL: Break Statement Doesn't Exit Outer Loop**
**Location**: `frontend/src/App.tsx:115`
**Issue**: `break` on line 115 only exits inner `for` loop, not outer `while` loop
**Impact**: Continues reading stream even after `done: true` signal
**Fix Required**: Use flag or return to exit both loops

### 5. **MEDIUM: Empty AI Message Not Handled**
**Location**: `frontend/src/App.tsx:52`
**Issue**: If stream fails immediately, empty message remains in chat
**Impact**: Poor UX, empty message bubble displayed
**Fix Required**: Remove empty messages or show error immediately

### 6. **MEDIUM: SSE Parsing Doesn't Handle Malformed Data**
**Location**: `frontend/src/App.tsx:107`
**Issue**: JSON.parse can throw on malformed SSE data, caught but not handled
**Impact**: Silent failures, partial messages
**Fix Required**: Better error recovery or user notification

### 7. **MEDIUM: Auto-scroll Performance During Streaming**
**Location**: `frontend/src/components/ChatWindow.tsx:23-25`
**Issue**: Scrolls on every message update (every character during streaming)
**Impact**: Performance degradation, janky scrolling
**Fix Required**: Debounce scroll or only scroll on significant updates

### 8. **LOW: Context Cache Never Invalidates on File Change**
**Location**: `api/chat.ts:8-9`
**Issue**: Cache persists for 5 minutes even if context.md is updated
**Impact**: Stale data served after context updates
**Fix Required**: Consider file mtime checking or shorter TTL

### 9. **LOW: No Request Cancellation on Component Unmount**
**Location**: `frontend/src/App.tsx:37`
**Issue**: If component unmounts during streaming, request continues
**Impact**: Memory leak, state updates on unmounted component
**Fix Required**: Add cleanup in useEffect return

## Edge Cases to Test

1. **Rapid Message Sending**: Send 3 messages within 1 second
2. **Network Interruption**: Disconnect network mid-stream
3. **Server Timeout**: Trigger 60s timeout
4. **Malformed SSE**: Send invalid JSON in SSE stream
5. **Empty Response**: OpenAI returns empty content
6. **Component Unmount**: Navigate away during streaming
7. **Concurrent Requests**: Multiple tabs sending requests
8. **Very Long Response**: Response exceeds max_tokens

## Recommendations

### Immediate Fixes (Before Production)
1. Fix message ID generation (use crypto.randomUUID or Date.now() + Math.random())
2. Add proper cleanup for timeouts and readers
3. Fix break statement to exit outer loop
4. Add reader.releaseLock() in finally block

### Short-term Improvements
1. Debounce auto-scroll during streaming
2. Handle empty messages gracefully
3. Add request cancellation on unmount
4. Improve error recovery for malformed SSE

### Long-term Enhancements
1. Add file mtime checking for context cache
2. Implement request queuing to prevent race conditions
3. Add retry logic for transient failures
4. Monitor and log streaming performance metrics

## Test Cases to Execute

- [ ] Send message and verify streaming works
- [ ] Send rapid messages and verify no ID collisions
- [ ] Trigger timeout and verify proper cleanup
- [ ] Disconnect network mid-stream and verify error handling
- [ ] Send malformed data and verify graceful handling
- [ ] Unmount component during stream and verify no errors
- [ ] Verify context cache works and expires correctly
- [ ] Test with very long responses
- [ ] Test concurrent requests from multiple tabs
