import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Upload an image file to Firebase Storage with progress tracking
 */
export function uploadMedia(file, storagePath, onProgress = null) {
  return new Promise((resolve, reject) => {
    if (!isFirebaseConfigured || !storage) {
      return reject(new Error('Firebase Storage is not configured.'));
    }

    if (!file) {
      return reject(new Error('No file provided for upload.'));
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return reject(new Error(`Invalid file type (${file.type}). Allowed types: JPG, PNG, WEBP, GIF.`));
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return reject(new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit of 10MB.`));
    }

    const fileRef = ref(storage, storagePath);
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString()
      }
    };

    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (typeof onProgress === 'function') {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('[storageService] Upload failed:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadURL,
            fullPath: fileRef.fullPath,
            name: file.name,
            size: file.size,
            type: file.type
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Delete a media file from Firebase Storage
 */
export async function deleteMedia(storagePath) {
  if (!isFirebaseConfigured || !storage || !storagePath) return;

  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  } catch (error) {
    // Gracefully handle if file was already removed or not found (storage/object-not-found)
    if (error.code !== 'storage/object-not-found') {
      console.warn('[storageService] Failed to delete storage asset at:', storagePath, error);
    }
  }
}
