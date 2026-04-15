// ─── Home Dashboard ──────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { Typography } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/colors';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { Badge } from '../../src/components/ui/Badge';
import { SectionHeader } from '../../src/components/ui/EmptyState';
import { subscribeToTracks, subscribeToResumes } from '../../src/lib/firestore';
import { fetchNews } from '../../src/lib/newsApi';
import { Track, Resume, NewsArticle } from '../../src/types';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, userData } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubTracks = subscribeToTracks(user.uid, setTracks);
      const unsubResumes = subscribeToResumes(user.uid, setResumes);
      return () => { unsubTracks(); unsubResumes(); };
    }
  }, [user]);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const articles = await fetchNews('all');
    setNews(articles.slice(0, 3));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeTrack = tracks.find((t) => t.progress < 100) || tracks[0];
  const nextStep = activeTrack?.steps.find(s => !s.completed);
  const latestResume = resumes[0];
  const firstName = userData?.name || user?.displayName || 'there';
  const role = userData?.onboardingData?.status || 'Professional';
  const industry = userData?.onboardingData?.industry || 'General';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[Typography.display, { color: colors.text }]}>
              {greeting()},{'\n'}{firstName.split(' ')[0]} 👋
            </Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
            <Feather name="user" size={20} color={colors.accent} />
          </View>
        </View>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
          {role} • Focusing on {industry}
        </Text>
      </View>

      {/* Current Track */}
      <SectionHeader title="Current Track" action="View All" onAction={() => router.push('/(tabs)/tracks')} />
      {activeTrack ? (
        <Card onPress={() => router.push(`/(tabs)/tracks/${activeTrack.id}`)} style={{ marginBottom: Spacing.xl }}>
          <View style={styles.trackBadgeRow}>
            <Badge label={activeTrack.industry || 'Track'} variant="accent" />
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              {activeTrack.steps.filter(s => s.completed).length}/{activeTrack.steps.length} steps
            </Text>
          </View>
          <Text style={[Typography.heading, { color: colors.text, marginTop: 8 }]}>{activeTrack.title}</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 4, marginBottom: Spacing.md }]} numberOfLines={1}>
            {activeTrack.description}
          </Text>
          
          <ProgressBar progress={activeTrack.progress} style={{ marginBottom: 8 }} />
          <View style={styles.progressLabel}>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>Progress</Text>
            <Text style={[Typography.captionMedium, { color: colors.accent }]}>{activeTrack.progress}%</Text>
          </View>

          {nextStep && (
            <View style={[styles.nextStepContainer, { borderTopColor: colors.borderLight }]}>
              <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: 8 }]}>Up Next</Text>
              <View style={styles.nextStepRow}>
                <View style={[styles.stepDot, { backgroundColor: colors.accent }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.bodyMedium, { color: colors.text }]}>{nextStep.title}</Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary }]}>{nextStep.provider}</Text>
                </View>
              </View>
            </View>
          )}
        </Card>
      ) : (
        <Card style={{ marginBottom: Spacing.xl }}>
          <View style={styles.emptyTrackContent}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.accentLight }]}>
              <Feather name="compass" size={24} color={colors.accent} />
            </View>
            <Text style={[Typography.bodyMedium, { color: colors.text, marginTop: 12 }]}>
              Start your journey
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
              Create your first upskilling track to start building your career path.
            </Text>
            <Button
              title="Create Track"
              onPress={() => router.push('/(tabs)/tracks')}
              variant="primary"
              size="sm"
              style={{ marginTop: 16 }}
            />
          </View>
        </Card>
      )}

      {/* Resume Status */}
      <SectionHeader title="Resume" action="Edit" onAction={() => router.push('/(tabs)/resume')} />
      <Card
        onPress={() => router.push('/(tabs)/resume')}
        style={{ marginBottom: Spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        padding={Spacing.md}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={[styles.iconBox, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
            <Feather name="file-text" size={20} color={colors.accent} />
          </View>
          <View>
            <Text style={[Typography.bodyMedium, { color: colors.text }]}>
              {latestResume?.title || 'No resume yet'}
            </Text>
            <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              {latestResume ? `Last updated ${getTimeAgo(latestResume.updatedAt)}` : 'Start building your resume'}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={16} color={colors.textTertiary} />
      </Card>

      {/* Market Intelligence */}
      <SectionHeader title="Market Intelligence" action="Read All" onAction={() => router.push('/(tabs)/news')} />
      {news.length > 0 ? (
        <Card
          onPress={() => router.push(`/(tabs)/news`)}
          style={{ marginBottom: Spacing.xl }}
        >
          <Badge label={news[0].category} variant="accent" style={{ marginBottom: 8 }} />
          <Text style={[Typography.bodyMedium, { color: colors.text, marginBottom: 8 }]} numberOfLines={2}>
            {news[0].title}
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]} numberOfLines={2}>
            {news[0].description}
          </Text>
        </Card>
      ) : (
        <Card style={{ marginBottom: Spacing.xl }}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>
            Loading market intelligence signals...
          </Text>
        </Card>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function getTimeAgo(dateStr: string | Date): string {
  if (!dateStr) return 'today';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  nextStepContainer: {
    borderTopWidth: 1,
    paddingTop: Spacing.md,
    marginTop: 4,
  },
  nextStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTrackContent: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
