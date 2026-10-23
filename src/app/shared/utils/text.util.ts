import { LocalizedText } from '../models/localized-text.model';

/** Recorta en el último espacio antes de `max` caracteres y agrega "…". Si cabe, devuelve el texto igual. */
export function truncateText(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) {
    return clean;
  }
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, '')}…`;
}

/** Recorta ambos idiomas de un texto bilingüe, conservando los marcadores de pendiente (TODO_*). */
export function truncateLocalized(text: LocalizedText, max: number): LocalizedText {
  return { es: truncateText(text.es, max), en: text.en.startsWith('TODO_') ? text.en : truncateText(text.en, max) };
}
