import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Newspaper, ExternalLink, Calendar, User, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface NewsItem {
  title: string;
  excerpt: string;
  url: string;
  date: string;
  author: string;
  imageUrl?: string;
}

interface NewsProps {
  onClose: () => void;
  getNews: (limit: number) => Promise<NewsItem[]>;
}

export const News: React.FC<NewsProps> = ({ onClose, getNews }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getNews(10);
      setNews(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  const nextNews = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevNews = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[80vh] glass rounded-3xl border border-white/10 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFA845] to-[#FF8C00] flex items-center justify-center">
              <Newspaper size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Hytale News</h2>
              <p className="text-sm text-gray-400">Latest updates from hytale.com</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNews}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <RefreshCw size={40} className="text-[#FFA845] animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading news...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchNews}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : news.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400">No news available</p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Featured News */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex-1">
                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                      {news[currentIndex].title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {news[currentIndex].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                      {news[currentIndex].date && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{news[currentIndex].date}</span>
                        </div>
                      )}
                      {news[currentIndex].author && (
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          <span>{news[currentIndex].author}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => openLink(news[currentIndex].url)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFA845] to-[#FF8C00] rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      <span>Read More</span>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={prevNews}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex items-center gap-2">
                  {news.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-[#FFA845] w-4'
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextNews}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-center">
          <button
            onClick={() => openLink('https://hytale.com/news')}
            className="text-sm text-gray-400 hover:text-[#FFA845] transition-colors flex items-center gap-2"
          >
            <span>View all news on hytale.com</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
