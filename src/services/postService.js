import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { deleteMedia } from './storageService';
import { detectVideoProvider } from '../utils/videoUtils';
import { slugify } from '../utils/slugify';

const COLLECTION_NAME = 'posts';

// Sample fallback data if Firestore is empty or unconfigured
export const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'Behind The Lens: The Reality of Phnom Penh Street Life',
    slug: 'behind-the-lens-phnom-penh-street-life',
    description: 'An intimate look into the lives of night-market vendors and street recyclers, captured through unfiltered cinematography.',
    content: `Documentary filmmaking in real streets requires vulnerability and patience. In our latest feature, we walked through the neon-lit alleyways of Phnom Penh after midnight.

We listened to stories of resilience from street cart vendors, tricycle drivers, and youth pursuing their dreams against immense odds.

"You cannot direct real life; you can only bear witness to it." — V-REAL MEDIA Director.

Our goal was never to sensationalize struggle, but to honor the dignity and warmth of our community. Check out the full episode in our portfolio section.`,
    category: 'documentary',
    thumbnailURL: '/assets/logo.jpg',
    thumbnailPath: null,
    videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoProvider: 'youtube',
    status: 'published',
    featured: true,
    publishedAt: new Date('2026-10-15'),
    createdAt: new Date('2026-10-15'),
  },
  {
    id: 'post-2',
    title: 'Social Experiment: Would Strangers Share Food In Need?',
    slug: 'social-experiment-strangers-share-food',
    description: 'We tested human kindness and empathy in a busy public square. The results surprised the entire crew.',
    content: `In an era dominated by screens and social detachment, we wanted to know: has our collective empathy faded?

We placed an actor pretending to have lost their wallet and asking ordinary pedestrians for a piece of bread. The response from everyday Cambodian citizens was overwhelming.

More than 80% offered not just their food, but their own money. This experiment reminds us of the profound compassion at the core of our culture.`,
    category: 'social-experiment',
    thumbnailURL: '/assets/logo.jpg',
    thumbnailPath: null,
    videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoProvider: 'youtube',
    status: 'published',
    featured: true,
    publishedAt: new Date('2026-10-22'),
    createdAt: new Date('2026-10-22'),
  },
  {
    id: 'post-3',
    title: 'V-REAL MEDIA Manifesto: Unscripted. Fearless. Real.',
    slug: 'v-real-media-manifesto',
    description: 'Why we reject glossy commercial setups to champion unscripted street reality and human truth.',
    content: `V-REAL MEDIA was founded with one clear conviction: authentic human connection cannot be manufactured on a soundstage.

We capture the raw pulse of Cambodian culture—the laughter, the tears, the dilemmas, and the community unity. We bring social awareness directly to the screen through uncompromising storytelling.`,
    category: 'human-stories',
    thumbnailURL: '/assets/logo.jpg',
    thumbnailPath: null,
    videoURL: '',
    videoProvider: null,
    status: 'published',
    featured: false,
    publishedAt: new Date('2026-10-28'),
    createdAt: new Date('2026-10-28'),
  }
];

/**
 * Fetch published posts for public site
 */
export async function getPublishedPosts(category = 'all', maxItems = 20) {
  if (!isFirebaseConfigured || !db) {
    if (category && category !== 'all') {
      return INITIAL_POSTS.filter(p => p.category === category);
    }
    return INITIAL_POSTS;
  }

  try {
    const postsRef = collection(db, COLLECTION_NAME);
    let q;

    if (category && category !== 'all') {
      q = query(
        postsRef,
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('publishedAt', 'desc'),
        limit(maxItems)
      );
    } else {
      q = query(
        postsRef,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(maxItems)
      );
    }

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return INITIAL_POSTS;
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.warn('[postService] Falling back to initial posts:', error);
    return INITIAL_POSTS;
  }
}

/**
 * Real-time listener for published posts
 */
export function subscribeToPublishedPosts(callback, category = 'all') {
  if (!isFirebaseConfigured || !db) {
    callback(category && category !== 'all' ? INITIAL_POSTS.filter(p => p.category === category) : INITIAL_POSTS);
    return () => {};
  }

  try {
    const postsRef = collection(db, COLLECTION_NAME);
    let q;

    if (category && category !== 'all') {
      q = query(
        postsRef,
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('publishedAt', 'desc'),
        limit(30)
      );
    } else {
      q = query(
        postsRef,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(30)
      );
    }

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(INITIAL_POSTS);
        } else {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          callback(items);
        }
      },
      (error) => {
        console.error('[postService] Snapshot error:', error);
        callback(INITIAL_POSTS);
      }
    );
  } catch (err) {
    callback(INITIAL_POSTS);
    return () => {};
  }
}

/**
 * Fetch single post by slug
 */
export async function getPostBySlug(slug) {
  if (!isFirebaseConfigured || !db) {
    return INITIAL_POSTS.find(p => p.slug === slug) || null;
  }

  try {
    const postsRef = collection(db, COLLECTION_NAME);
    const q = query(postsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_POSTS.find(p => p.slug === slug) || null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('[postService] Error fetching post by slug:', error);
    return INITIAL_POSTS.find(p => p.slug === slug) || null;
  }
}

/**
 * Fetch all posts for Admin CMS (includes drafts and published)
 */
export async function getAllPostsAdmin() {
  if (!isFirebaseConfigured || !db) {
    return INITIAL_POSTS;
  }

  const postsRef = collection(db, COLLECTION_NAME);
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Create a new Post
 */
export async function createPost(postData, authorId = 'admin') {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }

  const baseSlug = slugify(postData.title || 'untitled-post');
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;
  const videoInfo = postData.videoURL ? detectVideoProvider(postData.videoURL) : null;

  const docData = {
    title: (postData.title || '').trim(),
    slug: uniqueSlug,
    description: (postData.description || '').trim(),
    content: postData.content || '',
    category: postData.category || 'street-reality',
    thumbnailURL: postData.thumbnailURL || null,
    thumbnailPath: postData.thumbnailPath || null,
    videoURL: postData.videoURL ? postData.videoURL.trim() : '',
    videoProvider: videoInfo ? videoInfo.provider : null,
    status: postData.status === 'published' ? 'published' : 'draft',
    featured: Boolean(postData.featured),
    authorId: authorId || 'admin',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: postData.status === 'published' ? serverTimestamp() : null,
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
  return { id: docRef.id, ...docData };
}

/**
 * Update an existing post
 */
export async function updatePost(id, postData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  const videoInfo = postData.videoURL ? detectVideoProvider(postData.videoURL) : null;

  const updates = {
    title: (postData.title || '').trim(),
    description: (postData.description || '').trim(),
    content: postData.content || '',
    category: postData.category || 'street-reality',
    videoURL: postData.videoURL ? postData.videoURL.trim() : '',
    videoProvider: videoInfo ? videoInfo.provider : null,
    status: postData.status === 'published' ? 'published' : 'draft',
    featured: Boolean(postData.featured),
    updatedAt: serverTimestamp(),
  };

  if (postData.thumbnailURL !== undefined) {
    updates.thumbnailURL = postData.thumbnailURL;
  }
  if (postData.thumbnailPath !== undefined) {
    updates.thumbnailPath = postData.thumbnailPath;
  }
  if (postData.status === 'published' && !postData.publishedAt) {
    updates.publishedAt = serverTimestamp();
  }

  await updateDoc(docRef, updates);
  return { id, ...updates };
}

/**
 * Delete a post and its associated storage assets
 */
export async function deletePost(id, thumbnailPath = null) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }

  // 1. Delete associated Storage assets if present
  if (thumbnailPath) {
    await deleteMedia(thumbnailPath);
  }

  // 2. Delete Firestore document
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return true;
}
