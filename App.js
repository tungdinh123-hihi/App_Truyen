import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavoriteScreen from './src/screens/FavoriteScreen';
import HistoryScreen from './src/screens/HistoryScreen';
// Import Context
import { AuthProvider, useAuth } from './src/context/AuthContext';
import SearchScreen from './src/screens/SearchScreen';
// Import Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BottomTabs from './src/navigation/BottomTabs';
import StoryDetailScreen from './src/screens/StoryDetailScreen';
import ReadingScreen from './src/screens/ReadingScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#FF500A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // LUỒNG 1: NẾU ĐÃ ĐĂNG NHẬP (user có dữ liệu) -> Chỉ load các màn hình chính
          <>
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
            <Stack.Screen name="Reading" component={ReadingScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Favorite" component={FavoriteScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </>
        ) : (
          // LUỒNG 2: NẾU CHƯA ĐĂNG NHẬP -> Bắt buộc ở ngoài màn hình Auth
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}