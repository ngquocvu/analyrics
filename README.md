# Lyrics Deep Dive 🎵

A Gen Z-styled app to understand the hidden meaning behind song lyrics using AI.

## 🚀 Getting Started

### 1. Prerequisites
You need API keys for the app to function fully (otherwise it uses mock data).

### 2. Get API Keys

#### **Genius API Token** (for Song Search)
1. Go to [Genius API Clients](https://genius.com/api-clients).
2. Sign up or Log in.
3. Click **"New API Client"**.
4. **App Name**: `Lyrics Deep Dive` (or anything).
5. **App Website URL**: `http://localhost:3000` (can be anything valid).
6. Click **Save**.
7. Copy the **`Client Access Token`**.

#### **Google Gemini API Key** (for Meaning Analysis)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey).
2. Click **"Create API Key"**.
3. Copy the key.

### 3. Setup Environment
Create a file named `.env.local` in the root directory and add your keys:

```bash
GENIUS_ACCESS_TOKEN=your_copied_token_here
GOOGLE_API_KEY=your_google_key_here
```

### 4. Run the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🛠 Tech Stack
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS, Framer Motion
- **AI**: Google Generative AI
- **Data**: Genius API

## ⚠️ Notes
- If you don't provide a Genius Token, the search will return **Mock Data** (fake songs) for testing the UI.
