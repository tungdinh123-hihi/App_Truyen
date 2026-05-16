import React from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { STORIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const FavoriteScreen = ({ navigation }) => {
  const { favorites, toggleFavorite } = useAuth();

  const favoriteStories = STORIES.filter(story => favorites.includes(story.id));

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
    >
      <Image source={item.cover} style={styles.cover} />
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        
        <View style={styles.stats}>
          <Ionicons name="star" size={14} color="#FF500A" />
          <Text style={styles.statText}>{item.votes}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => toggleFavorite(item.id)} 
      >
         <Ionicons name="close-circle" size={24} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Truyện Yêu Thích</Text>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={favoriteStories}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={50} color="#555" />
            <Text style={styles.emptyText}>Chưa có truyện nào trong danh sách</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#222' },
  backButton: { padding: 4 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  listContainer: { padding: 16, paddingBottom: 80 },
  card: { flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 3 },
  cover: { width: 85, height: 120, backgroundColor: '#333' },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6, lineHeight: 22 },
  author: { color: '#A0A0A0', fontSize: 13, marginBottom: 10 },
  stats: { flexDirection: 'row', alignItems: 'center' },
  statText: { color: '#A0A0A0', fontSize: 13, marginLeft: 4 },
  dot: { color: '#666', marginHorizontal: 8 },
  statusText: { color: '#FF500A', fontSize: 12, fontWeight: '500' },
  actionButton: { padding: 12, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#888', fontSize: 16, marginTop: 16 }
});

export default FavoriteScreen;