D# Debugging External APIs in Next.js

This project is configured with comprehensive debugging support for external API calls (YouTube, Spotify, etc.).

## Quick Start

### Option 1: VS Code Debugger (Recommended)

1. Open the **Run and Debug** panel (Cmd+Shift+D)
2. Select one of these configurations:
   - **Next.js: debug full stack** - Debug both client and server code
   - **Next.js: debug server-side** - Debug API routes and server components
   - **Next.js: debug client-side** - Debug React components in browser
3. Press F5 or click the green play button
4. Set breakpoints in your API files (e.g., `src/lib/youtube.ts`)

### Option 2: Enhanced Logging

The `apiDebugger` utility provides detailed logs for all API calls:

```bash
npm run dev
```

You'll see formatted logs like:
```
🔵 [YouTube] API Request
📍 Endpoint: https://www.googleapis.com/youtube/v3/search
📋 Params: { q: "song title artist official", maxResults: 5 }
⏰ Time: 2026-01-05T23:12:32Z

🟢 [YouTube] API Response (234ms)
📊 Status: 200
📦 Data: { ... }
⏱️ Duration: 234ms
```

### Option 3: Debug Mode with Inspector

For advanced debugging with Node.js DevTools:

```bash
npm run dev:debug
```

Then open `chrome://inspect` in Chrome and click "inspect" on your Next.js process.

## Debugging Your APIs

### Adding Debug Support to Other APIs

Import the debugger in your API files:

```typescript
import { apiDebugger } from './debug';

// Wrap API calls for automatic logging and debugging
const result = await apiDebugger.wrapAPICall(
  'ServiceName',
  'https://api.example.com/endpoint',
  async () => {
    return await fetch('https://api.example.com/endpoint');
  },
  { param1: 'value1' }
);
```

### Setting Breakpoints

1. In VS Code, click the gutter (left of line numbers) to set breakpoints
2. Look for the 🔍 comment in `youtube.ts` - this is a strategic breakpoint location
3. When the breakpoint hits, you can:
   - Inspect variables
   - Step through code (F10, F11)
   - Evaluate expressions in the Debug Console

### Environment Variables

Enable API debugging in production-like environments:

```bash
# In .env.local
NEXT_PUBLIC_DEBUG_API=true
```

## Features

- ✅ **Request/Response Logging** - See all API calls with timing
- ✅ **Secret Sanitization** - API keys are automatically masked in logs
- ✅ **Error Tracking** - Detailed error information with stack traces
- ✅ **Performance Monitoring** - Track API call duration
- ✅ **Breakpoint Support** - Step through external API calls
- ✅ **VS Code Integration** - One-click debugging

## Troubleshooting

**Breakpoints not hitting:**
- Ensure you're using the correct debug configuration
- Check that source maps are enabled (they are by default in Next.js)

**No logs appearing:**
- Verify `NODE_ENV=development` or `NEXT_PUBLIC_DEBUG_API=true`
- Check the terminal where `npm run dev` is running

**Can't attach debugger:**
- Make sure only one Next.js dev server is running
- Try `dev:debug` script which starts with `--inspect` flag
