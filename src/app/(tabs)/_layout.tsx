import { Tabs } from 'expo-router/js-tabs';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../constants/tema';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tema.colores.primario,
        tabBarInactiveTintColor: tema.colores.textoSecundario,
        tabBarStyle: {
          backgroundColor: tema.colores.superficie,
          borderTopColor: tema.colores.borde,
        },
      }}
    >
      <Tabs.Screen
        name="(catalog)"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="library-outline"
              color={typeof color === 'string' ? color : tema.colores.textoSecundario}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="bookmark-outline"
              color={typeof color === 'string' ? color : tema.colores.textoSecundario}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
