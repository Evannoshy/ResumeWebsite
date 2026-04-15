// ─── Firestore Operations ────────────────────────────────────────
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Track, TrackStep, Resume, ResumeSections, Bookmark } from '../types';

// ─── Tracks ──────────────────────────────────────────────────────

export async function createTrack(
  userId: string,
  title: string,
  industry: string,
  description: string,
  steps: TrackStep[]
): Promise<string> {
  const trackRef = await addDoc(collection(db, 'users', userId, 'tracks'), {
    title,
    industry,
    description,
    steps,
    progress: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return trackRef.id;
}

export async function updateTrack(
  userId: string,
  trackId: string,
  data: Partial<Omit<Track, 'id' | 'userId' | 'createdAt'>>
) {
  await updateDoc(doc(db, 'users', userId, 'tracks', trackId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTrack(userId: string, trackId: string) {
  await deleteDoc(doc(db, 'users', userId, 'tracks', trackId));
}

export function subscribeToTracks(
  userId: string,
  callback: (tracks: Track[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'users', userId, 'tracks'),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const tracks = snapshot.docs.map((doc) => ({
      id: doc.id,
      userId,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Track[];
    callback(tracks);
  });
}

export async function updateStepProgress(
  userId: string,
  trackId: string,
  steps: TrackStep[]
) {
  const completedCount = steps.filter((s) => s.completed).length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  await updateDoc(doc(db, 'users', userId, 'tracks', trackId), {
    steps,
    progress,
    updatedAt: serverTimestamp(),
  });
}

// ─── Resumes ─────────────────────────────────────────────────────

export async function createResume(
  userId: string,
  title: string,
  template: 'classic' | 'modern',
  sections: ResumeSections
): Promise<string> {
  const resumeRef = await addDoc(collection(db, 'users', userId, 'resumes'), {
    title,
    template,
    sections,
    completeness: calculateCompleteness(sections),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return resumeRef.id;
}

export async function updateResume(
  userId: string,
  resumeId: string,
  data: Partial<Omit<Resume, 'id' | 'userId' | 'createdAt'>>
) {
  const updateData: any = { ...data, updatedAt: serverTimestamp() };
  if (data.sections) {
    updateData.completeness = calculateCompleteness(data.sections);
  }
  await updateDoc(doc(db, 'users', userId, 'resumes', resumeId), updateData);
}

export async function deleteResume(userId: string, resumeId: string) {
  await deleteDoc(doc(db, 'users', userId, 'resumes', resumeId));
}

export function subscribeToResumes(
  userId: string,
  callback: (resumes: Resume[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'users', userId, 'resumes'),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const resumes = snapshot.docs.map((doc) => ({
      id: doc.id,
      userId,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Resume[];
    callback(resumes);
  });
}

function calculateCompleteness(sections: ResumeSections): number {
  let filled = 0;
  let total = 5;

  if (sections.personal.name && sections.personal.email) filled++;
  if (sections.education.length > 0) filled++;
  if (sections.experience.length > 0) filled++;
  if (sections.projects.length > 0) filled++;
  if (sections.skills.technical.length > 0 || sections.skills.soft.length > 0) filled++;

  return Math.round((filled / total) * 100);
}

// ─── Bookmarks ───────────────────────────────────────────────────

export async function addBookmark(userId: string, bookmark: Omit<Bookmark, 'id' | 'savedAt'>) {
  await addDoc(collection(db, 'users', userId, 'bookmarks'), {
    ...bookmark,
    savedAt: serverTimestamp(),
  });
}

export async function removeBookmark(userId: string, bookmarkId: string) {
  await deleteDoc(doc(db, 'users', userId, 'bookmarks', bookmarkId));
}

export function subscribeToBookmarks(
  userId: string,
  callback: (bookmarks: Bookmark[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'users', userId, 'bookmarks'),
    orderBy('savedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const bookmarks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      savedAt: doc.data().savedAt?.toDate() || new Date(),
    })) as Bookmark[];
    callback(bookmarks);
  });
}
