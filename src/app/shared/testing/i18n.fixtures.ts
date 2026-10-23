import { Event } from '../models/event.model';
import { News } from '../models/news.model';
import { WellnessItem } from '../models/wellness.model';

/** Datos FICTICIOS, solo para pruebas. */
const t = (es: string, en: string) => ({ es, en });

export const EVENTS: Event[] = [
  { id: 1, title: t('Evento pasado', 'Past event'), date: '2000-01-10', time: '09:00', type: 'seminar',
    description: t('Ya ocurrió', 'Already happened'), location: t('Aula', 'Classroom') },
  { id: 2, title: t('Seminario ficticio', 'Fictitious seminar'), date: '2999-04-16', time: '17:00', type: 'seminar',
    description: t('Descripción del seminario', 'Seminar description'), location: t('Auditorio', 'Auditorium'),
    registration_link: 'https://example.test/registro', more_info: 'info@example.test' },
  { id: 3, title: t('Fecha límite ficticia', 'Fictitious deadline'), date: '2999-02-17', time: '08:30', type: 'deadline',
    description: t('Entrega', 'Submission'), location: t('Virtual', 'Online') }
];

export const NEWS: News[] = [
  { id: 1, title: t('Noticia vieja', 'Old news'), summary: t('Resumen viejo', 'Old summary'), date: '2024-01-05', image: 'a.jpg' },
  { id: 2, title: t('Noticia destacada', 'Highlighted news'), summary: t('Resumen destacado', 'Highlighted summary'),
    date: '2025-03-20', image: 'b.jpg', isHighlight: true },
  { id: 3, title: t('Noticia reciente', 'Recent news'), summary: t('Resumen reciente', 'Recent summary'), date: '2025-10-01', image: 'c.jpg' }
];

export const WELLNESS: WellnessItem[] = [
  { icon: 'bi-chat-dots', name: t('Consejería', 'Counseling'), description: t('Acompañamiento personalizado.', 'Personalized support.') },
  { icon: 'bi-clipboard-check', name: t('Saber Pro', 'Saber Pro'), description: t('Prueba nacional.', 'National test.') }
];
