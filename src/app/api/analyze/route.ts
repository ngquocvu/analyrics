import { NextResponse } from 'next/server';
import { generateMeaning } from '@/lib/ai';
import { searchYouTubeVideo } from '@/lib/youtube';

export async function POST(request: Request) {
    const body = await request.json();
    const { song } = body;

    if (!song) {
        return NextResponse.json({ error: 'Song data required' }, { status: 400 });
    }

    // Search for YouTube video - don't let this fail the entire analysis
    let youtubeVideo = null;
    try {
        youtubeVideo = await searchYouTubeVideo(song.title, song.artist);
    } catch (error) {
        console.error('YouTube API failed:', error);
        // Set error flag to indicate YouTube is unavailable
        youtubeVideo = { error: true };
    }

    // If searchYouTubeVideo returns null, also mark as error
    if (!youtubeVideo) {
        youtubeVideo = { error: true };
    }

    // Generate Meaning - AI will search for and read lyrics from the web
    // Pass song title and artist so AI can search for accurate lyrics
    const meaning = await generateMeaning(song.title, song.artist);

    return NextResponse.json({ meaning, youtubeVideo });
}
