import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Rutas del servidor para el sitio estático (angular.json: "outputMode": "static").
 * Todo se prerenderiza al compilar. Las rutas con `:id` toman sus ids de los mismos JSON que usa la web,
 * así que agregar un grupo, una persona, una línea o una opción de grado la prerenderiza sin tocar código.
 * `getPrerenderParams` solo corre al compilar (en Node), por eso puede leer el disco.
 */
const DATA_DIR = join(process.cwd(), 'src', 'assets', 'data');

async function readData<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(join(DATA_DIR, file), 'utf8')) as T;
}

const toParams = (ids: string[]) => ids.map(id => ({ id }));

export const serverRoutes: ServerRoute[] = [
  {
    path: 'research/groups/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => toParams((await readData<{ id: string }[]>('research-groups.json')).map(group => group.id))
  },
  {
    path: 'research/lines/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => toParams((await readData<{ id: string }[]>('research-lines.json')).map(line => line.id))
  },
  {
    // Solo los docentes tienen ficha propia.
    path: 'people/faculty/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      toParams((await readData<{ id: string; category: string }[]>('people.json'))
        .filter(person => person.category === 'faculty').map(person => person.id))
  },
  {
    path: 'students/graduation-options/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      toParams((await readData<{ options: { id: string }[] }>('graduation-options.json')).options.map(option => option.id))
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
