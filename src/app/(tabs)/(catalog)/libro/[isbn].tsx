import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { useLibros } from '../../../../hooks/useLibros';
import { useBiblioteca } from '../../../../context/BibliotecaContext';
import { tema } from '../../../../constants/tema';

const ISBN_VALIDO = /^\d{13}$/;

export default function DetalleScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { libros, cargando, error, reintentar } = useLibros();
  const {
    registrarReciente,
    ejemplaresDisponibles,
    esperaDe,
    tienePrestamo,
    estaEnEspera,
    posicionEnEspera,
  } = useBiblioteca();

  const libro = libros.find((item) => item.isbn === isbn);

  useEffect(() => {
    if (libro) {
      registrarReciente(libro);
    }
  }, [libro, registrarReciente]);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.colores.primario} />
        <Text style={styles.mensaje}>Cargando detalle...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensajeError}>{error}</Text>
        <Pressable accessibilityRole="button" onPress={reintentar} style={styles.botonPrimario}>
          <Text style={styles.textoBotonPrimario}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!isbn || !ISBN_VALIDO.test(isbn) || !libro) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensajeError}>
          {isbn && !ISBN_VALIDO.test(isbn)
            ? 'El ISBN ingresado no es válido. Debe tener 13 dígitos.'
            : 'No encontramos un libro con ese ISBN en la biblioteca.'}
        </Text>
        <Link href="/" asChild>
          <Pressable accessibilityRole="button" style={styles.botonPrimario}>
            <Text style={styles.textoBotonPrimario}>Volver al Catálogo</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  const disponibles = ejemplaresDisponibles(libro);
  const espera = esperaDe(libro.isbn);
  const yaReservado = tienePrestamo(libro.isbn) || estaEnEspera(libro.isbn);
  const posicion = posicionEnEspera(libro.isbn);

  return (
    <>
      <Stack.Screen options={{ title: libro.titulo }} />
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>{libro.titulo}</Text>
        <Text style={styles.autor}>{libro.autor}</Text>
        <Text style={styles.meta}>Año: {libro.anio}</Text>
        <Text style={styles.meta}>ISBN: {libro.isbn}</Text>

        <View style={styles.cajaEstado}>
          <Text style={disponibles > 0 ? styles.estadoDisponible : styles.estadoEspera}>
            {disponibles > 0
              ? `${disponibles} ${disponibles === 1 ? 'ejemplar disponible' : 'ejemplares disponibles'}`
              : 'Sin ejemplares disponibles'}
          </Text>
          <Text style={styles.esperaTexto}>
            Personas en lista de espera: {espera.length}
          </Text>
          {espera.map((persona, indice) => (
            <Text key={`${libro.isbn}-${persona}-${indice}`} style={styles.esperaPersona}>
              {indice + 1}. {persona}
            </Text>
          ))}
        </View>

        {yaReservado ? (
          <Text style={styles.avisoReservado}>
            {tienePrestamo(libro.isbn)
              ? 'Ya tenés este libro en préstamo.'
              : `Ya estás en la lista de espera (posición ${posicion}).`}
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/reservar/${libro.isbn}`)}
            style={styles.botonPrimario}
          >
            <Text style={styles.textoBotonPrimario}>Reservar</Text>
          </Pressable>
        )}
      </ScrollView>
    </>
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
  mensaje: {
    marginTop: tema.espaciado.md,
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
  },
  mensajeError: {
    color: tema.colores.error,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
    marginBottom: tema.espaciado.md,
  },
  contenido: {
    padding: tema.espaciado.lg,
  },
  titulo: {
    fontSize: tema.tipografia.titulo.fontSize,
    fontWeight: tema.tipografia.titulo.fontWeight,
    color: tema.colores.texto,
  },
  autor: {
    fontSize: tema.tipografia.subtitulo.fontSize,
    color: tema.colores.textoSecundario,
    marginTop: tema.espaciado.xs,
  },
  meta: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.textoSecundario,
    marginTop: tema.espaciado.xs,
  },
  cajaEstado: {
    backgroundColor: tema.colores.superficie,
    borderRadius: tema.radios.md,
    padding: tema.espaciado.md,
    marginTop: tema.espaciado.lg,
  },
  estadoDisponible: {
    color: tema.colores.disponible,
    fontSize: tema.tipografia.subtitulo.fontSize,
    fontWeight: '600',
  },
  estadoEspera: {
    color: tema.colores.espera,
    fontSize: tema.tipografia.subtitulo.fontSize,
    fontWeight: '600',
  },
  esperaTexto: {
    color: tema.colores.texto,
    fontSize: tema.tipografia.cuerpo.fontSize,
    marginTop: tema.espaciado.sm,
  },
  esperaPersona: {
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    marginTop: tema.espaciado.xs,
  },
  avisoReservado: {
    marginTop: tema.espaciado.lg,
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
  },
  botonPrimario: {
    marginTop: tema.espaciado.lg,
    backgroundColor: tema.colores.primario,
    paddingVertical: tema.espaciado.md,
    borderRadius: tema.radios.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonPrimario: {
    color: tema.colores.textoClaro,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
});
