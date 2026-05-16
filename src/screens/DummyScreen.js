import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Image } from 'react-native';
import MosaicSection from '../components/MosaicSection';
import { mockImages } from '../data/mockData';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={styles.header}>
        <Text style={styles.logoText}>W</Text> 
        <TouchableOpacity style={styles.avatarContainer}>
          <Text style={styles.avatarText}>T</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <MosaicSection title="Truyện hay nhất đề xuất cho bạn" data={mockImages} />
        <MosaicSection title="Chúng tôi tin bạn sẽ thích" data={[...mockImages].reverse()} />
        
        <View style={styles.section}>
          <Text style={styles.superTitle}>Đọc say sưa từ đầu đến cuối</Text>
          <Text style={styles.sectionTitle}>Truyện đã Hoàn Thành</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
             {mockImages.map((img, index) => (
                <TouchableOpacity key={index} activeOpacity={0.8}>
                  <Image source={{ uri: img }} style={styles.normalCover} />
                </TouchableOpacity>
             ))}
          </ScrollView>
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
  section: { marginTop: 24 },
  superTitle: { color: '#A0A0A0', fontSize: 13, paddingHorizontal: 16, marginBottom: 4 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 16 },
  horizontalScroll: { paddingLeft: 16, paddingRight: 8, gap: 10 },
  normalCover: { width: 130, height: 200, borderRadius: 8, backgroundColor: '#333', marginRight: 10 },
});

export default HomeScreen;