"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, ExternalLink } from 'lucide-react';

interface AudioPlayerProps {
    previewUrl?: string | null;
    spotifyUrl: string;
    songTitle: string;
    artist: string;
}

export default function AudioPlayer({ previewUrl, spotifyUrl, songTitle, artist }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const time = parseFloat(e.target.value);
        audio.currentTime = time;
        setCurrentTime(time);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!previewUrl) {
        // No preview available - show Spotify link only
        return (
            <motion.a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1DB954] text-white font-bold rounded-full hover:bg-[#1ed760] transition-colors shadow-lg"
            >
                <ExternalLink size={20} />
                Nghe trên Spotify
            </motion.a>
        );
    }

    return (
        <div className="w-full bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
            <audio ref={audioRef} src={previewUrl} preload="metadata" />

            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Play/Pause Button */}
                <motion.button
                    onClick={togglePlay}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg flex-shrink-0"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </motion.button>

                <div className="flex-1 w-full space-y-2 min-w-0">
                    {/* Song Info */}
                    <div className="flex items-center justify-between text-sm gap-2">
                        <div className="flex-1 min-w-0 max-w-md">
                            <p className="text-white font-medium truncate" title={songTitle}>{songTitle}</p>
                            <p className="text-white/60 text-xs truncate" title={artist}>{artist}</p>
                        </div>
                        <span className="text-xs text-white/40 flex-shrink-0">Preview 30s</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-white/60 w-10 text-right">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-1 h-1 bg-white/20 rounded-full outline-none appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                                [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                        />
                        <span className="text-xs text-white/60 w-10">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Spotify Link */}
                <motion.a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white text-sm font-bold rounded-full hover:bg-[#1ed760] transition-colors shadow-lg flex-shrink-0"
                >
                    <ExternalLink size={16} />
                    <span className="hidden sm:inline">Full</span>
                </motion.a>
            </div>
        </div>
    );
}
