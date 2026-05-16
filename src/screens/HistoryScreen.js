import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STORIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const HistoryScreen = ({ navigation }) => {
  // Lấy thêm hàm removeFromHistory từ Context
  const { history, clearHistory, removeFromHistory } = useAuth();

  // Ánh xạ mảng ID thành mảng dữ liệu truyện. (Map theo mảng history để giữ đúng thứ tự từ mới nhất đến cũ nhất)
  const historyStories = history
    .map(id => STORIES.find(s => s.id === id))
    .filter(story => story !== undefined);

  const handleClearHistory = () => {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử đọc không?");
      if (confirmDelete) {
        clearHistory();
      }
    } else {
      Alert.alert(
        "Xóa lịch sử",
        "Bạn có chắc chắn muốn xóa toàn bộ lịch sử đọc không?",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Xóa", onPress: () => clearHistory(), style: "destructive" }
        ]
      );
    }
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
          <Text style={styles.statusText}>Đã đọc gần đây</Text>
        </View>
      </View>

      {/* CẬP NHẬT: Thêm nút Xóa từng truyện (dấu X) */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => removeFromHistory(item.id)} // Gọi hàm xóa 1 truyện
      >
        <Ionicons name="close-circle" size={24} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch Sử Đọc</Text>
        
        {/* Nút Xóa lịch sử (Chỉ hiện khi có dữ liệu) */}
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClearHistory} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={24} color="#FF500A" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 34 }} />
        )}
      </View>

      {/* DANH SÁCH */}
      <FlatList
        data={historyStories}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={50} color="#555" />
            <Text style={styles.emptyText}>Bạn chưa đọc truyện nào</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#222' },
  iconButton: { padding: 4 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  listContainer: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 3 },
  cover: { width: 85, height: 120, backgroundColor: '#333' },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6, lineHeight: 22 },
  author: { color: '#A0A0A0', fontSize: 13, marginBottom: 10 },
  stats: { flexDirection: 'row', alignItems: 'center' },
  statusText: { color: '#888', fontSize: 12, fontStyle: 'italic' },
  // Thêm style cho nút xóa từng truyện
  deleteButton: { padding: 12, justifyContent: 'center', alignItems: 'center' }, 
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#888', fontSize: 16, marginTop: 16 }
});

export default HistoryScreen;