import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../posts/PostCard';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

export default function LatestPosts() {
  const { posts, loading } = usePosts('all');
  const { t, language } = useLanguage();
  const latestPosts = posts.slice(0, 3);

  return (
    <section className="py-24 bg-white border-b border-neutral-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
                {t.news.sectionBadge}
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight ${
              language === 'km' ? 'font-khmer' : 'font-display uppercase'
            }`}>
              {t.news.title}
            </h2>
          </div>

          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-xs tracking-wider text-accent-red hover:text-neutral-900 transition font-khmer font-semibold"
          >
            <span>{t.news.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <Loader size="lg" text="កំពុងទាញយកព័ត៌មាន..." />
        ) : latestPosts.length === 0 ? (
          <EmptyState
            title={t.news.emptyTitle}
            description="ក្រុមការងារកំពុងរៀបចំអត្ថបទថ្មីៗពីទីតាំងជាក់ស្តែង។"
            icon={Newspaper}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
