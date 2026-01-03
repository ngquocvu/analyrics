import { NextResponse } from 'next/server';
import { generateMeaning } from '@/lib/ai';
import { searchYouTubeVideo } from '@/lib/youtube';

export async function POST(request: Request) {
    const body = await request.json();
    const { song } = body;

    if (!song) {
        return NextResponse.json({ error: 'Song data required' }, { status: 400 });
    }

    // Search for YouTube video
    const youtubeVideo = await searchYouTubeVideo(song.title, song.artist);

    // Generate Meaning - AI will search for and read lyrics from the web
    // Pass song title and artist so AI can search for accurate lyrics
    const meaning = await generateMeaning(song.title, song.artist);

    return NextResponse.json({ meaning, youtubeVideo });
}
