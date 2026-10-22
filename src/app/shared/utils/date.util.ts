export class DateUtil {
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}

/**
 * Fecha ISO "AAAA-MM-DD" en formato largo ("21 de octubre de 2026" / "October 21, 2026").
 * Se interpreta como fecha local para que no se corra un día por la zona horaria.
 */
export function formatLongDate(iso: string, lang: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) {
    return iso;
  }
  return new Date(year, month - 1, day).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
