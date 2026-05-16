import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';


const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  const getAvatarImage = (avatarName) => {
    switch(avatarName) {
      case 'avatar1': return require('../../assets/images/avatar1.jpg');
      case 'logo': return require('../../assets/images/logo.png');

      default: return null;
    }
  };
  const getAvatarChar = () => {
    return user?.username ? user.username.charAt(0).toUpperCase() : '?';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="settings" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* THÔNG TIN NGƯỜI DÙNG DỰA TRÊN ACCOUNT ĐÃ ĐĂNG NHẬP */}
        <View style={styles.userInfoSection}>
          
          {/* CẬP NHẬT Ở ĐÂY: Dùng hàm getAvatarImage */}
          {user?.avatar ? (
            <Image source={getAvatarImage(user.avatar)} style={styles.largeAvatarImage} />
          ) : (
            <View style={styles.largeAvatar}>
              <Text style={styles.largeAvatarText}>{getAvatarChar()}</Text>
            </View>
          )}
          
          <Text style={styles.userName}>{user?.username || 'Người dùng'}</Text>
          <Text style={styles.userHandle}>{user?.email}</Text>

          {/* THỐNG KÊ ĐỘNG TỪ MOCKDATA */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.works || 0}</Text>
              <Text style={styles.statLabel}>Tác phẩm</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.followers || 0}</Text>
              <Text style={styles.statLabel}>Người theo dõi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.following || 0}</Text>
              <Text style={styles.statLabel}>Đang theo dõi</Text>
            </View>
          </View>
        </View>

        {/* MENU TÍNH NĂNG */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="book-outline" size={24} color="#FFF" style={styles.menuIcon} />
            <Text style={styles.menuText}>Tác phẩm của tôi</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Favorite')}
          >
            <Ionicons name="bookmark-outline" size={24} color="#FFF" style={styles.menuIcon} />
            <Text style={styles.menuText}>Danh sách đọc (Yêu thích)</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
          style={styles.menuItem}
            onPress={() => navigation.navigate('History')}>
            <Ionicons name="time-outline" size={24} color="#FFF" style={styles.menuIcon} />
            <Text style={styles.menuText}>Lịch sử đọc</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* NÚT ĐĂNG XUẤT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF500A" style={styles.menuIcon} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  largeAvatarImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  iconButton: { padding: 4 },
  scrollContent: { paddingBottom: 40 },
  userInfoSection: { alignItems: 'center', marginTop: 10, paddingHorizontal: 20 },
  largeAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#8E44AD', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  largeAvatarText: { color: '#FFF', fontSize: 48, fontWeight: 'bold' },
  userName: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  userHandle: { color: '#A0A0A0', fontSize: 16, marginBottom: 24 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#222' },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { color: '#A0A0A0', fontSize: 13 },
  statDivider: { width: 1, height: 30, backgroundColor: '#333' },
  menuSection: { marginTop: 24, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#222' },
  menuIcon: { marginRight: 16 },
  menuText: { color: '#FFF', fontSize: 16, flex: 1 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingHorizontal: 20, paddingVertical: 18 },
  logoutText: { color: '#FF500A', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;