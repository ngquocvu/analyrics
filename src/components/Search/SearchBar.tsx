"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) onSearch(query);
    };

    return (
        <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl mx-auto"
        >
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[--neon-cyan] to-[--neon-purple] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-neutral-900 rounded-full border border-neutral-800 focus-within:border-[--neon-purple] transition-colors">
                    <Search className="w-5 h-5 ml-4 text-neutral-400 group-focus-within:text-[--neon-cyan]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm kiếm bài hát..."
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 py-4 px-4 rounded-full outline-none font-medium"
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <div className="mr-4 animate-spin h-5 w-5 border-2 border-[--neon-purple] border-t-transparent rounded-full"></div>
                    )}
                </div>
            </div>
        </motion.form>
    );
}
