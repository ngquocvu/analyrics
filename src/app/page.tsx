"use client";

import { useState } from 'react';
import SearchBar from '@/components/Search/SearchBar';
import SongCard from '@/components/Results/SongCard';
import MeaningReveal from '@/components/Analysis/MeaningReveal';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [songs, setSongs] = useState<any[]>([]);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [meaning, setMeaning] = useState<any>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSongs([]);
    setSelectedSong(null);
    setMeaning(null);
    setYoutubeVideo(null);
    try {
      const res = await axios.get('/api/search', { params: { q: query } });
      setSongs(res.data.songs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSong = async (song: any) => {
    setSelectedSong(song);
    setAnalyzing(true);
    setMeaning(null);
    setYoutubeVideo(null);

    try {
      const res = await axios.post('/api/analyze', { song });
      setMeaning(res.data.meaning);
      setYoutubeVideo(res.data.youtubeVideo);
    } catch (e) {
      setMeaning("Lỗi khi phân tích. Vui lòng kiểm tra lại API Key.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedSong(null);
    setMeaning(null);
    setYoutubeVideo(null);
  }

  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden bg-[#050505]">

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[--neon-purple] rounded-full blur-[180px] opacity-15 animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[--neon-cyan] rounded-full blur-[180px] opacity-15 animate-pulse duration-[12s]"></div>
      </div>

      <div className="z-10 w-full max-w-6xl px-6 py-12 md:py-20 flex flex-col items-center gap-16">

        {/* Animated Hero Section */}
        <AnimatePresence>
          {!selectedSong && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-[--neon-lime] tracking-widest uppercase mb-4"
              >
                🎵 Phân tích nhạc bằng AI
              </motion.div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white relative">
                LYRICS
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[--neon-cyan] via-white to-[--neon-purple] animate-gradient-x">
                  DEEP DIVE
                </span>
              </h1>

              <p className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-lg mx-auto leading-relaxed px-4">
                Không chỉ nghe. <span className="text-white font-bold">Mà còn hiểu sâu.</span> <br />
                Khám phá ý nghĩa, slang và câu chuyện đằng sau mỗi bài hát.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Content Area */}
        <div className="w-full transition-all duration-500">
          {!selectedSong && (
            <div className="mb-12">
              <SearchBar onSearch={handleSearch} isLoading={loading} />
            </div>
          )}

          {/* Results Grid */}
          <AnimatePresence mode='wait'>
            {!selectedSong && songs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
              >
                {songs.map((song, i) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    index={i}
                    onSelect={handleSelectSong}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis View */}
          <AnimatePresence mode="wait">
            {(selectedSong || analyzing) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                {/* Back button when viewing analysis */}
                <button
                  onClick={resetAnalysis}
                  className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại
                </button>

                <MeaningReveal
                  isLoading={analyzing && !meaning}
                  meaning={meaning || ""}
                  onClose={resetAnalysis}
                  song={selectedSong}
                  youtubeVideo={youtubeVideo}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
