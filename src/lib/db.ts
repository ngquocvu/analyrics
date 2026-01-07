import { getDb } from './firebase';
import type { AnalysisResult } from './ai';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Database model for analyzed songs stored in Firestore
 */
export interface AnalyzedSong {
    id: string; // Firestore document ID
    cacheKey: string; // Normalized "title-artist" key for lookup
    song: {
        id: string;
        title: string;
        artist: string;
        imageUrl: string;
    };
    analysis: AnalysisResult;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Generate a consistent cache key from song title and artist
 * Normalizes the key by converting to lowercase and removing special characters
 */
export function generateCacheKey(title: string, artist: string): string {
    const normalize = (str: string) =>
        str
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '-'); // Replace spaces with hyphens

    return `${normalize(title)}_${normalize(artist)}`;
}

/**
 * Save analyzed song to Firestore
 * @param song - Song metadata
 * @param analysis - AI-generated analysis results
 * @returns The saved document ID
 */
export async function saveAnalyzedSong(
    song: { id: string; title: string; artist: string; imageUrl: string },
    analysis: AnalysisResult
): Promise<string> {
    try {
        const db = getDb();
        const cacheKey = generateCacheKey(song.title, song.artist);
        const now = Timestamp.now();

        const docData: Omit<AnalyzedSong, 'id'> = {
            cacheKey,
            song,
            analysis,
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await db.collection('analyzedSongs').add(docData);
        console.log(`✅ Saved analysis to database for: ${song.title} by ${song.artist}`);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error saving analyzed song to database:', error);
        throw error;
    }
}

/**
 * Retrieve analyzed song from Firestore by cache key
 * @param title - Song title
 * @param artist - Artist name
 * @returns The analyzed song document or null if not found
 */
export async function getAnalyzedSong(
    title: string,
    artist: string
): Promise<AnalysisResult | null> {
    try {
        const db = getDb();
        const cacheKey = generateCacheKey(title, artist);

        const snapshot = await db
            .collection('analyzedSongs')
            .where('cacheKey', '==', cacheKey)
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log(`ℹ️ No cached analysis found for: ${title} by ${artist}`);
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data() as Omit<AnalyzedSong, 'id'>;

        console.log(`✅ Found cached analysis in database for: ${title} by ${artist}`);
        return data.analysis;
    } catch (error) {
        console.error('❌ Error retrieving analyzed song from database:', error);
        // Return null instead of throwing to allow fallback to AI generation
        return null;
    }
}

/**
 * List recently analyzed songs (optional utility function)
 * @param limit - Maximum number of songs to retrieve
 * @returns Array of analyzed songs
 */
export async function listRecentAnalyzedSongs(limit = 10): Promise<AnalyzedSong[]> {
    try {
        const db = getDb();
        const snapshot = await db
            .collection('analyzedSongs')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<AnalyzedSong, 'id'>),
        }));
    } catch (error) {
        console.error('❌ Error listing recent analyzed songs:', error);
        return [];
    }
}
