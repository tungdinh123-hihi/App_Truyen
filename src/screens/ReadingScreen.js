import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, SafeAreaView, StatusBar, 
  FlatList 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { CHAPTER_CONTENTS, STORIES } from '../data/mockData';

const ReadingScreen = ({ route, navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // 1. TÌM ID CHƯƠNG HIỆN TẠI MỘT CÁCH CHÍNH XÁC
  let initialChapterId = route?.params?.chapterId;
  let chapter = null;
  let currentChapterId = initialChapterId;

  if (CHAPTER_CONTENTS && typeof CHAPTER_CONTENTS === 'object') {
    const keys = Object.keys(CHAPTER_CONTENTS);
    if (keys.length > 0) {
      // Nếu không có chapterId truyền vào, mặc định lấy chương đầu tiên
      if (!initialChapterId) {
        currentChapterId = keys[0]; 
      }
      chapter = CHAPTER_CONTENTS[currentChapterId];
    }
  }

  // 2. TÌM TRUYỆN ĐỂ LẤY DANH SÁCH CHƯƠNG & XỬ LÝ NÚT NEXT/PREV
  const currentStory = STORIES && STORIES.find(s => s.title === chapter?.bookName);
  const chapterList = currentStory ? currentStory.chaptersList : [];

  // Tìm vị trí (index) của chương hiện tại trong danh sách
  const currentChapterIndex = chapterList.findIndex(c => c.id === currentChapterId);
  const prevChapter = currentChapterIndex > 0 ? chapterList[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapterList.length - 1 ? chapterList[currentChapterIndex + 1] : null;

  // 3. TỰ ĐỘNG LƯU LỊCH SỬ
  const { addToHistory } = useAuth();
  useEffect(() => {
    if (currentStory && currentStory.id && route.params?.chapterId) {
      addToHistory(currentStory.id);
    }
  }, [currentStory]);

  if (!chapter) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <Ionicons name="warning-outline" size={50} color="#FF500A" style={{ marginBottom: 16 }} />
        <Text style={{ color: '#FFF', fontSize: 18, marginBottom: 20 }}>Nội dung chương chưa sẵn sàng!</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#FF500A', borderRadius: 8 }}
        >
          <Text style={{ color: '#FF500A', fontSize: 16, fontWeight: 'bold' }}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      {/* HEADER CONTAINER */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <Ionicons name="arrow-back" size={26} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerTitleContainer} 
            onPress={() => setDropdownVisible(!dropdownVisible)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerTitle}>
              {chapter.chapterName} 
              <Ionicons name={dropdownVisible ? "caret-up" : "caret-down"} size={14} color="#FFF" style={{marginLeft: 4}}/>
            </Text>
            <Text style={styles.headerSubtitle}>{chapter.bookName}</Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="cloud-offline-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Text style={styles.fontSettingText}>Aa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DROPDOWN XỔ XUỐNG */}
        {dropdownVisible && (
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity 
              style={styles.dropdownOverlay} 
              activeOpacity={1} 
              onPress={() => setDropdownVisible(false)} 
            />
            <View style={styles.dropdownListContainer}>
              <FlatList
                data={chapterList}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => {
                  const isActive = item.id === currentChapterId; // Cập nhật so sánh chính xác
                  return (
                    <TouchableOpacity
                      style={[styles.chapterItem, isActive && styles.activeChapterItem]}
                      onPress={() => {
                        setDropdownVisible(false);
                        navigation.replace('Reading', { chapterId: item.id });
                      }}
                    >
                      <Text style={[styles.chapterItemText, isActive && styles.activeChapterText]}>
                        {item.title}
                      </Text>
                      <Text style={styles.chapterItemDate}>{item.date}</Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <Text style={{color: '#888', textAlign: 'center', padding: 20}}>Chưa có danh sách chương</Text>
                }
              />
            </View>
          </View>
        )}
      </View>

      {/* NỘI DUNG ĐỌC */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
        <Text style={styles.mainTitle}>{chapter.chapterName}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={14} color="#888" />
            <Text style={styles.statText}>{chapter.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#888" />
            <Text style={styles.statText}>{chapter.votes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color="#888" />
            <Text style={styles.statText}>{chapter.comments}</Text>
          </View>
        </View>
        {/* <Text style={styles.paragraphText}>{chapter.content}</Text> */}
        <View style={styles.paragraphsContainer}>
          {chapter.paragraphs && chapter.paragraphs.map((text, index) => (
            <Text key={index} style={styles.paragraphText}>
              {text}
            </Text>
          ))}
        </View>
        
        {/* CẬP NHẬT: THANH ĐIỀU HƯỚNG CHƯƠNG (Chương trước / Chương sau) */}
        <View style={styles.chapterNavigation}>
          <TouchableOpacity 
            style={[styles.navButton, !prevChapter && styles.navButtonDisabled]}
            disabled={!prevChapter}
            onPress={() => navigation.replace('Reading', { chapterId: prevChapter.id })}
          >
            <Ionicons name="chevron-back" size={20} color={prevChapter ? "#FFF" : "#888"} />
            <Text style={[styles.navButtonText, !prevChapter && styles.navButtonTextDisabled]}>Chương trước</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navButton, !nextChapter && styles.navButtonDisabled]}
            disabled={!nextChapter}
            onPress={() => navigation.replace('Reading', { chapterId: nextChapter.id })}
          >
            <Text style={[styles.navButtonText, !nextChapter && styles.navButtonTextDisabled]}>Chương sau</Text>
            <Ionicons name="chevron-forward" size={20} color={nextChapter ? "#FFF" : "#888"} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} /> 
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="star-outline" size={24} color="#FF6B00" />
          <Text style={styles.bottomTabTextActive}>Bình chọn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="chatbox-outline" size={24} color="#FF6B00" />
          <Text style={styles.bottomTabTextActive}>{chapter.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="share-outline" size={24} color="#FF6B00" />
          <Text style={styles.bottomTabTextActive}>Chia sẻ</Text>
        </TouchableOpacity>
        
        
      </View>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1A1A1A' },
  headerContainer: { zIndex: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#1A1A1A' },
  headerIcon: { padding: 4, marginLeft: 10 },
  headerTitleContainer: { alignItems: 'center', flex: 1 },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', flexDirection: 'row', alignItems: 'center' },
  headerSubtitle: { color: '#A0A0A0', fontSize: 12, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  fontSettingText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  dropdownWrapper: { position: 'absolute', top: '100%', left: 0, right: 0, height: 1000 },
  dropdownOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  dropdownListContainer: { backgroundColor: '#1A1A1A', maxHeight: 350, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTopWidth: 1, borderTopColor: '#333', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  chapterItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  activeChapterItem: { backgroundColor: '#2A2A2A' },
  chapterItemText: { color: '#CCC', fontSize: 16 },
  activeChapterText: { color: '#FF500A', fontWeight: 'bold' },
  chapterItemDate: { color: '#666', fontSize: 13 },
  contentContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  mainTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 30, marginBottom: 20, color: '#333', fontFamily: 'serif' },
  statsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40, gap: 24 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { color: '#888', fontSize: 13 },
  paragraphsContainer: { paddingHorizontal: 20 },
  paragraphText: { fontSize: 18, lineHeight: 28, color: '#222', fontFamily: 'serif', marginBottom: 24 },
  
  // STYLE NÚT ĐIỀU HƯỚNG CHƯƠNG MỚI THÊM
  chapterNavigation: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, paddingBottom: 20 },
  navButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF500A', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, elevation: 2 },
  navButtonDisabled: { backgroundColor: '#F0F0F0' },
  navButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold', marginHorizontal: 6 },
  navButtonTextDisabled: { color: '#888' },

  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEEEEE', paddingVertical: 10, paddingBottom: 20 },
  bottomTab: { alignItems: 'center', justifyContent: 'center' },
  bottomTabTextActive: { color: '#A0A0A0', fontSize: 12, marginTop: 4 },
});

export default ReadingScreen;