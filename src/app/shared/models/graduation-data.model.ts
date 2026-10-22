import { GraduationOption } from './graduation-option.model';
import { GraduationResource } from './graduation-resource.model';
import { GraduationCicle } from './graduation-cicle.model';
import { GraduationFaq } from './graduation-faq.model';

/** Estructura de src/assets/data/graduation-options.json. */
export interface GraduationData {
  options: GraduationOption[];
  resources: GraduationResource[];
  cicles: GraduationCicle[];
  faqs: GraduationFaq[];
}
