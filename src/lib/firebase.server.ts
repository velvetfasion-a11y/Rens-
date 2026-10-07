import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const SERVICE_ACCOUNT_PATH = join(process.cwd(), ".secrets", "firebase-service-account.json");

export function isFirebaseConfigured(): boolean {
  return existsSync(SERVICE_ACCOUNT_PATH);
}

function loadServiceAccount(): Record<string, unknown> {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Add .secrets/firebase-service-account.json from the Firebase console.",
    );
  }
  return JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf8")) as Record<string, unknown>;
}

export function firebaseApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const serviceAccount = loadServiceAccount();
  const projectId = String(serviceAccount.project_id ?? "");
  const bucket =
    process.env.FIREBASE_STORAGE_BUCKET?.trim() || (projectId ? `${projectId}.appspot.com` : undefined);

  return initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
    projectId: projectId || undefined,
    storageBucket: bucket,
  });
}

export function firestore() {
  return getFirestore(firebaseApp());
}

export function storageBucket() {
  return getStorage(firebaseApp()).bucket();
}
