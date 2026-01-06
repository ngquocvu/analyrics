"use client";

import { useState } from 'react';
import SearchBar from '@/components/Search/SearchBar';
import SongCard from '@/components/Results/SongCard';
import MeaningReveal from '@/components/Analysis/MeaningReveal';
import BuyMeACoffee from '@/components/UI/BuyMeACoffee';
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
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden bg-black text-white">

      {/* Static Minimal Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.08),_transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(255,255,255,0.03),_transparent_70%)] blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-6xl px-6 py-12 md:py-20 flex flex-col items-center gap-16">

        {/* Animated Hero Section */}
        <AnimatePresence>
          {!selectedSong && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-8 flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-semibold text-white/80 tracking-[0.2em] uppercase mb-4"
              >
                Phân Tích Lời Nhạc Bằng AI
              </motion.div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter relative mb-4">
                <span className="block drop-shadow-2xl animate-text-spotlight">
                  ANALYRICS
                </span>
              </h1>

              <p className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4 font-light">
                <span className="text-white font-medium">Không chỉ nghe, mà còn hiểu sâu.</span>
                <br />
                <span className="text-neutral-500 mt-2 block">
                  Khám phá ý nghĩa, slang và câu chuyện ẩn giấu đằng sau mỗi bài hát.
                </span>
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
                <motion.button
                  onClick={resetAnalysis}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="mb-8 relative z-10 flex items-center gap-3 px-5 py-3 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl transition-all group shadow-lg"
                >
                  <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                  <span className="font-semibold">Quay lại</span>
                </motion.button>

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


      {/* Footer */}
      <footer className="w-full py-8 text-center text-neutral-500 text-sm relative z-10">
        <div className="flex flex-col items-center gap-4 mb-4">
          <BuyMeACoffee />
        </div>
        <p className="mb-2">Built with using Gemini 2.5 Flash</p>
        <div className="flex justify-center gap-4">
          <a
            href="https://www.facebook.com/iamquocvu/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Connect with Owner (Vu Nguyen)
          </a>
        </div>
      </footer>
    </main >
  );
}
