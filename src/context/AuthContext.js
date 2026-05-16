import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user_info');
        if (storedUser) setUser(JSON.parse(storedUser));

        // Tải danh sách yêu thích khi mở app
        const storedFavs = await AsyncStorage.getItem('@favorites');
        if (storedFavs) setFavorites(JSON.parse(storedFavs));
        const storedHistory = await AsyncStorage.getItem('@history');
        if (storedHistory) setHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.log('Lỗi khi đọc AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const login = async (userData) => { 
    try {
      setUser(userData);
      await AsyncStorage.setItem('@user_info', JSON.stringify(userData));
    } catch (error) { console.log(error); }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('@user_info');
      // Tùy chọn: Xóa danh sách yêu thích khi đăng xuất (hoặc giữ lại tùy bạn)
      setFavorites([]); 
      await AsyncStorage.removeItem('@favorites');
      setHistory([]);
      await AsyncStorage.removeItem('@history');
    } catch (error) { console.log(error); }
  };

  // THÊM HÀM NÀY: Xử lý Thêm/Xóa khỏi danh sách yêu thích
  const toggleFavorite = async (storyId) => {
    try {
      let updatedFavs = [];
      // Nếu đã có trong danh sách -> Xóa đi
      if (favorites.includes(storyId)) {
        updatedFavs = favorites.filter(id => id !== storyId);
      } else {
        // Nếu chưa có -> Thêm vào mảng
        updatedFavs = [...favorites, storyId];
      }
      setFavorites(updatedFavs);
      await AsyncStorage.setItem('@favorites', JSON.stringify(updatedFavs));
    } catch (error) {
      console.log('Lỗi khi lưu danh sách yêu thích:', error);
    }
  };
  const addToHistory = async (storyId) => {
    try {
      // 1. Lọc bỏ truyện này nếu nó đã có trong lịch sử (để tránh trùng lặp)
      const filteredHistory = history.filter(id => id !== storyId);
      // 2. Đẩy truyện này lên đầu mảng (mới đọc nhất)
      const newHistory = [storyId, ...filteredHistory];
      
      setHistory(newHistory);
      await AsyncStorage.setItem('@history', JSON.stringify(newHistory));
    } catch (error) {
      console.log('Lỗi khi lưu lịch sử:', error);
    }
  };
  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem('@history');
  };
  const removeFromHistory = async (storyId) => {
    try {
      const updatedHistory = history.filter(id => id !== storyId);
      setHistory(updatedHistory);
      await AsyncStorage.setItem('@history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Lỗi khi xóa 1 truyện:', error);
    }
  };
  // Xuất ra để các màn hình khác sử dụng
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, favorites, toggleFavorite,history, addToHistory, clearHistory,removeFromHistory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);