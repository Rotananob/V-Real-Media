import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../services/postService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/formatDate';
import { detectVideoProvider, getSafeEmbedUrl } from '../utils/videoUtils';
import { ArrowLeft, Calendar, User, Share2, Film, Check } from 'lucide-react';

export default function PostDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPost() {
      setLoading(true);
      try {
        const data = await getPostBySlug(slug);
        if (isMounted) setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPost();
    return () => { isMounted = false; };
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background-primary flex items-center justify-center">
        <Loader size="lg" text="Loading story narrative..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background-primary max-w-3xl mx-auto px-4">
        <EmptyState
          title="Story Not Found"
          description="The story you are looking for may have been archived or removed."
          action={
            <Link
              to="/news"
              className="px-4 py-2 rounded-lg bg-accent-red text-white text-xs font-semibold"
            >
              Back to Stories
            </Link>
          }
        />
      </div>
    );
  }

  const safeEmbed = post.videoURL ? getSafeEmbedUrl(post.videoURL) : null;

  return (
    <article className="pt-28 pb-24 bg-background-primary min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-content-muted hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Stories</span>
          </Link>
        </div>

        {/* Category & Date Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2.5 py-1 rounded bg-accent-red/10 border border-accent-red/30 text-accent-red text-xs font-mono uppercase tracking-wider font-semibold">
            {post.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-content-muted font-mono">
            <Calendar className="w-3.5 h-3.5 text-accent-red" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Description / Subtitle */}
        <p className="text-lg sm:text-xl text-content-secondary leading-relaxed mb-8 border-l-2 border-accent-red pl-4">
          {post.description}
        </p>

        {/* Media Player or Thumbnail */}
        <div className="rounded-2xl overflow-hidden border border-border bg-surface mb-10 shadow-2xl">
          {safeEmbed ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={safeEmbed}
                title={post.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-black">
              <img
                src={post.thumbnailURL || '/assets/logo.jpg'}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/logo.jpg';
                }}
              />
            </div>
          )}
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none text-content-secondary text-base sm:text-lg leading-relaxed space-y-6">
          {post.content ? (
            post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))
          ) : (
            <p>{post.description}</p>
          )}
        </div>

        {/* Footer Bar: Share & Author */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-accent-red">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white block">V-REAL Editorial Team</span>
              <span className="text-xs text-content-muted">Phnom Penh, Cambodia</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent-red text-xs text-white font-medium flex items-center gap-2 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-accent-red" />
                <span>Share Story</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
}
