import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { useBiblioteca } from '../context/BibliotecaContext';
import { tema } from '../constants/tema';

export function NavegadorBiblioteca() {
  const { sesionIniciada, hidratando } = useBiblioteca();

  if (hidratando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color={tema.colores.primario} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: tema.colores.superficie },
        headerTintColor: tema.colores.texto,
        contentStyle: { backgroundColor: tema.colores.fondo },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Protected guard={!sesionIniciada}>
        <Stack.Screen
          name="login"
          options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack.Protected>

      <Stack.Protected guard={sesionIniciada}>
        <Stack.Screen name="mostrador" />
      </Stack.Protected>

      <Stack.Screen name="buscar" />
      <Stack.Screen name="escanear" />
      <Stack.Screen name="reservar/[isbn]" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="permisos/[recurso]" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="reserva" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.fondo,
  },
});
