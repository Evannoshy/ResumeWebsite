// ─── Track Detail Screen ─────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';
import { Typography } from '../../../src/constants/typography';
import { Spacing, BorderRadius } from '../../../src/constants/colors';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { Badge } from '../../../src/components/ui/Badge';
import { ProgressBar } from '../../../src/components/ui/ProgressBar';
import { subscribeToTracks, updateStepProgress, deleteTrack } from '../../../src/lib/firestore';
import { Track, TrackStep } from '../../../src/types';
import * as WebBrowser from 'expo-web-browser';

export default function TrackDetailScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepType, setNewStepType] = useState<'course' | 'project' | 'milestone' | 'certification'>('milestone');

  useEffect(() => {
    if (user && id) {
      const unsub = subscribeToTracks(user.uid, (tracks) => {
        const found = tracks.find((t) => t.id === id);
        if (found) setTrack(found);
      });
      return unsub;
    }
  }, [user, id]);

  const toggleStep = async (stepIndex: number) => {
    if (!track || !user) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const updatedSteps = [...track.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      completed: !updatedSteps[stepIndex].completed,
    };

    setTrack({ ...track, steps: updatedSteps });

    try {
      await updateStepProgress(user.uid, track.id, updatedSteps);
    } catch (err) {
      console.error('Failed to update step:', err);
    }
  };

  const addCustomMilestone = async () => {
    if (!track || !user || !newStepTitle.trim()) return;

    const newStep: TrackStep = {
      id: `custom-${Date.now()}`,
      title: newStepTitle.trim(),
      description: '',
      type: newStepType,
      level: 'beginner',
      completed: false,
      order: track.steps.length,
    };

    const updatedSteps = [...track.steps, newStep];
    setTrack({ ...track, steps: updatedSteps });
    setNewStepTitle('');
    setShowAddForm(false);

    try {
      await updateStepProgress(user.uid, track.id, updatedSteps);
    } catch (err) {
      console.error('Failed to add milestone:', err);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Track',
      'Are you sure you want to delete this track? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (user && track) {
              await deleteTrack(user.uid, track.id);
              router.back();
            }
          },
        },
      ]
    );
  };

  if (!track) return null;

  const completedCount = track.steps.filter(s => s.completed).length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="chevron-left" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Badge label={track.industry || 'Track'} variant="accent" style={{ marginBottom: 12 }} />
        <Text style={[Typography.display, { color: colors.text }]}>{track.title}</Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
          {track.description}
        </Text>
      </View>

      {/* Progress Summary */}
      <Card style={{ marginBottom: Spacing.xl }}>
        <View style={styles.progressHeader}>
          <Text style={[Typography.bodyMedium, { color: colors.text }]}>Overall Progress</Text>
          <Text style={[Typography.heading, { color: colors.accent }]}>{track.progress}%</Text>
        </View>
        <ProgressBar progress={track.progress} height={8} style={{ marginTop: 8 }} />
        <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 8 }]}>
          {completedCount} of {track.steps.length} steps completed
        </Text>
      </Card>

      {/* Timeline */}
      <Text style={[Typography.title, { color: colors.text, marginBottom: Spacing.md }]}>Steps</Text>
      <View style={styles.timelineContainer}>
        {/* Vertical Line */}
        <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />

        {track.steps.map((step, index) => (
          <View key={step.id} style={styles.timelineItem}>
            {/* Circle Node */}
            <TouchableOpacity
              onPress={() => toggleStep(index)}
              activeOpacity={0.8}
              style={[
                styles.node,
                {
                  borderColor: step.completed ? colors.accent : colors.borderDark,
                  backgroundColor: step.completed ? colors.accentLight : colors.surface,
                },
              ]}
            >
              {step.completed && <Feather name="check" size={10} color={colors.accent} />}
            </TouchableOpacity>

            <View style={[styles.stepContent, { opacity: step.completed ? 0.5 : 1 }]}>
              <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: 4 }]}>
                Phase {index + 1}
              </Text>
              
              <Text
                style={[
                  Typography.bodyMedium,
                  {
                    color: colors.text,
                    fontSize: 16,
                    textDecorationLine: step.completed ? 'line-through' : 'none',
                  },
                ]}
              >
                {step.title}
              </Text>

              <View style={styles.badgeRow}>
                <Badge 
                  label={step.type} 
                  style={{ backgroundColor: colors.surfaceMuted, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }} 
                />
                {step.provider && (
                  <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                    {step.provider}
                  </Text>
                )}
                {step.url && (
                  <TouchableOpacity
                    onPress={() => WebBrowser.openBrowserAsync(step.url!)}
                    style={[styles.linkBtn, { backgroundColor: colors.accentLight }]}
                  >
                    <Feather name="external-link" size={12} color={colors.accent} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Add Custom Milestone */}
      {showAddForm ? (
        <Card style={{ marginTop: Spacing.md }}>
          <Text style={[Typography.bodyMedium, { color: colors.text, marginBottom: 12 }]}>New Milestone</Text>
          <TextInput
            style={[styles.addInput, { color: colors.text, borderBottomColor: colors.accent }]}
            placeholder="Milestone title..."
            placeholderTextColor={colors.textTertiary}
            value={newStepTitle}
            onChangeText={setNewStepTitle}
            autoFocus
          />
          <View style={styles.typeRow}>
            {(['milestone', 'course', 'project', 'certification'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setNewStepType(type)}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: newStepType === type ? colors.accent : colors.surfaceMuted,
                    borderColor: newStepType === type ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text style={[Typography.caption, { color: newStepType === type ? '#FFF' : colors.textSecondary }]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.addActions}>
            <Button title="Cancel" onPress={() => { setShowAddForm(false); setNewStepTitle(''); }} variant="ghost" size="sm" />
            <Button title="Add" onPress={addCustomMilestone} size="sm" disabled={!newStepTitle.trim()} />
          </View>
        </Card>
      ) : (
        <Button
          title="Add Custom Milestone"
          onPress={() => setShowAddForm(true)}
          variant="ghost"
          fullWidth
          icon={<Feather name="plus" size={16} color={colors.textSecondary} />}
          style={{ marginTop: Spacing.md }}
        />
      )}

      <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
        <Text style={[Typography.caption, { color: colors.error }]}>Delete Track</Text>
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backBtn: {
    marginBottom: Spacing.lg,
    marginLeft: -4,
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 20,
    width: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing['2xl'],
    paddingLeft: 28,
  },
  node: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepContent: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  linkBtn: {
    padding: 4,
    borderRadius: 4,
  },
  addInput: {
    fontSize: 14,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  addActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  deleteBtn: {
    marginTop: 60,
    alignItems: 'center',
  },
});
