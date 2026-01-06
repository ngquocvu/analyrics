import { motion, useReducedMotion } from 'framer-motion';
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
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -4 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={() => onSelect(song)}
            className="relative group cursor-pointer overflow-hidden rounded-2xl"
            style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
        >
            {/* Enhanced gradient border glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>

            {/* Card content with enhanced glass effect */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 group-active:scale-[0.98] transition-all duration-300 p-4 rounded-2xl flex items-center gap-4 h-full shadow-xl group-hover:shadow-2xl">
                {/* Album art with enhanced presentation */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500 shimmer-effect">
                    <Image
                        src={song.imageUrl}
                        alt={song.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        unoptimized
                    />

                    {/* Enhanced play overlay */}
                    {song.previewUrl && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                            <Play size={28} className="text-white drop-shadow-2xl transform group-hover:scale-110 transition-transform" fill="white" />
                        </div>
                    )}

                    {/* Enhanced preview badge */}
                    {song.previewUrl && (
                        <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white text-[9px] font-bold rounded shadow-lg border border-white/30 backdrop-blur-sm">
                            PREVIEW
                        </div>
                    )}
                </div>

                {/* Song info with better contrast */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-white/90 group-hover:text-white truncate transition-colors duration-300 drop-shadow-sm">
                        {song.title}
                    </h3>
                    <p className="text-neutral-400 text-sm truncate group-hover:text-white/80 transition-colors duration-300">
                        {song.artist}
                    </p>
                </div>

                {/* Enhanced chevron indicator */}
                <div className="text-neutral-600 group-hover:text-white transition-all duration-300 opacity-30 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 drop-shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
}
