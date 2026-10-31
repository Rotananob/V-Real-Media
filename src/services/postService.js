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

// Clean initial state: No fake or exaggerated placeholder posts
export const INITIAL_POSTS = [];

/**
 * Fetch published posts for public site
 */
export async function getPublishedPosts(category = 'all', maxItems = 20) {
  if (!isFirebaseConfigured || !db) {
    return [];
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
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.warn('[postService] Falling back to empty array:', error);
    return [];
  }
}

/**
 * Real-time listener for published posts
 */
export function subscribeToPublishedPosts(callback, category = 'all') {
  if (!isFirebaseConfigured || !db) {
    callback([]);
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
          callback([]);
        } else {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          callback(items);
        }
      },
      (error) => {
        console.error('[postService] Snapshot error:', error);
        callback([]);
      }
    );
  } catch (err) {
    callback([]);
    return () => {};
  }
}

/**
 * Fetch single post by slug
 */
export async function getPostBySlug(slug) {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  try {
    const postsRef = collection(db, COLLECTION_NAME);
    const q = query(postsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('[postService] Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Fetch all posts for Admin CMS (includes drafts and published)
 */
export async function getAllPostsAdmin() {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const postsRef = collection(db, COLLECTION_NAME);
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.warn('[postService] Error fetching admin posts:', err);
    return [];
  }
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

  if (thumbnailPath) {
    await deleteMedia(thumbnailPath);
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return true;
}
