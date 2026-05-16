import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, SafeAreaView, StatusBar, 
  FlatList, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CHAPTER_CONTENTS, STORIES } from '../data/mockData';

const FONT_FAMILIES = [
  { id: Platform.OS === 'ios' ? 'Georgia' : 'serif', name: 'Có chân (Serif)' },
  { id: Platform.OS === 'ios' ? 'Helvetica' : 'normal', name: 'Mặc định (Sans)' },
  { id: Platform.OS === 'ios' ? 'Courier' : 'monospace', name: 'Đơn cách (Mono)' }
];

const ReadingScreen = ({ route, navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fontPanelVisible, setFontPanelVisible] = useState(false);
  const [fontSize, setFontSize] = useState(18); 
  
  const [fontFamily, setFontFamily] = useState(Platform.OS === 'ios' ? 'Georgia' : 'serif');
  // 1. Tạo một State để kiểm tra chương này đã tải chưa
const [isDownloaded, setIsDownloaded] = useState(false);

// 2. Hàm xử lý khi bấm nút Đám mây
const handleDownloadOffline = async () => {
  try {
    // Lưu toàn bộ cục nội dung chapter vào máy theo ID
    await AsyncStorage.setItem(`@offline_chapter_${currentChapterId}`, JSON.stringify(chapter));
    setIsDownloaded(true);
    alert("Đã tải chương này để đọc ngoại tuyến!");
  } catch (error) {
    console.log("Lỗi tải truyện", error);
  }
};
  // Tìm ID chương hiện tại
  let initialChapterId = route?.params?.chapterId;
  let chapter = null;
  let currentChapterId = initialChapterId;

  if (CHAPTER_CONTENTS && typeof CHAPTER_CONTENTS === 'object') {
    const keys = Object.keys(CHAPTER_CONTENTS);
    if (keys.length > 0) {
      if (!initialChapterId) {
        currentChapterId = keys[0]; 
      }
      chapter = CHAPTER_CONTENTS[currentChapterId];
    }
  }

  // Tìm truyện và danh sách chương để xử lý nút bấm Next/Prev
  const currentStory = STORIES && STORIES.find(s => s.title === chapter?.bookName);
  const chapterList = currentStory ? currentStory.chaptersList : [];

  const currentChapterIndex = chapterList.findIndex(c => c.id === currentChapterId);
  const prevChapter = currentChapterIndex > 0 ? chapterList[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapterList.length - 1 ? chapterList[currentChapterIndex + 1] : null;

  // Tự động lưu lịch sử đọc truyện
  const { addToHistory } = useAuth();
  useEffect(() => {
    if (currentStory && currentStory.id && route.params?.chapterId) {
      addToHistory(currentStory.id);
    }
  }, [currentStory]);

  // Hàm tăng/giảm kích thước chữ
  const adjustFontSize = (type) => {
    if (type === 'increase' && fontSize < 30) setFontSize(fontSize + 2);
    if (type === 'decrease' && fontSize > 14) setFontSize(fontSize - 2);
  };

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
      
      {/* HEADER BAR */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <Ionicons name="arrow-back" size={26} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerTitleContainer} 
            onPress={() => {
              setDropdownVisible(!dropdownVisible);
              setFontPanelVisible(false); 
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.headerTitle}>
              {chapter.chapterName} 
              <Ionicons name={dropdownVisible ? "caret-up" : "caret-down"} size={14} color="#FFF" style={{marginLeft: 4}}/>
            </Text>
            <Text style={styles.headerSubtitle}>{chapter.bookName}</Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleDownloadOffline} style={styles.headerIcon}>
  <Ionicons 
    name={isDownloaded ? "cloud-done" : "cloud-offline-outline"} 
    size={24} 
    color={isDownloaded ? "#FF500A" : "#FFF"} 
  />
</TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerIcon} 
              onPress={() => {
                setFontPanelVisible(!fontPanelVisible);
                setDropdownVisible(false); 
              }}
            >
              <Text style={[styles.fontSettingText, fontPanelVisible && { color: '#FF500A' }]}>Aa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DROPDOWN DANH SÁCH CHƯƠNG */}
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
                  const isActive = item.id === currentChapterId;
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

      {/* NỘI DUNG CHỮ TRUYỆN */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
        <Text style={[styles.mainTitle, { fontFamily: fontFamily }]}>{chapter.chapterName}</Text>
        
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

        <View style={styles.paragraphsContainer}>
          {chapter.paragraphs && chapter.paragraphs.map((text, index) => (
            <Text 
              key={index} 
              style={[
                styles.paragraphText, 
                { 
                  fontSize: fontSize, 
                  fontFamily: fontFamily, 
                  lineHeight: fontSize * 1.55 
                }
              ]}
            >
              {text}
            </Text>
          ))}
        </View>
        
        {/* NÚT CHUYỂN CHƯƠNG PREV / NEXT */}
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

      {/* BẢNG TÙY CHỈNH FONT CHỮ (FONT PANEL) */}
      {fontPanelVisible && (
        <View style={styles.fontPanelContainer}>
          {/* Tùy chỉnh Kích thước */}
          <View style={styles.panelRow}>
            <Text style={styles.panelLabel}>Kích cỡ</Text>
            <View style={styles.sizeControlGroup}>
              <TouchableOpacity style={styles.sizeBtn} onPress={() => adjustFontSize('decrease')}>
                <Text style={styles.sizeBtnText}>A-</Text>
              </TouchableOpacity>
              <Text style={styles.sizeValueText}>{fontSize}</Text>
              <TouchableOpacity style={styles.sizeBtn} onPress={() => adjustFontSize('increase')}>
                <Text style={styles.sizeBtnText}>A+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tùy chỉnh Kiểu chữ */}
          <View style={styles.panelRow}>
            <Text style={styles.panelLabel}>Kiểu chữ</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fontFamilyGroup}>
              {FONT_FAMILIES.map((f) => {
                const isSelected = fontFamily === f.id;
                return (
                  <TouchableOpacity 
                    key={f.id} 
                    style={[styles.fontFamilyBtn, isSelected && styles.fontFamilyBtnActive]}
                    onPress={() => setFontFamily(f.id)}
                  >
                    <Text style={[styles.fontFamilyBtnText, isSelected && styles.fontFamilyBtnTextActive, { fontFamily: f.id }]}>
                      {f.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* BOTTOM TAB BAR */}
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
  mainTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 30, marginBottom: 20, color: '#333' },
  statsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40, gap: 24 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { color: '#888', fontSize: 13 },
  paragraphsContainer: { paddingHorizontal: 20 },
  paragraphText: { color: '#222', marginBottom: 24 },
  
  chapterNavigation: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, paddingBottom: 20 },
  navButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF500A', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, elevation: 2 },
  navButtonDisabled: { backgroundColor: '#F0F0F0' },
  navButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold', marginHorizontal: 6 },
  navButtonTextDisabled: { color: '#888' },

  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEEEEE', paddingVertical: 10, paddingBottom: 20 },
  bottomTab: { alignItems: 'center', justifyContent: 'center' },
  bottomTabTextActive: { color: '#A0A0A0', fontSize: 12, marginTop: 4 },

  fontPanelContainer: { backgroundColor: '#1A1A1A', padding: 16, borderTopWidth: 1, borderTopColor: '#333', borderTopLeftRadius: 16, borderTopRightRadius: 16, position: 'absolute', bottom: 75, left: 0, right: 0, zIndex: 99 },
  panelRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between' },
  panelLabel: { color: '#AAA', fontSize: 14, fontWeight: '500', width: 70 },
  sizeControlGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A2A2A', borderRadius: 8, padding: 4 },
  sizeBtn: { paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#333', borderRadius: 6 },
  sizeBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  sizeValueText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginHorizontal: 16, minWidth: 20, textAlign: 'center' },
  fontFamilyGroup: { flexDirection: 'row', gap: 10, paddingLeft: 4 },
  fontFamilyBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#2A2A2A', borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  fontFamilyBtnActive: { backgroundColor: '#FF500A', borderColor: '#FF500A' },
  fontFamilyBtnText: { color: '#CCC', fontSize: 14 },
  fontFamilyBtnTextActive: { color: '#FFF', fontWeight: 'bold' }
});

export default ReadingScreen;