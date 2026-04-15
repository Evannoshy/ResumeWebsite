// ─── Onboarding Screen ───────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { Typography } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/colors';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { STATUS_OPTIONS, INDUSTRIES } from '../../src/constants/tracks';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { userData, updateUserData, completeOnboarding } = useAuth();
  
  const [step, setStep] = useState(0);
  const [name, setName] = useState(userData?.name || '');
  const [status, setStatus] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (name) await updateUserData({ name });
      await completeOnboarding(status, interests);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Onboarding error:', err);
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length > 1;
    if (step === 1) return !!status;
    return interests.length > 0;
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <View style={[styles.iconBox, { backgroundColor: colors.accent, marginBottom: 32 }]}>
          <Feather name="compass" size={24} color="#FFF" />
        </View>

        <View style={{ marginBottom: 40 }}>
          <Text style={[Typography.display, { color: colors.text }]}>Welcome to{'\n'}PathSkill.</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
            Let's set up your professional profile.
          </Text>
        </View>

        {step === 0 && (
          <View style={styles.stepContainer}>
            <Input
              label="What's your name?"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Wei Jie"
              autoFocus
            />
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[Typography.bodyMedium, { color: colors.text, marginBottom: 16 }]}>
              Current Status
            </Text>
            <View style={styles.grid}>
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setStatus(option.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.optionBtn,
                    {
                      borderColor: status === option.id ? colors.accent : colors.border,
                      backgroundColor: status === option.id ? colors.accentLight : colors.surface,
                    },
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        Typography.bodyMedium,
                        { color: status === option.id ? colors.accent : colors.text },
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                      {option.description}
                    </Text>
                  </View>
                  {status === option.id && <Feather name="check-circle" size={18} color={colors.accent} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[Typography.bodyMedium, { color: colors.text, marginBottom: 16 }]}>
              Industries of Interest
            </Text>
            <View style={styles.chipGrid}>
              {INDUSTRIES.map((industry) => {
                const selected = interests.includes(industry.id);
                return (
                  <TouchableOpacity
                    key={industry.id}
                    onPress={() => toggleInterest(industry.id)}
                    activeOpacity={0.7}
                    style={[
                      styles.industryChip,
                      {
                        borderColor: selected ? colors.accent : colors.border,
                        backgroundColor: selected ? colors.accentLight : colors.surface,
                      },
                    ]}
                  >
                    <Feather 
                      name={industry.icon as any} 
                      size={16} 
                      color={selected ? colors.accent : colors.textSecondary} 
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        Typography.captionMedium,
                        { color: selected ? colors.accent : colors.textSecondary },
                      ]}
                    >
                      {industry.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === step ? colors.accent : colors.border,
                width: i === step ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title={step === 2 ? "Get Started" : "Continue"}
          onPress={step === 2 ? handleComplete : () => setStep(step + 1)}
          disabled={!canProceed()}
          loading={loading}
          fullWidth
          size="lg"
          icon={step < 2 ? <Feather name="arrow-right" size={16} color="#FFF" /> : <Feather name="check" size={16} color="#FFF" />}
        />
        {step > 0 && (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backBtn}>
            <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 40,
    minHeight: '100%',
  },
  content: {
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    marginBottom: 40,
  },
  grid: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  industryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    marginTop: 'auto',
  },
  backBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
});
