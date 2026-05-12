import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, 
  TouchableOpacity, SafeAreaView, StatusBar 
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { STORIES } from '../data/mockData';

const StoryDetailScreen = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState('summary');
   
  const storyId = route?.params?.storyId || '1';  
  const story = STORIES.find(s => s.id === storyId) || STORIES[0];

  const { favorites, toggleFavorite } = useAuth();
  const isFavorite = favorites ? favorites.includes(storyId) : false;

  const relatedStories = STORIES.filter(s => s.id !== storyId).slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="more-vertical" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.heroSection}>
          <Image source={story.cover} style={styles.coverImage} />
          <View style={styles.heroInfo}>
            <Text style={styles.title} numberOfLines={2}>{story.title}</Text>
            
            <View style={styles.authorRow}>
              <Text style={styles.authorName}>{story.author}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="eye-outline" size={16} color="#A0A0A0" />
                <Text style={styles.statText}>{story.views}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="star-outline" size={16} color="#A0A0A0" />
                <Text style={styles.statText}>{story.votes}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="list" size={16} color="#A0A0A0" />
                <Text style={styles.statText}>{story.chapters} chương</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('summary')}>
            <Text style={activeTab === 'summary' ? { ...styles.tabText, ...styles.activeTabText } : styles.tabText}>
              Tóm tắt
            </Text>
            {activeTab === 'summary' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('chapters')}>
            <Text style={activeTab === 'chapters' ? { ...styles.tabText, ...styles.activeTabText } : styles.tabText}>
              Chương
            </Text>
            {activeTab === 'chapters' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        {activeTab === 'summary' && (
          <View style={styles.summaryContent}>
            
            <View style={styles.statusRow}>
              <MaterialCommunityIcons name="book-open-variant" size={20} color="#FFF" />
              <Text style={styles.statusTextBold}>{story.status}</Text>
              <Text style={styles.statusTextSub}>{story.date} • {story.readTime}</Text>
            </View>
            
            <View style={styles.thinDivider} />

            {/* CẬP NHẬT: Render Category dạng mảng vào các thẻ Tag */}
            <View style={styles.tagsContainer}>
              {Array.isArray(story.category) ? (
                story.category.map((cat, index) => (
                  <View key={index} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{cat}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{story.category}</Text>
                </View>
              )}
            </View>

            <Text style={styles.descriptionText} numberOfLines={5}>
              {story.description}
            </Text>
            <TouchableOpacity>
              <Text style={styles.readMoreText}>Đọc thêm</Text>
            </TouchableOpacity>

            <View style={styles.thinDivider} />

            <TouchableOpacity style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {story.rank} <Text style={{color: '#A0A0A0', fontWeight: '400'}}>
                  {Array.isArray(story.category) ? story.category.join(', ') : story.category}
                </Text>
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#A0A0A0" />
            </TouchableOpacity>

            <View style={styles.thinDivider} />

            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Bạn cũng có thể thích</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginTop: 12 }}>
                {relatedStories.map((item) => (
                  <TouchableOpacity 
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => navigation.push('StoryDetail', { storyId: item.id })}
                  >
                    <Image source={item.cover} style={styles.relatedCover} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        
        {activeTab === 'chapters' && (
          <View style={styles.chaptersContent}>
            {story.chaptersList && story.chaptersList.map((chapter) => (
              <TouchableOpacity 
                key={chapter.id} 
                style={styles.chapterRow}
                onPress={() => navigation.navigate('Reading', { chapterId: chapter.id })}              
              >
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Text style={styles.chapterDate}>{chapter.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          activeOpacity={0.9}
          onPress={() => {
            const firstChapterId = story.chaptersList?.[0]?.id;
            if (firstChapterId) {
              navigation.navigate('Reading', { chapterId: firstChapterId });
            }
          }}
        >
          <Text style={styles.primaryButtonText}>Bắt đầu đọc</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={isFavorite ? { ...styles.addButton, ...styles.addButtonActive } : styles.addButton} 
          onPress={() => toggleFavorite(storyId)}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={30} 
            color={isFavorite ? "#FF500A" : "#FFF"} 
          />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, zIndex: 10 },
  iconButton: { padding: 4 },
  scrollContent: { paddingBottom: 120 },
  heroSection: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 10 },
  coverImage: { width: 115, height: 175, borderRadius: 8, backgroundColor: '#333' },
  heroInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 12, lineHeight: 28 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  authorName: { color: '#E0E0E0', fontSize: 14, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 15 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { color: '#A0A0A0', fontSize: 13 },
  tabsContainer: { flexDirection: 'row', marginTop: 30, justifyContent: 'center', gap: 80 },
  tabButton: { alignItems: 'center', paddingBottom: 10 },
  tabText: { color: '#A0A0A0', fontSize: 16, fontWeight: 'bold' },
  activeTabText: { color: '#FFF' },
  activeIndicator: { height: 3, width: 40, backgroundColor: '#FF500A', borderRadius: 2, position: 'absolute', bottom: 0 },
  divider: { height: 1, backgroundColor: '#262626' },
  thinDivider: { height: 1, backgroundColor: '#262626', marginVertical: 16 },
  summaryContent: { padding: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusTextBold: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  statusTextSub: { color: '#A0A0A0', fontSize: 14 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tagBadge: { backgroundColor: '#1E1E1E', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  tagText: { color: '#E0E0E0', fontSize: 13, fontWeight: '500' },
  descriptionText: { color: '#BBB', fontSize: 15, lineHeight: 24 },
  readMoreText: { color: '#FFF', fontWeight: 'bold', marginTop: 10, fontSize: 15 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E1E1E', padding: 14, borderRadius: 8 },
  categoryText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  relatedSection: { marginTop: 35 },
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  relatedCover: { width: 120, height: 180, borderRadius: 8, backgroundColor: '#333' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#121212', paddingHorizontal: 16, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#222' },
  primaryButton: { flex: 1, backgroundColor: '#FFF', height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  primaryButtonText: { color: '#000', fontSize: 18, fontWeight: '900' },
  addButton: { width: 54, height: 54, borderRadius: 27, borderWidth: 1.5, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  addButtonActive: { borderColor: '#FF500A' }, 
  chaptersContent: { paddingBottom: 20 },
  chapterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  chapterTitle: { color: '#E0E0E0', fontSize: 16, fontWeight: '400' },
  chapterDate: { color: '#8A8A8E', fontSize: 14 },
});

export default StoryDetailScreen;