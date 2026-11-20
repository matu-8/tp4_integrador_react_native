import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="buscar" />
      <Tabs.Screen name="reservas" />
      <Tabs.Screen name="mostrador" />
    </Tabs>
  );
}