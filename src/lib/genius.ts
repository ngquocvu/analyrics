import axios from 'axios';

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
        console.warn("GENIUS_ACCESS_TOKEN not found, using mock data");
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
        const response = await axios.get('https://api.genius.com/search', {
            headers: {
                'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`
            },
            params: { q: query }
        });

        return response.data.response.hits.map((hit: any) => ({
            id: hit.result.id,
            title: hit.result.title,
            artist: hit.result.primary_artist.name,
            imageUrl: hit.result.song_art_image_url,
            url: hit.result.url
        }));
    } catch (error) {
        console.error("Genius API Error:", error);
        return [];
    }
};
