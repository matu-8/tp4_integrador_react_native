import type { Libro } from '../types';

/**
 * ----------------------------------------------------------------------
 * CONFIGURACIÓN DE LIBROS REALES PARA EL ESCÁNER
 * Completá con los datos de dos libros físicos que tengas a mano.
 * ----------------------------------------------------------------------
 */
export const LIBRO_REAL_1 = {
  isbn: '', // 13 dígitos numéricos sin guiones (ej: '9789871234567')
  titulo: '',
  autor: '',
  anio: 2024,
  ejemplares: 2,
};

export const LIBRO_REAL_2 = {
  isbn: '', // 13 dígitos numéricos sin guiones (ej: '9789877654321')
  titulo: '',
  autor: '',
  anio: 2024,
  ejemplares: 1,
};

// Catálogo base con 13 libros de programación y arquitectura
const LIBROS_BASE: Libro[] = [
  {
    isbn: '9780132350884',
    titulo: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    autor: 'Robert C. Martin',
    anio: 2008,
    ejemplares: 2,
  },
  {
    isbn: '9780201616224',
    titulo: 'The Pragmatic Programmer: From Journeyman to Master',
    autor: 'Andrew Hunt, David Thomas',
    anio: 1999,
    ejemplares: 1,
  },
  {
    isbn: '9780201485677',
    titulo: 'Refactoring: Improving the Design of Existing Code',
    autor: 'Martin Fowler',
    anio: 1999,
    ejemplares: 0, // Sin ejemplares (para lista de espera)
  },
  {
    isbn: '9780201633610',
    titulo: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    autor: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    anio: 1994,
    ejemplares: 3,
  },
  {
    isbn: '9781593279509',
    titulo: 'Eloquent JavaScript: A Modern Introduction to Programming',
    autor: 'Marijn Haverbeke',
    anio: 2018,
    ejemplares: 2,
  },
  {
    isbn: '9781491950296',
    titulo: 'Programming TypeScript: Making Your JavaScript Applications Scale',
    autor: 'Boris Cherny',
    anio: 2019,
    ejemplares: 0, // Sin ejemplares (para lista de espera)
  },
  {
    isbn: '9780135957059',
    titulo: 'The Pragmatic Programmer: 20th Anniversary Edition',
    autor: 'David Thomas, Andrew Hunt',
    anio: 2019,
    ejemplares: 1,
  },
  {
    isbn: '9781491904244',
    titulo: "You Don't Know JS: Up & Going",
    autor: 'Kyle Simpson',
    anio: 2015,
    ejemplares: 4,
  },
  {
    isbn: '9781449331818',
    titulo: 'Learning JavaScript Design Patterns',
    autor: 'Addy Osmani',
    anio: 2012,
    ejemplares: 2,
  },
  {
    isbn: '9780596517748',
    titulo: 'JavaScript: The Good Parts',
    autor: 'Douglas Crockford',
    anio: 2008,
    ejemplares: 0, // Sin ejemplares
  },
  {
    isbn: '9781492051725',
    titulo: 'Learning React: Modern Patterns for Developing React Apps',
    autor: 'Alex Banks, Eve Porcello',
    anio: 2020,
    ejemplares: 2,
  },
  {
    isbn: '9781789346589',
    titulo: 'React Native Cookbook',
    autor: 'Dan Ward',
    anio: 2019,
    ejemplares: 1,
  },
  {
    isbn: '9781617294051',
    titulo: 'React in Action',
    autor: 'Mark Tielens Thomas',
    anio: 2018,
    ejemplares: 2,
  },
];

// Resolución con fallback para garantizar siempre >= 15 libros válidos
const libro1Resuelto: Libro = {
  isbn: LIBRO_REAL_1.isbn.trim() || '0000000000001',
  titulo: LIBRO_REAL_1.titulo.trim() || 'Libro Físico 1 (Configurar en src/data/libros.ts)',
  autor: LIBRO_REAL_1.autor.trim() || 'Autor Pendiente',
  anio: LIBRO_REAL_1.anio || 2024,
  ejemplares: LIBRO_REAL_1.ejemplares,
};

const libro2Resuelto: Libro = {
  isbn: LIBRO_REAL_2.isbn.trim() || '0000000000002',
  titulo: LIBRO_REAL_2.titulo.trim() || 'Libro Físico 2 (Configurar en src/data/libros.ts)',
  autor: LIBRO_REAL_2.autor.trim() || 'Autor Pendiente',
  anio: LIBRO_REAL_2.anio || 2024,
  ejemplares: LIBRO_REAL_2.ejemplares,
};

export const LIBROS: Libro[] = [
  ...LIBROS_BASE,
  libro1Resuelto,
  libro2Resuelto,
];
