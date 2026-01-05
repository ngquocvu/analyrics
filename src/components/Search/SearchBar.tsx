"use client";

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const shouldReduceMotion = useReducedMotion();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) onSearch(query);
    };

    return (
        <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                duration: shouldReduceMotion ? 0.2 : 0.5,
                type: shouldReduceMotion ? 'tween' : 'spring'
            }}
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl mx-auto"
        >
            <div className="relative group">
                {/* Animated gradient glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-white/30 to-white/10 rounded-full blur opacity-25 group-hover:opacity-75 group-focus-within:opacity-100 transition-all duration-500 animate-gradient-x"></div>

                {/* Search bar */}
                <div className="relative flex items-center bg-neutral-900/90 backdrop-blur-xl rounded-full border border-neutral-800 focus-within:border-white/50 transition-all shadow-2xl">
                    <Search className="w-5 h-5 ml-5 text-neutral-400 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm kiếm bài hát..."
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 py-4 px-4 rounded-full outline-none font-medium text-base"
                        disabled={isLoading}
                    />

                    {/* Loading spinner or keyboard hint */}
                    {isLoading ? (
                        <div className="mr-5 animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : query.length > 0 ? (
                        <div className="mr-5 px-2 py-1 bg-white/5 rounded text-xs text-white/40 font-mono">
                            ↵ Enter
                        </div>
                    ) : (
                        <div className="mr-5 px-2 py-1 bg-white/5 rounded text-xs text-white/30 font-mono">
                            ⌘K
                        </div>
                    )}
                </div>
            </div>
        </motion.form>
    );
}
