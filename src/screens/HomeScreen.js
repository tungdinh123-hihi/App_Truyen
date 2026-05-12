import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Image } from 'react-native';
import { STORIES } from '../data/mockData';

import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  //  Khai báo biến user từ hook useAuth để dùng cho Avatar
  const { user } = useAuth();
  const getAvatarImage = (avatarName) => {
    switch(avatarName) {
      case 'avatar1': return require('../../assets/images/avatar1.jpg');
      case 'logo': return require('../../assets/images/logo.png');

      default: return null;
    }
  };
  // Hàm hỗ trợ render danh sách truyện cuộn ngang để tối ưu code
  const renderHorizontalList = (data) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
      {data.map((item, index) => (
        <TouchableOpacity 
          key={item.id} 
          activeOpacity={0.8}
          // Thêm sự kiện onPress để chuyển hướng và truyền storyId
          onPress={() => {
            if (item.id) {
              navigation.navigate('StoryDetail', { storyId: item.id });
            }
          }}
        >       
          {/* Lấy item.cover nếu là object, hoặc item nếu nó vẫn đang là chuỗi string */}
          <Image source={ item.cover || item } style={styles.normalCover} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={styles.header}>
      <Image 
          source={require('../../assets/images/unnamed.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
                <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('Profile')}>
          
          {user?.avatar ? (
            <Image source={getAvatarImage(user.avatar)} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase() || '?'}</Text>
          )}

        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Mục 1: Truyện hay nhất đề xuất cho bạn */}
        <View style={styles.firstSection}>
          <Text style={styles.sectionTitle}>Truyện hay nhất đề xuất cho bạn</Text>
          {renderHorizontalList(STORIES)}
        </View>

        {/* Mục 2: Chúng tôi tin bạn sẽ thích */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Truyện mới cập nhật</Text>
          {renderHorizontalList([...STORIES].reverse())}
        </View>
        
        {/* Mục 3: Truyện đã Hoàn Thành */}
        <View style={styles.section}>
          {/* <Text style={styles.superTitle}>2</Text> */}
          <Text style={styles.sectionTitle}>Truyện đã Hoàn Thành</Text>
          {renderHorizontalList(STORIES)}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  logoText: { fontSize: 28, fontWeight: '900', color: '#FF500A', fontStyle: 'italic' },
  avatarContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#8E44AD', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 20 },
  firstSection: { marginTop: 10 }, 
  section: { marginTop: 24 },
  superTitle: { color: '#A0A0A0', fontSize: 13, paddingHorizontal: 16, marginBottom: 4 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 16 },
  horizontalScroll: { paddingLeft: 16, paddingRight: 8, gap: 10 },
  normalCover: { width: 130, height: 200, borderRadius: 8, backgroundColor: '#333', marginRight: 10 },
  avatarImage: { width: 36, height: 36, borderRadius: 18 },
  logoImage: {
    width: 100,  
    height: 40,  
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default HomeScreen;