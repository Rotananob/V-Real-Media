import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../services/postService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/formatDate';
import { getSafeEmbedUrl } from '../utils/videoUtils';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Calendar, User, Share2, Check } from 'lucide-react';

export default function PostDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

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
      <div className="pt-32 pb-24 min-h-screen bg-background-primary flex items-center justify-center font-khmer">
        <Loader size="lg" text="កំពុងទាញយកខ្លឹមសាររឿងរ៉ាវ..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background-primary max-w-3xl mx-auto px-4 font-khmer">
        <EmptyState
          title="រកមិនឃើញរឿងរ៉ាវនេះឡើយ"
          description="រឿងរ៉ាវដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានផ្លាស់ប្តូរ ឬលុបចេញពីប្រព័ន្ធ។"
          action={
            <Link
              to="/news"
              className="px-4 py-2 rounded-xl bg-accent-red text-white text-xs font-semibold"
            >
              {t.news.backToNews}
            </Link>
          }
        />
      </div>
    );
  }

  const safeEmbed = post.videoURL ? getSafeEmbedUrl(post.videoURL) : null;
  const categoryName = t.categories[post.category] || post.category;

  return (
    <article className="pt-28 pb-24 bg-background-primary min-h-screen font-khmer">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-content-muted hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.news.backToNews}</span>
          </Link>
        </div>

        {/* Category & Date Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-md bg-accent-red/10 border border-accent-red/30 text-accent-red text-xs uppercase tracking-wider font-semibold">
            {categoryName}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-content-muted font-mono">
            <Calendar className="w-3.5 h-3.5 text-accent-red" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Description / Subtitle */}
        <p className="text-lg sm:text-xl text-content-secondary leading-relaxed mb-8 border-l-2 border-accent-red pl-4">
          {post.description}
        </p>

        {/* Media Player or Thumbnail */}
        <div className="rounded-2xl overflow-hidden border border-border bg-surface mb-10 shadow-human-card">
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
              <p key={idx} className="whitespace-pre-line leading-relaxed">
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
            <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-accent-red shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white block">ក្រុមការងារនិពន្ធ V-REAL MEDIA</span>
              <span className="text-xs text-content-muted">រាជធានីភ្នំពេញ • ប្រទេសកម្ពុជា</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-surface border border-border hover:border-accent-red text-xs text-white font-medium flex items-center gap-2 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{t.news.copied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-accent-red" />
                <span>{t.news.shareStory}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
}
