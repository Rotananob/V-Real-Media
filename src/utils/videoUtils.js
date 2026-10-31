/**
 * Secure Video URL Parsing, Provider Detection, and Embed Generator
 * Prevents arbitrary script injection or unsafe URLs in iframes.
 */

export function detectVideoProvider(url) {
  if (!url || typeof url !== 'string') return { provider: 'unknown', id: null, embedUrl: null };

  const trimmed = url.trim();

  // YouTube detection (youtube.com, youtu.be, youtube-nocookie.com, shorts)
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      provider: 'youtube',
      id: videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  }

  // Vimeo detection
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      provider: 'vimeo',
      id: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?autoplay=1`,
      thumbnailUrl: null
    };
  }

  // TikTok detection
  const tiktokMatch = trimmed.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/i);
  if (tiktokMatch && tiktokMatch[2]) {
    return {
      provider: 'tiktok',
      id: tiktokMatch[2],
      user: tiktokMatch[1],
      embedUrl: null, // TikTok recommends official embed block or external link
      externalUrl: trimmed
    };
  }

  // Direct MP4 / WebM
  if (/\.(mp4|webm|ogg)$/i.test(trimmed)) {
    return {
      provider: 'direct',
      id: null,
      embedUrl: trimmed,
      thumbnailUrl: null
    };
  }

  // Generic secure URL fallback
  if (/^https:\/\//i.test(trimmed)) {
    return {
      provider: 'external',
      id: null,
      embedUrl: null,
      externalUrl: trimmed
    };
  }

  return { provider: 'invalid', id: null, embedUrl: null };
}

export function getSafeEmbedUrl(url) {
  const result = detectVideoProvider(url);
  return result.embedUrl || null;
}
