import { GraduationOption } from './graduation-option.model';
import { GraduationCicle } from './graduation-cicle.model';
import { GraduationFaq } from './graduation-faq.model';

/** Estructura de src/assets/data/graduation-options.json. */
export interface GraduationData {
  options: GraduationOption[];
  /** Ids de los recursos (resources.json) que se muestran en la página de opciones de grado. */
  resourceIds: string[];
  cicles: GraduationCicle[];
  faqs: GraduationFaq[];
}
