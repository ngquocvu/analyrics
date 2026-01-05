"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Quote, Zap, Code, ChevronDown, ChevronUp, Music2 } from 'lucide-react';
import type { AnalysisResult } from '@/lib/ai';
import Image from 'next/image';
import AudioPlayer from '@/components/Audio/AudioPlayer';

interface MeaningRevealProps {
    meaning: AnalysisResult | string | null;
    isLoading: boolean;
    onClose: () => void;
    song: any;
    youtubeVideo?: any;
}

export default function MeaningReveal({ meaning, isLoading, onClose, song, youtubeVideo }: MeaningRevealProps) {
    const videoRef = useRef<HTMLDivElement>(null);

    const scrollToVideo = () => {
        videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a subtle highlight effect
        videoRef.current?.classList.add('ring-2', 'ring-pink-400', 'ring-opacity-50');
        setTimeout(() => {
            videoRef.current?.classList.remove('ring-2', 'ring-pink-400', 'ring-opacity-50');
        }, 2000);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 min-h-[60vh] relative z-20">
                {/* Enhanced multi-layer spinner */}
                <motion.div className="relative">
                    {/* Outer ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 rounded-full border-4 border-white/10 border-t-[--neon-cyan]"
                    />
                    {/* Middle ring */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full border-4 border-white/10 border-t-[--neon-purple]"
                    />
                    {/* Inner ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full border-4 border-white/10 border-t-white"
                    />
                    {/* Pulsing center dot */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-gradient-to-r from-[--neon-cyan] to-[--neon-purple]"
                    />
                </motion.div>

                {/* Loading messages */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 text-center space-y-2"
                >
                    <p className="text-lg font-semibold text-white/90">
                        Đang phân tích lời bài hát...
                    </p>
                    <motion.p
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-sm text-white/50"
                    >
                        Đang tìm kiếm và giải mã ý nghĩa ✨
                    </motion.p>
                </motion.div>

                {song && (
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        {/* Blur disabled for mobile performance */}
                    </div>
                )}
            </div>
        )
    }

    // Error State
    if (typeof meaning === 'string' || !meaning) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-10 text-white z-20 relative max-w-2xl mx-auto"
            >
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-6xl mb-4">😕</div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Không tìm thấy lời bài hát</h3>
                    <p className="text-white/60 mb-6 leading-relaxed">
                        {meaning || "Rất tiếc, chúng tôi không thể phân tích bài hát này. Có thể lời bài hát chưa có sẵn hoặc hệ thống đang bận."}
                    </p>
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:shadow-lg transition-all"
                    >
                        🔍 Tìm bài khác
                    </motion.button>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full max-w-6xl mx-auto pb-20 relative z-10"
        >
            {/* Ambient Background (Apple Music Style) */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                {song && (
                    <>
                        {/* Dreamy blur effect with album art */}
                        <motion.div
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 0.3, scale: 1 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `url(${song.imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 0.6, 0.4] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-b from-black/60 via-purple-900/40 to-black/80 backdrop-blur-3xl"
                        />
                    </>
                )}
            </div>

            {/* Header: Album Art & Vibe */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12 pt-10 px-4 md:px-0">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 shrink-0"
                >
                    <Image src={song.imageUrl} alt={song.title} fill className="object-cover" />
                </motion.div>

                <div className="space-y-4 flex-1 text-center md:text-left">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        className="flex flex-wrap gap-3 overflow-hidden justify-center md:justify-start"
                    >
                        <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm uppercase tracking-widest shadow-lg overflow-hidden max-w-xs sm:max-w-md">
                            <div className="flex whitespace-nowrap animate-marquee">
                                <span className="inline-block px-2">VIBE: {meaning.vibe}</span>
                                <span className="inline-block px-2">VIBE: {meaning.vibe}</span>
                            </div>
                        </div>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg break-words">
                        {song.title}
                    </h1>
                    <h2 className="text-2xl text-white/60 font-medium truncate" title={song.artist}>{song.artist}</h2>

                    {/* Play Video Button */}
                    {youtubeVideo && (
                        <motion.button
                            onClick={scrollToVideo}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-4 mx-auto md:mx-0 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 transition-all backdrop-blur-sm border border-red-500/20"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                            <span>Xem Video</span>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Core Message - Full Width */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-4 md:px-0 mb-8"
            >
                <div className="p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex items-start gap-3">
                        <Quote className="text-white/40 shrink-0 mt-1" size={20} />
                        <div>
                            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Thông điệp cốt lõi</h3>
                            <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                                "{meaning.coreMessage}"
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-0">

                {/* Left Column: Analysis (8 cols) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Overview Box */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <Sparkles className="text-yellow-400" size={20} /> Tổng Quan
                        </h3>
                        <p className="text-gray-200 text-lg leading-relaxed">{meaning.overview}</p>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
                        <Music2 className="text-pink-400" size={22} /> Phân tích chi tiết
                    </h3>

                    {/* Analysis Cards with Expandable Lyrics */}
                    {meaning.analysis.map((item, idx) => (
                        <AnalysisCard key={idx} item={item} idx={idx} />
                    ))}
                </div>

                {/* Right Column: YouTube + Full Lyrics + Slang/Metaphors (4 cols) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-10 space-y-6">

                        {/* YouTube Video Player - Compact */}
                        {youtubeVideo && (
                            <motion.div
                                ref={videoRef}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
                            >
                                <div className="aspect-video">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${youtubeVideo.videoId}?rel=0`}
                                        title={youtubeVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="px-3 py-2 bg-black/30">
                                    <p className="text-white/50 text-xs truncate">{youtubeVideo.channelTitle}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Full Lyrics Section */}
                        {meaning.fullLyrics && (
                            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Music2 className="text-purple-400" size={20} /> Lời bài hát đầy đủ
                                </h3>
                                <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                    <pre className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                        {meaning.fullLyrics}
                                    </pre>
                                </div>
                            </div>
                        )}

                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Zap className="text-cyan-400" size={22} /> Giải mã Slang
                        </h3>

                        {meaning.metaphors.map((meta, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className="group bg-black/20 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors"
                            >
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">KEYWORD</p>
                                <p className="text-xl font-bold text-white mb-1">"{meta.phrase}"</p>
                                <p className="text-white/70 text-sm leading-relaxed">{meta.meaning}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>



            {/* Footer Action */}
            <div className="mt-20 text-center">
                <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-black font-bold text-sm sm:text-base rounded-full transition-all shadow-xl shadow-white/20 hover:shadow-2xl hover:shadow-white/30"
                >
                    🎵 Phân tích bài khác
                </motion.button>
            </div>

        </motion.div>
    );
}


// Sub-component for individual expandable analysis cards
function AnalysisCard({ item, idx }: { item: any; idx: number }) {
    const [showLyrics, setShowLyrics] = useState(false);
    const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);

    // Karaoke animation disabled for mobile performance
    // useEffect(() => {
    //     if (showLyrics && item.lyricsQuote) {
    //         const words = item.lyricsQuote.split(' ');
    //         let currentIndex = 0;

    //         const interval = setInterval(() => {
    //             setHighlightedWordIndex(currentIndex);
    //             currentIndex++;

    //             if (currentIndex >= words.length) {
    //                 clearInterval(interval);
    //                 setTimeout(() => setHighlightedWordIndex(-1), 500);
    //             }
    //         }, 250);

    //         return () => clearInterval(interval);
    //     } else {
    //         setHighlightedWordIndex(-1);
    //     }
    // }, [showLyrics, item.lyricsQuote]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
        >
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                    <h4 className="text-pink-300 font-bold text-lg uppercase tracking-wider">{item.section}</h4>
                </div>

                <p className="text-gray-100 text-lg leading-relaxed mb-6">
                    {item.content}
                </p>

                {/* Lyrics Toggle */}
                {item.lyricsQuote && (
                    <div className="border-t border-white/10 pt-4">
                        <button
                            onClick={() => setShowLyrics(!showLyrics)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                            {showLyrics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {showLyrics ? "Ẩn lời bài hát" : "Xem lời bài hát"}
                        </button>

                        <AnimatePresence>
                            {showLyrics && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-3 p-4 bg-black/30 rounded-xl border-l-2 border-pink-400/30 shadow-lg max-h-64 overflow-y-auto">
                                        <pre className="text-base text-gray-300 leading-relaxed italic whitespace-pre-wrap font-sans">
                                            "{item.lyricsQuote}"
                                        </pre>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
