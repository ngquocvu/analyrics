import axios from 'axios';
import { apiDebugger } from './debug';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';

export interface SpotifyTrack {
    id: string;
    title: string;
    artist: string;
    imageUrl: string;
    album: string;
    previewUrl?: string | null;
    spotifyUrl: string;
}

let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        throw new Error('Spotify credentials not configured');
    }

    try {
        const response = await apiDebugger.wrapAPICall(
            'Spotify',
            'https://accounts.spotify.com/api/token',
            async () => {
                return await axios.post(
                    'https://accounts.spotify.com/api/token',
                    'grant_type=client_credentials',
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
                        }
                    }
                );
            },
            { grant_type: 'client_credentials' }
        );

        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 min before expiry

        if (!accessToken) {
            apiDebugger.log('error', 'Spotify', 'No access token received');
            throw new Error('Failed to receive access token from Spotify');
        }

        apiDebugger.log('info', 'Spotify', 'Access token obtained');
        return accessToken;
    } catch (error) {
        apiDebugger.log('error', 'Spotify', 'Token error', error);
        throw new Error('Failed to get Spotify access token');
    }
}

/**
 * Search for tracks on Spotify
 */
export const searchTracks = async (query: string): Promise<SpotifyTrack[]> => {
    try {
        const token = await getAccessToken();

        // 🔍 Debug-friendly API call wrapper
        const response = await apiDebugger.wrapAPICall(
            'Spotify',
            'https://api.spotify.com/v1/search',
            async () => {
                return await axios.get('https://api.spotify.com/v1/search', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        q: query,
                        type: 'track',
                        limit: 10
                    }
                });
            },
            { q: query, type: 'track', limit: 10 }
        );

        const tracks = response.data.tracks.items.map((track: any) => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map((a: any) => a.name).join(', '),
            imageUrl: track.album.images[0]?.url || 'https://via.placeholder.com/300',
            album: track.album.name,
            previewUrl: track.preview_url,
            spotifyUrl: track.external_urls.spotify,
        }));

        apiDebugger.log('info', 'Spotify', `Found ${tracks.length} tracks`);
        return tracks;
    } catch (error) {
        apiDebugger.log('error', 'Spotify', 'Search failed', error);
        throw new Error('Failed to search Spotify');
    }
};
