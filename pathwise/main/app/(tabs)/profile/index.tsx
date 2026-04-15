// ─── Profile Screen ──────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';
import { Typography } from '../../../src/constants/typography';
import { Spacing, BorderRadius } from '../../../src/constants/colors';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { Badge } from '../../../src/components/ui/Badge';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../src/lib/firebase';

export default function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();
  const { user, userData, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your tracks, resumes, and bookmarks. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              // Delete all tracks
              const tracksSnap = await getDocs(collection(db, 'users', user.uid, 'tracks'));
              for (const d of tracksSnap.docs) {
                await deleteDoc(doc(db, 'users', user.uid, 'tracks', d.id));
              }
              // Delete all resumes
              const resumesSnap = await getDocs(collection(db, 'users', user.uid, 'resumes'));
              for (const d of resumesSnap.docs) {
                await deleteDoc(doc(db, 'users', user.uid, 'resumes', d.id));
              }
              // Delete all bookmarks
              const bookmarksSnap = await getDocs(collection(db, 'users', user.uid, 'bookmarks'));
              for (const d of bookmarksSnap.docs) {
                await deleteDoc(doc(db, 'users', user.uid, 'bookmarks', d.id));
              }
              Alert.alert('Done', 'All data has been cleared.');
            } catch (err) {
              Alert.alert('Error', 'Failed to reset data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'student': return 'Student / Undergraduate';
      case 'ns': return 'National Service (NS)';
      case 'working': return 'Working Professional';
      default: return 'User';
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Typography.display, { color: colors.text }]}>Settings</Text>
      </View>

      {/* User Info Card */}
      <Card style={{ marginBottom: Spacing.xl }}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
            <Text style={{ fontSize: 24 }}>
              {(userData?.name || user?.displayName || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[Typography.heading, { color: colors.text, fontSize: 20 }]}>
              {userData?.name || user?.displayName || 'User'}
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 2 }]}>
              {getStatusLabel(userData?.onboardingData?.status)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>Industry</Text>
          <Badge 
            label={userData?.onboardingData?.industry || 'General'} 
            variant="accent" 
          />
        </View>
        <View style={[styles.detailsRow, { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 14, marginTop: 14 }]}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>Account</Text>
          <Text style={[Typography.bodyMedium, { color: colors.text }]}>Cloud Synced</Text>
        </View>
      </Card>

      {/* Action List */}
      <View style={styles.actionList}>
        <TouchableOpacity
          onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          style={[styles.actionRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: colors.accentLight }]}>
              <Feather name={mode === 'dark' ? 'moon' : 'sun'} size={16} color={colors.accent} />
            </View>
            <Text style={[Typography.bodyMedium, { color: colors.text, marginLeft: 12 }]}>
              {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
          <View style={[styles.toggleTrack, { backgroundColor: mode === 'dark' ? colors.accent : colors.surfaceSecondary }]}>
            <View style={[styles.toggleThumb, { 
              backgroundColor: '#FFF',
              transform: [{ translateX: mode === 'dark' ? 16 : 0 }],
            }]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL('mailto:support@pathskill.sg')}
          style={[styles.actionRow, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 8 }]}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: colors.tertiaryLight }]}>
              <Feather name="mail" size={16} color={colors.tertiary} />
            </View>
            <Text style={[Typography.bodyMedium, { color: colors.text, marginLeft: 12 }]}>Send Feedback</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          style={[styles.actionRow, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 8 }]}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: colors.secondaryLight }]}>
              <Feather name="log-out" size={16} color={colors.secondary} />
            </View>
            <Text style={[Typography.bodyMedium, { color: colors.text, marginLeft: 12 }]}>Sign Out</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Footer / Reset */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleReset} style={[styles.resetBtn, { borderColor: colors.error + '30' }]}>
          <Feather name="trash-2" size={14} color={colors.error} />
          <Text style={[Typography.captionMedium, { color: colors.error, marginLeft: 6 }]}>Reset All Data</Text>
        </TouchableOpacity>
        <Text style={[Typography.label, { color: colors.textTertiary, textTransform: 'none', marginTop: 20 }]}>
          PathSkill v1.0.0 • Singapore Career Companion
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 20,
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionList: {
    marginTop: Spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTrack: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
});
