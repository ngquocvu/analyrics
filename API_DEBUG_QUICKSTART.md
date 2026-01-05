# API Debugging Configuration

All external API integrations (YouTube, Spotify, Genius) are now configured with comprehensive debugging support.

## ✅ What's Been Configured

1. **VS Code Launch Configurations** (`.vscode/launch.json`)
   - Server-side debugging
   - Client-side debugging
   - Full-stack debugging
   - Attach to running server

2. **API Debug Utility** (`src/lib/debug.ts`)
   - Request/response logging with timing
   - Automatic secret sanitization
   - Color-coded console output
   - Breakpoint-friendly wrapper functions

3. **Enhanced API Files**
   - `src/lib/youtube.ts` - YouTube API with debugging
   - `src/lib/spotify.ts` - Spotify API with debugging
   - `src/lib/genius.ts` - Genius API with debugging

4. **NPM Scripts**
   - `npm run dev` - Normal development
   - `npm run dev:debug` - Development with Node inspector

## 🚀 Quick Start Guide

### Method 1: VS Code Debugger (Easiest)

1. **Open Run and Debug panel**: Press `Cmd+Shift+D` (or View → Run)
2. **Select configuration**: Choose "Next.js: debug full stack"
3. **Start debugging**: Press `F5` or click green play button
4. **Set breakpoints**: Click left of line numbers in your API files
5. **Trigger API call**: Use your app to make an API request
6. **Step through code**: Use F10 (step over), F11 (step into)

### Method 2: Enhanced Logging

Just run your dev server normally:
```bash
npm run dev
```

You'll see detailed, color-coded logs like:
```
🔵 [YouTube] API Request
📍 Endpoint: https://www.googleapis.com/youtube/v3/search
📋 Params: { q: "Imagine Dragons Believer official", maxResults: 5 }

🟢 [YouTube] API Response (234ms)
📦 Data: { items: [...] }
⏱️ Duration: 234ms
```

### Method 3: Chrome DevTools

```bash
npm run dev:debug
```

Then open Chrome and navigate to `chrome://inspect`, click "inspect".

## 🎯 Debugging Tips

### Finding API Breakpoints

Look for these 🔍 comments in the code:
- `src/lib/youtube.ts` - Line ~27
- `src/lib/spotify.ts` - Line ~63
- `src/lib/genius.ts` - Line ~26

### Viewing API Responses

In VS Code debugger, hover over variables or add them to the Watch panel to inspect:
- `response` - Full API response object
- `response.data` - Response body
- `error` - Error details if request fails

### Common Debugging Scenarios

**Debug a failing YouTube search:**
1. Set breakpoint in `youtube.ts` at the `wrapAPICall` line
2. Search for a song in your app
3. Inspect the `query` variable
4. Step through the axios call
5. Check `response.data.items` to see results

**Debug Spotify authentication:**
1. Set breakpoint in `spotify.ts` at `getAccessToken` function
2. Make any Spotify request
3. Inspect `accessToken` and `tokenExpiry` variables
4. Step through the token request

## 📊 Understanding Debug Output

| Icon | Meaning | When It Appears |
|------|---------|----------------|
| 🔵 | Request Started | Before API call is made |
| 🟢 | Success | API returned successfully |
| 🔴 | Error | API call failed |
| ℹ️ | Info | General information |
| ⚠️ | Warning | Something unusual but not critical |
| 🐛 | Debug | Detailed debugging info |

## ⚙️ Configuration

### Enable/Disable Debug Logs

Debug logs are automatically enabled in development. To enable in production:

```bash
# Add to .env.local
NEXT_PUBLIC_DEBUG_API=true
```

### Customize Logging

Edit `src/lib/debug.ts` to customize:
- Log formatting
- Secret sanitization rules
- Debug output level

## 📚 Additional Resources

- [DEBUG.md](./DEBUG.md) - Full debugging documentation
- [src/lib/debug.example.ts](./src/lib/debug.example.ts) - Code examples
- [VS Code Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)

## 🔒 Security Notes

- API keys are automatically sanitized in logs (shows only first/last 4 chars)
- Sensitive headers are masked
- Debug logs respect `NODE_ENV` - won't spam production

---

**Need help?** Check the [DEBUG.md](./DEBUG.md) file for more detailed information or refer to the example file at `src/lib/debug.example.ts`.
