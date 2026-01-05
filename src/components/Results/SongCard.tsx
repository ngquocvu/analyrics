import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface Song {
    id: string;
    title: string;
    artist: string;
    imageUrl: string;
    previewUrl?: string | null;
    spotifyUrl: string;
}

interface SongCardProps {
    song: Song;
    onSelect: (song: Song) => void;
    index: number;
}

export default function SongCard({ song, onSelect, index }: SongCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(song)}
            className="relative group cursor-pointer overflow-hidden rounded-2xl"
        >
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[--neon-cyan] via-[--neon-purple] to-[--neon-cyan] rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 animate-gradient-x"></div>

            {/* Card content */}
            <div className="relative glass-panel group-hover:glass-panel-hover transition-all duration-300 p-4 rounded-2xl flex items-center gap-4 h-full">
                {/* Album art with shimmer */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:shadow-2xl group-hover:shadow-[--neon-cyan]/30 transition-all duration-300 shimmer-effect">
                    <Image
                        src={song.imageUrl}
                        alt={song.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                    />

                    {/* Play overlay */}
                    {song.previewUrl && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Play size={28} className="text-white drop-shadow-lg" fill="white" />
                        </div>
                    )}

                    {/* Preview badge */}
                    {song.previewUrl && (
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-gradient-to-r from-[--neon-purple] to-[--neon-cyan] text-white text-[9px] font-bold rounded shadow-lg">
                            PREVIEW
                        </div>
                    )}
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-white truncate transition-all duration-300">
                        {song.title}
                    </h3>
                    <p className="text-neutral-400 text-sm truncate group-hover:text-white transition-colors">
                        {song.artist}
                    </p>
                </div>

                {/* Chevron indicator */}
                <div className="text-neutral-600 group-hover:text-[--neon-cyan] transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
}
