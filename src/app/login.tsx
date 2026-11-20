import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useBiblioteca } from '../context/BibliotecaContext';
import { tema } from '../constants/tema';

export default function LoginScreen() {
  const { iniciarSesion } = useBiblioteca();
  const [usuario, setUsuario] = useState<string>('');
  const [clave, setClave] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const entrar = () => {
    const valido = iniciarSesion(usuario, clave);
    if (valido) {
      setError(null);
      router.back();
      return;
    }
    setError('Usuario o clave incorrectos. Verificá los datos e intentá de nuevo.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: 'Acceso del personal' }} />

      <View style={styles.formulario}>
        <Text style={styles.titulo}>Acceso del personal</Text>

        <Text style={styles.etiqueta}>Usuario</Text>
        <TextInput
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Usuario"
          placeholderTextColor={tema.colores.textoSecundario}
          style={styles.entrada}
          accessibilityLabel="Usuario del personal"
        />

        <Text style={styles.etiqueta}>Clave</Text>
        <TextInput
          value={clave}
          onChangeText={setClave}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Clave"
          placeholderTextColor={tema.colores.textoSecundario}
          style={styles.entrada}
          accessibilityLabel="Clave del personal"
          onSubmitEditing={entrar}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable accessibilityRole="button" onPress={entrar} style={styles.botonPrimario}>
          <Text style={styles.textoBotonPrimario}>Ingresar</Text>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.botonCancelar}>
          <Text style={styles.textoBotonCancelar}>Cancelar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.colores.fondo,
    justifyContent: 'center',
    padding: tema.espaciado.lg,
  },
  formulario: {
    backgroundColor: tema.colores.superficie,
    borderRadius: tema.radios.lg,
    padding: tema.espaciado.lg,
  },
  titulo: {
    fontSize: tema.tipografia.encabezado.fontSize,
    fontWeight: tema.tipografia.encabezado.fontWeight,
    color: tema.colores.texto,
    marginBottom: tema.espaciado.lg,
  },
  etiqueta: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.textoSecundario,
    marginBottom: tema.espaciado.xs,
  },
  entrada: {
    backgroundColor: tema.colores.fondo,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    borderRadius: tema.radios.md,
    paddingHorizontal: tema.espaciado.md,
    paddingVertical: tema.espaciado.sm,
    minHeight: tema.dimensiones.areaMinimaTactil,
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.texto,
    marginBottom: tema.espaciado.md,
  },
  error: {
    color: tema.colores.error,
    fontSize: tema.tipografia.cuerpo.fontSize,
    marginBottom: tema.espaciado.md,
  },
  botonPrimario: {
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
  botonCancelar: {
    marginTop: tema.espaciado.sm,
    paddingVertical: tema.espaciado.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonCancelar: {
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
  },
});
