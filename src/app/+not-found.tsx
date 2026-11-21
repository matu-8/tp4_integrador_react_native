import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tema } from '../constants/tema';

export default function NoEncontradoScreen() {
  const ruta = usePathname();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Pantalla no encontrada</Text>
      <Text style={styles.mensaje}>La siguiente ruta no existe en la app:</Text>
      <Text style={styles.ruta}>{ruta}</Text>
      <Link href="/" asChild>
        <Pressable accessibilityRole="button" style={styles.boton}>
          <Text style={styles.textoBoton}>Volver al catálogo</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.fondo,
    padding: tema.espaciado.lg,
  },
  titulo: {
    fontSize: tema.tipografia.encabezado.fontSize,
    fontWeight: tema.tipografia.encabezado.fontWeight,
    color: tema.colores.texto,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.textoSecundario,
    marginTop: tema.espaciado.sm,
    textAlign: 'center',
  },
  ruta: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
    color: tema.colores.error,
    backgroundColor: tema.colores.superficie,
    borderRadius: tema.radios.md,
    padding: tema.espaciado.md,
    marginTop: tema.espaciado.md,
    marginBottom: tema.espaciado.lg,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: tema.colores.primario,
    paddingVertical: tema.espaciado.md,
    paddingHorizontal: tema.espaciado.lg,
    borderRadius: tema.radios.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    justifyContent: 'center',
  },
  textoBoton: {
    color: tema.colores.textoClaro,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
});
