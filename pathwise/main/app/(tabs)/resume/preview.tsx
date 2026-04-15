// ─── Resume Preview Screen ───────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';
import { Typography } from '../../../src/constants/typography';
import { Spacing } from '../../../src/constants/colors';
import { Button } from '../../../src/components/ui/Button';
import { subscribeToResumes } from '../../../src/lib/firestore';
import { Resume } from '../../../src/types';
import { generateResumePDF, shareResumePDF } from '../../../src/utils/pdf';

export default function ResumePreviewScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [exporting, setExporting] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (user && id) {
      const unsub = subscribeToResumes(user.uid, (resumes) => {
        const found = resumes.find((r) => r.id === id);
        if (found) setResume(found);
      });
      return unsub;
    }
  }, [user, id]);

  const handleExport = async () => {
    if (!resume) return;
    setExporting(true);
    try {
      const uri = await generateResumePDF(resume.sections, resume.template);
      await shareResumePDF(uri);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  if (!resume) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[Typography.body, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  const s = resume.sections;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading, { color: colors.text }]}>Preview</Text>
        <Button title="Export" onPress={handleExport} loading={exporting} variant="primary" size="sm" />
      </View>

      {/* Resume preview card */}
      <View style={[styles.resumeCard, { backgroundColor: '#FFFFFF' }]}>
        <Text style={styles.previewName}>{s.personal.name || 'Your Name'}</Text>
        <Text style={styles.previewContact}>
          {[s.personal.email, s.personal.phone, s.personal.linkedin].filter(Boolean).join(' · ')}
        </Text>

        {s.personal.summary ? <Text style={styles.previewSummary}>{s.personal.summary}</Text> : null}

        {s.education.length > 0 && (
          <>
            <Text style={styles.previewSectionTitle}>EDUCATION</Text>
            {s.education.map((edu) => (
              <View key={edu.id} style={styles.previewEntry}>
                <Text style={styles.previewBold}>{edu.school}</Text>
                <Text style={styles.previewSub}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</Text>
                <Text style={styles.previewDate}>{edu.startYear} — {edu.endYear}</Text>
              </View>
            ))}
          </>
        )}

        {s.experience.length > 0 && (
          <>
            <Text style={styles.previewSectionTitle}>EXPERIENCE</Text>
            {s.experience.map((exp) => (
              <View key={exp.id} style={styles.previewEntry}>
                <Text style={styles.previewBold}>{exp.role}</Text>
                <Text style={styles.previewSub}>{exp.company} · {exp.startDate} — {exp.current ? 'Present' : exp.endDate}</Text>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <Text key={i} style={styles.previewBullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </>
        )}

        {s.projects.length > 0 && (
          <>
            <Text style={styles.previewSectionTitle}>PROJECTS</Text>
            {s.projects.map((proj) => (
              <View key={proj.id} style={styles.previewEntry}>
                <Text style={styles.previewBold}>{proj.title}</Text>
                {proj.techStack.length > 0 && (
                  <Text style={styles.previewSub}>{proj.techStack.join(' · ')}</Text>
                )}
                <Text style={styles.previewDesc}>{proj.description}</Text>
              </View>
            ))}
          </>
        )}

        {(s.skills.technical.length > 0 || s.skills.soft.length > 0) && (
          <>
            <Text style={styles.previewSectionTitle}>SKILLS</Text>
            <Text style={styles.previewDesc}>
              {[...s.skills.technical, ...s.skills.soft].join(' · ')}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.xl, paddingTop: 60, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl },
  resumeCard: {
    padding: 24, borderRadius: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  previewName: { fontSize: 22, fontWeight: '600', color: '#1a1a1a', letterSpacing: -0.5 },
  previewContact: { fontSize: 11, color: '#666', marginTop: 4, marginBottom: 14 },
  previewSummary: { fontSize: 11, color: '#444', lineHeight: 16, marginBottom: 14 },
  previewSectionTitle: {
    fontSize: 11, fontWeight: '600', color: '#1a1a1a', letterSpacing: 1,
    borderBottomWidth: 1.5, borderBottomColor: '#1a1a1a', paddingBottom: 3.5, marginTop: 16, marginBottom: 10,
  },
  previewEntry: { marginBottom: 10 },
  previewBold: { fontSize: 12, fontWeight: '600', color: '#1a1a1a' },
  previewSub: { fontSize: 10.5, color: '#555', marginTop: 1 },
  previewDate: { fontSize: 10, color: '#888', marginTop: 1 },
  previewBullet: { fontSize: 10.5, color: '#333', marginTop: 2, paddingLeft: 8 },
  previewDesc: { fontSize: 10.5, color: '#444', marginTop: 3, lineHeight: 15 },
});
