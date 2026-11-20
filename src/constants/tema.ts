export const tema = {
  colores: {
    primario: '#1D4ED8',
    primarioPresionado: '#1E40AF',
    fondo: '#F8FAFC',
    superficie: '#FFFFFF',
    superficieSecundaria: '#F1F5F9',
    texto: '#0F172A',
    textoSecundario: '#64748B',
    textoClaro: '#FFFFFF',
    borde: '#E2E8F0',
    divisor: '#F1F5F9',
    // Estados semánticos
    disponible: '#15803D',
    disponibleFondo: '#DCFCE7',
    espera: '#B45309',
    esperaFondo: '#FEF3C7',
    error: '#B91C1C',
    errorFondo: '#FEE2E2',
    deshabilitado: '#94A3B8',
  },
  espaciado: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  tipografia: {
    caption: { fontSize: 12, lineHeight: 16 },
    cuerpo: { fontSize: 14, lineHeight: 20 },
    subtitulo: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
    titulo: { fontSize: 20, lineHeight: 28, fontWeight: '700' as const },
    encabezado: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  },
  radios: {
    sm: 6,
    md: 10,
    lg: 16,
    completo: 9999,
  },
  dimensiones: {
    areaMinimaTactil: 44, // Accesibilidad: regla 7.9
  },
} as const;

export type Tema = typeof tema;
