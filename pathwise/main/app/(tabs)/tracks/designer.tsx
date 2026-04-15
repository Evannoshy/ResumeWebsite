// ─── Track Designer Screen ───────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';
import { Typography } from '../../../src/constants/typography';
import { Spacing, BorderRadius } from '../../../src/constants/colors';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { TRACK_TEMPLATES, INDUSTRIES, STATUS_OPTIONS, TrackTemplate } from '../../../src/constants/tracks';
import { createTrack } from '../../../src/lib/firestore';
import { TrackStep } from '../../../src/types';

export default function TrackDesignerScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [step, setStep] = useState(0); // 0: select industry, 1: pick template, 2: customize
  const [industry, setIndustry] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TrackTemplate | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [trackSteps, setTrackSteps] = useState<TrackStep[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredTemplates = TRACK_TEMPLATES.filter((t) => t.industry === industry);

  const selectTemplate = (template: TrackTemplate) => {
    setSelectedTemplate(template);
    setCustomTitle(template.title);
    setCustomDescription(template.description);
    setTrackSteps(template.steps.map((s) => ({ ...s, completed: false })));
    setStep(2);
  };

  const startBlank = () => {
    setSelectedTemplate(null);
    setCustomTitle('');
    setCustomDescription('');
    setTrackSteps([]);
    setStep(2);
  };

  const addCustomStep = () => {
    const newStep: TrackStep = {
      id: `custom-${Date.now()}`,
      title: '',
      description: '',
      type: 'course',
      level: 'beginner',
      completed: false,
      order: trackSteps.length,
    };
    setTrackSteps([...trackSteps, newStep]);
  };

  const updateStep = (index: number, field: keyof TrackStep, value: any) => {
    const updated = [...trackSteps];
    (updated[index] as any)[field] = value;
    setTrackSteps(updated);
  };

  const removeStep = (index: number) => {
    setTrackSteps(trackSteps.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!customTitle.trim()) {
      Alert.alert('Missing title', 'Please enter a title for your track.');
      return;
    }
    if (trackSteps.length === 0) {
      Alert.alert('No steps', 'Add at least one step to your track.');
      return;
    }

    setLoading(true);
    try {
      if (user) {
        await createTrack(user.uid, customTitle, industry, customDescription, trackSteps);
      }
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to create track. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Close button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
        <View style={[styles.closeBtnCircle, { backgroundColor: colors.surfaceMuted }]}>
          <Feather name="x" size={20} color={colors.text} />
        </View>
      </TouchableOpacity>

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i <= step ? colors.accent : colors.border,
                width: i === step ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {step === 0 && (
        <>
          <Text style={[Typography.display, { color: colors.text }]}>Choose an{'\n'}industry</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8, marginBottom: Spacing['2xl'] }]}>
            We'll show relevant track templates for your chosen field.
          </Text>

          <View style={styles.industryGrid}>
            {INDUSTRIES.map((ind) => (
              <TouchableOpacity
                key={ind.id}
                onPress={() => { setIndustry(ind.id); setStep(1); }}
                activeOpacity={0.7}
                style={[styles.industryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={[styles.industryIcon, { backgroundColor: colors.accentLight }]}>
                  <Feather name={ind.icon as any} size={22} color={colors.accent} />
                </View>
                <Text style={[Typography.bodyMedium, { color: colors.text, marginTop: 10 }]}>{ind.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {step === 1 && (
        <>
          <Text style={[Typography.display, { color: colors.text }]}>Pick a template</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8, marginBottom: Spacing['2xl'] }]}>
            Start with a proven roadmap, or build your own from scratch.
          </Text>

          {filteredTemplates.map((template) => (
            <Card key={template.id} onPress={() => selectTemplate(template)} style={{ marginBottom: Spacing.md }}>
              <Text style={[Typography.bodyMedium, { color: colors.text }]}>{template.title}</Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
                {template.description}
              </Text>
              <View style={styles.templateMeta}>
                <Badge label={`${template.steps.length} steps`} />
                <Text style={[Typography.caption, { color: colors.textTertiary, marginLeft: 8 }]}>
                  ~{template.estimatedWeeks} weeks
                </Text>
              </View>
            </Card>
          ))}

          <Card onPress={startBlank} style={{ marginBottom: Spacing.md }}>
            <View style={styles.blankRow}>
              <View style={[styles.blankIcon, { backgroundColor: colors.accentLight }]}>
                <Feather name="plus" size={18} color={colors.accent} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[Typography.bodyMedium, { color: colors.accent }]}>Start from scratch</Text>
                <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  Build a completely custom track.
                </Text>
              </View>
            </View>
          </Card>

          <Button
            title="Back"
            onPress={() => setStep(0)}
            variant="ghost"
            style={{ marginTop: Spacing.md }}
          />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={[Typography.display, { color: colors.text }]}>Customise{'\n'}your track</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8, marginBottom: Spacing.xl }]}>
            Edit steps, add your own, and make it yours.
          </Text>

          <Input
            label="Track Title"
            value={customTitle}
            onChangeText={setCustomTitle}
            placeholder="e.g., Software Engineering Path"
          />

          <Input
            label="Description (optional)"
            value={customDescription}
            onChangeText={setCustomDescription}
            placeholder="Brief description of this track"
            multiline
            numberOfLines={2}
          />

          <Text style={[Typography.heading, { color: colors.text, marginTop: Spacing.lg, marginBottom: Spacing.md }]}>
            Steps ({trackSteps.length})
          </Text>

          {trackSteps.map((s, i) => (
            <Card key={s.id} style={{ marginBottom: Spacing.md }}>
              <View style={styles.stepHeader}>
                <View style={[styles.stepNum, { backgroundColor: colors.accentLight }]}>
                  <Text style={[Typography.captionMedium, { color: colors.accent }]}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Input
                    value={s.title}
                    onChangeText={(v) => updateStep(i, 'title', v)}
                    placeholder="Step title"
                    containerStyle={{ marginBottom: 4 }}
                  />
                  <Input
                    value={s.description}
                    onChangeText={(v) => updateStep(i, 'description', v)}
                    placeholder="Brief description"
                    multiline
                    containerStyle={{ marginBottom: 0 }}
                  />
                </View>
                <TouchableOpacity onPress={() => removeStep(i)} style={{ padding: 8 }}>
                  <Feather name="trash-2" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
              <View style={styles.stepMeta}>
                <Badge label={s.level} variant={getLevelColor(s.level) as any} />
                <Badge label={s.type} style={{ marginLeft: 8 }} />
              </View>
            </Card>
          ))}

          <Button
            title="Add Step"
            onPress={addCustomStep}
            variant="ghost"
            fullWidth
            icon={<Feather name="plus" size={16} color={colors.text} style={{ marginRight: 4 }} />}
            style={{ marginBottom: Spacing.xl }}
          />

          <View style={styles.actionRow}>
            <Button title="Back" onPress={() => setStep(1)} variant="ghost" style={{ flex: 1, marginRight: 12 }} />
            <Button title="Create Track" onPress={handleCreate} loading={loading} style={{ flex: 2 }} size="lg" />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
  },
  closeBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  industryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  industryCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1.5,
  },
  industryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  blankRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blankIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  stepMeta: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 38,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
});
