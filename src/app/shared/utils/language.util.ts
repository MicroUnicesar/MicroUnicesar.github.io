/**
 * Idioma inicial de una visita:
 * 1. el que la persona eligió antes (si sigue siendo uno soportado),
 * 2. el primer idioma del navegador que sea soportado ("en-US" cuenta como "en"),
 * 3. el idioma por defecto.
 */
export function resolveInitialLanguage(
  saved: string | null | undefined,
  browserLanguages: readonly string[],
  available: readonly string[],
  fallback: string
): string {
  if (saved && available.includes(saved)) {
    return saved;
  }
  for (const tag of browserLanguages) {
    const base = tag.toLowerCase().split('-')[0];
    if (available.includes(base)) {
      return base;
    }
  }
  return fallback;
}

/** Locale de `Intl` para un idioma de la web. */
export function intlLocale(lang: string): string {
  return lang === 'en' ? 'en-US' : 'es-CO';
}
