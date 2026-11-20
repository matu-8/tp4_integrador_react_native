import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useLibros } from '../../hooks/useLibros';
import { useBiblioteca, type ResultadoReserva } from '../../context/BibliotecaContext';
import { tema } from '../../constants/tema';

const ISBN_VALIDO = /^\d{13}$/;

export default function ReservarScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { libros, cargando, error, reintentar } = useLibros();
  const { reservar } = useBiblioteca();
  const [resultado, setResultado] = useState<ResultadoReserva | null>(null);
  const ejecutado = useRef<boolean>(false);

  const libro = libros.find((item) => item.isbn === isbn);

  useEffect(() => {
    if (libro && !ejecutado.current) {
      ejecutado.current = true;
      setResultado(reservar(libro));
    }
  }, [libro, reservar]);

  const cuerpo = () => {
    if (cargando) {
      return (
        <View style={styles.centrado}>
          <Stack.Screen options={{ title: 'Reservar' }} />
          <ActivityIndicator size="large" color={tema.colores.primario} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centrado}>
          <Stack.Screen options={{ title: 'Reservar' }} />
          <Text style={styles.textoError}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={reintentar} style={styles.boton}>
            <Text style={styles.textoBoton}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }

    if (!isbn || !ISBN_VALIDO.test(isbn) || !libro) {
      return (
        <View style={styles.centrado}>
          <Stack.Screen options={{ title: 'Reservar' }} />
          <Text style={styles.textoError}>No encontramos ese libro.</Text>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.boton}>
            <Text style={styles.textoBoton}>Cerrar</Text>
          </Pressable>
        </View>
      );
    }

    if (!resultado) {
      return (
        <View style={styles.centrado}>
          <Stack.Screen options={{ title: 'Reservar' }} />
          <ActivityIndicator size="large" color={tema.colores.primario} />
        </View>
      );
    }

    const mensaje =
      resultado.tipo === 'prestamo'
        ? `Listo, te llevás "${libro.titulo}". Recordá devolverlo en 7 días.`
        : resultado.tipo === 'espera'
          ? `No quedan ejemplares de "${libro.titulo}". Quedaste en la lista de espera en la posición ${resultado.posicion}. Te avisaremos cuando esté disponible.`
          : `Ya tenés una reserva o préstamo de "${libro.titulo}".`;

    return (
      <View style={styles.centrado}>
        <Stack.Screen options={{ title: 'Reservar' }} />
        <Text style={styles.titulo}>
          {resultado.tipo === 'prestamo'
            ? '¡Reserva confirmada!'
            : resultado.tipo === 'espera'
              ? 'En lista de espera'
              : 'Ya está reservado'}
        </Text>
        <Text style={styles.mensaje}>{mensaje}</Text>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.boton}>
          <Text style={styles.textoBoton}>Volver al detalle</Text>
        </Pressable>
      </View>
    );
  };

  return <View style={styles.contenedor}>{cuerpo()}</View>;
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.colores.fondo,
  },
  centrado: {
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
    marginBottom: tema.espaciado.md,
  },
  mensaje: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    lineHeight: tema.tipografia.cuerpo.lineHeight,
    color: tema.colores.textoSecundario,
    textAlign: 'center',
    marginBottom: tema.espaciado.lg,
  },
  textoError: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.error,
    textAlign: 'center',
    marginBottom: tema.espaciado.md,
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
