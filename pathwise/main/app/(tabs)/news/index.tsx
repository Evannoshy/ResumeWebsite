// ─── News Feed Screen ────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';
import { Typography } from '../../../src/constants/typography';
import { Spacing } from '../../../src/constants/colors';
import { Card } from '../../../src/components/ui/Card';
import { Chip } from '../../../src/components/ui/Badge';
import { Badge } from '../../../src/components/ui/Badge';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { fetchNews } from '../../../src/lib/newsApi';
import { addBookmark, removeBookmark, subscribeToBookmarks } from '../../../src/lib/firestore';
import { NewsArticle, NewsCategory, Bookmark } from '../../../src/types';

const CATEGORIES: { id: NewsCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'public-sector', label: 'Policy' },
  { id: 'tech', label: 'Tech' },
  { id: 'finance', label: 'Finance' },
  { id: 'global', label: 'Macro' },
];

export default function NewsFeedScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [category, setCategory] = useState<NewsCategory>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    loadArticles();
  }, [category]);

  useEffect(() => {
    if (user) {
      const unsub = subscribeToBookmarks(user.uid, setBookmarks);
      return unsub;
    }
  }, [user]);

  const loadArticles = async () => {
    setLoading(true);
    const data = await fetchNews(category);
    setArticles(data);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  };

  const isBookmarked = (articleId: string) => bookmarks.some((b) => b.articleId === articleId);

  const toggleBookmark = async (article: NewsArticle) => {
    if (!user) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const existing = bookmarks.find((b) => b.articleId === article.id);
    if (existing) {
      await removeBookmark(user.uid, existing.id);
    } else {
      await addBookmark(user.uid, {
        articleId: article.id,
        title: article.title,
        source: article.source,
        summary: article.description,
        url: article.url,
        category: article.category,
      });
    }
  };

  const openArticle = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  function getTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Typography.display, { color: colors.text }]}>Market{'\n'}Intelligence</Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
          Curated signals for the Singapore economy.
        </Text>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            selected={category === cat.id}
            onPress={() => setCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {/* Articles */}
      {loading && articles.length === 0 ? (
        <View style={styles.loadingState}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>Loading articles...</Text>
        </View>
      ) : articles.length === 0 ? (
        <EmptyState
          icon="globe"
          title="No signals found"
          description="Try a different channel or pull to refresh."
        />
      ) : (
        articles.map((article) => (
          <Card
            key={article.id}
            onPress={() => openArticle(article.url)}
            style={{ marginBottom: Spacing.md }}
            padding={Spacing.lg}
          >
            <View style={styles.articleHeader}>
              <Badge label={article.category} variant="accent" />
              <Text style={[Typography.label, { color: colors.textTertiary, textTransform: 'none' }]}>
                {getTimeAgo(article.publishedAt)}
              </Text>
            </View>

            <Text style={[Typography.bodyMedium, { color: colors.text, fontSize: 15, marginBottom: 8 }]} numberOfLines={2}>
              {article.title}
            </Text>

            <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: 12 }]} numberOfLines={2}>
              {article.description}
            </Text>

            <View style={styles.articleFooter}>
              <Text style={[Typography.label, { color: colors.textTertiary, textTransform: 'uppercase' }]}>
                {article.source}
              </Text>
              <TouchableOpacity onPress={() => toggleBookmark(article)}>
                <Feather
                  name={isBookmarked(article.id) ? 'bookmark' : 'bookmark'}
                  size={16}
                  color={isBookmarked(article.id) ? colors.accent : colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </Card>
        ))
      )}

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
    marginBottom: Spacing.xl,
  },
  chipRow: {
    marginBottom: Spacing.xl,
    gap: 0,
  },
  loadingState: {
    paddingVertical: Spacing['4xl'],
    alignItems: 'center',
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});
