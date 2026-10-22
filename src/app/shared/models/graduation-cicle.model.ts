/** Ciclo de recepción y evaluación de solicitudes. Todas las fechas son ISO (AAAA-MM-DD). */
export interface GraduationCicle {
  number: string;
  reception_from: string;
  reception_to: string;
  session: string;
  eval_from: string;
  eval_to: string;
  answer: string;
}
