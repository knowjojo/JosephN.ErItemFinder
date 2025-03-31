/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchScreen from './screens/SearchScreen';
import DetailsScreen from './screens/DetailsScreen';
import MapScreen from './screens/MapScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import Background from './Background';
import { FavoritesProvider } from './context/FavoritesContext';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Custom navigation options to match the other screen styles
const screenOptions = {
  headerStyle: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: '#e2c792',
    fontWeight: 'bold' as 'bold',
    fontSize: 20,
  },
  headerTintColor: '#e2c792',
};


const SearchStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="Search" 
      component={SearchScreen} 
      options={{
        title: 'Search Items',
      }}
    />
    <Stack.Screen 
      name="Details" 
      component={DetailsScreen} 
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="Favorites" 
      component={FavoritesScreen} 
      options={{
        title: 'Favorites',
      }}
    />
    <Stack.Screen 
      name="Details" 
      component={DetailsScreen} 
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);


const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <FavoritesProvider>
        <Background>
          <NavigationContainer>
            <Tab.Navigator 
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName = '';
                  
                  if (route.name === 'SearchTab') {
                    iconName = 'magnify';
                  } else if (route.name === 'MapTab') {
                    iconName = 'map';
                  } else if (route.name === 'FavoritesTab') {
                    iconName = focused ? 'star' : 'star-outline';
                  }
                  
                  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#e2c792',
                tabBarInactiveTintColor: '#9b8065',
                tabBarStyle: {
                  backgroundColor: 'rgba(20, 20, 20, 0.9)',
                  borderTopColor: 'rgba(155, 128, 101, 0.3)',
                  borderTopWidth: 1,
                  paddingTop: 5,
                  height: 60,
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '500',
                  marginBottom: 5,
                },
              })}
            >
              <Tab.Screen 
                name="SearchTab" 
                component={SearchStack} 
                options={{ 
                  tabBarLabel: 'Search',
                }}
              />
              <Tab.Screen 
                name="MapTab" 
                component={MapScreen} 
                options={{ 
                  tabBarLabel: 'Map',
                  ...screenOptions,
                }}
              />
              <Tab.Screen 
                name="FavoritesTab" 
                component={FavoritesStack} 
                options={{ 
                  tabBarLabel: 'Favorites',
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </Background>
      </FavoritesProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
  );
};



export default App;