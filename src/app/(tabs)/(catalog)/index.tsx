import { FlatList, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useLibros } from '../../../hooks/useLibros';
import { useBiblioteca } from '../../../context/BibliotecaContext';
import { tema } from '../../../constants/tema';
import type { Libro } from '../../../types';

export default function CatalogoScreen() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { recientes } = useBiblioteca();

  const abrirDetalle = (libro: Libro) => {
    router.push(`/libro/${libro.isbn}`);
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.colores.primario} />
        <Text style={styles.mensaje}>Cargando catálogo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensajeError}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={reintentar}
          style={styles.botonPrimario}
        >
          <Text style={styles.textoBotonPrimario}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={libros}
      keyExtractor={(item) => item.isbn}
      contentContainerStyle={styles.contenido}
      ListHeaderComponent={
        <View>
          <View style={styles.acciones}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/buscar')}
              style={styles.botonAccion}
            >
              <Text style={styles.textoBotonAccion}>Buscar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/permisos/camara')}
              style={styles.botonAccion}
            >
              <Text style={styles.textoBotonAccion}>Escanear</Text>
            </Pressable>
          </View>

          <Text style={styles.seccionTitulo}>Vistos recientemente</Text>
          {recientes.length === 0 ? (
            <Text style={styles.recienteVacio}>Todavía no abriste ningún libro.</Text>
          ) : (
            recientes.map((libro) => (
              <Pressable
                key={libro.isbn}
                accessibilityRole="button"
                accessibilityLabel={`Abrir ${libro.titulo}`}
                onPress={() => abrirDetalle(libro)}
                style={styles.reciente}
              >
                <Text style={styles.recienteTitulo} numberOfLines={1}>
                  {libro.titulo}
                </Text>
              </Pressable>
            ))
          )}

          <Text style={[styles.seccionTitulo, styles.seccionTituloLibros]}>Todos los libros</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Abrir ${item.titulo}`}
          onPress={() => abrirDetalle(item)}
          style={styles.tarjeta}
        >
          <Text style={styles.tarjetaTitulo} numberOfLines={2}>
            {item.titulo}
          </Text>
          <Text style={styles.tarjetaAutor}>{item.autor}</Text>
          <Text
            style={[
              styles.tarjetaEstado,
              item.ejemplares > 0 ? styles.estadoDisponible : styles.estadoEspera,
            ]}
          >
            {item.ejemplares > 0 ? `${item.ejemplares} disponibles` : 'Sin ejemplares'}
          </Text>
        </Pressable>
      )}
      ListEmptyComponent={
        <Text style={styles.mensaje}>No hay libros en el catálogo.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.fondo,
    padding: tema.espaciado.lg,
  },
  contenido: {
    padding: tema.espaciado.md,
    paddingBottom: tema.espaciado.xxl,
  },
  mensaje: {
    marginTop: tema.espaciado.md,
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
  },
  mensajeError: {
    color: tema.colores.error,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
    marginBottom: tema.espaciado.md,
  },
  botonPrimario: {
    backgroundColor: tema.colores.primario,
    paddingVertical: tema.espaciado.sm,
    paddingHorizontal: tema.espaciado.lg,
    borderRadius: tema.radios.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    justifyContent: 'center',
  },
  textoBotonPrimario: {
    color: tema.colores.textoClaro,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
  acciones: {
    flexDirection: 'row',
    gap: tema.espaciado.sm,
    marginBottom: tema.espaciado.lg,
  },
  botonAccion: {
    flex: 1,
    backgroundColor: tema.colores.primario,
    paddingVertical: tema.espaciado.sm,
    borderRadius: tema.radios.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonAccion: {
    color: tema.colores.textoClaro,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
  seccionTitulo: {
    fontSize: tema.tipografia.subtitulo.fontSize,
    fontWeight: tema.tipografia.subtitulo.fontWeight,
    color: tema.colores.texto,
    marginBottom: tema.espaciado.sm,
  },
  seccionTituloLibros: {
    marginTop: tema.espaciado.lg,
  },
  recienteVacio: {
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    marginBottom: tema.espaciado.sm,
  },
  reciente: {
    backgroundColor: tema.colores.superficie,
    borderRadius: tema.radios.md,
    padding: tema.espaciado.sm,
    marginBottom: tema.espaciado.xs,
    minHeight: tema.dimensiones.areaMinimaTactil,
    justifyContent: 'center',
  },
  recienteTitulo: {
    color: tema.colores.texto,
    fontSize: tema.tipografia.cuerpo.fontSize,
  },
  tarjeta: {
    backgroundColor: tema.colores.superficie,
    borderRadius: tema.radios.md,
    padding: tema.espaciado.md,
    marginBottom: tema.espaciado.sm,
  },
  tarjetaTitulo: {
    fontSize: tema.tipografia.subtitulo.fontSize,
    fontWeight: tema.tipografia.subtitulo.fontWeight,
    color: tema.colores.texto,
  },
  tarjetaAutor: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.textoSecundario,
    marginTop: tema.espaciado.xs,
  },
  tarjetaEstado: {
    marginTop: tema.espaciado.sm,
    fontSize: tema.tipografia.caption.fontSize,
    fontWeight: '600',
  },
  estadoDisponible: {
    color: tema.colores.disponible,
  },
  estadoEspera: {
    color: tema.colores.espera,
  },
});
