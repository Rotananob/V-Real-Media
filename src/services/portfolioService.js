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

// Initial high-impact portfolio pieces showcasing V-REAL MEDIA's concept
export const INITIAL_PORTFOLIO = [
  {
    id: 'port-1',
    title: 'STREET REALITY: 24 Hours with Phnom Penh Tuk-Tuk Drivers',
    slug: 'street-reality-24-hours-tuk-tuk-drivers',
    description: 'An unscripted day-in-the-life documentary following street transportation workers through blistering heat and monsoon downpours.',
    category: 'street-reality',
    thumbnailURL: '/assets/logo.jpg',
    thumbnailPath: null,
    videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoProvider: 'youtube',
    featured: true,
    status: 'published',
    publishedAt: new Date('2026-10-10'),
    createdAt: new Date('2026-10-10'),
  },
  {
    id: 'port-2',
    title: 'SOCIAL EXPERIMENT: Dropping Money in Front of Strangers',
    slug: 'social-experiment-dropping-money-strangers',
    description: 'A psychological and social experiment on honesty and community integrity in local markets.',
    category: 'social-experiment',
    thumbnailURL: '/assets/logo.jpg',
    thumbnailPath: null,
    videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoProvider: 'youtube',
    featured: true,
    status: 'published',
    publishedAt: new Date('2026-10-18'),
    createdAt: new Date('2026-10-18'),
  },
  {
    id: 'port-3',
    title: 'HUMAN DOCUMENTARY: Shadows of the Tonle Sap',
    slug: 'human-documentary-shadows-tonle-sap',
    description: 'Exploring the floating villages and preserving the ancestral wisdom of indigenous fishing communities facing environmental shifts.',
    category: 'documentary',
    thumbnailURL: '/assets/logo.jpg',
    thumbnailPath: null,
    videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoProvider: 'youtube',
    featured: true,
    status: 'published',
    publishedAt: new Date('2026-10-24'),
    createdAt: new Date('2026-10-24'),
  },
  {
    id: 'port-4',
    title: 'HUMAN STORIES: The Silent Craftsmen of Siem Reap',
    slug: 'human-stories-silent-craftsmen-siem-reap',
    description: 'Stone carvers and silk weavers who keep ancient Khmer heritage alive with unmatched passion and dedication.',
    category: 'human-stories',
    thumbnailURL: '/assets/logo.jpg',
    thumbnailPath: null,
    videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoProvider: 'youtube',
    featured: false,
    status: 'published',
    publishedAt: new Date('2026-10-27'),
    createdAt: new Date('2026-10-27'),
  }
];

/**
 * Fetch published portfolio items
 */
export async function getPublishedPortfolio(category = 'all', maxItems = 24) {
  if (!isFirebaseConfigured || !db) {
    if (category && category !== 'all') {
      return INITIAL_PORTFOLIO.filter(item => item.category === category);
    }
    return INITIAL_PORTFOLIO;
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
      return INITIAL_PORTFOLIO;
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.warn('[portfolioService] Falling back to initial portfolio:', error);
    return INITIAL_PORTFOLIO;
  }
}

/**
 * Realtime subscription to published portfolio items
 */
export function subscribeToPublishedPortfolio(callback, category = 'all') {
  if (!isFirebaseConfigured || !db) {
    callback(category && category !== 'all' ? INITIAL_PORTFOLIO.filter(i => i.category === category) : INITIAL_PORTFOLIO);
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
          callback(INITIAL_PORTFOLIO);
        } else {
          callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      },
      (error) => {
        console.error('[portfolioService] Snapshot error:', error);
        callback(INITIAL_PORTFOLIO);
      }
    );
  } catch (err) {
    callback(INITIAL_PORTFOLIO);
    return () => {};
  }
}

/**
 * Fetch single portfolio item by id or slug
 */
export async function getPortfolioById(id) {
  if (!isFirebaseConfigured || !db) {
    return INITIAL_PORTFOLIO.find(i => i.id === id || i.slug === id) || null;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}

/**
 * Fetch all portfolio items for Admin CMS
 */
export async function getAllPortfolioAdmin() {
  if (!isFirebaseConfigured || !db) {
    return INITIAL_PORTFOLIO;
  }

  const colRef = collection(db, COLLECTION_NAME);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
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

  // 1. Delete associated Storage assets
  if (thumbnailPath) {
    await deleteMedia(thumbnailPath);
  }

  // 2. Delete Firestore document
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return true;
}
