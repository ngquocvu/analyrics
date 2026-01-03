import { NextResponse } from 'next/server';
import { searchTracks } from '@/lib/spotify';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    try {
        const songs = await searchTracks(q);
        return NextResponse.json({ songs });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
