// ─── Resume Editor Screen ────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';
import { Typography } from '../../../src/constants/typography';
import { Spacing, BorderRadius } from '../../../src/constants/colors';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { subscribeToResumes, updateResume } from '../../../src/lib/firestore';
import { EMPTY_RESUME_SECTIONS, ACTION_VERBS, BULLET_SUGGESTIONS } from '../../../src/constants/resume';
import { Resume, ResumeSections, ResumeEducation, ResumeExperience, ResumeProject } from '../../../src/types';
import { generateResumePDF, shareResumePDF } from '../../../src/utils/pdf';

type ViewMode = 'structure' | 'preview';

export default function ResumeEditorScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [resume, setResume] = useState<Resume | null>(null);
  const [sections, setSections] = useState<ResumeSections>(EMPTY_RESUME_SECTIONS);
  const [viewMode, setViewMode] = useState<ViewMode>('structure');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (user && id) {
      const unsub = subscribeToResumes(user.uid, (resumes) => {
        const found = resumes.find((r) => r.id === id);
        if (found) {
          setResume(found);
          if (!dirty) setSections(found.sections);
        }
      });
      return unsub;
    }
  }, [user, id]);

  const save = useCallback(async () => {
    if (!user || !id) return;
    setSaving(true);
    try {
      await updateResume(user.uid, id, { sections });
      setDirty(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to save resume.');
    } finally {
      setSaving(false);
    }
  }, [user, id, sections]);

  const updatePersonal = (field: string, value: string) => {
    setSections((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    setDirty(true);
  };

  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`, school: '', degree: '', field: '',
      startYear: '', endYear: '', highlights: [],
    };
    setSections((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
    setDirty(true);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setSections((prev) => {
      const updated = [...prev.education];
      (updated[index] as any)[field] = value;
      return { ...prev, education: updated };
    });
    setDirty(true);
  };

  const removeEducation = (index: number) => {
    setSections((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
    setDirty(true);
  };

  const addExperience = () => {
    const newExp: ResumeExperience = {
      id: `exp-${Date.now()}`, company: '', role: '',
      startDate: '', endDate: '', current: false, bullets: [''],
    };
    setSections((prev) => ({ ...prev, experience: [...prev.experience, newExp] }));
    setDirty(true);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setSections((prev) => {
      const updated = [...prev.experience];
      (updated[index] as any)[field] = value;
      return { ...prev, experience: updated };
    });
    setDirty(true);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    setSections((prev) => {
      const updated = [...prev.experience];
      updated[expIndex].bullets[bulletIndex] = value;
      return { ...prev, experience: updated };
    });
    setDirty(true);
  };

  const addBullet = (expIndex: number) => {
    setSections((prev) => {
      const updated = [...prev.experience];
      updated[expIndex].bullets.push('');
      return { ...prev, experience: updated };
    });
    setDirty(true);
  };

  const removeExperience = (index: number) => {
    setSections((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
    setDirty(true);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await save();
      const uri = await generateResumePDF(sections, resume?.template || 'classic');
      await shareResumePDF(uri);
    } catch (err) {
      Alert.alert('Export Error', 'Failed to generate PDF.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Sticky Header */}
      <View style={[styles.stickyHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => { if (dirty) save(); router.back(); }}>
            <Feather name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[Typography.heading, { color: colors.text }]}>Document Builder</Text>
          <TouchableOpacity onPress={save} disabled={saving || !dirty}>
            <Feather name="save" size={20} color={dirty ? colors.accent : colors.textTertiary} />
          </TouchableOpacity>
        </View>
        <View style={[styles.toggleContainer, { backgroundColor: colors.surfaceMuted }]}>
          <TouchableOpacity 
            onPress={() => setViewMode('structure')}
            style={[styles.toggleBtn, viewMode === 'structure' && { backgroundColor: colors.surface, shadowColor: colors.shadow }]}
          >
            <Text style={[Typography.captionMedium, { color: viewMode === 'structure' ? colors.accent : colors.textSecondary }]}>Structure</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setViewMode('preview')}
            style={[styles.toggleBtn, viewMode === 'preview' && { backgroundColor: colors.surface, shadowColor: colors.shadow }]}
          >
            <Text style={[Typography.captionMedium, { color: viewMode === 'preview' ? colors.accent : colors.textSecondary }]}>Preview</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {viewMode === 'structure' ? (
          <View style={styles.editorContent}>
            {/* Identification Section */}
            <View style={styles.sectionHeader}>
              <Text style={[Typography.title, { color: colors.text }]}>Identification</Text>
            </View>
            <View style={styles.sectionFields}>
              <Input placeholder="Full Name" value={sections.personal.name} onChangeText={(v) => updatePersonal('name', v)} containerStyle={styles.minimalInput} />
              <Input placeholder="Email Address" value={sections.personal.email} onChangeText={(v) => updatePersonal('email', v)} containerStyle={styles.minimalInput} keyboardType="email-address" />
              <Input placeholder="Phone Number" value={sections.personal.phone} onChangeText={(v) => updatePersonal('phone', v)} containerStyle={styles.minimalInput} keyboardType="phone-pad" />
              <Input placeholder="LinkedIn URL" value={sections.personal.linkedin} onChangeText={(v) => updatePersonal('linkedin', v)} containerStyle={styles.minimalInput} />
            </View>

            {/* Experience Section */}
            <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
              <Text style={[Typography.title, { color: colors.text }]}>Experience</Text>
              <TouchableOpacity onPress={addExperience} style={styles.addBtn}>
                <Feather name="plus" size={14} color={colors.text} />
                <Text style={[Typography.captionMedium, { color: colors.text }]}>Add Entry</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.entryList}>
              {sections.experience.map((exp, i) => (
                <View key={exp.id} style={[styles.entryBox, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                  <TouchableOpacity onPress={() => removeExperience(i)} style={styles.removeBtn}>
                    <Feather name="trash-2" size={14} color={colors.error} />
                  </TouchableOpacity>
                  <Input placeholder="Company Name" value={exp.company} onChangeText={(v) => updateExperience(i, 'company', v)} containerStyle={styles.minimalInput} />
                  <Input placeholder="Role / Title" value={exp.role} onChangeText={(v) => updateExperience(i, 'role', v)} containerStyle={styles.minimalInput} />
                  <Input placeholder="Period (e.g. Jan 2023 - Present)" value={exp.startDate + (exp.endDate ? ' - ' + exp.endDate : '')} onChangeText={(v) => updateExperience(i, 'startDate', v)} containerStyle={styles.minimalInput} />
                  
                  <Text style={[Typography.label, { color: colors.textTertiary, marginTop: 12, marginBottom: 8 }]}>Bullet Points</Text>
                  {exp.bullets.map((bullet, bi) => (
                    <Input
                      key={bi}
                      value={bullet}
                      onChangeText={(v) => updateBullet(i, bi, v)}
                      placeholder="Key achievement..."
                      multiline
                      containerStyle={styles.bulletInput}
                    />
                  ))}
                  <TouchableOpacity onPress={() => addBullet(i)} style={{ marginTop: 8 }}>
                    <Text style={[Typography.caption, { color: colors.accent }]}>+ Add Bullet</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Education Section */}
            <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
              <Text style={[Typography.title, { color: colors.text }]}>Education</Text>
              <TouchableOpacity onPress={addEducation} style={styles.addBtn}>
                <Feather name="plus" size={14} color={colors.text} />
                <Text style={[Typography.captionMedium, { color: colors.text }]}>Add Entry</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.entryList}>
              {sections.education.map((edu, i) => (
                <View key={edu.id} style={[styles.entryBox, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                  <TouchableOpacity onPress={() => removeEducation(i)} style={styles.removeBtn}>
                    <Feather name="trash-2" size={14} color={colors.error} />
                  </TouchableOpacity>
                  <Input placeholder="Institution Name" value={edu.school} onChangeText={(v) => updateEducation(i, 'school', v)} containerStyle={styles.minimalInput} />
                  <Input placeholder="Degree / Certification" value={edu.degree} onChangeText={(v) => updateEducation(i, 'degree', v)} containerStyle={styles.minimalInput} />
                  <Input placeholder="Period / Year of Graduation" value={edu.startYear + (edu.endYear ? ' - ' + edu.endYear : '')} onChangeText={(v) => updateEducation(i, 'startYear', v)} containerStyle={styles.minimalInput} />
                </View>
              ))}
            </View>

            <Button
              title="Export Document"
              onPress={handleExport}
              loading={exporting}
              variant="primary"
              size="lg"
              style={{ marginTop: Spacing['2xl'] }}
              icon={<Feather name="download" size={18} color="#FFF" style={{ marginRight: 8 }} />}
            />
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 100 }]}>
              Export to PDF to see the final layout.
            </Text>
            <Button
              title="Generate PDF Preview"
              onPress={handleExport}
              loading={exporting}
              variant="secondary"
              style={{ marginTop: 24, marginHorizontal: 40 }}
            />
          </View>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 16,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: BorderRadius.md,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  editorContent: {
    padding: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C7DBFF',
    paddingBottom: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionFields: {
    marginBottom: Spacing.md,
  },
  minimalInput: {
    marginBottom: 8,
  },
  entryList: {
    gap: 12,
  },
  entryBox: {
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  bulletInput: {
    marginBottom: 4,
  },
  previewContainer: {
    flex: 1,
    paddingTop: 40,
  },
});
