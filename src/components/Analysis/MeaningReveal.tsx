"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
    const shouldReduceMotion = useReducedMotion();

    const [isPlaying, setIsPlaying] = useState(false);

    const scrollToVideo = () => {
        setIsPlaying(true);
        videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a subtle highlight effect
        videoRef.current?.classList.add('ring-2', 'ring-red-400', 'ring-opacity-50');
        setTimeout(() => {
            videoRef.current?.classList.remove('ring-2', 'ring-red-400', 'ring-opacity-50');
        }, 2000);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 min-h-[60vh] relative z-20">
                {/* Optimized spinner with reduced rings on mobile */}
                <motion.div className="relative">
                    {/* Outer ring */}
                    <motion.div
                        animate={shouldReduceMotion ? {} : { rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 rounded-full border-4 border-white/10 border-t-white"
                        style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
                    />
                    {/* Middle ring - hidden on mobile */}
                    <motion.div
                        animate={shouldReduceMotion ? {} : { rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full border-4 border-white/10 border-t-white/60 hidden md:block"
                        style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
                    />
                    {/* Inner ring - hidden on mobile */}
                    <motion.div
                        animate={shouldReduceMotion ? {} : { rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full border-4 border-white/10 border-t-white/30 hidden md:block"
                        style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
                    />
                    {/* Pulsing center dot */}
                    <motion.div
                        animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white"
                        style={{ willChange: shouldReduceMotion ? 'auto' : 'transform, opacity' }}
                    />
                </motion.div>

                {/* Loading messages */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
                    className="mt-8 text-center space-y-2"
                >
                    <p className="text-lg font-semibold text-white/90">
                        Đang phân tích lời bài hát...
                    </p>
                    <motion.p
                        animate={shouldReduceMotion ? {} : { opacity: [0.4, 1, 0.4] }}
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
                <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Lượng truy cập cao</h3>
                    <p className="text-white/60 mb-6 leading-relaxed">
                        {meaning || "Rất tiếc, hệ thống đang có lượng truy cập cao. Vui lòng thử lại sau."}
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
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, type: shouldReduceMotion ? "tween" : "spring" }}
            className="w-full max-w-6xl mx-auto pb-20 relative z-10"
        >
            {/* Ambient Background (Apple Music Style) - Simplified for mobile */}
            <div className="fixed -z-10 overflow-hidden" style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
                paddingLeft: 'env(safe-area-inset-left)',
                paddingRight: 'env(safe-area-inset-right)',
                marginTop: 'calc(-1 * env(safe-area-inset-top))',
                marginBottom: 'calc(-1 * env(safe-area-inset-bottom))',
                marginLeft: 'calc(-1 * env(safe-area-inset-left))',
                marginRight: 'calc(-1 * env(safe-area-inset-right))',
            }}>
                {song && (
                    <>
                        {/* Dreamy blur effect with album art */}
                        <motion.div
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 0.3, scale: 1 }}
                            transition={{ duration: shouldReduceMotion ? 0.3 : 1.5 }}
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `url(${song.imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                willChange: shouldReduceMotion ? 'auto' : 'transform, opacity',
                            }}
                        />
                        <motion.div
                            animate={shouldReduceMotion ? {} : { opacity: [0.4, 0.6, 0.4] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-b from-black/60 via-purple-900/40 to-black/80 backdrop-blur-3xl"
                            style={{ willChange: shouldReduceMotion ? 'auto' : 'opacity' }}
                        />
                    </>
                )}
            </div>

            {/* Header: Album Art & Song Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-12 pt-6 md:pt-10 px-6 md:px-0">
                {/* Album Cover - Responsive card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full max-w-sm md:w-64 aspect-square md:aspect-auto md:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 shrink-0 group"
                >
                    <Image
                        src={song.imageUrl}
                        alt={song.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority
                    />
                    {/* Vinyl shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </motion.div>

                {/* Song Info */}
                <div className="w-full md:flex-1 space-y-4 text-center md:text-left">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex flex-wrap gap-3 justify-center md:justify-start overflow-hidden"
                    >
                        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-white/40 text-white font-bold text-xs uppercase tracking-widest shadow-lg">
                            <span className="drop-shadow-lg">VIBE: {meaning.vibe}</span>
                        </div>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg break-words">
                        {song.title}
                    </h1>
                    <h2 className="text-xl sm:text-2xl text-white/60 font-medium" title={song.artist}>{song.artist}</h2>

                    {/* Play Video Button */}
                    {youtubeVideo && !youtubeVideo.error && (
                        <motion.button
                            onClick={scrollToVideo}
                            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                            className="mt-4 inline-flex items-center gap-3 px-6 py-3 border border-white/30 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium rounded-full transition-all duration-300 shadow-lg"
                            style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span className="tracking-wide">Phát nhạc</span>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Core Message - Full Width */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
                className="px-6 md:px-0 mb-10"
            >
                <div className="p-8 md:p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
                    <div className="flex items-start gap-3">
                        <Quote className="text-purple-400/60 shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Thông điệp cốt lõi</h3>
                            <p className="text-xl md:text-xl text-white/95 font-light leading-relaxed">
                                "{meaning.coreMessage}"
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 md:px-0">

                {/* Left Column: Analysis (8 cols) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Overview Box */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
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
                                transition={{ delay: shouldReduceMotion ? 0 : 0.4 }}
                                className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group"
                            >
                                {youtubeVideo.error ? (
                                    // Error state - System overload message
                                    <div className="aspect-video relative flex items-center justify-center bg-black/50">
                                        <div className="text-center px-6">
                                            <div className="text-4xl mb-3">⏳</div>
                                            <h4 className="text-white font-bold text-lg mb-2">Hệ thống đang quá tải</h4>
                                            <p className="text-white/60 text-sm">Không thể tải video lúc này</p>
                                        </div>
                                    </div>
                                ) : (
                                    // Normal video player
                                    <>
                                        <div className="aspect-video relative">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${youtubeVideo.videoId}?rel=0${isPlaying ? '&autoplay=1' : ''}`}
                                                title={youtubeVideo.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full z-10 relative"
                                            />
                                            {!isPlaying && (
                                                <div
                                                    className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => setIsPlaying(true)}
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl pl-1">
                                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-3 py-2 bg-black/30">
                                            <p className="text-white/50 text-xs truncate">{youtubeVideo.channelTitle}</p>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}

                        {/* Full Lyrics Section */}
                        {meaning.fullLyrics && (
                            <div className="relative bg-black/30 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                                {/* Decorative corner accents */}
                                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/10 rounded-tl-3xl" />
                                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/10 rounded-br-3xl" />

                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-3 pb-3 border-b border-white/10">
                                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                            <Music2 className="text-purple-300" size={20} />
                                        </div>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
                                            Lời bài hát
                                        </span>
                                    </h3>

                                    <div className="max-h-[28rem] overflow-y-auto pr-3 lyrics-scrollbar">
                                        {/* Opening quote decoration */}
                                        <div className="flex items-start gap-3 mb-2">
                                            <Quote className="text-white/30 shrink-0 mt-1" size={24} />
                                            <div className="flex-1">
                                                <pre className="text-white/85 text-[15px] leading-[1.9] whitespace-pre-wrap font-serif tracking-wide">
                                                    {meaning.fullLyrics}
                                                </pre>
                                            </div>
                                        </div>
                                        {/* Closing quote decoration */}
                                        <div className="flex justify-end mt-2">
                                            <Quote className="text-white/30 rotate-180" size={24} />
                                        </div>
                                    </div>
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
                                transition={{ delay: shouldReduceMotion ? 0 : 0.3 + (idx * 0.1) }}
                                className="group bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-black/30 transition-colors"
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
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-black font-bold text-sm sm:text-base rounded-full transition-all shadow-xl shadow-white/20 hover:shadow-2xl hover:shadow-white/30"
                    style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
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
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : idx * 0.1 }}
            className="glass-strong rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
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
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white hover:text-white bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg"
                        >
                            {showLyrics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            <span>{showLyrics ? "Ẩn lời bài hát" : "Xem lời bài hát"}</span>
                        </button>

                        <AnimatePresence>
                            {showLyrics && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 p-5 bg-black/30 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm max-h-80 overflow-y-auto lyrics-scrollbar">
                                        {/* Quote decoration and content */}
                                        <div className="flex items-start gap-3">
                                            <Quote className="text-white/40 shrink-0 mt-1" size={20} />
                                            <div className="flex-1">
                                                <pre className="text-white/80 text-[15px] leading-[1.85] italic whitespace-pre-wrap font-serif tracking-wide mb-2">
                                                    {item.lyricsQuote}
                                                </pre>
                                            </div>
                                        </div>
                                        {/* Closing quote - moved to bottom right */}
                                        <div className="flex justify-end w-full mt-1">
                                            <Quote className="text-white/40 shrink-0 rotate-180" size={20} />
                                        </div>
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
