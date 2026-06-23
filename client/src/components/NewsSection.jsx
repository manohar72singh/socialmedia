import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <section id="news" className="py-12 sm:py-16 bg-[#0F172A]">
      <div className="container mx-auto px-5 sm:px-6">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[#1E293B] rounded-2xl h-72 sm:h-96" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-400 bg-red-400/10 p-4 rounded-lg">
            Could not load news at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {news.slice(0, 6).map((article, index) => (
              <motion.a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#1E293B] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#6366F1] transition-all group block"
              >
                <div className="h-40 sm:h-48 overflow-hidden bg-gray-800">
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <div className="text-xs text-[#6366F1] font-semibold mb-2 uppercase">
                    {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-[#6366F1] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-3">
                    {article.description}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
