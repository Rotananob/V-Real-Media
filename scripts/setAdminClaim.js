/**
 * V-REAL MEDIA — Admin Custom Claim Script
 *
 * Usage:
 *   node scripts/setAdminClaim.js <user-email>
 *
 * Requirements:
 *   1. Download your service account key JSON from Firebase Console:
 *      Project Settings -> Service accounts -> Generate new private key
 *   2. Save the file as `serviceAccountKey.json` in the project root (or set GOOGLE_APPLICATION_CREDENTIALS)
 *   3. Run: node scripts/setAdminClaim.js v.real.khmer@gmail.com
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const email = process.argv[2];

if (!email) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Please provide the target user email address.');
  console.log('Example: node scripts/setAdminClaim.js v.real.khmer@gmail.com');
  process.exit(1);
}

const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json');

if (!existsSync(serviceAccountPath) && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: `serviceAccountKey.json` not found in project root.');
  console.log('Please download your Service Account JSON from Firebase Console:');
  console.log('  Firebase Console -> Project Settings -> Service Accounts -> "Generate new private key"');
  console.log('  Save it as `serviceAccountKey.json` in your root folder.');
  process.exit(1);
}

let app;
if (existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  app = initializeApp({
    credential: cert(serviceAccount)
  });
} else {
  app = initializeApp();
}

const auth = getAuth(app);

async function setAdmin() {
  try {
    const user = await auth.getUserByEmail(email);
    console.log(`Found user: ${user.uid} (${user.email})`);

    await auth.setCustomUserClaims(user.uid, { admin: true });

    console.log('\x1b[32m%s\x1b[0m', `SUCCESS: Custom claim { admin: true } granted to ${email}.`);
    console.log('The user should now sign out and sign back in (or click "Refresh Token Claim" in the UI).');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Failed to set admin custom claim:', error.message);
  }
}

setAdmin();
