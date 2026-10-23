import { LocalizedText, PENDING_CONTENT, PENDING_TRANSLATION } from '../models/localized-text.model';
import { APP_CONSTANTS } from '../constants/app.constants';

/**
 * Devuelve el texto en el idioma pedido.
 * - Si la traducción falta o está marcada TODO_TRADUCCION, usa el idioma por defecto.
 * - Si el dato está marcado TODO_CONTENIDO, devuelve '' para que la vista lo oculte.
 */
export function localize(text: LocalizedText | null | undefined, lang: string): string {
  if (!text) {
    return '';
  }
  const requested = text[lang as keyof LocalizedText];
  const value = !requested || requested === PENDING_TRANSLATION
    ? text[APP_CONSTANTS.LANGUAGES.DEFAULT as keyof LocalizedText]
    : requested;
  return !value || value === PENDING_CONTENT ? '' : value;
}
