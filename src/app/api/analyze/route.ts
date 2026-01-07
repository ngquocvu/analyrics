import { NextResponse } from 'next/server';
import { generateMeaning } from '@/lib/ai';
import { searchYouTubeVideo } from '@/lib/youtube';
import { getAnalyzedSong, saveAnalyzedSong } from '@/lib/db';

export async function POST(request: Request) {
    const body = await request.json();
    const { song, forceRegenerate = false } = body;

    if (!song) {
        return NextResponse.json({ error: 'Song data required' }, { status: 400 });
    }

    // TEMPORARILY HIDDEN - YouTube API call disabled
    // Search for YouTube video - don't let this fail the entire analysis
    let youtubeVideo = null;
    /* 
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
    */

    let meaning = null;
    let fromCache = false;

    // Step 1: Check if analysis exists in database (skip if force regenerate)
    if (!forceRegenerate) {
        try {
            meaning = await getAnalyzedSong(song.title, song.artist);
            if (meaning) {
                fromCache = true;
            }
        } catch (error) {
            console.error('Database lookup failed, will proceed with AI generation:', error);
        }
    } else {
        console.log(`🔄 Force regenerating analysis for: ${song.title} by ${song.artist}`);
    }

    // Step 2: If not in database or force regenerate, generate new analysis with AI
    if (!meaning) {
        // Generate Meaning - AI will search for and read lyrics from the web
        // Pass song title and artist so AI can search for accurate lyrics
        meaning = await generateMeaning(song.title, song.artist);

        // Step 3: Save the new analysis to database (this will override if exists)
        if (meaning) {
            try {
                await saveAnalyzedSong(song, meaning);
            } catch (error) {
                // Don't fail the request if database save fails
                console.error('Failed to save analysis to database:', error);
            }
        }
    }

    return NextResponse.json({ meaning, youtubeVideo, fromCache });
}
