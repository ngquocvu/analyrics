import axios from 'axios';
import { apiDebugger } from './debug';

const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN || '';

interface GeniusSong {
    id: number;
    title: string;
    artist: string;
    imageUrl: string;
    url: string;
}

export const searchSongs = async (query: string): Promise<GeniusSong[]> => {
    if (!GENIUS_ACCESS_TOKEN) {
        apiDebugger.log('warn', 'Genius', 'API token not found, using mock data');
        return [
            {
                id: 1,
                title: "Mock Song",
                artist: "Mock Artist",
                imageUrl: "https://via.placeholder.com/300",
                url: "https://genius.com/mock-song-lyrics"
            }
        ];
    }

    try {
        // 🔍 Debug-friendly API call wrapper
        const response = await apiDebugger.wrapAPICall(
            'Genius',
            'https://api.genius.com/search',
            async () => {
                return await axios.get('https://api.genius.com/search', {
                    headers: {
                        'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`
                    },
                    params: { q: query }
                });
            },
            { q: query }
        );

        const songs = response.data.response.hits.map((hit: any) => ({
            id: hit.result.id,
            title: hit.result.title,
            artist: hit.result.primary_artist.name,
            imageUrl: hit.result.song_art_image_url,
            url: hit.result.url
        }));

        apiDebugger.log('info', 'Genius', `Found ${songs.length} songs`);
        return songs;
    } catch (error) {
        apiDebugger.log('error', 'Genius', 'Search failed', error);
        return [];
    }
};
