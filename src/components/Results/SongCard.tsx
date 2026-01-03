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
            whileHover={{ scale: 1.05, rotate: -1 }}
            onClick={() => onSelect(song)}
            className="glass-panel p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-4 group"
        >
            <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 shadow-lg group-hover:shadow-[--neon-cyan]/50 transition-shadow group">
                <Image
                    src={song.imageUrl}
                    alt={song.title}
                    fill
                    className="object-cover"
                    unoptimized
                />
                {song.previewUrl && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={24} className="text-white" fill="white" />
                    </div>
                )}
                {song.previewUrl && (
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded">
                        30s
                    </div>
                )}
            </div>
            <div className="overflow-hidden">
                <h3 className="font-bold text-lg text-white truncate group-hover:text-[--neon-cyan] transition-colors">{song.title}</h3>
                <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
            </div>
        </motion.div>
    );
}
