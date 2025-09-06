import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import MealsScreen from './src/screens/MealsScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import ShoppingScreen from './src/screens/ShoppingScreen';
import ProgressScreen from './src/screens/ProgressScreen';

const Tab = createBottomTabNavigator();

const COLORS = {
  red: '#CE1126',
  gold: '#FCD116',
  green: '#006B3F',
  darkGray: '#212529',
  lightGray: '#F8F9FA',
  white: '#FFFFFF'
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.red} barStyle="light-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            if (route.name === 'Meals') {
              iconName = 'restaurant';
            } else if (route.name === 'Workouts') {
              iconName = 'fitness-center';
            } else if (route.name === 'Shopping') {
              iconName = 'shopping-cart';
            } else if (route.name === 'Progress') {
              iconName = 'trending-up';
            }
            
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.red,
          tabBarInactiveTintColor: COLORS.darkGray,
          tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopColor: COLORS.lightGray,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8
          },
          headerStyle: {
            backgroundColor: COLORS.red,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Meals" 
          component={MealsScreen}
          options={{
            title: '🇬🇭 Ghanaian Meals'
          }}
        />
        <Tab.Screen 
          name="Workouts" 
          component={WorkoutsScreen}
          options={{
            title: '💪 Workouts'
          }}
        />
        <Tab.Screen 
          name="Shopping" 
          component={ShoppingScreen}
          options={{
            title: '🛒 Shopping'
          }}
        />
        <Tab.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{
            title: '📊 Progress'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}