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

const COLLECTION_NAME = 'portfolio';

// Clean initial state: No fake or exaggerated placeholder items
export const INITIAL_PORTFOLIO = [];

/**
 * Fetch published portfolio items
 */
export async function getPublishedPortfolio(category = 'all', maxItems = 24) {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    let q;

    if (category && category !== 'all') {
      q = query(
        colRef,
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('publishedAt', 'desc'),
        limit(maxItems)
      );
    } else {
      q = query(
        colRef,
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
    console.warn('[portfolioService] Falling back to empty array:', error);
    return [];
  }
}

/**
 * Realtime subscription to published portfolio items
 */
export function subscribeToPublishedPortfolio(callback, category = 'all') {
  if (!isFirebaseConfigured || !db) {
    callback([]);
    return () => {};
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    let q;

    if (category && category !== 'all') {
      q = query(
        colRef,
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('publishedAt', 'desc'),
        limit(30)
      );
    } else {
      q = query(
        colRef,
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
          callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      },
      (error) => {
        console.error('[portfolioService] Snapshot error:', error);
        callback([]);
      }
    );
  } catch (err) {
    callback([]);
    return () => {};
  }
}

/**
 * Fetch single portfolio item by id or slug
 */
export async function getPortfolioById(id) {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (err) {
    console.warn('[portfolioService] Error getting item:', err);
    return null;
  }
}

/**
 * Fetch all portfolio items for Admin CMS
 */
export async function getAllPortfolioAdmin() {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.warn('[portfolioService] Error fetching admin portfolio:', err);
    return [];
  }
}

/**
 * Create a new Portfolio entry
 */
export async function createPortfolioItem(itemData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }

  const baseSlug = slugify(itemData.title || 'untitled-work');
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;
  const videoInfo = itemData.videoURL ? detectVideoProvider(itemData.videoURL) : null;

  const docData = {
    title: (itemData.title || '').trim(),
    slug: uniqueSlug,
    description: (itemData.description || '').trim(),
    category: itemData.category || 'street-reality',
    thumbnailURL: itemData.thumbnailURL || (videoInfo ? videoInfo.thumbnailUrl : null),
    thumbnailPath: itemData.thumbnailPath || null,
    videoURL: itemData.videoURL ? itemData.videoURL.trim() : '',
    videoProvider: videoInfo ? videoInfo.provider : null,
    featured: Boolean(itemData.featured),
    status: itemData.status === 'published' ? 'published' : 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: itemData.status === 'published' ? serverTimestamp() : null,
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
  return { id: docRef.id, ...docData };
}

/**
 * Update an existing portfolio entry
 */
export async function updatePortfolioItem(id, itemData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  const videoInfo = itemData.videoURL ? detectVideoProvider(itemData.videoURL) : null;

  const updates = {
    title: (itemData.title || '').trim(),
    description: (itemData.description || '').trim(),
    category: itemData.category || 'street-reality',
    videoURL: itemData.videoURL ? itemData.videoURL.trim() : '',
    videoProvider: videoInfo ? videoInfo.provider : null,
    featured: Boolean(itemData.featured),
    status: itemData.status === 'published' ? 'published' : 'draft',
    updatedAt: serverTimestamp(),
  };

  if (itemData.thumbnailURL !== undefined) {
    updates.thumbnailURL = itemData.thumbnailURL;
  }
  if (itemData.thumbnailPath !== undefined) {
    updates.thumbnailPath = itemData.thumbnailPath;
  }
  if (itemData.status === 'published' && !itemData.publishedAt) {
    updates.publishedAt = serverTimestamp();
  }

  await updateDoc(docRef, updates);
  return { id, ...updates };
}

/**
 * Delete a portfolio item and its storage assets
 */
export async function deletePortfolioItem(id, thumbnailPath = null) {
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
