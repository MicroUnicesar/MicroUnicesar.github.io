import { intlLocale } from './language.util';

/** Formatos de fecha y hora de la web. */
export type DateStyle = 'long' | 'short' | 'day' | 'month' | 'time';

const OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  short: { day: '2-digit', month: 'short', year: 'numeric' },
  day: { day: '2-digit' },
  month: { month: 'short' },
  time: { hour: 'numeric', minute: '2-digit' }
};

/**
 * Fecha ISO "AAAA-MM-DD" (o hora "HH:mm" con el estilo 'time') en el idioma pedido.
 * Se interpreta como fecha local para que no se corra un día por la zona horaria.
 * Si el texto no es una fecha/hora válida se devuelve tal cual.
 */
export function formatDate(value: string, lang: string, style: DateStyle = 'long'): string {
  let date: Date;
  if (style === 'time') {
    const [hours, minutes] = value.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes) || value.split(':').length !== 2) {
      return value;
    }
    date = new Date(2000, 0, 1, hours, minutes);
  } else {
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) {
      return value;
    }
    date = new Date(year, month - 1, day);
  }
  return new Intl.DateTimeFormat(intlLocale(lang), OPTIONS[style]).format(date);
}

/** Fecha ISO en formato largo ("21 de octubre de 2026" / "October 21, 2026"). */
export function formatLongDate(iso: string, lang: string): string {
  return formatDate(iso, lang, 'long');
}

/** Número con los separadores del idioma ("1.234,5" / "1,234.5"). */
export function formatNumber(value: number, lang: string): string {
  return new Intl.NumberFormat(intlLocale(lang)).format(value);
}
