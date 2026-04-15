// ─── Article Detail Screen ───────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../../../src/context/ThemeContext';
import { Typography } from '../../../src/constants/typography';
import { Spacing, BorderRadius } from '../../../src/constants/colors';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { Badge } from '../../../src/components/ui/Badge';

// Since articles are fetched via newsApi and not persisted,
// we pass basic data as search params from the news feed.
export default function ArticleDetailScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    id: string;
    title?: string;
    description?: string;
    source?: string;
    url?: string;
    category?: string;
    publishedAt?: string;
  }>();

  const { id, title, description, source, url, category, publishedAt } = params;

  const openInBrowser = () => {
    if (url) {
      WebBrowser.openBrowserAsync(url);
    }
  };

  const getTimeAgo = (dateStr?: string): string => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="chevron-left" size={24} color={colors.text} />
      </TouchableOpacity>

      {title ? (
        <>
          {/* Article Header */}
          <View style={styles.articleHeader}>
            {category && <Badge label={category} variant="accent" style={{ marginBottom: 12 }} />}
            <Text style={[Typography.display, { color: colors.text, fontSize: 22 }]}>
              {title}
            </Text>
            {(source || publishedAt) && (
              <View style={styles.metaRow}>
                {source && (
                  <Text style={[Typography.captionMedium, { color: colors.accent }]}>
                    {source}
                  </Text>
                )}
                {publishedAt && (
                  <Text style={[Typography.caption, { color: colors.textTertiary }]}>
                    {getTimeAgo(publishedAt)}
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Description Card */}
          <Card style={{ marginBottom: Spacing.xl }}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: 8 }]}>Summary</Text>
            <Text style={[Typography.body, { color: colors.text, lineHeight: 22 }]}>
              {description || 'No summary available for this article.'}
            </Text>
          </Card>

          {/* Read Full Article */}
          {url && (
            <Button
              title="Read Full Article"
              onPress={openInBrowser}
              variant="primary"
              fullWidth
              size="lg"
              icon={<Feather name="external-link" size={16} color="#FFF" />}
            />
          )}

          {/* Share Section */}
          <View style={styles.shareRow}>
            <TouchableOpacity
              onPress={openInBrowser}
              style={[styles.shareBtn, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}
            >
              <Feather name="share-2" size={16} color={colors.textSecondary} />
              <Text style={[Typography.captionMedium, { color: colors.textSecondary, marginLeft: 6 }]}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openInBrowser}
              style={[styles.shareBtn, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}
            >
              <Feather name="bookmark" size={16} color={colors.textSecondary} />
              <Text style={[Typography.captionMedium, { color: colors.textSecondary, marginLeft: 6 }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.fallback}>
          <View style={[styles.fallbackIcon, { backgroundColor: colors.accentLight }]}>
            <Feather name="file-text" size={32} color={colors.accent} />
          </View>
          <Text style={[Typography.heading, { color: colors.text, marginTop: 16, textAlign: 'center' }]}>
            Article not found
          </Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8, textAlign: 'center' }]}>
            This article may have been removed or the link has expired.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="secondary"
            style={{ marginTop: 24 }}
          />
        </View>
      )}

      <View style={{ height: 40 }} />
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
  articleHeader: {
    marginBottom: Spacing.xl,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  shareRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.xl,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
  },
  fallback: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  fallbackIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
