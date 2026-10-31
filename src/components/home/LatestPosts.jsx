import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../posts/PostCard';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

export default function LatestPosts() {
  const { posts, loading } = usePosts('all');
  const latestPosts = posts.slice(0, 3);

  return (
    <section className="py-24 bg-background-secondary border-t border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
                EDITORIAL & NEWS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight uppercase">
              Latest Stories & Insights
            </h2>
          </div>

          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-red hover:text-white transition group"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <Loader size="lg" text="Loading Latest Stories..." />
        ) : latestPosts.length === 0 ? (
          <EmptyState
            title="No Stories Published Yet"
            description="Our documentary team is currently on the ground capturing new stories."
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
