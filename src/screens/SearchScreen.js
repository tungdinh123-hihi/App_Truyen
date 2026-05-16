import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, StatusBar, 
  TextInput, FlatList, TouchableOpacity, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STORIES } from '../data/mockData';

const CATEGORIES = [
  'Lãng mạn', 'Fanfiction', 'Truyện Ngắn', 'Hài hước', 'Viễn tưởng',
  'Hành động', 'Khoa Học Viễn Tưởng', 'Kinh dị', 'Bí ẩn', 'Thriller', 
  'Phiêu lưu', 'Tiểu Thuyết Lịch Sử', 'Siêu nhiên', 'Vampire',  
  'Thơ Ca', 'Cổ điển'
];

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  useEffect(() => {
    if (searchQuery.trim() === '' && !selectedCategory) {
      setSearchResults([]);
      return;
    }

    let filtered = STORIES;

    // 1. Lọc theo từ khóa (nếu có)
    if (searchQuery.trim() !== '') {
      const formattedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(formattedQuery) || 
        story.author.toLowerCase().includes(formattedQuery)
      );
    }

    // 2. Lọc tiếp theo thể loại 
    if (selectedCategory) {
      const formattedCat = selectedCategory.toLowerCase();
      filtered = filtered.filter(story => {
        // Kiểm tra an toàn: Nếu là mảng thì dùng .some(), nếu là chuỗi thì so sánh bình thường
        const catMatch = Array.isArray(story.category) 
          ? story.category.some(c => c.toLowerCase() === formattedCat)
          : story.category?.toLowerCase() === formattedCat;
          
        const tagMatch = story.tags?.some(tag => tag.toLowerCase() === formattedCat);
        return catMatch || tagMatch;
      });
    }

    setSearchResults(filtered);
  }, [searchQuery, selectedCategory]);

  const clearSearch = () => {
    setSearchQuery('');
  };

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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* THANH TÌM KIẾM */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm truyện hoặc người"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false} 
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* KHUNG CHỌN THỂ LOẠI */}
      <View style={styles.categoryPanel}>
        {isCategoryExpanded ? (
          <View>
            <View style={styles.tagsWrapper}>
              {CATEGORIES.map((cat, index) => {
                const isActive = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.catBadge, isActive && styles.catBadgeActive]}
                    onPress={() => setSelectedCategory(isActive ? null : cat)} 
                  >
                    <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity 
              style={styles.collapseIcon}
              onPress={() => setIsCategoryExpanded(false)}
            >
              <Ionicons name="chevron-up" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.expandRow}
            onPress={() => setIsCategoryExpanded(true)}
          >
            <Text style={styles.expandText}>
              {selectedCategory ? `Đang lọc: ${selectedCategory}` : "Hiển thị bộ lọc thể loại"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* HIỂN THỊ KẾT QUẢ TÌM KIẾM */}
      {searchQuery.trim() === '' && !selectedCategory ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={60} color="#333" />
          <Text style={styles.emptyText}>Nhập tên truyện hoặc chọn một thể loại để bắt đầu tìm kiếm</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={60} color="#333" />
              <Text style={styles.emptyText}>Không tìm thấy truyện nào khớp với yêu cầu của bạn</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 12, 
    borderBottomWidth: 1, borderBottomColor: '#222' 
  },
  backButton: { padding: 4, marginRight: 12 },
  searchBar: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#2A2A2A', borderRadius: 8,
    paddingHorizontal: 12, height: 44 
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 16, outlineStyle: 'none' }, 
  clearButton: { padding: 4 },
  
  categoryPanel: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    position: 'relative'
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingRight: 30
  },
  catBadge: {
    backgroundColor: '#2A2A2A', 
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  catBadgeActive: {
    backgroundColor: '#FFFFFF', 
  },
  catText: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: '500'
  },
  catTextActive: {
    color: '#000', 
    fontWeight: 'bold'
  },
  collapseIcon: {
    position: 'absolute',
    top: -5,
    right: 0,
    padding: 4
  },
  expandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  expandText: {
    color: '#CCC',
    fontSize: 16,
    fontWeight: '500'
  },

  listContainer: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 3 },
  cover: { width: 85, height: 120, backgroundColor: '#333' },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6, lineHeight: 22 },
  author: { color: '#A0A0A0', fontSize: 13, marginBottom: 10 },
  stats: { flexDirection: 'row', alignItems: 'center' },
  statText: { color: '#A0A0A0', fontSize: 13, marginLeft: 4 },
  dot: { color: '#666', marginHorizontal: 8 },
  statusText: { color: '#FF500A', fontSize: 12, fontWeight: '500' },
  
  emptyContainer: { alignItems: 'center', marginTop: 100, paddingHorizontal: 30 },
  emptyText: { color: '#888', fontSize: 16, marginTop: 16, textAlign: 'center', lineHeight: 24 }
});

export default SearchScreen;