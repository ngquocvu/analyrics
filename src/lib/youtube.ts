import axios from 'axios';
import { apiDebugger } from './debug';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

interface YouTubeVideo {
    videoId: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
}

/**
 * Search for YouTube videos by song title and artist
 * Prioritizes official videos and lyric videos
 */
export const searchYouTubeVideo = async (songTitle: string, artist: string): Promise<YouTubeVideo | null> => {
    if (!YOUTUBE_API_KEY) {
        console.warn('YouTube API key not configured');
        return null;
    }

    try {
        const query = `${songTitle} ${artist} official`;

        // 🔍 Debug-friendly API call wrapper
        const response = await apiDebugger.wrapAPICall(
            'YouTube',
            'https://www.googleapis.com/youtube/v3/search',
            async () => {
                return await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        q: query,
                        type: 'video',
                        maxResults: 5,
                        key: YOUTUBE_API_KEY,
                        videoEmbeddable: true,
                        videoCategoryId: '10' // Music category
                    }
                });
            },
            { q: query, maxResults: 5 }
        );

        if (!response.data.items || response.data.items.length === 0) {
            apiDebugger.log('warn', 'YouTube', 'No videos found', { query });
            return null;
        }

        const items = response.data.items;

        const bestMatch = items[0];

        apiDebugger.log('info', 'YouTube', 'Video found', {
            videoId: bestMatch.id.videoId,
            title: bestMatch.snippet.title
        });

        return {
            videoId: bestMatch.id.videoId,
            title: bestMatch.snippet.title,
            thumbnail: bestMatch.snippet.thumbnails.high.url,
            channelTitle: bestMatch.snippet.channelTitle
        };
    } catch (error) {
        apiDebugger.log('error', 'YouTube', 'API call failed', error);
        return null;
    }
};
