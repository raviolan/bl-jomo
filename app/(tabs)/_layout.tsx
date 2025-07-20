import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';

import { MenuProvider } from '@/app/context/MenuContext';
import MenuDrawer from '@/components/ui/MenuDrawer';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <MenuProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: { position: 'absolute' },
              default: {},
            }),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="likes"
            options={{
              title: 'Likes',
              tabBarIcon: () => <Text style={{ fontSize: 20 }}>❤️</Text>,
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
              tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔍</Text>,
            }}
          />
          <Tabs.Screen
            name="locations"
            options={{
              title: 'Places',
              tabBarIcon: () => <Text style={{ fontSize: 20 }}>📍</Text>,
            }}
          />
          <Tabs.Screen
            name="categories"
            options={{
              title: 'Topics',
              tabBarIcon: () => <Text style={{ fontSize: 20 }}>🗂️</Text>,
            }}
          />
          <Tabs.Screen
            name="host"
            options={{
              title: 'Host',
              tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎤</Text>,
            }}
          />
        </Tabs>

        {/* 🧾 Renders the drawer on top of all screens */}
        <MenuDrawer />
      </View>
    </MenuProvider>
  );
}