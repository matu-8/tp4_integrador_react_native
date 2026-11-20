import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { useBiblioteca } from '../context/BibliotecaContext';
import { tema } from '../constants/tema';

export function BotonPersonal() {
  const { sesionIniciada } = useBiblioteca();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Acceso del personal de biblioteca"
      onPress={() => router.push(sesionIniciada ? '/mostrador' : '/login')}
      style={styles.boton}
    >
      <Text style={styles.texto}>Personal</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    minWidth: tema.dimensiones.areaMinimaTactil,
    minHeight: tema.dimensiones.areaMinimaTactil,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: tema.espaciado.md,
  },
  texto: {
    color: tema.colores.primario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
});
