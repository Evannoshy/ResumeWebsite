// ─── Resume List Screen ──────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
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
import { subscribeToResumes, createResume, deleteResume } from '../../../src/lib/firestore';
import { EMPTY_RESUME_SECTIONS } from '../../../src/constants/resume';
import { Resume } from '../../../src/types';

export default function ResumeListScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      const unsub = subscribeToResumes(user.uid, setResumes);
      return unsub;
    }
  }, [user]);

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    try {
      const id = await createResume(
        user.uid,
        `Resume ${resumes.length + 1}`,
        'classic',
        { ...EMPTY_RESUME_SECTIONS, personal: { ...EMPTY_RESUME_SECTIONS.personal, email: user.email || '' } }
      );
      router.push({ pathname: '/(tabs)/resume/editor', params: { id } });
    } catch (err) {
      Alert.alert('Error', 'Failed to create resume.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Typography.display, { color: colors.text }]}>Your{'\n'}Resumes</Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
          Build ATS-friendly resumes for Singapore employers.
        </Text>
      </View>

      {resumes.length === 0 ? (
        <EmptyState
          icon="file-text"
          title="No resumes yet"
          description="Create your first resume with our guided builder and ATS-friendly templates."
          actionLabel="Create Resume"
          onAction={handleCreate}
        />
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <Text style={[Typography.heading, { color: colors.text }]}>Saved Documents</Text>
            <Badge 
              label={`${resumes.length} doc${resumes.length > 1 ? 's' : ''}`} 
              variant="accent" 
            />
          </View>
          
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              onPress={() => router.push({ pathname: '/(tabs)/resume/editor', params: { id: resume.id } })}
              style={{ marginBottom: Spacing.md }}
              padding={Spacing.lg}
            >
              <View style={styles.resumeRow}>
                <View style={[styles.iconBox, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
                  <Feather name="file-text" size={18} color={colors.accent} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={[Typography.bodyMedium, { color: colors.text }]}>{resume.title}</Text>
                  <View style={{ marginTop: 8 }}>
                    <ProgressBar progress={resume.completeness} height={4} />
                  </View>
                  <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
                    {resume.completeness}% Complete · {new Date(resume.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.textTertiary} />
              </View>
            </Card>
          ))}
        </>
      )}

      <Button
        title="Create New Resume"
        onPress={handleCreate}
        loading={creating}
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
  resumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
