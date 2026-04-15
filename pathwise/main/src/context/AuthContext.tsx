// ─── Authentication Context ──────────────────────────────────────
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';

interface AuthContextValue {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<User>) => Promise<void>;
  completeOnboarding: (status: string, interests: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch user document from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserData({ id: userDoc.id, ...userDoc.data() } as User);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    // Create user document in Firestore
    const newUser: Omit<User, 'id'> = {
      name,
      email,
      status: 'student',
      interests: [],
      onboardingComplete: false,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', credential.user.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
    });

    setUserData({ id: credential.user.uid, ...newUser });
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUserData(null);
  }, []);

  const updateUserData = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), data);
    setUserData((prev) => prev ? { ...prev, ...data } : null);
  }, [user]);

  const completeOnboarding = useCallback(async (status: string, interests: string[]) => {
    if (!user) return;
    // Derive primary industry from first interest
    const industry = interests[0] || 'General';
    const updates = {
      status,
      interests,
      onboardingComplete: true,
      onboardingData: { status, industry },
    };
    await updateDoc(doc(db, 'users', user.uid), updates);
    setUserData((prev) => prev ? { ...prev, ...updates } : null);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, signIn, signUp, signOut, updateUserData, completeOnboarding }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
