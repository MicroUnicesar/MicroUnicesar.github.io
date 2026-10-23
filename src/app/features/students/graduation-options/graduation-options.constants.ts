/** Correo del comité de investigación que ya publicaba la página de opciones de grado. */
export const GRADUATION_CONTACT_EMAIL = 'comiteinvestigacionmicro@unicesar.edu.co';

/** Pasos del procedimiento general: los textos están en i18n (grade-step-N-title / grade-step-N-text). */
export const GRADUATION_PROCEDURE_STEPS = [1, 2, 3, 4, 5, 6, 7].map(number => ({
  icon: `bi-${number}-circle`,
  titleKey: `grade-step-${number}-title`,
  textKey: `grade-step-${number}-text`
}));
