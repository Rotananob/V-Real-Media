import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../context/LanguageContext';

export default function PostCard({ post }) {
  const { t } = useLanguage();
  const thumbnail = post.thumbnailURL || '/assets/logo.jpg';
  const categoryName = t.categories[post.category] || post.category || 'News';

  return (
    <article className="group relative rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-all duration-200 flex flex-col h-full shadow-sm hover:shadow-md">
      
      {/* Thumbnail Aspect Container */}
      <Link to={`/news/${post.slug || post.id}`} className="relative aspect-video w-full overflow-hidden bg-neutral-900 block">
        <img
          src={thumbnail}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/logo.jpg';
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm border border-neutral-200 text-[10px] font-khmer font-medium text-neutral-800 shadow-xs">
          {categoryName}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-2">
            <Calendar className="w-3.5 h-3.5 text-accent-red" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>

          <h3 className="text-base font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-accent-red transition-colors font-khmer">
            <Link to={`/news/${post.slug || post.id}`}>
              {post.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed mb-4 font-khmer">
            {post.description}
          </p>
        </div>

        {/* Link Footer */}
        <div className="pt-3 border-t border-neutral-100">
          <Link
            to={`/news/${post.slug || post.id}`}
            className="text-xs font-semibold text-accent-red hover:text-neutral-900 flex items-center gap-1.5 transition-colors group/link font-khmer"
          >
            <span>{t.news.readStory}</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </article>
  );
}
