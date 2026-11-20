import { Stack, Tabs } from 'expo-router';
import { useState, useEffect } from 'react';

export default function RootLayout() {
  const [session, setSession] = useState<'login' | 'main'>('login');

  useEffect(() => {
    // Simulación: después de un corto tiempo, mantener login activo
    // En realidad esto sería AsyncStorage o contexto
    const timer = setTimeout(() => setSession('main'), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (session === 'login') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
      </Stack>
    );
  }

  // Ya hay sesión activa: mostrar el navegador principal con pestañas
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