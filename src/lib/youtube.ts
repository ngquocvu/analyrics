import axios from 'axios';

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

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
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

        if (!response.data.items || response.data.items.length === 0) {
            return null;
        }

        // Find the best match (prefer official/lyric videos)
        const items = response.data.items;
        const officialVideo = items.find((item: any) =>
            item.snippet.title.toLowerCase().includes('official') ||
            item.snippet.title.toLowerCase().includes('lyrics')
        );

        const bestMatch = officialVideo || items[0];

        return {
            videoId: bestMatch.id.videoId,
            title: bestMatch.snippet.title,
            thumbnail: bestMatch.snippet.thumbnails.high.url,
            channelTitle: bestMatch.snippet.channelTitle
        };
    } catch (error) {
        console.error('YouTube API Error:', error);
        return null;
    }
};
