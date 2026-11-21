import { Stack } from 'expo-router';
import { BotonPersonal } from '../../../components/BotonPersonal';
import { tema } from '../../../constants/tema';

export const unstable_settings = {
  anchor: 'index',
};

export default function CatalogLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tema.colores.superficie },
        headerTintColor: tema.colores.texto,
        contentStyle: { backgroundColor: tema.colores.fondo },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Catálogo',
          headerRight: () => <BotonPersonal />,
        }}
      />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Detalle' }} />
    </Stack>
  );
}
