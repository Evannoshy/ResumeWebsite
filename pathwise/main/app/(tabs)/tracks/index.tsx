// ─── Tracks List Screen ──────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';
import { Typography } from '../../../src/constants/typography';
import { Spacing, BorderRadius } from '../../../src/constants/colors';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { ProgressBar } from '../../../src/components/ui/ProgressBar';
import { Badge } from '../../../src/components/ui/Badge';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { subscribeToTracks } from '../../../src/lib/firestore';
import { Track } from '../../../src/types';

export default function TracksScreen() {
  const { colors } = useTheme();
  const { user, userData } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (user) {
      const unsub = subscribeToTracks(user.uid, setTracks);
      return unsub;
    }
  }, [user]);

  const industry = userData?.onboardingData?.industry || 'your career';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Typography.display, { color: colors.text }]}>Upskilling{'\n'}Tracks</Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
          Structured paths for {industry}.
        </Text>
      </View>

      {tracks.length === 0 ? (
        <EmptyState
          icon="compass"
          title="No tracks yet"
          description="Create your first upskilling track to start building a structured career path."
          actionLabel="Create Track"
          onAction={() => router.push('/(tabs)/tracks/designer')}
        />
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <Text style={[Typography.heading, { color: colors.text }]}>Active Paths</Text>
            <Badge 
              label={`${tracks.length} track${tracks.length > 1 ? 's' : ''}`} 
              variant="accent" 
            />
          </View>
          
          {tracks.map((track) => (
            <Card
              key={track.id}
              onPress={() => router.push(`/(tabs)/tracks/${track.id}`)}
              style={{ marginBottom: Spacing.md }}
              padding={Spacing.lg}
            >
              <View style={styles.trackRow}>
                <View style={[styles.trackIcon, { backgroundColor: colors.accentLight }]}>
                  <Feather name="map" size={18} color={colors.accent} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[Typography.bodyMedium, { color: colors.text }]}>{track.title}</Text>
                  <View style={{ marginTop: 8 }}>
                    <ProgressBar progress={track.progress} height={4} />
                  </View>
                  <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 6 }]}>
                    {track.progress}% · {track.steps.length} steps
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.textTertiary} />
              </View>
            </Card>
          ))}
        </>
      )}

      <Button
        title="Create New Track"
        onPress={() => router.push('/(tabs)/tracks/designer')}
        variant="primary"
        fullWidth
        size="lg"
        icon={<Feather name="plus" size={18} color="#FFF" style={{ marginRight: 4 }} />}
        style={{ marginTop: Spacing.xl }}
      />
      
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
