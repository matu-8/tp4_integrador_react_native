import { StyleSheet, Text, View } from 'react-native';
import { tema } from '../constants/tema';

export default function IndexScreen() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Biblioteca IPF</Text>
      <Text style={styles.subtitulo}>Catálogo en preparación</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.fondo,
    padding: tema.espaciado.md,
  },
  titulo: {
    fontSize: tema.tipografia.encabezado.fontSize,
    lineHeight: tema.tipografia.encabezado.lineHeight,
    fontWeight: tema.tipografia.encabezado.fontWeight,
    color: tema.colores.texto,
    marginBottom: tema.espaciado.sm,
  },
  subtitulo: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    lineHeight: tema.tipografia.cuerpo.lineHeight,
    color: tema.colores.textoSecundario,
  },
});
