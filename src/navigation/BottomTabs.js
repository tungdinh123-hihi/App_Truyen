import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SearchScreen from '../screens/SearchScreen';
import HomeScreen from '../screens/HomeScreen';
import DummyScreen from '../screens/DummyScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import { Alert } from 'react-native';
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') return <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />;
          if (route.name === 'Search') return <Ionicons name={focused ? 'search' : 'search-outline'} size={26} color={color} />;
          if (route.name === 'Favorite') return <Ionicons name={focused ? 'heart' : 'heart-outline'} size={26} color={color} />;
          
          if (route.name === 'History') return <MaterialCommunityIcons name={focused ? 'history' : 'clock-outline'} size={26} color={color} />;
          
          if (route.name === 'Notifications') return <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#FF500A',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: '#222',
          paddingBottom: 5,
          height: 60,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorite" component={FavoriteScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen 
        name="Notifications" 
        component={DummyScreen} 
        listeners={{
          tabPress: (e) => {
            // Ngăn chặn hành động chuyển tab mặc định của React Navigation
            e.preventDefault();
            
            // Hiện thông báo (Tùy chọn)
            // Alert.alert('Thông báo', 'Tính năng Thông báo đang được phát triển!');
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;